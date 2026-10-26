/* @bureau-internal — excluded from design audits */
/**
 * Gate definitions for the BUREAU review circuit.
 * Weights sum to 100. Any gate < 3.5, any P0, or missing evidence fails.
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const GATE_ORDER = [
  "g0-intake",
  "g1-concept",
  "g2-direction",
  "g3-type-color",
  "g4-composition",
  "g5-motion",
  "g6-engineering",
  "g7-access",
  "g8-truth",
  "g9-launch"
];

export const gates = [
  {
    id: "g0-intake",
    index: 0,
    name: "Intake",
    persona: "The Producer",
    weight: 5,
    question: "Is the brief true, bounded, and evidenced?",
    evidence: [
      { label: "Brief", path: "BUREAU.md" },
      { label: "Config", path: ".bureau/config.json" }
    ],
    hardFails: [
      "Invented proof or implied credibility",
      "No defined audience or action",
      "Scope contradicts budget/deadline with no trade-off recorded"
    ]
  },
  {
    id: "g1-concept",
    index: 1,
    name: "Concept",
    persona: "The Creative Director",
    weight: 14,
    question: "Is there an idea only this brand could own?",
    evidence: [
      { label: "Decision record", path: ".bureau/comps/decision.md" },
      { label: "Lineage blend", path: ".bureau/comps/blend.md" },
      { label: "Three comps + decision + blend", path: ".bureau/comps/*", min: 5 }
    ],
    hardFails: [
      "The concept could belong to any competitor unchanged",
      "One source dominates: the attribution test names it",
      "No signature move, or a generic effect",
      "Depends on assets that do not exist and cannot be produced"
    ]
  },
  {
    id: "g2-direction",
    index: 2,
    name: "Direction",
    persona: "The Art Director",
    weight: 15,
    question: "Does the visual world feel inevitable and alive?",
    evidence: [
      { label: "Visual contract", path: "DESIGN.md" },
      { label: "Type specimen", path: ".bureau/evidence/*type*" },
      { label: "Color sheet", path: ".bureau/evidence/*color*" },
      { label: "Divergence report", path: ".bureau/evidence/divergence.json" }
    ],
    hardFails: [
      "Reads as a template or a known site with the logo swapped",
      "Divergence above 0.35 against the scaffold or a bundled template",
      "More than one competing signature move",
      "A section belongs to another design language"
    ]
  },
  {
    id: "g3-type-color",
    index: 3,
    name: "Type & Color",
    persona: "The Type Director",
    weight: 12,
    question: "Is the type distinctive and the color narrative coherent?",
    evidence: [
      { label: "Design tokens", path: "DESIGN.md" },
      { label: "Contrast report", path: ".bureau/evidence/*contrast*" }
    ],
    hardFails: [
      "Body contrast below 4.5:1",
      "Gradient text on a headline",
      "More than 3 families without an editorial reason",
      "Accent used more than 3 times above the fold without a system",
      "Portuguese/Spanish accents break the display face"
    ]
  },
  {
    id: "g4-composition",
    index: 4,
    name: "Composition",
    persona: "The Layout Architect",
    weight: 12,
    question: "Does the composition direct attention at every viewport?",
    evidence: [
      { label: "Visual audit", path: ".bureau/qa/report.json" },
      { label: "Mobile screenshot", path: ".bureau/qa/screenshots/*390*", min: 1 },
      { label: "Tablet screenshot", path: ".bureau/qa/screenshots/*768*", min: 1 },
      { label: "Laptop screenshot", path: ".bureau/qa/screenshots/*1440*", min: 1 }
    ],
    hardFails: [
      "Horizontal scroll at 320px",
      "Primary action unreachable or hidden below a full-screen decoration",
      "Content clipped at 200% zoom",
      "Overlapping fixed elements that block interaction"
    ]
  },
  {
    id: "g5-motion",
    index: 5,
    name: "Motion",
    persona: "The Motion Director",
    weight: 12,
    question: "Is motion choreographed, purposeful, and performant?",
    evidence: [
      { label: "Motion grammar", path: "MOTION.md" },
      { label: "Motion evidence", path: ".bureau/evidence/*motion*" },
      { label: "Reduced-motion shot", path: ".bureau/qa/screenshots/*reduced*" }
    ],
    hardFails: [
      "prefers-reduced-motion ignored",
      "Scroll hijacking with no escape",
      "Autoplay audio",
      "Motion causes a P0 performance failure",
      "Flashing above 3 Hz"
    ]
  },
  {
    id: "g6-engineering",
    index: 6,
    name: "Engineering",
    persona: "The Tech Lead",
    weight: 10,
    question: "Is it fast, resilient, and maintainable?",
    evidence: [
      { label: "Visual/perf audit", path: ".bureau/qa/report.json" }
    ],
    hardFails: [
      "LCP > 4s on mobile or CLS > 0.25",
      "A console error breaks a primary interaction",
      "Blank without JS when content is static",
      "Dependency with an incompatible license"
    ]
  },
  {
    id: "g7-access",
    index: 7,
    name: "Access",
    persona: "The Access Lead",
    weight: 9,
    question: "Can everyone use it, including keyboard and reduced motion?",
    evidence: [
      { label: "Access report", path: ".bureau/qa/report.json" },
      { label: "Keyboard/a11y notes", path: ".bureau/evidence/*{keyboard,a11y,access}*", min: 1 }
    ],
    hardFails: [
      "Any P0 access barrier",
      "Missing labels on form controls",
      "Keyboard trap",
      "Text over media fails contrast at a meaningful frame",
      "No captions for meaningful speech"
    ]
  },
  {
    id: "g8-truth",
    index: 8,
    name: "Truth",
    persona: "The Editor-in-Chief",
    weight: 8,
    question: "Is every word true and free of AI tells?",
    evidence: [
      { label: "Static audit", path: ".bureau/evidence/audit.json" },
      { label: "Copy review", path: ".bureau/evidence/*copy*" }
    ],
    hardFails: [
      "Fabricated claim, logo, metric, testimonial, or award",
      "Lorem ipsum in a shipped page",
      "A P0 slop pattern that defines the page",
      "Copy that misrepresents price, availability, or capability"
    ]
  },
  {
    id: "g9-launch",
    index: 9,
    name: "Launch",
    persona: "The Release Engineer",
    weight: 3,
    question: "Can it ship, be found, measured, and recovered?",
    evidence: [
      { label: "Launch checklist", path: ".bureau/evidence/*launch*" },
      { label: "OG/social asset", path: ".bureau/evidence/*og*" }
    ],
    hardFails: [
      "No working primary action in production",
      "Exposed secrets or debug data",
      "Missing consent where legally required",
      "No way to roll back"
    ]
  }
];

export const gateById = new Map(gates.map((g) => [g.id, g]));

export const VERDICTS = {
  award: 90,
  pass: 82,
  conditional: 72
};

const IGNORE_DIRS = new Set([
  "node_modules", ".git", ".bureau", "dist", "build", ".next", ".astro",
  "coverage", ".cache", ".turbo", "test-results", "playwright-report"
]);

const SOURCE_EXT = new Set([
  ".html", ".htm", ".css", ".scss", ".sass", ".less", ".js", ".mjs", ".cjs",
  ".jsx", ".ts", ".tsx", ".vue", ".svelte", ".astro", ".json", ".svg",
  ".md", ".mdx", ".webmanifest", ".xml", ".txt"
]);

export function walkFiles(root, rel = "") {
  const out = [];
  const abs = path.join(root, rel);
  let entries;
  try { entries = fs.readdirSync(abs, { withFileTypes: true }); }
  catch { return out; }
  for (const entry of entries) {
    if (entry.name.startsWith(".git")) continue;
    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      out.push(...walkFiles(root, path.join(rel, entry.name)));
    } else if (entry.isFile()) {
      out.push(path.join(rel, entry.name));
    }
  }
  return out;
}

function globToRegex(glob) {
  let g = glob.replace(/\\/g, "/");
  const braces = [];
  g = g.replace(/\{([^}]+)\}/g, (_, group) => {
    braces.push(group.split(",").map((part) => part.replace(/[.+^${}()|[\]\\]/g, "\\$&")).join("|"));
    return `\u0001${braces.length - 1}\u0001`;
  });
  g = g.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  g = g.replace(/\*\*/g, "\u0000");
  g = g.replace(/\*/g, "[^/]*");
  g = g.replace(/\?/g, "[^/]");
  g = g.replace(/\u0000/g, ".*");
  g = g.replace(/\u0001(\d+)\u0001/g, (_, i) => `(${braces[Number(i)]})`);
  return new RegExp("^" + g + "$");
}

