/* @bureau-internal — test fixture; excluded from design audits */
import test from "node:test";
import assert from "node:assert/strict";
import { SOURCES, SURVEY_TARGET, surveyQueue, validateSurvey } from "../skill/scripts/lib/sources.mjs";
import { probeQueue } from "../skill/scripts/survey.mjs";

const lenses = ["visual", "interaction", "structure", "flow", "visual"];
const verify = (entry, i) => ({
  ...entry, status: "verified", url: `https://example.org/project-${i}`, accessedAt: "2026-10-27",
  lens: lenses[i % lenses.length], observation: "The index runs as a fixed left column", principle: "Navigation as a reading margin", avoid: "Its wordmark, imagery and copy"
});
const complete = () => {
  const queue = surveyQueue("landing");
  let n = 0;
  const out = queue.map((entry) => entry.status === "pending" && n < SURVEY_TARGET ? verify(entry, n++) : entry);
  const ids = out.filter((e) => e.status === "verified").map((e) => e.source);
  return { queue: out, synthesis: { pattern: "A fixed index column beside a single reading measure", patternSources: ids.slice(0, 3), creative: "The index becomes the price list and scrolls with the order", avoid: "No layout, identity or copy is lifted from any reference" } };
};

test("registry holds the 25 requested references, unidentified ones skipped", () => {
  assert.equal(SOURCES.length, 25);
  assert.equal(new Set(SOURCES.map((s) => s.id)).size, 25);
  const queue = surveyQueue("general");
  assert.equal(queue.find((e) => e.source === "canvas").status, "skipped");
  assert.equal(queue.find((e) => e.source === "goodbrief").status, "skipped");
  assert.equal(surveyQueue("saas")[0].source, "mobbin");
  assert.throws(() => surveyQueue("nope"));
});

test("survey closes only with five verified sources taken in queue order", () => {
  assert.deepEqual(validateSurvey(complete()).errors, []);
  const four = complete();
  const last = four.queue.findLastIndex((e) => e.status === "verified");
  four.queue[last] = { source: four.queue[last].source, status: "pending" };
  assert.ok(validateSurvey(four).errors.some((e) => e.includes("4/5")));
  const skipped = complete();
  const first = skipped.queue.findIndex((e) => e.status === "verified");
  skipped.queue[first] = { source: skipped.queue[first].source, status: "pending" };
  assert.ok(validateSurvey(skipped).errors.some((e) => e.includes("ahead of a verified")), "no silent cherry-picking");
  skipped.queue[first] = { source: skipped.queue[first].source, status: "skipped", reason: "Account wall on 2026-10-27; next source taken." };
  assert.ok(validateSurvey(skipped).errors.some((e) => e.includes("4/5")), "a skip moves on but does not count");
  const home = complete();
  const src = SOURCES.find((s) => s.id === home.queue[first].source);
  home.queue[first].url = src.origin + "/";
  assert.ok(validateSurvey(home).errors.some((e) => e.includes("project page")));
  const thin = complete();
  thin.synthesis.patternSources = thin.synthesis.patternSources.slice(0, 2);
  assert.ok(validateSurvey(thin).errors.some((e) => e.includes("patternSources")));
});

test("probe skips unreachable and redirected sources and stops once enough are reachable", async () => {
  const queue = surveyQueue("general");
  const calls = [];
  const fetcher = async (url) => {
    calls.push(url);
    if (calls.length === 1) throw Object.assign(new Error("down"), { name: "TimeoutError" });
    if (calls.length === 2) return { status: 301, headers: new Headers({ location: "https://elsewhere.example/robots.txt" }), body: null };
    return { status: 200, headers: new Headers(), body: null };
  };
  await probeQueue(queue, fetcher, () => new Date("2026-10-27T00:00:00Z"));
  const pending = queue.filter((e) => e.status === "pending");
  assert.match(queue[0].reason, /Unreachable/);
  assert.match(queue[1].reason, /redirected to elsewhere\.example/);
  assert.equal(queue.filter((e) => e.probed).length, SURVEY_TARGET + 2);
  assert.equal(calls.length, SURVEY_TARGET + 4);
  assert.ok(pending.length > SURVEY_TARGET + 2, "the rest stay queued for fallback");
});
