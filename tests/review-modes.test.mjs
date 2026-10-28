/* @bureau-internal — test fixture; excluded from design audits */
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { REVIEW_MODES, gatesForMode, modeWeight, reviewModeById, parseDelivery, DELIVERY_ITEMS } from "../skill/scripts/lib/gates.mjs";

const root = path.resolve(import.meta.dirname, "..");
const review = path.join(root, "skill", "scripts", "review.mjs");
const run = (args, cwd) => spawnSync(process.execPath, [review, ...args], { cwd, encoding: "utf8" });

test("the three review modes declare their contract", () => {
  assert.deepEqual(Object.keys(REVIEW_MODES), ["fast", "standard", "signature"]);
  assert.equal(gatesForMode("fast").length, 6);
  assert.equal(gatesForMode("standard").length, 10);
  assert.equal(gatesForMode("signature").length, 10);
  assert.equal(modeWeight("fast"), 59);
  assert.equal(modeWeight("standard"), 100);
  assert.equal(modeWeight("signature"), 100);
  assert.equal(REVIEW_MODES.fast.jury, false);
  assert.equal(REVIEW_MODES.standard.jury, false);
  assert.equal(REVIEW_MODES.signature.jury, true);
  assert.equal(REVIEW_MODES.fast.award, false);
  assert.equal(REVIEW_MODES.standard.award, false);
  assert.equal(REVIEW_MODES.signature.award, true);
  assert.equal(reviewModeById("FAST").id, "fast");
  assert.equal(reviewModeById("nope"), null);
});

test("a mode is persisted and an unknown mode is refused", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "bureau-mode-"));
  fs.mkdirSync(path.join(dir, ".bureau"), { recursive: true });
  fs.writeFileSync(path.join(dir, "BUREAU.md"), "# Brief\n");
  let r = run(["--mode", "fast"], dir);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /Fast/);
  const stateFile = path.join(dir, ".bureau", "review", "state.json");
  assert.equal(JSON.parse(fs.readFileSync(stateFile, "utf8")).mode, "fast");
  r = run(["--mode", "theatre"], dir);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /Unknown review mode/);
  fs.rmSync(dir, { recursive: true, force: true });
});

test("Fast validates only the Floor block of the Delivery Gate", () => {
  const text = [
    ...DELIVERY_ITEMS.filter((item) => item.block === "Floor").map((item) => `- [PASS] ${item.id} ${item.text} — .bureau/qa/report.json, 0 issues`),
    "- [ ] DG-R1 Every slop tell has a waiver — open on purpose"
  ].join("\n");
  assert.deepEqual(parseDelivery(text, ["Floor"]).errors, []);
  assert.ok(parseDelivery(text, ["Floor", "Reflex"]).errors.some((e) => e.includes("DG-R1")));
});
