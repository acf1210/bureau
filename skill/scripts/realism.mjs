#!/usr/bin/env node
/* @bureau-internal — excluded from design audits */
/**
 * BUREAU realism audit: the mechanical subset of Realism First.
 * Usage:
 *   node scripts/realism.mjs [target...] [--json] [--out file] [--fail-on p0|p1|p2|none]
 *
 * Photographic quality is not judged here. Render the page, inspect the
 * screenshots and the video frames (references/41-media-validation.md).
 */

import fs from "node:fs";
import path from "node:path";
import { realismFindings, REALISM_RULE_IDS, STOCK_HOSTS } from "./lib/realism.mjs";

const VERSION = readVersion();
const CODE_EXT = new Set([".html", ".htm", ".css"]);
const IGNORE_DIRS = new Set(["node_modules", ".git", ".bureau", "dist", "build", "coverage", ".cache"]);
const MAX_BYTES = 2 * 1024 * 1024;

function readVersion() {
  try { return fs.readFileSync(path.resolve(import.meta.dirname, "..", "..", "VERSION"), "utf8").trim(); }
  catch { return "0.0.0"; }
}

function parseArgs(argv) {
  const opts = { targets: [], json: false, out: null, failOn: "p1" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--json") opts.json = true;
    else if (a === "--out") opts.out = argv[++i];
    else if (a === "--fail-on") opts.failOn = argv[++i];
    else if (a === "--help" || a === "-h") {
      console.log("BUREAU realism audit\n\nUsage: node scripts/realism.mjs [target...] [--json] [--out file] [--fail-on p0|p1|p2|none]\n");
      process.exit(0);
    } else if (a.startsWith("-")) {
      console.error(`Unknown option: ${a}`);
      process.exit(2);
    } else opts.targets.push(a);
  }
  if (!opts.targets.length) opts.targets.push(".");
  if (!["p0", "p1", "p2", "none"].includes(opts.failOn)) {
    console.error("--fail-on must be p0, p1, p2 or none");
    process.exit(2);
  }
  return opts;
}

function walk(target, root, out = []) {
  let stat;
  try { stat = fs.statSync(target); } catch { return out; }
  if (stat.isFile()) {
    if (CODE_EXT.has(path.extname(target).toLowerCase())) out.push(target);
    return out;
  }
  if (IGNORE_DIRS.has(path.basename(target))) return out;
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    const full = path.join(target, entry.name);
    if (entry.isDirectory()) walk(full, root, out);
    else if (CODE_EXT.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

const opts = parseArgs(process.argv.slice(2));
const root = process.cwd();
const files = [...new Set(opts.targets.flatMap((t) => walk(path.resolve(root, t), root)))].sort();
const scanned = [];
for (const file of files) {
  try {
    const stat = fs.statSync(file);
    if (stat.size > MAX_BYTES) continue;
    scanned.push({ file, content: fs.readFileSync(file, "utf8"), isHtml: /\.html?$/i.test(file), ext: path.extname(file).toLowerCase() });
  } catch { /* unreadable file: skip, never invent a finding */ }
}

const findings = realismFindings(scanned, { root });
const bySeverity = { p0: 0, p1: 0, p2: 0 };
for (const f of findings) bySeverity[f.severity] = (bySeverity[f.severity] || 0) + 1;
const report = {
  meta: { tool: "bureau-realism", version: VERSION, generatedAt: new Date().toISOString(), root },
  filesScanned: scanned.length,
  rules: REALISM_RULE_IDS,
  stockHosts: STOCK_HOSTS,
  findings,
  summary: {
    bySeverity,
    count: findings.length,
    hardFail: opts.failOn === "p0" ? bySeverity.p0 > 0 : opts.failOn === "p1" ? bySeverity.p0 + bySeverity.p1 > 0 : opts.failOn === "p2" ? findings.length > 0 : false
  },
  note: "Mechanical subset only. A clean report does not prove the photography is good; see references/41-media-validation.md."
};

const text = JSON.stringify(report, null, 2);
if (opts.out) fs.writeFileSync(path.resolve(root, opts.out), text + "\n");
if (opts.json) console.log(text);
else {
  console.log(`BUREAU realism ${VERSION} — ${root}`);
  console.log(`${scanned.length} files scanned · ${findings.length} findings · P0 ${bySeverity.p0} · P1 ${bySeverity.p1} · P2 ${bySeverity.p2}`);
  for (const f of findings) console.log(`${f.id} ${f.severity.toUpperCase()} ${f.file}:${f.line} — ${f.title}`);
  console.log("\nMechanical subset only. Photographic quality needs rendered screenshots and frames.");
}
process.exit(report.summary.hardFail ? 1 : 0);
