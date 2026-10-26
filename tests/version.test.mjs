/* @bureau-internal — test fixture; excluded from design audits */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const version = fs.readFileSync(path.join(root, "VERSION"), "utf8").trim();

// Same list as scripts/release.mjs, read from its source so the two never drift.
const source = fs.readFileSync(path.join(root, "scripts", "release.mjs"), "utf8");
const sites = [...source.matchAll(/\["([^"]+)", (\/.*\/[a-z]*)\]/g)].map(([, file, re]) => {
  const body = re.slice(1, re.lastIndexOf("/"));
  const flags = re.slice(re.lastIndexOf("/") + 1);
  return [file, new RegExp(body, flags)];
});

test("every version reference matches VERSION", () => {
  assert.ok(sites.length >= 15, "release.mjs should list every version site");
  for (const [file, re] of sites) {
    const m = fs.readFileSync(path.join(root, file), "utf8").match(re);
    assert.ok(m, `${file}: version pattern not found`);
    assert.equal(m[1], version, `${file} says ${m[1]}, VERSION says ${version}`);
  }
});

test("the changelog has a dated section for the current version", () => {
  const log = fs.readFileSync(path.join(root, "CHANGELOG.md"), "utf8");
  assert.match(log, new RegExp(`^## \\[${version.replace(/\./g, "\\.")}\\] — \\d{4}-\\d{2}-\\d{2}$`, "m"));
  assert.match(log, new RegExp(`^\\[${version.replace(/\./g, "\\.")}\\]: https://github\\.com/acf1210/bureau/`, "m"));
});
