/* @bureau-internal — test fixture; excluded from design audits */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { rules } from "../skill/scripts/lib/rules.mjs";
import { proof } from "../site/assets/proof-engine.js";

const root = path.resolve(import.meta.dirname, "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

test("the landing's proof is the detector's real output", () => {
  const generic = proof(read("site/assets/specimen/generic.html"), rules);
  assert.ok(generic.length >= 10, "the specimen must give the detector something to mark");
  assert.ok(generic.some((m) => m.severity === "p0"), "the specimen must fail");
  assert.deepEqual(proof(read("site/assets/specimen/reviewed.html"), rules), [], "the reviewed specimen is clean");
  assert.deepEqual(proof(read("site/index.html"), rules), [], "the landing proofs itself clean");
  for (const m of generic) assert.match(read("site/assets/specimen/generic.html"), new RegExp(`data-mark="[^"]*${m.id}`), `${m.id} has no element to mark`);
  const check = spawnSync(process.execPath, [path.join(root, "scripts", "proof.mjs"), "--check"], { encoding: "utf8" });
  assert.equal(check.status, 0, check.stderr);
});
