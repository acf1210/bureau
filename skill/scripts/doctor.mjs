#!/usr/bin/env node
/* @bureau-internal — excluded from design audits */
/**
 * BUREAU doctor — capability and install report.
 * Usage: node scripts/doctor.mjs [--json]
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(__dirname, "..");

function parseArgs(argv) {
  const opts = { json: false };
  for (const a of argv) {
    if (a === "--json") opts.json = true;
    else if (a === "--help" || a === "-h") {
      console.log("Usage: node scripts/doctor.mjs [--json]");
      process.exit(0);
    }
  }
  return opts;
}

function cmd(bin, args = ["--version"]) {
  try {
    const out = execFileSync(bin, args, { stdio: ["ignore", "pipe", "ignore"], timeout: 5000 }).toString().trim().split("\n")[0];
    return { ok: true, version: out };
  } catch {
    return { ok: false, version: null };
  }
}

function exists(p) {
  try { return fs.existsSync(p); } catch { return false; }
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const checks = [];
  const add = (name, ok, detail, fix = null) => checks.push({ name, ok: !!ok, detail, fix });

  const nodeMajor = Number(process.versions.node.split(".")[0]);
  add("Node.js ≥ 20", nodeMajor >= 20, process.version, "Install Node 20+.");

  add("SKILL.md", exists(path.join(SKILL_ROOT, "SKILL.md")), path.join(SKILL_ROOT, "SKILL.md"));
  const refs = exists(path.join(SKILL_ROOT, "references")) ? fs.readdirSync(path.join(SKILL_ROOT, "references")).filter((f) => f.endsWith(".md")).length : 0;
  add("References", refs >= 20, `${refs} files`);
  const templates = exists(path.join(SKILL_ROOT, "assets", "templates")) ? fs.readdirSync(path.join(SKILL_ROOT, "assets", "templates")).filter((f) => fs.statSync(path.join(SKILL_ROOT, "assets", "templates", f)).isDirectory()).length : 0;
  add("Templates", templates >= 3, `${templates} templates`);

  let playwright = null;
  try {
    const mod = await import("playwright");
    playwright = mod;
    add("Playwright", true, "module available");
  } catch {
    add("Playwright", false, "module not found", "npm install && npx playwright install chromium");
  }
  const sysChromium = cmd("chromium")["ok"] ? cmd("chromium") : cmd("google-chrome");
  if (playwright?.chromium) {
    try {
      const p = playwright.chromium.executablePath();
      const ok = exists(p) || sysChromium.ok;
      add("Chromium", ok, exists(p) ? p : `bundled missing; system fallback: ${sysChromium.version || "available"}`, "npx playwright install chromium");
    } catch (err) {
      add("Chromium", sysChromium.ok, sysChromium.ok ? `system fallback: ${sysChromium.version}` : err.message, "npx playwright install chromium");
    }
  } else {
    add("Chromium", sysChromium.ok, sysChromium.version || "not found", "npx playwright install chromium");
  }

  const ffmpeg = cmd("ffmpeg", ["-version"]);
  add("ffmpeg", ffmpeg.ok, ffmpeg.version || "not found", "Install ffmpeg for video encoding.");
  const magick = cmd("magick")["ok"] ? cmd("magick") : cmd("convert");
  add("ImageMagick", magick.ok, magick.version || "not found", "Install ImageMagick for image conversion.");
  const git = cmd("git");
  add("git", git.ok, git.version || "not found");
  const gh = cmd("gh", ["--version"]);
  add("GitHub CLI", gh.ok, gh.version || "not found");

  const project = process.cwd();
  for (const f of ["BUREAU.md", "DESIGN.md", "MOTION.md", ".bureau/config.json"]) {
    add(`Project ${f}`, exists(path.join(project, f)), exists(path.join(project, f)) ? "present" : "missing", f === "BUREAU.md" ? "Run /bureau init" : null);
  }
  const figmaEnv = process.env.FIGMA_TOKEN || process.env.FIGMA_ACCESS_TOKEN || process.env.FIGMA_PERSONAL_ACCESS_TOKEN;
  add("Figma token/env", !!figmaEnv, figmaEnv ? "present" : "not set (MCP may still be available)");

  const home = os.homedir();
  const installs = [
    ["Claude (user)", path.join(home, ".claude", "skills", "bureau", "SKILL.md")],
    ["Codex (user)", path.join(home, ".codex", "skills", "bureau", "SKILL.md")],
    ["Antigravity (user)", path.join(home, ".gemini", "config", "skills", "bureau", "SKILL.md")],
    ["Hermes (user)", path.join(home, ".hermes", "skills", "creative", "bureau", "SKILL.md")],
    ["Claude (project)", path.join(project, ".claude", "skills", "bureau", "SKILL.md")],
    ["Codex (project)", path.join(project, ".codex", "skills", "bureau", "SKILL.md")],
    ["Antigravity (project)", path.join(project, ".agents", "skills", "bureau", "SKILL.md")]
  ];
  for (const [name, p] of installs) add(name, exists(p), exists(p) ? "installed" : "not installed");

  const ok = checks.filter((c) => c.ok).length;
  if (opts.json) {
    console.log(JSON.stringify({ version: readVersion(), cwd: project, ok, total: checks.length, checks }, null, 2));
    return;
  }
  console.log(`BUREAU doctor — ${ok}/${checks.length} checks pass`);
  console.log("");
  for (const c of checks) {
    console.log(`${c.ok ? "✓" : "✗"} ${c.name.padEnd(24)} ${c.detail}`);
    if (!c.ok && c.fix) console.log(`    → ${c.fix}`);
  }
  console.log("");
  console.log("Next: node scripts/audit.mjs . && node scripts/visual-audit.mjs <url> --out .bureau/qa");
}

function readVersion() {
  try { return fs.readFileSync(path.join(SKILL_ROOT, "..", "VERSION"), "utf8").trim(); }
  catch { return "5.0.1"; }
}

main().catch((err) => { console.error(err); process.exit(1); });