function walkAllFiles(root, rel = "") {
  const out = [];
  const abs = path.join(root, rel);
  let entries;
  try { entries = fs.readdirSync(abs, { withFileTypes: true }); }
  catch { return out; }
  for (const entry of entries) {
    if (entry.name.startsWith(".git")) continue;
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "dist" || entry.name === "build" || entry.name === ".next" || entry.name === ".astro") continue;
      out.push(...walkAllFiles(root, path.join(rel, entry.name)));
    } else if (entry.isFile()) {
      out.push(path.join(rel, entry.name));
    }
  }
  return out;
}

export function findMatches(root, glob) {
  const normalized = glob.replace(/\\/g, "/");
  const re = globToRegex(normalized);
  return walkAllFiles(root).filter((file) => re.test(file.replace(/\\/g, "/")));
}

export function checkEvidence(root, specs) {
  const missing = [];
  const found = [];
  for (const spec of specs) {
    const min = spec.min || 1;
    const matches = findMatches(root, spec.path);
    if (matches.length < min) {
      missing.push({ label: spec.label, path: spec.path, min, found: matches.length });
    } else {
      found.push({ label: spec.label, path: spec.path, count: matches.length, files: matches.slice(0, 8) });
    }
  }
  return { missing, found };
}

// Pre-build critique (Gate 1): six axes, 1–5. Any axis under 3 sends the direction back.
export const CRITIQUE_AXES = ["philosophy", "hierarchy", "execution", "specificity", "restraint", "variety"];

