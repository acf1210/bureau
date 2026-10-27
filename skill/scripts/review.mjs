#!/usr/bin/env node
/* @bureau-internal — excluded from design audits */
/**
 * BUREAU review circuit.
 * Usage:
 *   node scripts/review.mjs --status
 *   node scripts/review.mjs --gate g1-concept --scores .bureau/review/g1.json
 *   node scripts/review.mjs --delivery-init
 *   node scripts/review.mjs --final --tribunal .bureau/review/tribunal.json
 */

import fs from "node:fs";
import path from "node:path";
import { validateJury, UX_LAWS } from "./lib/jury.mjs";
import {
  gates, gateById, GATE_ORDER, VERDICTS,
  checkEvidence, normalizeScores, validateEvidenceFiles,
  sourceHash, pointsFor, verdict,
  CRITIQUE_AXES, parseDelivery, deliveryTemplate
} from "./lib/gates.mjs";

const STATE_VERSION = 1;

function parseArgs(argv) {
  const opts = { root: process.cwd(), json: false, gate: null, scores: null, final: false, tribunal: null, status: false, reset: false, yes: false, report: false, deliveryInit: false, juryInit: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--root") opts.root = path.resolve(argv[++i]);
    else if (a === "--gate") opts.gate = argv[++i];
    else if (a === "--scores") opts.scores = argv[++i];
    else if (a === "--final") opts.final = true;
    else if (a === "--tribunal") opts.tribunal = argv[++i];
    else if (a === "--status") opts.status = true;
    else if (a === "--reset") opts.reset = true;
    else if (a === "--yes") opts.yes = true;
    else if (a === "--report") opts.report = true;
    else if (a === "--delivery-init") opts.deliveryInit = true;
    else if (a === "--jury-init") opts.juryInit = true;
    else if (a === "--json") opts.json = true;
    else if (a === "--help" || a === "-h") {
      console.log(`BUREAU review circuit

Usage:
  node scripts/review.mjs --status
  node scripts/review.mjs --gate <id> --scores <file>
  node scripts/review.mjs --delivery-init
  node scripts/review.mjs --jury-init
  node scripts/review.mjs --final [--tribunal <file>]
  node scripts/review.mjs --report
  node scripts/review.mjs --reset --yes

Options:
  --root <dir>       project root (default cwd)
  --json             machine-readable output
`);
      process.exit(0);
    } else {
      console.error(`Unknown option: ${a}`);
      process.exit(2);
    }
  }
  return opts;
}

function paths(root) {
  const dir = path.join(root, ".bureau", "review");
  return {
    dir,
    state: path.join(dir, "state.json"),
    scorecardMd: path.join(dir, "scorecard.md"),
    scorecardJson: path.join(dir, "scorecard.json"),
    scorecardHtml: path.join(dir, "scorecard.html")
  };
}

function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); }
  catch (err) { return null; }
}

function loadState(root) {
  const p = paths(root);
  const existing = readJson(p.state);
  if (existing && existing.version === STATE_VERSION) return existing;
  let project = path.basename(root);
  try { project = JSON.parse(fs.readFileSync(path.join(root, ".bureau", "config.json"), "utf8")).name || project; } catch {}
  return {
    version: STATE_VERSION,
    project,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    gates: {},
    tribunal: null,
    total: null,
    verdict: null
  };
}

function saveState(root, state) {
  const p = paths(root);
  fs.mkdirSync(p.dir, { recursive: true });
  state.updatedAt = new Date().toISOString();
  fs.writeFileSync(p.state, JSON.stringify(state, null, 2));
}

function gateRows(root, state) {
  const current = sourceHash(root);
  return gates.map((g) => {
    const r = state.gates[g.id];
    const stale = !!(r && r.sourceHash && r.sourceHash !== current.hash);
    return { def: g, result: r || null, stale };
  });
}

