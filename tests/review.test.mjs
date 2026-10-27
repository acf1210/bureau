/* @bureau-internal — test fixture; excluded from design audits */
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { sourceHash } from "../skill/scripts/lib/gates.mjs";
import { UX_LAWS } from "../skill/scripts/lib/jury.mjs";
import { surveyQueue } from "../skill/scripts/lib/sources.mjs";

const root = path.resolve(import.meta.dirname, "..");
const scaffold = path.join(root, "skill", "scripts", "new-project.mjs");
const review = path.join(root, "skill", "scripts", "review.mjs");

const gates = {
  "g0-intake": ["BUREAU.md", ".bureau/config.json"],
  "g1-concept": [".bureau/comps/decision.md", ".bureau/comps/blend.md", ".bureau/research/survey.json", ".bureau/comps/a.html", ".bureau/comps/b.html", ".bureau/comps/c.html"],
  "g2-direction": ["DESIGN.md", ".bureau/evidence/type-specimen.png", ".bureau/evidence/color-sheet.png", ".bureau/evidence/divergence.json"],
  "g3-type-color": ["DESIGN.md", ".bureau/evidence/contrast.md"],
  "g4-composition": [".bureau/qa/report.json", ".bureau/qa/screenshots/mobile-390-fold.png", ".bureau/qa/screenshots/tablet-768-fold.png", ".bureau/qa/screenshots/laptop-1440-fold.png"],
  "g5-motion": ["MOTION.md", ".bureau/evidence/motion.mp4", ".bureau/qa/screenshots/laptop-1440-reduced-motion.png"],
  "g6-engineering": [".bureau/qa/report.json"],
  "g7-access": [".bureau/qa/report.json", ".bureau/evidence/keyboard-notes.md"],
  "g8-truth": [".bureau/evidence/audit.json", ".bureau/evidence/copy-review.md"],
  "g9-launch": [".bureau/evidence/launch-checklist.md", ".bureau/evidence/og.png"]
};

function writeSurvey(project) {
  let n = 0;
  const lenses = ["visual", "interaction", "structure", "flow", "visual"];
  const queue = surveyQueue("editorial").map((entry) => entry.status === "pending" && n < 5 ? {
    ...entry, status: "verified", url: `https://example.org/reference-${n}`, accessedAt: "2026-10-27", lens: lenses[n++],
    observation: "Body text holds one measure under a ruled index", principle: "One measure, one margin of notes", avoid: "No identity, imagery or copy is taken"
  } : entry);
  const ids = queue.filter((e) => e.status === "verified").map((e) => e.source);
  fs.mkdirSync(path.join(project, ".bureau", "research"), { recursive: true });
  fs.writeFileSync(path.join(project, ".bureau", "research", "survey.json"), JSON.stringify({ queue, synthesis: {
    pattern: "A single reading measure beside a ruled index", patternSources: ids.slice(0, 3),
    creative: "The index turns into the issue's running table of figures", avoid: "No layout, identity or copy is lifted from any reference"
  } }));
}

function run(script, args, cwd) {
  return spawnSync(process.execPath, [script, ...args], { cwd, encoding: "utf8" });
}

