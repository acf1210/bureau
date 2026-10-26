#!/usr/bin/env node
/* @bureau-internal — bounded source availability monitor */
import fs from "node:fs/promises";
import { pathToFileURL } from "node:url";

// Monitoring robots.txt only avoids collecting site content or bypassing access restrictions.
export const sources = [
  ["awwwards", "https://www.awwwards.com"], ["fwa", "https://thefwa.com"],
  ["css-design-awards", "https://www.cssdesignawards.com"], ["siteinspire", "https://www.siteinspire.com"],
  ["godly", "https://godly.website"], ["behance", "https://www.behance.net"],
  ["dribbble", "https://dribbble.com"], ["mobbin", "https://mobbin.com"],
  ["landbook", "https://land-book.com"], ["minimal-gallery", "https://minimal.gallery"],
  ["lapa-ninja", "https://www.lapa.ninja"], ["one-page-love", "https://onepagelove.com"],
  ["curated-design", "https://curated.design"], ["saasframe", "https://www.saasframe.io"],
  ["saas-landing-page", "https://saaslandingpage.com"], ["dark-mode-design", "https://www.darkmodedesign.com"],
  ["brutalist-websites", "https://brutalistwebsites.com"], ["ui-sources", "https://www.uisources.com"],
  ["refero", "https://refero.design"], ["goodbrief", "https://goodbrief.io"],
  ["webflow-showcase", "https://webflow.com"], ["layers", "https://layers.to"]
];
export const unidentified = ["Pintura / Hover Statues", "UX Archive", "Canvas"];

export async function monitor(fetcher = fetch, clock = () => new Date()) {
  const results = [];
  // Sequential requests bound load on remote services; redirects are reported, never followed.
  for (const [id, origin] of sources) {
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