function printStatus(root, state, asJson) {
  const rows = gateRows(root, state);
  const passed = rows.filter((r) => r.result?.status === "passed").length;
  const current = sourceHash(root);
  if (asJson) {
    console.log(JSON.stringify({ project: state.project, sourceHash: current.hash, gates: rows.map((r) => ({ id: r.def.id, name: r.def.name, weight: r.def.weight, status: r.result?.status || "open", score: r.result?.score ?? null, stale: r.stale })), total: state.total, verdict: state.verdict }, null, 2));
    return;
  }
  console.log(`BUREAU circuit — ${state.project}`);
  console.log(`${passed}/${gates.length} gates passed · source ${current.hash.slice(0, 10)} · ${current.files} files`);
  console.log("");
  for (const row of rows) {
    const r = row.result;
    const status = !r ? "open" : row.stale ? "STALE" : r.status;
    const score = r?.score != null ? `${r.score}/5` : "—";
    console.log(`${row.def.id.padEnd(16)} ${row.def.weight.toString().padStart(3)}  ${score.padStart(5)}  ${status.toUpperCase()}`);
  }
  if (state.verdict) console.log(`\nVerdict: ${state.verdict.verdict.toUpperCase()} (${state.total}/100) — ${state.verdict.reason}`);
  else {
    const next = rows.find((r) => !r.result || r.stale || r.result.status !== "passed");
    if (next) console.log(`\nNext: ${next.def.id} — ${next.def.question}`);
  }
}

function ensureDirs(root) {
  const p = paths(root);
  fs.mkdirSync(p.dir, { recursive: true });
  fs.mkdirSync(path.join(root, ".bureau", "evidence"), { recursive: true });
  fs.mkdirSync(path.join(root, ".bureau", "comps"), { recursive: true });
  fs.mkdirSync(path.join(root, ".bureau", "qa", "screenshots"), { recursive: true });
}

