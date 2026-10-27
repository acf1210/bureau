/* @bureau-internal — test fixture; excluded from design audits */
import test from "node:test";
import assert from "node:assert/strict";
import { UX_LAWS, bestRound, scoreMembers, validateJury } from "../skill/scripts/lib/jury.mjs";

const categories = ["g0", "g1"];
const vote = () => ({ result: "pass", reason: "Reviewed in fixture", evidence: "evidence.txt" });
const members = () => Array.from({ length: 10 }, (_, i) => ({
  id: `reviewer-${i}`, specialty: `specialty-${i}`, independent: "independent fixture",
  categories: Object.fromEntries(categories.map((key) => [key, vote()])),
  laws: Object.fromEntries(UX_LAWS.map((key) => [key, vote()]))
}));
const round = (n, list, closedAt, sourceHash = "abc") => ({ n, sourceHash, closedAt, issues: [], members: list, ...scoreMembers(list, categories) });
const make = (rounds) => ({ loop: { startedAt: "2026-10-27T10:00:00Z", budgetSeconds: 600 }, rounds });
const check = (jury, hash = "abc", exists = () => true) => validateJury(jury, categories, hash, exists);

test("jury requires a started loop, a round, every vote and the current revision", () => {
  assert.deepEqual(check(make([round(1, members(), "2026-10-27T10:04:00Z")])).errors, []);
  assert.ok(check({ rounds: [] }).errors[0].includes("never started"));
  assert.ok(check(make([])).errors[0].includes("no jury round"));
  assert.ok(check(make([round(1, members(), "2026-10-27T10:04:00Z")]), "changed").errors.some((e) => e.includes("another revision")));
  assert.ok(check(make([round(1, members(), "2026-10-27T10:04:00Z")]), "abc", () => false).errors.some((e) => e.includes("evidence missing")));
  const short = round(1, members().slice(0, 9), "2026-10-27T10:04:00Z");
  assert.ok(check(make([short])).errors.some((e) => e.includes("10–15")));
  const missing = members();
  delete missing[0].laws[UX_LAWS[0]];
  assert.ok(check(make([round(1, missing, "2026-10-27T10:04:00Z")])).errors.some((e) => e.includes("unresolved")));
});

test("the best round inside ten minutes is the decision; late rounds are rejected", () => {
  const dissent = members();
  dissent[0].laws[UX_LAWS[0]].result = "fail";
  dissent[1].laws[UX_LAWS[1]].result = "fail";
  const one = members();
  one[0].laws[UX_LAWS[0]].result = "fail";
  const jury = make([round(1, dissent, "2026-10-27T10:03:00Z", "old"), round(2, one, "2026-10-27T10:07:00Z")]);
  const result = check(jury);
  assert.deepEqual(result.errors, []);
  assert.equal(result.best.n, 2);
  assert.equal(result.unanimous, false);
  assert.equal(result.fails.length, 1);
  jury.rounds.push(round(3, members(), "2026-10-27T10:11:00Z"));
  assert.equal(bestRound(jury.rounds, Date.parse("2026-10-27T10:10:00Z")).n, 2, "a round after the deadline never wins");
  assert.ok(check(jury).errors.some((e) => e.includes("after the 10-minute time box")));
  const tampered = make([{ ...round(1, members(), "2026-10-27T10:04:00Z"), score: 100 }]);
  tampered.rounds[0].members[0].laws[UX_LAWS[0]].result = "fail";
  assert.ok(check(tampered).errors.some((e) => e.includes("does not match")));
});
