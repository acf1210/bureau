/* @bureau-internal — test fixture; excluded from design audits */
import test from "node:test";
import assert from "node:assert/strict";
import { UX_LAWS, validateJury } from "../skill/scripts/lib/jury.mjs";

const categories = ["g0", "g1"];
const vote = () => ({ result: "pass", reason: "Reviewed in fixture", evidence: "evidence.txt" });
const make = () => ({ sourceHash: "abc", issues: [], members: Array.from({ length: 10 }, (_, i) => ({
  id: `reviewer-${i}`, specialty: `specialty-${i}`, independent: "independent fixture",
  categories: Object.fromEntries(categories.map((key) => [key, vote()])),
  laws: Object.fromEntries(UX_LAWS.map((key) => [key, vote()]))
})) });
const check = (jury, hash = "abc", exists = () => true) => validateJury(jury, categories, hash, exists);

test("jury requires every vote, valid evidence and the current revision", () => {
  assert.deepEqual(check(make()), []);
  const jury = make();
  delete jury.members[0].laws[UX_LAWS[0]];
  assert.ok(check(jury).some((error) => error.includes("unresolved")));
  assert.ok(check(make(), "changed").some((error) => error.includes("stale")));
  assert.ok(check(make(), "abc", () => false).some((error) => error.includes("evidence missing")));
  jury.members = jury.members.slice(0, 9);
  assert.ok(check(jury).some((error) => error.includes("10–15")));
  assert.ok(check({ sourceHash: "abc", issues: [null], members: Array(10).fill(null) }).length > 0);
});