function gateCommand(root, state, gateId, scoresFile) {
  const gate = gateById.get(gateId);
  if (!gate) {
    console.error(`Unknown gate: ${gateId}\nValid: ${GATE_ORDER.join(", ")}`);
    process.exit(2);
  }
  if (!scoresFile) {
    console.error("--scores <file> is required.");
    process.exit(2);
  }
  const raw = readJson(scoresFile);
  if (!raw) {
    console.error(`Could not read JSON: ${scoresFile}`);
    process.exit(2);
  }
  const index = gate.index;
  const currentHash = sourceHash(root).hash;
  for (const prevId of GATE_ORDER.slice(0, index)) {
    const prev = state.gates[prevId];
    if (!prev || prev.status !== "passed") {
      console.error(`Gate ${gateId} cannot open before ${prevId} passes.`);
      process.exit(3);
    }
    if (prev.sourceHash && prev.sourceHash !== currentHash) {
      console.error(`Gate ${gateId} cannot open: ${prevId} is stale (source changed). Re-run ${prevId} and every later gate first.`);
      process.exit(3);
    }
  }
  const normalized = normalizeScores(raw, gate);
  if (normalized.errors.length) {
    console.error("Invalid scores file:\n- " + normalized.errors.join("\n- "));
    process.exit(2);
  }

  const ev = checkEvidence(root, gate.evidence);
  const missingEvidence = validateEvidenceFiles(root, normalized.value.evidence);
  const issueEvidenceMissing = [];
  for (const issue of normalized.value.issues) {
    if (!issue.evidence) continue;
    const m = validateEvidenceFiles(root, [issue.evidence]);
    if (m.length) issueEvidenceMissing.push(...m);
  }
  if (ev.missing.length || missingEvidence.length || issueEvidenceMissing.length) {
    console.error("Gate blocked: evidence missing.");
    for (const m of ev.missing) console.error(`- required: ${m.label} (${m.path}), found ${m.found}/${m.min}`);
    for (const m of missingEvidence) console.error(`- listed but not found: ${m}`);
    for (const m of issueEvidenceMissing) console.error(`- issue evidence not found: ${m}`);
    process.exit(4);
  }

  const p0 = normalized.value.issues.filter((i) => i.severity === "p0");
  const score = normalized.value.score;
  const critique = normalized.value.critique;
  const lowAxes = critique ? CRITIQUE_AXES.filter((a) => critique[a] < 3) : [];
  const heuristics = normalized.value.heuristics;
  const lowHeuristics = heuristics && heuristics.ratio < 0.5;
  const status = score >= 3.5 && p0.length === 0 && !lowAxes.length && !lowHeuristics ? "passed" : "failed";
  const h = sourceHash(root);

  // Re-running a gate invalidates every later gate.
  for (const laterId of GATE_ORDER.slice(index + 1)) {
    if (state.gates[laterId]) delete state.gates[laterId];
  }
  state.gates[gate.id] = {
    id: gate.id,
    status,
    score,
    points: pointsFor(gate, score),
    weight: gate.weight,
    reviewer: normalized.value.reviewer,
    notes: normalized.value.notes,
    strengths: normalized.value.strengths,
    issues: normalized.value.issues,
    evidence: normalized.value.evidence,
    critique,
    heuristics,
    requiredEvidence: ev.found,
    sourceHash: h.hash,
    sourceFiles: h.files,
    at: new Date().toISOString()
  };
  state.tribunal = null;
  state.total = null;
  state.verdict = null;
  saveState(root, state);

  console.log(`GATE ${gate.id} — ${status.toUpperCase()}`);
  console.log(`Score ${score}/5 · points ${state.gates[gate.id].points}/${gate.weight} · reviewer ${normalized.value.reviewer}`);
  console.log(normalized.value.notes);
  if (p0.length) console.log(`BLOCKING: ${p0.length} P0 issue(s).`);
  if (lowAxes.length) console.log(`BLOCKING: pre-build critique under 3 on ${lowAxes.join(", ")}. Revise the direction before building.`);
  if (heuristics) console.log(`Heuristics ${heuristics.sum}/${heuristics.max}${lowHeuristics ? " — BLOCKING: under half the applicable maximum." : ""}`);
  console.log(`Evidence: ${ev.found.map((e) => `${e.label} (${e.count})`).join(", ")}`);
  const next = gates[index + 1];
  if (next) console.log(`Next: ${next.id} — ${next.question}`);
  if (status === "failed") process.exit(1);
}

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function scorecardData(root, state) {
  const rows = gateRows(root, state);
  const gateResults = rows.map((r) => ({
    id: r.def.id,
    name: r.def.name,
    persona: r.def.persona,
    weight: r.def.weight,
    question: r.def.question,
    status: r.result?.status || "open",
    score: r.result?.score ?? null,
    points: r.result?.points ?? 0,
    stale: r.stale,
    notes: r.result?.notes || "",
    issues: r.result?.issues || [],
    evidence: r.result?.evidence || [],
    at: r.result?.at || null
  }));
  const total = gateResults.reduce((n, g) => n + (g.status === "passed" ? g.points : 0), 0);
  const missing = [];
  for (const row of rows) {
    if (!row.result) { missing.push(`${row.def.id}: not reviewed`); continue; }
    const ev = checkEvidence(root, row.def.evidence);
    for (const m of ev.missing) missing.push(`${row.def.id}: ${m.label} (${m.path})`);
    if (row.stale) missing.push(`${row.def.id}: stale — source changed since review`);
  }
  const v = state.verdict || verdict(Math.round(total * 10) / 10, gateResults, state.tribunal);
  return { project: state.project, generatedAt: new Date().toISOString(), gates: gateResults, total: Math.round(total * 10) / 10, verdict: v, missing, tribunal: state.tribunal };
}

