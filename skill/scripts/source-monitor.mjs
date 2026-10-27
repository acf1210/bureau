#!/usr/bin/env node
/* @bureau-internal — bounded source availability monitor */
import fs from "node:fs/promises";
import { pathToFileURL } from "node:url";

import { SOURCES } from "./lib/sources.mjs";

// Monitoring robots.txt only avoids collecting site content or bypassing access restrictions.
export const sources = SOURCES.filter((s) => s.origin).map((s) => [s.id, new URL(s.origin).origin]);
export const unidentified = SOURCES.filter((s) => !s.origin).map((s) => s.name);

export async function monitor(fetcher = fetch, clock = () => new Date(), list = sources) {
  const results = [];
  // Sequential requests bound load on remote services; redirects are reported, never followed.
  for (const [id, origin] of list) {
    const checkedAt = clock().toISOString();
    try {
      const response = await fetcher(`${origin}/robots.txt`, {
        method: "GET", redirect: "manual", signal: AbortSignal.timeout(8000),
        headers: { "user-agent": "BUREAU-source-monitor/1.0" }
      });
      results.push({ id, origin, checkedAt, status: response.status, location: response.headers.get("location") });
      await response.body?.cancel();
    } catch (error) {
      results.push({ id, origin, checkedAt, status: null, error: error.name || "Error" });
    }
  }
  return { generatedAt: clock().toISOString(), scope: "robots.txt availability only", results, unidentified };
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length !== 2 || args[0] !== "--out" || !args[1]) {
    console.error("Usage: node source-monitor.mjs --out <report.json>");
    process.exitCode = 2;
    return;
  }
  const report = await monitor();
  await fs.writeFile(args[1], JSON.stringify(report, null, 2) + "\n", { flag: "wx" });
  console.log(`Wrote ${args[1]}: ${report.results.length} sources; ${report.unidentified.length} unidentified.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => { console.error(error.message); process.exitCode = 1; });
}
