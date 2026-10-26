/* @bureau-internal — test fixture; excluded from design audits */
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { compare } from "../skill/scripts/lib/fingerprint.mjs";

const root = path.resolve(import.meta.dirname, "..");
const divergence = path.join(root, "skill", "scripts", "divergence.mjs");
const scaffold = path.join(root, "skill", "scripts", "new-project.mjs");
const templatesDir = path.join(root, "skill", "assets", "templates");
const templates = fs.readdirSync(templatesDir).map((t) => path.join(templatesDir, t, "index.html")).filter((f) => fs.existsSync(f));

test("bundled templates do not share a design fingerprint", () => {
  for (let i = 0; i < templates.length; i++) {
    for (let j = i + 1; j < templates.length; j++) {
      const r = compare(fs.readFileSync(templates[i], "utf8"), fs.readFileSync(templates[j], "utf8"));
      assert.ok(r.similarity <= 0.2, `${path.basename(path.dirname(templates[i]))} ↔ ${path.basename(path.dirname(templates[j]))}: ${r.similarity}`);
      assert.equal(r.dimensions.favicon.similarity, 0, "each template needs its own favicon");
      assert.equal(r.dimensions.easing.similarity, 0, "each template needs its own motion curve");
    }
  }
});

test("every template documents its lineage", () => {
  for (const t of templates) {
    const lineage = path.join(path.dirname(t), "LINEAGE.md");
    assert.ok(fs.existsSync(lineage), `missing ${lineage}`);
    const text = fs.readFileSync(lineage, "utf8");
    for (const role of ["Dominant", "Counter", "Accent", "Subject-only ingredient"]) assert.match(text, new RegExp(role));
  }
});

test("a reskinned copy is caught", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "bureau-div-"));
  const copy = fs.readFileSync(templates[0], "utf8").replace(/<title>[^<]*<\/title>/, "<title>Other brand</title>").replace(/#[0-9A-F]{6}/, "#123456");
  fs.writeFileSync(path.join(dir, "index.html"), copy);
  const r = spawnSync(process.execPath, [divergence, path.join(dir, "index.html"), "--templates", "--json"], { encoding: "utf8" });
  assert.equal(r.status, 1, r.stderr);
  const report = JSON.parse(r.stdout);
  assert.equal(report.pass, false);
  assert.ok(report.highest > 0.9);
  fs.rmSync(dir, { recursive: true, force: true });
});

test("divergence CLI rejects bad usage", () => {
  const r = spawnSync(process.execPath, [divergence, templates[0]], { encoding: "utf8" });
  assert.equal(r.status, 2);
});

test("scaffold copies the lineage and only the media the template uses", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "bureau-scaffold-"));
  const project = path.join(dir, "site");
  const r = spawnSync(process.execPath, [scaffold, "site", "--dir", project, "--template", "kinetic-editorial"], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
  assert.ok(fs.existsSync(path.join(project, "LINEAGE.md")));
  assert.equal(fs.existsSync(path.join(project, "media")), false);
  assert.match(fs.readFileSync(path.join(project, "DESIGN.md"), "utf8"), /## Lineage/);
  assert.match(r.stdout, /divergence\.mjs/);
  fs.rmSync(dir, { recursive: true, force: true });
});

test("catalog, scaffold, captures and gallery cover every template", () => {
  const catalog = JSON.parse(fs.readFileSync(path.join(templatesDir, "catalog.json"), "utf8")).map((t) => t.id).sort();
  const folders = templates.map((t) => path.basename(path.dirname(t))).sort();
  assert.deepEqual(catalog, folders, "catalog.json must list every template folder");
  const list = spawnSync(process.execPath, [scaffold, "--list"], { encoding: "utf8" }).stdout;
  for (const id of folders) {
    assert.match(list, new RegExp(`^${id}\\b`, "m"), `new-project --list is missing ${id}`);
    for (const kind of ["desktop", "mobile"]) assert.ok(fs.existsSync(path.join(root, "site", "assets", "img", "demos", `${id}-${kind}.webp`)), `missing ${kind} capture for ${id}`);
  }
  const gallery = spawnSync(process.execPath, [path.join(root, "scripts", "gallery.mjs"), "--check"], { encoding: "utf8" });
  assert.equal(gallery.status, 0, gallery.stderr);
});
