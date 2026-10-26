/* @bureau-internal — test fixture; excluded from design audits */
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const tokens = path.join(root, "skill", "scripts", "tokens.mjs");

test("generates CSS, Tailwind and contrast from reference tokens", () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), "bureau-tokens-"));
  const r = spawnSync(process.execPath, [tokens, "--in", "skill/assets/tokens/tokens.json", "--out-dir", out, "--check"], { cwd: root, encoding: "utf8" });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.ok(fs.existsSync(path.join(out, "tokens.css")));
  assert.ok(fs.existsSync(path.join(out, "tokens.tailwind.css")));
  assert.ok(fs.existsSync(path.join(out, "contrast.md")));
  const css = fs.readFileSync(path.join(out, "tokens.css"), "utf8");
  assert.match(css, /--color-ground/);
  assert.match(css, /oklch\(/);
  const contrast = fs.readFileSync(path.join(out, "contrast.md"), "utf8");
  assert.doesNotMatch(contrast, /\| FAIL \|/);
  fs.rmSync(out, { recursive: true, force: true });
});

test("fails the check when a color pair is unreadable", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "bureau-contrast-"));
  const input = path.join(dir, "tokens.json");
  fs.writeFileSync(input, JSON.stringify({
    color: {
      ground: { $type: "color", $value: "#FFFFFF" },
      ink: { $type: "color", $value: "#F2F2F2" }
    }
  }));
  const out = path.join(dir, "out");
  const r = spawnSync(process.execPath, [tokens, "--in", input, "--out-dir", out, "--check"], { cwd: root, encoding: "utf8" });
  assert.equal(r.status, 1);
  assert.match(r.stdout, /FAIL/);
  fs.rmSync(dir, { recursive: true, force: true });
});
