/* @bureau-internal — test fixture; excluded from design audits */
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const installer = path.join(root, "installers", "install.sh");

test("installer dry-run prints all four hosts and changes nothing", () => {
  const r = spawnSync("bash", [installer, "--agent", "all", "--scope", "user", "--dry-run"], { cwd: root, encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
  for (const host of ["claude", "codex", "antigravity", "hermes"]) assert.match(r.stdout, new RegExp(host));
  assert.match(r.stdout, /dry-run/);
});

test("installer rejects an invalid agent", () => {
  const r = spawnSync("bash", [installer, "--agent", "nope"], { cwd: root, encoding: "utf8" });
  assert.notEqual(r.status, 0);
});
