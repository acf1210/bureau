/* @bureau-internal — test fixture; excluded from design audits */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { realismFindings } from "../skill/scripts/lib/realism.mjs";

function check(html, options = {}) {
  const root = options.root || fs.mkdtempSync(path.join(os.tmpdir(), "bureau-realism-"));
  const scanned = [{ file: path.join(root, "index.html"), content: html, isHtml: true, ext: ".html" }];
  if (options.css) scanned.push({ file: path.join(root, "style.css"), content: options.css, isHtml: false, ext: ".css" });
  return realismFindings(scanned, { root });
}

test("a large inline vector with no media is a vector hero", () => {
  const findings = check("<!doctype html><html><body><h1>Studio</h1><svg width=\"800\" height=\"600\"></svg></body></html>");
  assert.equal(findings.filter((f) => f.id === "BS-R01").length, 1);
});

test("a photograph clears the vector-hero rule", () => {
  const findings = check("<!doctype html><html><body><h1>Studio</h1><img src=\"media/room.avif\" alt=\"\"><svg width=\"800\" height=\"600\"></svg></body></html>");
  assert.equal(findings.filter((f) => f.id === "BS-R01").length, 0);
});

test("a labelled functional diagram is not a hero illustration", () => {
  const findings = check("<!doctype html><html><body><h1>Studio</h1><svg viewBox=\"0 0 800 600\" role=\"img\" aria-label=\"Site plan\"></svg></body></html>");
  assert.equal(findings.filter((f) => f.id === "BS-R01").length, 0);
});

test("an aria-labelledby chart with a title is not a hero illustration", () => {
  const html = "<!doctype html><html><body><h1>Harbour</h1><svg viewBox=\"0 0 400 400\" role=\"img\" aria-labelledby=\"tide-title\"><title id=\"tide-title\">Tide ring</title><circle cx=\"200\" cy=\"200\" r=\"150\"></circle></svg></body></html>";
  assert.equal(check(html).filter((f) => f.id === "BS-R01").length, 0);
});

test("a bundled scaffold is exempt until it becomes a project", () => {
  const findings = check("<!doctype html><html data-scaffold=\"true\"><body><h1>Scaffold</h1><svg width=\"800\" height=\"600\"></svg></body></html>", {
    css: ".hero{background:linear-gradient(#111,#222)}"
  });
  assert.equal(findings.length, 0);
});

test("a hero gradient with no media is decoration pretending to be an image", () => {
  const findings = check("<!doctype html><html><body><h1>Studio</h1></body></html>", {
    css: ".hero{background:linear-gradient(180deg,#111,#222)}"
  });
  assert.equal(findings.filter((f) => f.id === "BS-R02").length, 1);
});

test("a blurred circular ornament is a slop prop", () => {
  const findings = check("<!doctype html><html><body><h1>Studio</h1></body></html>", {
    css: ".orb{border-radius:50%;filter:blur(80px)}"
  });
  assert.equal(findings.filter((f) => f.id === "BS-R03").length, 1);
});

test("autoplaying film without a poster is a black first paint", () => {
  const html = "<!doctype html><html><body><video autoplay muted loop><source src=\"media/film.mp4\" type=\"video/mp4\"></video></body></html>";
  const findings = check(html);
  assert.equal(findings.filter((f) => f.id === "BS-R04").length, 1);
});

test("autoplaying film with a poster passes", () => {
  const html = "<!doctype html><html><body><video autoplay muted loop poster=\"media/film-poster.avif\"><source src=\"media/film.mp4\" type=\"video/mp4\"></video></body></html>";
  const findings = check(html);
  assert.equal(findings.filter((f) => f.id === "BS-R04").length, 0);
});

test("stock media without a licence attribute is a rights gap", () => {
  const html = "<!doctype html><html><body><img src=\"https://images.unsplash.com/photo-1\" alt=\"Room\"></body></html>";
  const findings = check(html);
  assert.equal(findings.filter((f) => f.id === "BS-R05").length, 1);
});

test("stock media with a recorded licence passes", () => {
  const html = "<!doctype html><html><body><img src=\"https://images.unsplash.com/photo-1\" alt=\"Room\" data-license=\"Unsplash, 2026-10-28\"></body></html>";
  const findings = check(html);
  assert.equal(findings.filter((f) => f.id === "BS-R05").length, 0);
});

test("provenance is enforced only when the project asks for it", () => {
  const html = "<!doctype html><html><body><img src=\"media/room.avif\" alt=\"Room\"></body></html>";
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "bureau-realism-prov-"));
  fs.mkdirSync(path.join(root, ".bureau"), { recursive: true });
  fs.writeFileSync(path.join(root, ".bureau", "config.json"), JSON.stringify({ visual_direction: { media_provenance: "required" } }));
  const scanned = [{ file: path.join(root, "index.html"), content: html, isHtml: true, ext: ".html" }];
  assert.equal(realismFindings(scanned, { root }).filter((f) => f.id === "BS-R06").length, 1);
  fs.mkdirSync(path.join(root, ".bureau", "media"), { recursive: true });
  fs.writeFileSync(path.join(root, ".bureau", "media", "provenance.json"), JSON.stringify({ media: [{ src: "media/room.avif", owner: "Studio", licence: "All rights" }] }));
  assert.equal(realismFindings(scanned, { root }).filter((f) => f.id === "BS-R06").length, 0);
});

test("the realism contract is published in all three locales with the same shape", () => {
  const root = path.resolve(import.meta.dirname, "..");
  const files = ["docs/pt-BR/realism.md", "docs/en/realism.md", "docs/es/realism.md"].map((f) => path.join(root, f));
  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    assert.match(text, /^# /, `${file}: one H1`);
    assert.equal((text.match(/^## /gm) || []).length, 9, `${file}: nine sections`);
    assert.match(text, /review\.mjs --mode/, `${file}: names the mode command`);
  }
  const counts = files.map((file) => ((fs.readFileSync(file, "utf8").match(/^\| /gm) || []).length));
  assert.equal(new Set(counts).size, 1, "table row counts match across locales");
});

test("the scaffold installs without the exemption and writes the realism config", () => {
  const root = path.resolve(import.meta.dirname, "..");
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "bureau-scaffold-realism-"));
  const scaffold = path.join(root, "skill", "scripts", "new-project.mjs");
  const project = path.join(dir, "site");
  const r = spawnSync(process.execPath, [scaffold, "site", "--dir", project, "--template", "kinetic-editorial"], { cwd: dir, encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
  const html = fs.readFileSync(path.join(project, "index.html"), "utf8");
  assert.ok(!html.includes("data-scaffold"), "a real project is judged by the realism audit");
  const config = JSON.parse(fs.readFileSync(path.join(project, ".bureau", "config.json"), "utf8"));
  assert.equal(config.visual_direction.realism_mode, "photographic");
  assert.equal(config.visual_direction.photography_first, true);
  assert.equal(config.creative_execution.review_mode, "standard");
  assert.equal(config.creative_execution.media_provenance, "required");
  assert.equal(config.review.mode, "standard");
  const brief = fs.readFileSync(path.join(project, "BUREAU.md"), "utf8");
  assert.match(brief, /Photographic direction/);
  assert.match(brief, /Media hierarchy/);
  fs.rmSync(dir, { recursive: true, force: true });
});
