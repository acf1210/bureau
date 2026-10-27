/* @bureau-internal — test fixture; excluded from design audits */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { draftMotionResearch, validateMotionResearch } from "../skill/scripts/lib/motion-research.mjs";

function complete() {
  return { references: Array.from({ length: 5 }, (_, i) => ({ project: `Fixture ${i}`, projectUrl: `https://example.org/project-${i}`, award: "Fixture award for testing", awardUrl: `https://example.org/award-${i}`, accessedAt: "2026-10-27", viewportAndState: "Desktop view during scroll", observation: "A panel changes with the scroll", principle: "Connect states with visual continuity", avoid: "Do not copy project assets", evidence: "fixture.txt" })), synthesis: { sharedPattern: "Sections transition with continuity", departure: "The brief uses a different composition", briefConnection: "The movement supports the task", fallback: "Use a readable static alternative" } };
}
const check = (value, exists = () => true) => validateMotionResearch(value, exists).errors;

test("motion research requires five distinct, documented awarded projects", () => {
  assert.deepEqual(check(complete()), []);
  assert.ok(check(draftMotionResearch()).length > 0);
  const four = complete(); four.references.pop(); assert.ok(check(four).some((s) => s.includes("at least 5")));
  const duplicate = complete(); duplicate.references[1].projectUrl = duplicate.references[0].projectUrl; assert.ok(check(duplicate).some((s) => s.includes("duplicate")));
  const invalid = complete(); invalid.references[0].awardUrl = "https://example.org/"; invalid.references[0].accessedAt = "2026-02-30";
  assert.ok(check(invalid).some((s) => s.includes("award"))); assert.ok(check(invalid).some((s) => s.includes("date")));
  assert.ok(check(complete(), () => false).some((s) => s.includes("evidence missing")));
});

test("CLI creates a pending draft and a plan only after research is complete", (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "bureau-motion-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const script = path.resolve(import.meta.dirname, "../skill/scripts/motion-research.mjs");
  const run = (...args) => spawnSync(process.execPath, [script, ...args], { cwd: dir, encoding: "utf8" });
  assert.equal(run("--init").status, 0);
  assert.equal(run("--init").status, 2, "never overwrite the draft");
  assert.equal(run("--plan").status, 1, "incomplete research cannot generate a plan");
  fs.writeFileSync(path.join(dir, "fixture.txt"), "test evidence");
  const record = path.join(dir, ".bureau", "research", "motion.json");
  fs.writeFileSync(record, JSON.stringify(complete()));
  assert.equal(run("--check").status, 0);
  assert.equal(run("--plan").status, 0);
  assert.match(fs.readFileSync(path.join(dir, ".bureau", "research", "motion-plan.md"), "utf8"), /Fixture 4/);
  assert.equal(run("--plan").status, 2, "never overwrite the plan");
});
