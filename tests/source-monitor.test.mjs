/* @bureau-internal — test fixture; excluded from design audits */
import test from "node:test";
import assert from "node:assert/strict";
import { monitor, sources, unidentified } from "../skill/scripts/source-monitor.mjs";

test("monitor records each response and failure without following redirects", async () => {
  const seen = [];
  const fetcher = async (url, options) => {
    seen.push({ url, options });
    if (seen.length === 2) throw Object.assign(new Error("network"), { name: "NetworkError" });
    return { status: 301, headers: new Headers({ location: "https://example.org/robots.txt" }), body: null };
  };
  const report = await monitor(fetcher, () => new Date("2026-10-26T00:00:00Z"));
  assert.equal(report.results.length, sources.length);
  assert.equal(report.results[0].status, 301);
  assert.equal(report.results[1].error, "NetworkError");
  assert.equal(report.unidentified.length, unidentified.length);
  assert.ok(seen.every(({ url, options }) => url.endsWith("/robots.txt") && options.redirect === "manual"));
});
