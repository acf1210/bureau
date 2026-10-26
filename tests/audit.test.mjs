/* @bureau-internal — test fixture; excluded from design audits */
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const audit = path.join(root, "skill", "scripts", "audit.mjs");

function run(args, cwd = root) {
  return spawnSync(process.execPath, [audit, ...args], { cwd, encoding: "utf8" });
}

test("templates have no P0 or P1 findings", () => {
  const r = run(["skill/assets/templates", "--json"]);
  assert.equal(r.status, 0, r.stderr);
  const report = JSON.parse(r.stdout);
  assert.equal(report.summary.bySeverity.p0, 0, JSON.stringify(report.findings.filter((f) => f.severity === "p0")));
  assert.equal(report.summary.bySeverity.p1, 0, JSON.stringify(report.findings.filter((f) => f.severity === "p1")));
  assert.ok(report.filesScanned >= 3);
});

test("detects a deliberately sloppy page", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "bureau-slop-"));
  fs.writeFileSync(path.join(dir, "index.html"), `<!doctype html><html><body>
    <h1>Empower your business</h1>
    <p>Lorem ipsum dolor sit amet.</p>
    <div style="background:linear-gradient(90deg,#7c3aed,#ec4899);background-clip:text">Seamless AI</div>
    <img src="hero.jpg">
    <video autoplay src="x.mp4"></video>
    <div onclick="go()">Click</div>
  </body></html>`);
  const r = run([dir, "--json"]);
  assert.equal(r.status, 0, r.stderr);
  const report = JSON.parse(r.stdout);
  assert.ok(report.summary.bySeverity.p0 > 0);
  const ids = new Set(report.findings.map((f) => f.id));
  for (const id of ["BS-K01", "BS-K02", "BS-W01", "BS-W02", "BS-A01", "BS-E06"]) {
    assert.ok(ids.has(id), `expected ${id}`);
  }
  fs.rmSync(dir, { recursive: true, force: true });
});

test("supports bureau-ignore on the same line", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "bureau-ignore-"));
  fs.writeFileSync(path.join(dir, "index.html"), `<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>
    <!-- bureau-ignore BS-K01: brand-mandated gradient -->
    <div style="background:linear-gradient(90deg,#7c3aed,#ec4899)">ok</div>
  </body></html>`);
  const r = run([dir, "--json"]);
  const report = JSON.parse(r.stdout);
  assert.equal(report.findings.some((f) => f.id === "BS-K01"), false);
  fs.rmSync(dir, { recursive: true, force: true });
});