function renderScorecardMd(data, state) {
  const lines = [];
  lines.push(`# BUREAU — Review Scorecard`);
  lines.push("");
  lines.push(`**Project:** ${data.project}  `);
  lines.push(`**Date:** ${data.generatedAt}  `);
  lines.push(`**Verdict:** ${data.verdict.verdict.toUpperCase()} — ${data.total}/100  `);
  lines.push(`**Reason:** ${data.verdict.reason}`);
  lines.push("");
  lines.push("| Gate | Persona | Score | Weight | Points | Status |");
  lines.push("|---|---|---:|---:|---:|---|");
  for (const g of data.gates) {
    lines.push(`| ${g.id} ${g.name} | ${g.persona} | ${g.score == null ? "—" : g.score + "/5"} | ${g.weight} | ${g.points} | ${g.stale ? "STALE" : g.status.toUpperCase()} |`);
  }
  lines.push("");
  if (data.tribunal) {
    lines.push(`## Tribunal`);
    lines.push("");
    lines.push(`**Decision:** ${data.tribunal.decision || "—"}  `);
    lines.push(`**Method:** ${data.tribunal.method === "degraded" ? "DEGRADED (single context)" : data.tribunal.method || "—"}  `);
    if (data.tribunal.notes) lines.push(`${data.tribunal.notes}`);
    if (data.tribunal.reason) lines.push(`\n**Reason:** ${data.tribunal.reason}`);
    if (data.tribunal.fix) lines.push(`\n**Smallest fix:** ${data.tribunal.fix}`);
    lines.push("");
  }
  lines.push("## Gates");
  for (const g of data.gates) {
    lines.push("");
    lines.push(`### ${g.id} — ${g.name} · ${g.score == null ? "not reviewed" : g.score + "/5"}${g.stale ? " · STALE" : ""}`);
    if (g.notes) lines.push(g.notes);
    if (g.issues.length) {
      lines.push("");
      lines.push("| Severity | Issue | Fix | Evidence |");
      lines.push("|---|---|---|---|");
      for (const i of g.issues) lines.push(`| ${String(i.severity).toUpperCase()} | ${i.title} | ${i.fix} | \`${i.evidence || "—"}\` |`);
    }
    if (g.evidence.length) {
      lines.push("");
      lines.push(`Evidence: ${g.evidence.map((e) => `\`${e}\``).join(", ")}`);
    }
  }
  if (data.missing.length) {
    lines.push("");
    lines.push("## Missing / stale");
    for (const m of data.missing) lines.push(`- ${m}`);
  }
  return lines.join("\n");
}

function renderScorecardHtml(data) {
  const badgeClass = data.verdict.verdict;
  const rows = data.gates.map((g) => {
    const pct = g.score == null ? 0 : (g.score / 5) * 100;
    const issues = g.issues.length ? `<ul class="issues">${g.issues.map((i) => `<li><span class="sev ${escapeHtml(i.severity)}">${escapeHtml(String(i.severity).toUpperCase())}</span> <strong>${escapeHtml(i.title)}</strong><br><span class="muted">${escapeHtml(i.fix)}</span></li>`).join("")}</ul>` : `<p class="muted">No issues recorded.</p>`;
    return `<article class="gate">
      <header><div><span class="id">${escapeHtml(g.id)}</span><h2>${escapeHtml(g.name)}</h2><p class="muted">${escapeHtml(g.persona)} · weight ${g.weight}</p></div>
      <div class="score">${g.score == null ? "—" : g.score}<span>/5</span></div></header>
      <div class="bar"><i style="width:${pct}%"></i></div>
      <p class="notes">${escapeHtml(g.notes || "Not reviewed.")}</p>
      ${issues}
      ${g.stale ? '<p class="stale">STALE — source changed since this gate.</p>' : ""}
    </article>`;
  }).join("");
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>BUREAU — ${escapeHtml(data.project)} — Review</title>
<style>
:root{--bg:#0b0b0c;--surface:#131315;--ink:#f1ede6;--muted:#9a958c;--line:#2a2a2e;--accent:#ff4a1c;--ok:#c6f04a;--warn:#e0b94a}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.55 "Archivo",system-ui,sans-serif}
main{max-width:1080px;margin:0 auto;padding:clamp(24px,5vw,72px)}
.eyebrow{font:11px/1 ui-monospace,monospace;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)}
h1{font-family:Georgia,"Times New Roman",serif;font-size:clamp(2.4rem,6vw,5rem);line-height:.95;letter-spacing:-.03em;margin:.2em 0 .3em;font-weight:400}
.verdict{display:inline-flex;gap:12px;align-items:baseline;border:1px solid var(--line);padding:12px 16px;border-radius:4px;margin:8px 0 32px}
.verdict b{font-size:20px;letter-spacing:.04em}.verdict.award b{color:var(--ok)}.verdict.pass b{color:var(--ok)}.verdict.conditional b{color:var(--warn)}.verdict.fail b{color:var(--accent)}
.gate{background:var(--surface);border:1px solid var(--line);border-radius:6px;padding:20px 22px;margin:14px 0}
.gate header{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}
.gate h2{font-size:20px;margin:2px 0}.id{font:11px/1 ui-monospace,monospace;color:var(--accent);letter-spacing:.08em}
.score{font:600 30px/1 ui-monospace,monospace}.score span{font-size:13px;color:var(--muted)}
.bar{height:3px;background:#222;margin:16px 0;overflow:hidden}.bar i{display:block;height:100%;background:var(--accent)}
.notes{margin:10px 0;color:#d8d3ca}.muted{color:var(--muted);font-size:13px}
.issues{list-style:none;padding:0;margin:12px 0 0;display:grid;gap:8px}.issues li{border-top:1px solid var(--line);padding-top:8px;font-size:14px}
.sev{font:10px/1 ui-monospace,monospace;padding:3px 5px;border-radius:2px;background:#333}.sev.p0{background:var(--accent);color:#fff}.sev.p1{background:var(--warn);color:#111}
.stale{color:var(--warn)}.muted a{color:inherit}
footer{margin-top:40px;border-top:1px solid var(--line);padding-top:16px;color:var(--muted);font-size:12px}
</style></head><body><main>
<p class="eyebrow">BUREAU · Review Circuit · ${escapeHtml(data.generatedAt)}</p>
<h1>${escapeHtml(data.project)}</h1>
<div class="verdict ${badgeClass}"><span class="eyebrow">Verdict</span><b>${escapeHtml(data.verdict.verdict.toUpperCase())}</b><span>${data.total}/100</span></div>
<p>${escapeHtml(data.verdict.reason)}</p>
${data.tribunal ? `<p class="muted"><strong>Tribunal:</strong> ${escapeHtml(data.tribunal.decision)} (${escapeHtml(data.tribunal.method === "degraded" ? "DEGRADED, single context" : data.tribunal.method || "method not declared")}) — ${escapeHtml(data.tribunal.notes || "")}${data.tribunal.fix ? ` · Smallest fix: ${escapeHtml(data.tribunal.fix)}` : ""}</p>` : ""}
${rows}
${data.missing.length ? `<section class="gate"><h2>Missing / stale</h2><ul>${data.missing.map((m) => `<li>${escapeHtml(m)}</li>`).join("")}</ul></section>` : ""}
<footer>Generated by BUREAU ${escapeHtml(process.env.npm_package_version || "")}. Evidence over opinion.</footer>
</main></body></html>`;
}

function writeScorecards(root, state) {
  const data = scorecardData(root, state);
  const p = paths(root);
  fs.mkdirSync(p.dir, { recursive: true });
  fs.writeFileSync(p.scorecardMd, renderScorecardMd(data, state));
  fs.writeFileSync(p.scorecardJson, JSON.stringify(data, null, 2));
  fs.writeFileSync(p.scorecardHtml, renderScorecardHtml(data));
  return data;
}

function finalCommand(root, state, tribunalFile, asJson) {
  const missingGates = gates.filter((g) => !state.gates[g.id]);
  if (missingGates.length) {
    console.error(`Cannot finalize: missing gates ${missingGates.map((g) => g.id).join(", ")}`);
    process.exit(3);
  }
  const rows = gateRows(root, state);
  let blocked = false;
  for (const row of rows) {
    if (row.result.status !== "passed") {
      console.error(`Cannot finalize: ${row.def.id} is ${row.result.status}.`);
      blocked = true;
    }
    if (row.stale) {
      console.error(`Cannot finalize: ${row.def.id} is stale (source changed). Re-run that gate and every later gate.`);
      blocked = true;
    }
    const ev = checkEvidence(root, row.def.evidence);
    if (ev.missing.length) {
      console.error(`Cannot finalize: ${row.def.id} evidence missing: ${ev.missing.map((m) => m.path).join(", ")}`);
      blocked = true;
    }
    const listed = validateEvidenceFiles(root, row.result.evidence || []);
    if (listed.length) {
      console.error(`Cannot finalize: ${row.def.id} evidence file(s) removed: ${listed.join(", ")}`);
      blocked = true;
    }
  }
  if (blocked) process.exit(3);

  // Delivery Gate: the Tribunal does not open on an unchecked or failing line.
  const deliveryFile = path.join(root, ".bureau", "review", "delivery.md");
  if (!fs.existsSync(deliveryFile)) {
    console.error("Cannot finalize: .bureau/review/delivery.md is missing. Run --delivery-init, fill every line with evidence, then finalize.");
    process.exit(4);
  }
  const delivery = parseDelivery(fs.readFileSync(deliveryFile, "utf8"));
  if (delivery.errors.length) {
    console.error("Cannot finalize: Delivery Gate not clean.\n- " + delivery.errors.join("\n- "));
    process.exit(1);
  }

  const jury = readJson(path.join(root, ".bureau", "review", "jury.json"));
  const juryErrors = validateJury(jury, GATE_ORDER, sourceHash(root).hash, (p) => {
    try { return fs.statSync(path.resolve(root, p)).isFile(); } catch { return false; }
  });
  if (juryErrors.length) {
    console.error("Cannot finalize: jury incomplete or stale.\n- " + juryErrors.join("\n- "));
    process.exit(1);
  }

  let tribunal = null;
  if (tribunalFile) {
    tribunal = readJson(tribunalFile);
    if (!tribunal) { console.error(`Could not read tribunal file: ${tribunalFile}`); process.exit(2); }
    tribunal.decision = String(tribunal.decision || "pass").toLowerCase();
    if (!["pass", "conditional", "veto"].includes(tribunal.decision)) {
      console.error("Tribunal decision must be pass, conditional, or veto.");
      process.exit(2);
    }
    tribunal.method = String(tribunal.method || "").toLowerCase();
    if (!["isolated", "degraded"].includes(tribunal.method)) {
      console.error('Tribunal method must be "isolated" (fresh-context reviewer, design review before detector output) or "degraded".');
      process.exit(2);
    }
    if (tribunal.decision === "veto" && !tribunal.reason) {
      console.error("A veto requires a reason and a smallest fix.");
      process.exit(2);
    }
  }

  const gateResults = rows.map((r) => ({
    id: r.def.id,
    weight: r.def.weight,
    status: r.result.status,
    points: r.result.points,
    stale: r.stale
  }));
  const total = Math.round(gateResults.reduce((n, g) => n + g.points, 0) * 10) / 10;
  const auto = verdict(total, gateResults, tribunal);

  if (!tribunal && ["pass", "award"].includes(auto.verdict)) {
    console.error("Tribunal statement required for PASS/AWARD. Write .bureau/review/tribunal.json with decision, notes, and (if needed) fix.");
    process.exit(3);
  }
  if (!tribunal && auto.verdict === "conditional") {
    tribunal = { decision: "conditional", notes: "Auto: conditional score. Written acceptance is required before release.", reason: auto.reason };
  }

  const severityRank = { p0: 0, p1: 1, p2: 2 };
  const issues = rows.flatMap((r) => (r.result.issues || []).map((i) => ({ ...i, gate: r.def.id }))).sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);
  const blocking = issues.filter((i) => i.severity === "p0");
  const conditional = issues.filter((i) => i.severity === "p1");

  let finalVerdict = auto.verdict;
  let reason = auto.reason;
  if (tribunal?.decision === "veto") { finalVerdict = "fail"; reason = `Tribunal veto: ${tribunal.reason}`; }
  else if (tribunal?.decision === "conditional" && ["pass", "award"].includes(finalVerdict)) { finalVerdict = "conditional"; reason = "Tribunal conditional acceptance"; }
  if (blocking.length) { finalVerdict = "fail"; reason = `${blocking.length} unresolved P0 issue(s).`; }
  // A single-context review cannot certify Award Track: the thread that built the work is its weakest reviewer.
  if (tribunal?.method === "degraded" && finalVerdict === "award") { finalVerdict = "pass"; reason = "DEGRADED review: single context; Award Track needs an isolated Tribunal."; }

  state.tribunal = tribunal;
  state.total = total;
  state.verdict = { verdict: finalVerdict, reason, at: new Date().toISOString() };
  state.issues = issues;
  state.blocking = blocking.length;
  state.conditional = conditional.length;
  saveState(root, state);
  const data = writeScorecards(root, state);

  console.log(`BUREAU TRIBUNAL — ${finalVerdict.toUpperCase()}`);
  console.log(`${total}/100 · ${data.gates.length} gates · P0 ${blocking.length} · P1 ${conditional.length}`);
  console.log(reason);
  console.log(`\nScorecard: ${path.relative(process.cwd(), paths(root).scorecardHtml)}`);
  if (asJson) console.log(JSON.stringify(data, null, 2));
  if (finalVerdict === "fail") process.exit(1);
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const root = opts.root;
  ensureDirs(root);
  const state = loadState(root);

  if (opts.reset) {
    if (!opts.yes) { console.error("Refusing to reset without --yes. This deletes the circuit state."); process.exit(2); }
    const p = paths(root);
    if (fs.existsSync(p.state)) fs.unlinkSync(p.state);
    console.log("Circuit state reset.");
    return;
  }
  if (opts.status || (!opts.gate && !opts.final && !opts.report && !opts.deliveryInit && !opts.juryInit)) {
    printStatus(root, state, opts.json);
    return;
  }
  if (opts.gate) {
    gateCommand(root, state, opts.gate, opts.scores);
    return;
  }
  if (opts.deliveryInit) {
    const file = path.join(root, ".bureau", "review", "delivery.md");
    if (fs.existsSync(file) && !opts.yes) { console.error(`${file} exists. Pass --yes to overwrite.`); process.exit(2); }
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, deliveryTemplate() + "\n");
    console.log(`Delivery Gate written: ${file}`);
    return;
  }
  if (opts.juryInit) {
    const file = path.join(root, ".bureau", "review", "jury.json");
    const votes = (keys) => Object.fromEntries(keys.map((key) => [key, { result: "pending", reason: "", evidence: "" }]));
    const draft = { sourceHash: sourceHash(root).hash, issues: [], members: Array.from({ length: 10 }, () => ({ id: "", specialty: "", independent: "", categories: votes(GATE_ORDER), laws: votes(UX_LAWS) })) };
    try { fs.writeFileSync(file, JSON.stringify(draft, null, 2) + "\n", { flag: "wx" }); }
    catch (error) { if (error.code === "EEXIST") { console.error(`${file} exists; preserve it or move it before initializing.`); process.exit(2); } throw error; }
    console.log(`Jury draft written: ${file}. All votes are pending; no reviewers are assigned.`);
    return;
  }
  if (opts.final) {
    finalCommand(root, state, opts.tribunal, opts.json);
    return;
  }
  if (opts.report) {
    const data = writeScorecards(root, state);
    console.log(`Scorecard: ${path.relative(process.cwd(), paths(root).scorecardHtml)}`);
    if (opts.json) console.log(JSON.stringify(data, null, 2));
  }
}

main();