test("review circuit gates in order and returns an award scorecard", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "bureau-review-"));
  const project = path.join(dir, "site");
  let r = run(scaffold, ["site", "--dir", project, "--template", "kinetic-editorial"], dir);
  assert.equal(r.status, 0, r.stderr);

  fs.mkdirSync(path.join(project, ".bureau", "comps"), { recursive: true });
  fs.mkdirSync(path.join(project, ".bureau", "evidence"), { recursive: true });
  fs.mkdirSync(path.join(project, ".bureau", "qa", "screenshots"), { recursive: true });
  fs.mkdirSync(path.join(project, ".bureau", "review"), { recursive: true });
  for (const name of ["a", "b", "c"]) fs.writeFileSync(path.join(project, ".bureau", "comps", `${name}.html`), "<!doctype html><title>comp</title>");
  fs.writeFileSync(path.join(project, ".bureau", "comps", "decision.md"), "# Decision\nA chosen.\n");
  fs.writeFileSync(path.join(project, ".bureau", "comps", "blend.md"), "# Blend\nTufte × Vignelli × Aicher.\n");
  writeSurvey(project);
  for (const f of ["type-specimen.png", "color-sheet.png", "contrast.md", "motion.mp4", "keyboard-notes.md", "audit.json", "copy-review.md", "launch-checklist.md", "og.png", "divergence.json"]) {
    fs.writeFileSync(path.join(project, ".bureau", "evidence", f), "evidence");
  }
  fs.writeFileSync(path.join(project, ".bureau", "qa", "report.json"), "{}");
  for (const f of ["mobile-390-fold.png", "tablet-768-fold.png", "laptop-1440-fold.png", "laptop-1440-reduced-motion.png"]) {
    fs.writeFileSync(path.join(project, ".bureau", "qa", "screenshots", f), "png");
  }

  const extra = {
    "g1-concept": { critique: { philosophy: 5, hierarchy: 4, execution: 4, specificity: 5, restraint: 4, variety: 4, weakest: "hierarchy: the index competed with the lede; moved it to the margin" } },
    "g7-access": { heuristics: [4, 4, 3, 4, 3, 4, { score: "n/a", reason: "single landing page" }, 4, 3, { score: "n/a", reason: "no help system on a landing page" }] }
  };
  for (const [gate, evidence] of Object.entries(gates)) {
    fs.writeFileSync(path.join(project, ".bureau", "review", `${gate}.json`), JSON.stringify({
      gate, score: 4.5, notes: "Reviewed against evidence at the same viewport.", issues: [], evidence, ...(extra[gate] || {})
    }));
    r = run(review, ["--gate", gate, "--scores", `.bureau/review/${gate}.json`], project);
    assert.equal(r.status, 0, `${gate}: ${r.stdout}\n${r.stderr}`);
  }

  r = run(review, ["--regate"], project);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /10 gates replayed/);

  fs.writeFileSync(path.join(project, ".bureau", "review", "tribunal.json"), JSON.stringify({
    decision: "pass", method: "isolated", notes: "The work keeps the brief and the evidence is real.", reviewer: "The Partner"
  }));
  r = run(review, ["--final", "--tribunal", ".bureau/review/tribunal.json"], project);
  assert.equal(r.status, 4, "final must refuse without a Delivery Gate");
  r = run(review, ["--delivery-init"], project);
  assert.equal(r.status, 0, r.stderr);
  r = run(review, ["--final", "--tribunal", ".bureau/review/tribunal.json"], project);
  assert.equal(r.status, 1, `final must refuse an unchecked Delivery Gate: ${r.status} ${r.stdout} ${r.stderr}`);
  const deliveryFile = path.join(project, ".bureau", "review", "delivery.md");
  fs.writeFileSync(deliveryFile, fs.readFileSync(deliveryFile, "utf8").replace(/- \[ \] (DG-\w+)(.*) — evidence:/g, "- [PASS] $1$2 — evidence: .bureau/qa/report.json, 0 issues"));
  r = run(review, ["--final", "--tribunal", ".bureau/review/tribunal.json"], project);
  assert.equal(r.status, 1, "final must refuse a missing jury");
  const vote = () => ({ result: "pass", reason: "Reviewed in this test fixture", evidence: ".bureau/qa/report.json" });
  const juryFile = path.join(project, ".bureau", "review", "jury.json");
  assert.equal(run(review, ["--jury-init"], project).status, 0);
  assert.equal(run(review, ["--jury-round"], project).status, 2, "no round before the loop starts");
  r = run(review, ["--jury-start"], project);
  assert.equal(r.status, 0, r.stderr);
  const jury = JSON.parse(fs.readFileSync(juryFile, "utf8"));
  jury.members = Array.from({ length: 10 }, (_, i) => ({
    id: `fixture-${i}`, specialty: `specialty-${i}`, independent: "test fixture",
    categories: Object.fromEntries(Object.keys(gates).map((id) => [id, vote()])),
    laws: Object.fromEntries(UX_LAWS.map((id) => [id, vote()]))
  }));
  jury.members[0].laws[UX_LAWS[0]].result = "fail";
  fs.writeFileSync(juryFile, JSON.stringify(jury));
  r = run(review, ["--jury-round"], project);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /Round 1: 99\.8\/100/);
  r = run(review, ["--final", "--tribunal", ".bureau/review/tribunal.json"], project);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /CONDITIONAL/, "a best round with dissent caps the verdict");
  const recorded = JSON.parse(fs.readFileSync(juryFile, "utf8"));
  recorded.members[0].laws[UX_LAWS[0]].result = "pass";
  fs.writeFileSync(juryFile, JSON.stringify(recorded));
  r = run(review, ["--jury-round"], project);
  assert.match(r.stdout, /unanimous/);
  assert.match(run(review, ["--jury-status"], project).stdout, /best round 2 at 100\/100, unanimous/);
  r = run(review, ["--final", "--tribunal", ".bureau/review/tribunal.json"], project);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /AWARD/);
  const scorecard = JSON.parse(fs.readFileSync(path.join(project, ".bureau", "review", "scorecard.json"), "utf8"));
  assert.equal(scorecard.verdict.verdict, "award");
  assert.equal(scorecard.total, 90);
  assert.ok(fs.existsSync(path.join(project, ".bureau", "review", "scorecard.html")));
  fs.rmSync(dir, { recursive: true, force: true });
});

