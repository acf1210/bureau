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

const page = (body, head = "") => `<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>::selection{background:#123}${head}</style></head><body>${body}</body></html>`;

function auditOf(html) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "bureau-rule-"));
  fs.writeFileSync(path.join(dir, "index.html"), html);
  const r = run([dir, "--json"]);
  fs.rmSync(dir, { recursive: true, force: true });
  return JSON.parse(r.stdout);
}
const ids = (report) => new Set(report.findings.map((f) => f.id));

// Each rule ships with a failing and a passing fixture, so a regression shows up as a red test.
const polarity = [
  ["BS-E10", page('<a href="#nowhere">Go</a>'), page('<a href="#here">Go</a><section id="here"></section>')],
  ["BS-A13", page('<button aria-controls="menu">Menu</button>'), page('<button aria-controls="menu">Menu</button><ul id="menu"></ul>')],
  ["BS-W14",
    page('<form id="f"><input id="e" aria-label="Email"></form><script>f.addEventListener("submit",(e)=>{e.preventDefault();note.textContent="Thanks, you\'re on the list!"})</script>'),
    page('<form id="f"><input id="e" aria-label="Email"></form><script>f.addEventListener("submit",(e)=>{e.preventDefault();note.textContent="Nothing was sent: this form is not connected yet."})</script>')],
  ["BS-E11", page("<p>x</p>").replace("::selection{background:#123}", ""), page("<p>x</p>")],
  ["BS-K11", page("<p>x</p>", ".card{border-left:4px solid #c00}"), page("<p>x</p>", ".note{border-left:1px solid #ccc}")],
  ["BS-K12", page("<p>x</p>", ".card{box-shadow:10px 10px 0 -1px var(--ink)}"), page("<p>x</p>", ".card{box-shadow:0 12px 30px -10px rgba(0,0,0,.3)}")],
  ["BS-W13", page("<p>Lisbon · Porto · Faro</p>"), page("<p>By Ana · 12 May</p>")],
  ["BS-A05", page('<input type="checkbox" value="1">'), page('<label><input type="checkbox" value="1"> Seat 1</label>')],
  ["BS-B11", page('<p class="reveal">x</p>', ".reveal{opacity:0}"), page('<p class="reveal">x</p>', ".js .reveal{opacity:0}")]
];

for (const [id, bad, good] of polarity) {
  test(`${id} fires on the bad fixture and stays quiet on the good one`, () => {
    assert.ok(ids(auditOf(bad)).has(id), `${id} missed the bad fixture`);
    assert.equal(ids(auditOf(good)).has(id), false, `${id} fired on the good fixture`);
  });
}

test("waivers bind by tier", () => {
  const p0 = auditOf(page("<!-- bureau-ignore BS-W02: this is a type specimen for a client -->\n<p>Lorem ipsum dolor</p>"));
  assert.ok(ids(p0).has("BS-W02"), "a P0 is the Floor and cannot be waived");
  assert.ok(ids(p0).has("BS-E12"), "the rejected waiver is reported");
  const short = auditOf(page("<!-- bureau-ignore BS-K11: brand -->\n<p>x</p>", "").replace("</style>", ".c{border-left:3px solid red}</style>").replace("<!-- bureau-ignore BS-K11: brand -->", ""));
  assert.ok(ids(short).has("BS-K11"));
  const html = page("<p>x</p>").replace("::selection{background:#123}", "::selection{background:#123}\n/* bureau-ignore BS-K11: the ledger stripe marks overdue rows in red */\n.c{border-left:3px solid red}");
  const ok = auditOf(html);
  assert.equal(ids(ok).has("BS-K11"), false, "a specific P2 waiver is accepted");
  assert.ok(ok.waivers.some((w) => w.id === "BS-K11" && w.accepted));
  const terse = auditOf(html.replace("the ledger stripe marks overdue rows in red", "brand"));
  assert.ok(ids(terse).has("BS-K11") && ids(terse).has("BS-E12"), "a terse reason is rejected");
});
