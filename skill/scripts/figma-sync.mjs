#!/usr/bin/env node
/* @bureau-internal — excluded from design audits */
/**
 * BUREAU Figma token sync.
 * Accepts Tokens Studio JSON, W3C DTCG, or a Figma Variables export.
 * Usage:
 *   node scripts/figma-sync.mjs --in design/figma-variables.json --out design/tokens.json
 */

import fs from "node:fs";
import path from "node:path";
import { flattenTokens, resolveAliases, toDtcg } from "./lib/tokens.mjs";
import { rgbToHex } from "./lib/color.mjs";

function parseArgs(argv) {
  const opts = { in: "design/figma-variables.json", out: "design/tokens.json", mode: null, check: false, json: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--in") opts.in = argv[++i];
    else if (a === "--out") opts.out = argv[++i];
    else if (a === "--mode") opts.mode = argv[++i];
    else if (a === "--check") opts.check = true;
    else if (a === "--json") opts.json = true;
    else if (a === "--help" || a === "-h") {
      console.log(`BUREAU Figma sync

Usage: node scripts/figma-sync.mjs [options]

  --in <file>      Tokens Studio / DTCG / Figma Variables JSON
  --out <file>     normalized DTCG output
  --mode <name>    theme mode (light/dark/...)
  --check          fail on unresolved aliases or empty output
  --json           print summary JSON
`);
      process.exit(0);
    } else {
      console.error(`Unknown option: ${a}`);
      process.exit(2);
    }
  }
  return opts;
}

function colorToHex(value) {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return null;
  if (typeof value.hex === "string") return value.hex;
  if ("r" in value && "g" in value && "b" in value) {
    const scale = value.r > 1 || value.g > 1 || value.b > 1 ? 255 : 1;
    return rgbToHex({ r: value.r / scale, g: value.g / scale, b: value.b / scale });
  }
  return null;
}

function inferType(variable, name) {
  const t = String(variable.resolvedType || variable.type || "").toUpperCase();
  if (t === "COLOR") return "color";
  if (t === "FLOAT" || t === "NUMBER") {
    if (/radius/i.test(name)) return "dimension";
    if (/space|gap|margin|padding|size/i.test(name)) return "dimension";
    if (/duration|delay/i.test(name)) return "duration";
    return "number";
  }
  if (t === "STRING") {
    if (/font/i.test(name)) return "fontFamily";
    return "string";
  }
  if (t === "BOOLEAN") return "boolean";
  return null;
}

function normalizeVariableValue(variable, mode) {
  const byMode = variable.valuesByMode;
  if (byMode && typeof byMode === "object") {
    if (mode && mode in byMode) return byMode[mode];
    const keys = Object.keys(byMode);
    return keys.length ? byMode[keys[0]] : null;
  }
  return variable.value ?? variable.$value ?? null;
}

function figmaVariablesToObject(input, mode) {
  const vars = Array.isArray(input) ? input : Array.isArray(input.variables) ? input.variables : null;
  if (!vars) return null;
  const root = {};
  for (const variable of vars) {
    const name = String(variable.name || variable.key || "").trim();
    if (!name) continue;
    const parts = name.split("/").map((p) => p.trim()).filter(Boolean);
    if (!parts.length) continue;
    let value = normalizeVariableValue(variable, mode);
    const type = inferType(variable, name);
    if (type === "color") {
      const hex = colorToHex(value);
      if (!hex) continue;
      value = hex;
    }
    if (type === "dimension" && typeof value === "number") {
      // keep number; formatter adds px
    }
    let node = root;
    for (const part of parts.slice(0, -1)) {
      node[part] ??= {};
      node = node[part];
    }
    const last = parts[parts.length - 1];
    node[last] = { $type: type || "string", $value: value };
  }
  return root;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const inputPath = path.resolve(opts.in);
  if (!fs.existsSync(inputPath)) {
    console.error(`Input not found: ${inputPath}

Export Figma variables as JSON (Tokens Studio or Figma Variables), or pass --in.`);
    process.exit(2);
  }
  let input;
  try { input = JSON.parse(fs.readFileSync(inputPath, "utf8")); }
  catch (err) { console.error(`Invalid JSON: ${err.message}`); process.exit(2); }

  const fromVariables = figmaVariablesToObject(input, opts.mode);
  const source = fromVariables || input;
  const flat = flattenTokens(source, { mode: opts.mode });
  const tokens = resolveAliases(flat);
  if (!tokens.size) {
    console.error("No tokens found after normalization.");
    process.exit(2);
  }
  const unresolved = [...tokens.values()].filter((t) => typeof t.value === "string" && /^\{[^}]+\}$/.test(t.value) && t.resolved === t.value);
  const out = toDtcg(tokens);
  fs.mkdirSync(path.dirname(path.resolve(opts.out)), { recursive: true });
  fs.writeFileSync(path.resolve(opts.out), JSON.stringify(out, null, 2));

  const summary = { input: inputPath, output: path.resolve(opts.out), tokens: tokens.size, unresolved: unresolved.map((t) => t.key), source: fromVariables ? "figma-variables" : "tokens-studio-or-dtcg" };
  if (opts.json) console.log(JSON.stringify(summary, null, 2));
  else {
    console.log(`BUREAU Figma sync — ${tokens.size} tokens (${summary.source})`);
    console.log(`Output: ${path.relative(process.cwd(), summary.output)}`);
    if (unresolved.length) console.log(`Unresolved aliases: ${unresolved.map((t) => t.key).join(", ")}`);
  }
  if (opts.check && unresolved.length) process.exit(1);
}

main();