test("pre-build critique under 3 fails Gate 1", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "bureau-critique-"));
  const project = path.join(dir, "site");
  run(scaffold, ["site", "--dir", project, "--template", "product-surface"], dir);
  fs.mkdirSync(path.join(project, ".bureau", "review"), { recursive: true });
  fs.writeFileSync(path.join(project, ".bureau", "review", "g0.json"), JSON.stringify({ gate: "g0-intake", score: 4, notes: "Brief names audience and proof.", issues: [], evidence: ["BUREAU.md"] }));
  assert.equal(run(review, ["--gate", "g0-intake", "--scores", ".bureau/review/g0.json"], project).status, 0);
  for (const f of ["a.html", "b.html", "c.html", "decision.md", "blend.md"]) fs.writeFileSync(path.join(project, ".bureau", "comps", f), "x");
  const g1 = { gate: "g1-concept", score: 4.5, notes: "Three distinct directions with real comps.", issues: [], evidence: [], critique: { philosophy: 4, hierarchy: 4, execution: 4, specificity: 2, restraint: 4, variety: 4, weakest: "specificity: the hero fits any planning tool" } };
  fs.writeFileSync(path.join(project, ".bureau", "review", "g1.json"), JSON.stringify(g1));
  let r = run(review, ["--gate", "g1-concept", "--scores", ".bureau/review/g1.json"], project);
  assert.equal(r.status, 4, "Gate 1 needs the reference survey");
  assert.equal(run(path.join(root, "skill", "scripts", "survey.mjs"), ["--init", "--need", "product"], project).status, 0);
  r = run(review, ["--gate", "g1-concept", "--scores", ".bureau/review/g1.json"], project);
  assert.equal(r.status, 4, "an unworked queue blocks Gate 1");
  assert.match(r.stderr, /0\/5 sources verified/);
  fs.rmSync(path.join(project, ".bureau", "research"), { recursive: true });
  writeSurvey(project);
  r = run(review, ["--gate", "g1-concept", "--scores", ".bureau/review/g1.json"], project);
  assert.equal(r.status, 1, r.stdout);
  assert.match(r.stdout, /specificity/);
  delete g1.critique;
  fs.writeFileSync(path.join(project, ".bureau", "review", "g1.json"), JSON.stringify(g1));
  r = run(review, ["--gate", "g1-concept", "--scores", ".bureau/review/g1.json"], project);
  assert.equal(r.status, 2, "critique is required");
  fs.rmSync(dir, { recursive: true, force: true });
});

test("refuses out-of-order gates", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "bureau-order-"));
  const project = path.join(dir, "site");
  run(scaffold, ["site", "--dir", project, "--template", "product-surface"], dir);
  fs.mkdirSync(path.join(project, ".bureau", "review"), { recursive: true });
  fs.writeFileSync(path.join(project, ".bureau", "review", "g1.json"), JSON.stringify({
    gate: "g1-concept", score: 4, notes: "Concept reviewed with three real comps.", issues: [], evidence: []
  }));
  const r = run(review, ["--gate", "g1-concept", "--scores", ".bureau/review/g1.json"], project);
  assert.equal(r.status, 3);
  fs.rmSync(dir, { recursive: true, force: true });
});

test("jury initialization creates only pending votes and never overwrites a record", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "bureau-jury-"));
  const result = run(review, ["--jury-init"], dir);
  assert.equal(result.status, 0, result.stderr);
  const file = path.join(dir, ".bureau", "review", "jury.json");
  const draft = JSON.parse(fs.readFileSync(file, "utf8"));
  assert.equal(draft.members.length, 10);
  assert.equal(draft.members[0].id, "");
  assert.equal(Object.keys(draft.members[0].laws).length, UX_LAWS.length);
  assert.ok(Object.values(draft.members[0].laws).every((vote) => vote.result === "pending"));
  assert.equal(run(review, ["--jury-init"], dir).status, 2);
  assert.deepEqual(JSON.parse(fs.readFileSync(file, "utf8")), draft);
  fs.rmSync(dir, { recursive: true, force: true });
});

test("the jury loop refuses rounds after ten minutes", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "bureau-timebox-"));
  assert.equal(run(review, ["--jury-init"], dir).status, 0);
  assert.equal(run(review, ["--jury-start"], dir).status, 0);
  assert.equal(run(review, ["--jury-start"], dir).status, 2, "a running loop is not restarted silently");
  const file = path.join(dir, ".bureau", "review", "jury.json");
  const jury = JSON.parse(fs.readFileSync(file, "utf8"));
  jury.loop.startedAt = new Date(Date.now() - 11 * 60000).toISOString();
  fs.writeFileSync(file, JSON.stringify(jury));
  const r = run(review, ["--jury-round"], dir);
  assert.equal(r.status, 3);
  assert.match(r.stderr, /Time box closed/);
  fs.rmSync(dir, { recursive: true, force: true });
});