// Usability heuristics (Gate 7): Nielsen's ten, 0–4 each, "n/a" allowed with a reason.
export const HEURISTICS = [
  "Visibility of system status", "Match with the real world", "User control and freedom",
  "Consistency and standards", "Error prevention", "Recognition over recall",
  "Flexibility and efficiency", "Aesthetic and minimalist design", "Error recovery",
  "Help and documentation"
];

// Delivery Gate: every line PASS with evidence, or the Tribunal does not open.
export const DELIVERY_ITEMS = [
  { id: "DG-F1", block: "Floor", text: "No fabricated proof: every claim, number, logo, quote and award has a source in BUREAU.md" },
  { id: "DG-F2", block: "Floor", text: "Every control was clicked and does what it says; no fake send, no dead link" },
  { id: "DG-F3", block: "Floor", text: "Contrast passes AA in every state, including text over media at its brightest frame" },
  { id: "DG-F4", block: "Floor", text: "Full keyboard path with visible, instant focus; no trap" },
  { id: "DG-F5", block: "Floor", text: "Reduced motion is designed; no flashing above 3 Hz; no autoplay audio" },
  { id: "DG-F6", block: "Floor", text: "No horizontal scroll from 320 to 1920 px; nothing clipped at 200% zoom" },
  { id: "DG-F7", block: "Floor", text: "At 1280×800 the headline, lede and primary action are visible without scrolling" },
  { id: "DG-F8", block: "Floor", text: "Content is visible with JavaScript off; reveals are scoped under .js" },
  { id: "DG-R1", block: "Reflex", text: "Every slop tell that remains has a written, page-specific waiver; none is P0" },
  { id: "DG-R2", block: "Reflex", text: "Attribution test run: no single designer, site or template can be named" },
  { id: "DG-R3", block: "Reflex", text: "Divergence at or below 0.35 against the scaffold and every bundled template" },
  { id: "DG-L1", block: "Liveliness", text: "Dials declared (ENERGY / RHYTHM / MOTION, 1–3) and the page matches them" },
  { id: "DG-L2", block: "Liveliness", text: "One focal point per screen; one deliberate accent, not zero and not everywhere" },
  { id: "DG-L3", block: "Liveliness", text: "One identity motif named and repeated; the signature move is memorable, not merely present" },
  { id: "DG-C1", block: "Finish", text: "Browser surfaces themed: selection, caret, focus, scrollbar, underline offset, tabular figures" },
  { id: "DG-C2", block: "Finish", text: "Typographic finish: real quotes and dashes, no widows in heads, glyphs intact at display size" },
  { id: "DG-C3", block: "Finish", text: "Empty, loading and error states exist for every live element" },
  { id: "DG-P1", block: "Process", text: "Design review written before reading detector output, or the run is declared degraded" },
  { id: "DG-P2", block: "Process", text: "Tribunal read the work in a fresh context, or declared degraded" }
];

