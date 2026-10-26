#!/usr/bin/env node
/* @bureau-internal — excluded from design audits */
/**
 * BUREAU divergence — measures how much two pages share a design fingerprint.
 * Use it to prove a build is not a copy of its scaffold, a reference, or a sibling.
 *
 * Usage:
 *   node scripts/divergence.mjs index.html --templates
 *   node scripts/divergence.mjs a.html b.html c.html --max 0.3
 *   node scripts/divergence.mjs index.html --templates --json --out .bureau/evidence/divergence.json
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { compare } from "./lib/fingerprint.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.resolve(__dirname, "..", "assets", "templates");

function parseArgs(argv) {
  const opts = { files: [], templates: false, max: 0.35, json: false, out: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--templates") opts.templates = true;
    else if (a === "--max") opts.max = Number(argv[++i]);
    else if (a === "--json") opts.json = true;
    else if (a === "--out") opts.out = argv[++i];
    else if (a === "--help" || a === "-h") {
      console.log(`BUREAU divergence

Usage: node scripts/divergence.mjs <file.html> [more.html...] [options]

  --templates        compare each file against every bundled template
  --max <0..1>       highest similarity allowed for any pair (default 0.35)
  --json             print JSON
  --out <file>       write the JSON report to a file

Exit codes: 0 every pair under --max · 1 a pair is too similar · 2 usage error
`);
      process.exit(0);
    } else if (a.startsWith("--")) {
      console.error(`Unknown option: ${a}`);
      process.exit(2);
    } else opts.files.push(a);
  }
  if (!Number.isFinite(opts.max) || opts.max <= 0 || opts.max > 1) {
    console.error("--max must be a number in (0, 1].");
    process.exit(2);
  }
  return opts;
}

function resolvePage(p) {
  const abs = path.resolve(p);
  if (fs.existsSync(abs) && fs.statSync(abs).isDirectory()) return path.join(abs, "index.html");
  return abs;
}

function templatePages() {
  return fs.readdirSync(TEMPLATES_DIR)
    .map((name) => path.join(TEMPLATES_DIR, name, "index.html"))
    .filter((f) => fs.existsSync(f));
}

function label(file) {
  const rel = path.relative(process.cwd(), file);
  return rel.startsWith("..") ? file : rel;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const files = opts.files.map(resolvePage);
  for (const f of files) {
    if (!fs.existsSync(f)) {
      console.error(`Not found: ${f}`);
      process.exit(2);
    }
  }
  const pairs = [];
  if (opts.templates) {
    if (!files.length) {
      console.error("Give at least one page to compare against the templates.");
      process.exit(2);
    }
    for (const f of files) for (const t of templatePages()) if (path.resolve(t) !== f) pairs.push([f, t]);
  } else {
    if (files.length < 2) {
      console.error("Give two or more pages, or one page with --templates.");
      process.exit(2);
    }
    for (let i = 0; i < files.length; i++) for (let j = i + 1; j < files.length; j++) pairs.push([files[i], files[j]]);
  }

  const results = pairs.map(([a, b]) => {
    const r = compare(fs.readFileSync(a, "utf8"), fs.readFileSync(b, "utf8"));
    return { a: label(a), b: label(b), ...r, pass: r.similarity <= opts.max };
  });
  const report = {
    tool: "bureau-divergence",
    max: opts.max,
    pass: results.every((r) => r.pass),
    highest: results.reduce((m, r) => Math.max(m, r.similarity), 0),
    pairs: results
  };

  if (opts.out) {
    fs.mkdirSync(path.dirname(path.resolve(opts.out)), { recursive: true });
    fs.writeFileSync(path.resolve(opts.out), JSON.stringify(report, null, 2) + "\n");
  }
  if (opts.json) console.log(JSON.stringify(report, null, 2));
  else {
    console.log(`BUREAU divergence · max ${opts.max}`);
    for (const r of results) {
      const top = Object.entries(r.dimensions).sort((x, y) => y[1].similarity * y[1].weight - x[1].similarity * x[1].weight)[0];
      console.log(`${r.pass ? "ok  " : "FAIL"} ${r.similarity.toFixed(3)}  ${r.a}  ↔  ${r.b}  (most shared: ${top[0]} ${top[1].similarity})`);
    }
    console.log(report.pass ? "Every pair is distinct enough." : "Too similar: change the shared dimensions, not the copy.");
  }
  // exitCode, not exit(): a large JSON report on a pipe must flush before the process ends.
  process.exitCode = report.pass ? 0 : 1;
}

main();
