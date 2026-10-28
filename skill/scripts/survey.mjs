#!/usr/bin/env node
/* @bureau-internal — five-source reference survey */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { SOURCES, NEEDS, SURVEY_TARGET, surveyQueue, validateSurvey } from "./lib/sources.mjs";
import { monitor } from "./source-monitor.mjs";

const usage = `Usage:
  node scripts/survey.mjs --init [--need <${NEEDS.join("|")}>] [--probe] [--file <survey.json>]
  node scripts/survey.mjs --check [--file <survey.json>] [--min <3|5>] [--json]

--init writes the queue for the brief's need; --probe checks robots.txt reachability in queue
order and skips unreachable or redirected sources until ${SURVEY_TARGET + 2} reachable ones are queued.
--check exits 1 until the target number of sources are verified in queue order with a synthesis.
The target is 3 in Standard/Fast projects and 5 in Signature, read from .bureau/config.json.`;

// Standard and Fast need three verified references; Signature needs five.
function targetFromConfig() {
  try {
    const config = JSON.parse(fs.readFileSync(path.join(".bureau", "config.json"), "utf8"));
    return config?.review?.mode === "signature" ? 5 : 3;
  } catch { return SURVEY_TARGET; }
}

const byId = new Map(SOURCES.map((s) => [s.id, s]));

// Probing stops once enough reachable sources are queued; the rest stay pending, unprobed.
export async function probeQueue(queue, fetcher = fetch, clock = () => new Date()) {
  let reachable = 0;
  for (const entry of queue) {
    if (entry.status !== "pending") continue;
    if (reachable >= SURVEY_TARGET + 2) break;
    const origin = new URL(byId.get(entry.source).origin).origin;
    const [result] = (await monitor(fetcher, clock, [[entry.source, origin]])).results;
    const moved = result.location && new URL(result.location, origin).host !== new URL(origin).host;
    if (result.status === null || result.status >= 500) {
      Object.assign(entry, { status: "skipped", reason: `Unreachable on ${result.checkedAt.slice(0, 10)} (${result.error || `HTTP ${result.status}`}); next source taken.` });
    } else if (moved) {
      Object.assign(entry, { status: "skipped", reason: `robots.txt redirected to ${new URL(result.location, origin).host} on ${result.checkedAt.slice(0, 10)}; identity unverified.` });
    } else {
      entry.probed = { status: result.status, at: result.checkedAt };
      reachable += 1;
    }
  }
  return queue;
}

export function draft(need, queue, target = SURVEY_TARGET) {
  return {
    need,
    target,
    instructions: `Work the queue in order. For each source open a project page: verified needs url, accessedAt, lens, observation, principle, avoid. If it cannot be verified, set skipped with the reason and move to the next. Verify ${target}.`,
    queue: queue.map((entry) => entry.status === "pending" ? { ...entry, url: "", accessedAt: "", lens: "", observation: "", principle: "", avoid: "" } : entry),
    synthesis: { pattern: "", patternSources: [], creative: "", avoid: "" }
  };
}

async function main() {
  const args = process.argv.slice(2);
  const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
  const file = path.resolve(opt("--file") || path.join(".bureau", "research", "survey.json"));
  if (args.includes("--init")) {
    const need = opt("--need") || "general";
    if (!NEEDS.includes(need)) { console.error(usage); process.exitCode = 2; return; }
    const target = targetFromConfig();
    let queue = surveyQueue(need);
    if (args.includes("--probe")) queue = await probeQueue(queue);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    try { fs.writeFileSync(file, JSON.stringify(draft(need, queue, target), null, 2) + "\n", { flag: "wx" }); }
    catch (error) { if (error.code === "EEXIST") { console.error(`${file} exists; finish or move it before initializing.`); process.exitCode = 2; return; } throw error; }
    const skipped = queue.filter((e) => e.status === "skipped").length;
    console.log(`Survey queue written: ${path.relative(process.cwd(), file)} · need ${need} · ${queue.length} sources · ${skipped} skipped. Verify ${target} in order.`);
    return;
  }
  if (args.includes("--check")) {
    let survey;
    try { survey = JSON.parse(fs.readFileSync(file, "utf8")); } catch { survey = null; }
    const min = Number(opt("--min"));
    const target = min === 3 || min === 5 ? min : targetFromConfig();
    const result = validateSurvey(survey, { target });
    if (args.includes("--json")) console.log(JSON.stringify(result, null, 2));
    else if (result.errors.length) console.error(`Survey incomplete (${result.verified}/${target}):\n- ${result.errors.join("\n- ")}`);
    else console.log(`Survey complete: ${result.verified} verified sources · lenses ${result.lenses.join(", ")}.`);
    process.exitCode = result.errors.length ? 1 : 0;
    return;
  }
  console.error(usage);
  process.exitCode = 2;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => { console.error(error.message); process.exitCode = 1; });
}