export function parseDelivery(text) {
  const items = new Map();
  for (const line of String(text).split(/\r?\n/)) {
    const m = line.match(/^\s*[-*]\s*\[(PASS|FAIL|N\/A|\s?)\]\s*(DG-[A-Z]\d+)\b\s*(?:—|-|:)?\s*(.*)$/i);
    if (m) items.set(m[2].toUpperCase(), { status: m[1].trim().toUpperCase() || "OPEN", evidence: m[3].trim() });
  }
  const errors = [];
  for (const item of DELIVERY_ITEMS) {
    const got = items.get(item.id);
    if (!got) { errors.push(`${item.id} missing`); continue; }
    if (got.status === "FAIL") errors.push(`${item.id} is FAIL: ${got.evidence || "no note"}`);
    else if (got.status === "OPEN") errors.push(`${item.id} is not checked`);
    else if (got.status === "N/A" && item.block === "Floor") errors.push(`${item.id} is Floor and cannot be N/A`);
    else if (got.evidence.replace(/^.*?(?:—|:)\s*/, "").length < 12) errors.push(`${item.id} needs evidence (a file, a screenshot, a command and its result)`);
  }
  return { items, errors };
}

export function deliveryTemplate() {
  const lines = ["# Delivery Gate", "", "Mark each line `[PASS]`, `[FAIL]` or (Reflex, Liveliness, Finish, Process only) `[N/A]`, then the text, then the evidence after an em dash.", ""];
  let block = null;
  for (const item of DELIVERY_ITEMS) {
    if (item.block !== block) { block = item.block; lines.push(`## ${block}`, ""); }
    lines.push(`- [ ] ${item.id} ${item.text} — evidence:`);
    if (DELIVERY_ITEMS[DELIVERY_ITEMS.indexOf(item) + 1]?.block !== block) lines.push("");
  }
  return lines.join("\n");
}

export function normalizeScores(input, gate) {
  const errors = [];
  if (!input || typeof input !== "object") return { errors: ["Scores file is not a JSON object."] };
  if (input.gate && input.gate !== gate.id) errors.push(`Scores gate is "${input.gate}", expected "${gate.id}".`);
  const score = Number(input.score);
  if (!Number.isFinite(score) || score < 0 || score > 5) errors.push("score must be a number between 0 and 5.");
  if (typeof input.notes !== "string" || input.notes.trim().length < 12) errors.push("notes must be specific (at least 12 characters).");
  const issues = Array.isArray(input.issues) ? input.issues : [];
  for (const [i, issue] of issues.entries()) {
    const sev = String(issue.severity || "").toLowerCase();
    if (!["p0", "p1", "p2"].includes(sev)) errors.push(`issues[${i}].severity must be P0, P1, or P2.`);
    if (!issue.title) errors.push(`issues[${i}].title is required.`);
    if (!issue.fix) errors.push(`issues[${i}].fix is required.`);
  }
  const evidence = Array.isArray(input.evidence) ? input.evidence : [];
  let critique = null;
  if (gate.id === "g1-concept") {
    const c = input.critique;
    if (!c || typeof c !== "object") errors.push(`critique is required: score ${CRITIQUE_AXES.join(", ")} from 1 to 5.`);
    else {
      critique = {};
      for (const axis of CRITIQUE_AXES) {
        const v = Number(c[axis]);
        if (!Number.isInteger(v) || v < 1 || v > 5) errors.push(`critique.${axis} must be an integer from 1 to 5.`);
        else critique[axis] = v;
      }
      if (!c.weakest || String(c.weakest).length < 12) errors.push("critique.weakest must name the weakest axis and the fix taken.");
      else critique.weakest = String(c.weakest);
    }
  }
  let heuristics = null;
  if (gate.id === "g7-access") {
    const h = input.heuristics;
    if (!Array.isArray(h) || h.length !== HEURISTICS.length) errors.push(`heuristics must list all ${HEURISTICS.length} usability heuristics, 0–4 or "n/a" with a reason.`);
    else {
      let sum = 0, max = 0;
      h.forEach((entry, i) => {
        const value = typeof entry === "object" && entry !== null ? entry.score : entry;
        if (String(value).toLowerCase() === "n/a") {
          if (!entry?.reason) errors.push(`heuristics[${i}] is n/a without a reason.`);
          return;
        }
        const v = Number(value);
        if (!Number.isFinite(v) || v < 0 || v > 4) errors.push(`heuristics[${i}] must be 0–4 or "n/a".`);
        else { sum += v; max += 4; }
      });
      heuristics = { sum, max, ratio: max ? Math.round((sum / max) * 100) / 100 : 0 };
    }
  }
  return {
    errors,
    value: {
      gate: gate.id,
      score: Number.isFinite(score) ? Math.round(score * 2) / 2 : null,
      reviewer: input.reviewer || gate.persona,
      notes: input.notes || "",
      strengths: Array.isArray(input.strengths) ? input.strengths : [],
      issues: issues.map((i) => ({ ...i, severity: String(i.severity || "").toLowerCase() })),
      evidence,
      critique,
      heuristics,
      reviewedAt: input.reviewedAt || new Date().toISOString()
    }
  };
}

