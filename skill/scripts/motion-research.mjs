#!/usr/bin/env node
/* @bureau-internal — awarded motion research workflow */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { draftMotionResearch, validateMotionResearch, TARGET } from "./lib/motion-research.mjs";

function targetFromConfig() {
  try {
    const config = JSON.parse(fs.readFileSync(path.join(".bureau", "config.json"), "utf8"));
    return config?.review?.mode === "signature" ? 5 : 3;
  } catch { return TARGET; }
}

function main(args) {
  const command = args[0];
  if (!["--init", "--check", "--plan"].includes(command) || args.length > 2) { console.error("Usage: node scripts/motion-research.mjs --init|--check|--plan [file]"); process.exitCode = 2; return; }
  const file = path.resolve(args[1] || ".bureau/research/motion.json");
  const target = targetFromConfig();
  if (command === "--init") {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    try { fs.writeFileSync(file, JSON.stringify(draftMotionResearch(target), null, 2) + "\n", { flag: "wx" }); }
    catch (error) { if (error.code === "EEXIST") { console.error(`Record exists: ${file}`); process.exitCode = 2; return; } throw error; }
    console.log(`Draft written: ${file}. No references have been verified; ${target} required.`); return;
  }
  let data;
  try { data = JSON.parse(fs.readFileSync(file, "utf8")); } catch { console.error(`Cannot read valid JSON: ${file}`); process.exitCode = 2; return; }
  const result = validateMotionResearch(data, (p) => { try { return fs.statSync(path.resolve(p)).isFile(); } catch { return false; } }, { target });
  if (result.errors.length) { console.error(`Motion research incomplete:\n- ${result.errors.join("\n- ")}`); process.exitCode = 1; }
  else if (command === "--plan") {
    const out = path.join(path.dirname(file), "motion-plan.md");
    const clean = (s) => String(s).replace(/[\r\n]+/g, " ").trim();
    const lines = ["# Motion production plan", "", "> Draft derived from recorded research. Verify sources and complete the implementation decisions before production.", "", "## Reference principles", ""];
    for (const ref of data.references) lines.push(`- ${clean(ref.project)} — ${clean(ref.principle)} (source: ${clean(ref.awardUrl)})`);
    lines.push("", "## Synthesis", "", `- Shared pattern: ${clean(data.synthesis.sharedPattern)}`, `- Departure: ${clean(data.synthesis.departure)}`, `- Brief connection: ${clean(data.synthesis.briefConnection)}`, `- Fallback: ${clean(data.synthesis.fallback)}`, "", "## Production decisions", "", "- Output, duration, dimensions and frame rate: TODO", "- Triggers, states, timing and interruption: TODO", "- Tools, versions, licenses and asset rights: TODO", "- Sound, consent, captions and transcript: TODO", "- Performance budget and device targets: TODO", "- Render, inspect, fix and re-render evidence: TODO", "");
    try { fs.writeFileSync(out, lines.join("\n"), { flag: "wx" }); }
    catch (error) { if (error.code === "EEXIST") { console.error(`Plan exists: ${out}`); process.exitCode = 2; return; } throw error; }
    console.log(`Draft motion plan written: ${out}. Complete TODOs and verify evidence.`);
  } else console.log(`Motion research complete: ${result.count} documented projects. Verify their award and observations independently.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main(process.argv.slice(2));
