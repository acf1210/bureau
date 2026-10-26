#!/usr/bin/env node
/* @bureau-internal — excluded from design audits */
/**
 * BUREAU token generator.
 * Usage:
 *   node scripts/tokens.mjs --in design/tokens.json --out-dir src/styles --check
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  flattenTokens, resolveAliases, buildCss, buildTailwind,
  contrastPairs, contrastMarkdown, toDtcg
} from "./lib/tokens.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const opts = {
    in: "skill/assets/tokens/tokens.json",
    outDir: "skill/assets/tokens/generated",
    mode: null,
    prefix: "",
    check: false,
    json: false
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--in") opts.in = argv[++i];
    else if (a === "--out-dir") opts.outDir = argv[++i];
    else if (a === "--mode") opts.mode = argv[++i];
    else if (a === "--prefix") opts.prefix = argv[++i];
    else if (a === "--check") opts.check = true;
    else if (a === "--json") opts.json = true;
    else if (a === "--help" || a === "-h") {
      console.log(`BUREAU tokens

Usage: node scripts/tokens.mjs [options]

  --in <file>        tokens JSON (default skill/assets/tokens/tokens.json)
  --out-dir <dir>    output directory
  --mode <name>      Tokens Studio set (light/dark/...)
  --prefix <name>    CSS variable prefix
  --check            exit 1 if contrast pairs fail
  --json             print summary JSON
`);
      process.exit(0);
    } else {
      console.error(`Unknown option: ${a}`);
      process.exit(2);
    }
  }
  return opts;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const inputPath = path.resolve(opts.in);
  if (!fs.existsSync(inputPath)) {
    console.error(`Tokens file not found: ${inputPath}`);
    process.exit(2);
  }
  let input;
  try { input = JSON.parse(fs.readFileSync(inputPath, "utf8")); }
  catch (err) { console.error(`Invalid JSON: ${err.message}`); process.exit(2); }

  const flat = flattenTokens(input, { mode: opts.mode });
  const tokens = resolveAliases(flat);
  if (!tokens.size) {
    console.error("No tokens found. Expected W3C DTCG, Tokens Studio, or flat JSON.");
    process.exit(2);
  }

  const outDir = path.resolve(opts.outDir);
  fs.mkdirSync(outDir, { recursive: true });

  const css = buildCss(tokens, { prefix: opts.prefix });
  const tw = buildTailwind(tokens);
  const pairs = contrastPairs(tokens);
  const failing = pairs.filter((p) => !p.pass);
  const unresolved = [...tokens.values()].filter((t) => typeof t.value === "string" && /^\{[^}]+\}$/.test(t.value) && t.resolved === t.value);

  fs.writeFileSync(path.join(outDir, "tokens.css"), css);
  fs.writeFileSync(path.join(outDir, "tokens.tailwind.css"), tw);
  fs.writeFileSync(path.join(outDir, "tokens.normalized.json"), JSON.stringify(toDtcg(tokens), null, 2));
  fs.writeFileSync(path.join(outDir, "contrast.md"), contrastMarkdown(pairs));

  const summary = {
    input: inputPath,
    outDir,
    tokens: tokens.size,
    colors: pairs.length ? new Set(pairs.flatMap((p) => [p.fg, p.bg])).size : 0,
    pairs: pairs.length,
    contrastFailing: failing.length,
    unresolvedAliases: unresolved.map((t) => t.key)
  };

  if (opts.json) console.log(JSON.stringify(summary, null, 2));
  else {
    console.log(`BUREAU tokens — ${tokens.size} tokens`);
    console.log(`CSS: ${path.relative(process.cwd(), path.join(outDir, "tokens.css"))}`);
    console.log(`Tailwind: ${path.relative(process.cwd(), path.join(outDir, "tokens.tailwind.css"))}`);
    console.log(`Contrast pairs: ${pairs.length}${failing.length ? ` · ${failing.length} FAIL` : " · all pass"}`);
    for (const f of failing.slice(0, 12)) console.log(`  ${f.ratio}:1  ${f.fg} on ${f.bg}`);
    if (unresolved.length) console.log(`Unresolved aliases: ${unresolved.map((t) => t.key).join(", ")}`);
  }

  if (opts.check && (failing.length || unresolved.length)) process.exit(1);
}

main();