export function validateEvidenceFiles(root, paths) {
  const missing = [];
  for (const p of paths || []) {
    if (!p || typeof p !== "string") continue;
    if (p.startsWith("(") || /^https?:/i.test(p)) continue;
    const abs = path.resolve(root, p);
    if (!fs.existsSync(abs)) missing.push(p);
  }
  return missing;
}

const HASH_EXT = new Set([
  ".html", ".htm", ".css", ".scss", ".sass", ".less", ".js", ".mjs", ".cjs",
  ".jsx", ".ts", ".tsx", ".vue", ".svelte", ".astro", ".json", ".svg",
  ".md", ".mdx", ".webmanifest", ".mp4", ".webm", ".jpg", ".jpeg",
  ".png", ".webp", ".avif", ".woff2"
]);

export function sourceHash(root) {
  let config = {};
  try { config = JSON.parse(fs.readFileSync(path.join(root, ".bureau/config.json"), "utf8")); } catch {}
  const candidates = [];
  const declared = config.paths?.source;
  if (Array.isArray(declared) && declared.length) {
    for (const p of declared) {
      const abs = path.join(root, p);
      if (!fs.existsSync(abs)) continue;
      if (fs.statSync(abs).isDirectory()) {
        candidates.push(...walkFiles(root).filter((f) => f === p || f.startsWith(p + path.sep) || f.startsWith(p.replace(/\\/g, "/") + "/")));
      } else {
        candidates.push(p);
      }
    }
  } else {
    candidates.push(...walkFiles(root));
  }
  const docs = ["BUREAU.md", "DESIGN.md", "MOTION.md", ".bureau/config.json", "VERSION"];
  for (const d of docs) if (fs.existsSync(path.join(root, d))) candidates.push(d);

  const files = [...new Set(candidates)]
    .map((f) => f.replace(/\\/g, "/"))
    .filter((f) => !f.startsWith(".bureau/review") && !f.startsWith(".bureau/evidence") && !f.startsWith(".bureau/qa"))
    .filter((f) => HASH_EXT.has(path.extname(f).toLowerCase()));
  files.sort();
  const hash = crypto.createHash("sha256");
  for (const f of files) {
    hash.update(f + "\0");
    try { hash.update(fs.readFileSync(path.join(root, f))); } catch {}
    hash.update("\0");
  }
  return { hash: hash.digest("hex"), files: files.length };
}

export function verdict(total, gateResults, tribunal) {
  const failedGates = gateResults.filter((g) => g.status !== "passed");
  const stale = gateResults.filter((g) => g.stale);
  if (failedGates.length) return { verdict: "fail", reason: `Gate(s) not passed: ${failedGates.map((g) => g.id).join(", ")}` };
  if (stale.length) return { verdict: "fail", reason: `Stale gate(s): ${stale.map((g) => g.id).join(", ")}` };
  if (tribunal?.decision === "veto") return { verdict: "fail", reason: `Tribunal veto: ${tribunal.reason || "no reason given"}` };
  if (total >= VERDICTS.award) return { verdict: "award", reason: "Award Track" };
  if (total >= VERDICTS.pass) return { verdict: "pass", reason: "Pass" };
  if (total >= VERDICTS.conditional) return { verdict: "conditional", reason: "Conditional" };
  return { verdict: "fail", reason: `Score ${total} below ${VERDICTS.conditional}` };
}

export function pointsFor(gate, score) {
  return Math.round(((score / 5) * gate.weight) * 10) / 10;
}
