#!/usr/bin/env node
/* @bureau-internal — excluded from design audits */
/**
 * Bump the version everywhere it is written, and date the CHANGELOG.
 * Usage: node scripts/release.mjs <x.y.z> [--date YYYY-MM-DD] [--dry-run]
 *
 * Then: npm run og (the social card prints the version), commit, PR, merge,
 * tag vX.Y.Z on the merge commit and publish the GitHub release.
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const next = args.find((a) => /^\d+\.\d+\.\d+$/.test(a));
const date = args[args.indexOf("--date") + 1]?.match(/^\d{4}-\d{2}-\d{2}$/)?.[0] || new Date().toISOString().slice(0, 10);
const dry = args.includes("--dry-run");
if (!next) {
  console.error("Usage: node scripts/release.mjs <x.y.z> [--date YYYY-MM-DD] [--dry-run]");
  process.exit(2);
}
const prev = fs.readFileSync(path.join(root, "VERSION"), "utf8").trim();
const cmp = (a, b) => a.split(".").map(Number).reduce((r, n, i) => r || n - b.split(".").map(Number)[i], 0);
if (cmp(next, prev) <= 0) {
  console.error(`New version ${next} must be greater than ${prev}.`);
  process.exit(2);
}

// Every place that carries the version, as [file, pattern] where the pattern's first group is the version.
export const VERSION_SITES = [
  ["VERSION", /^(\d+\.\d+\.\d+)$/m],
  ["package.json", /^\s*"version": "(\d+\.\d+\.\d+)"/m],
  ["package-lock.json", /^\s*"version": "(\d+\.\d+\.\d+)"/m],
  ["package-lock.json", /"packages": \{\s*"": \{\s*"name": "bureau",\s*"version": "(\d+\.\d+\.\d+)"/],
  ["skill/manifest.json", /"version": "(\d+\.\d+\.\d+)"/],
  ["skill/SKILL.md", /^\s*version: "(\d+\.\d+\.\d+)"/m],
  ["README.md", /badge\/version-(\d+\.\d+\.\d+)-/],
  ["README.en.md", /badge\/version-(\d+\.\d+\.\d+)-/],
  ["README.es.md", /badge\/version-(\d+\.\d+\.\d+)-/],
  ["site/og.html", /<span>v(\d+\.\d+\.\d+), MIT licence/],
  ["docs/assets/diagrams/architecture.svg", />v(\d+\.\d+\.\d+) \/ MIT</],
  ["site/assets/diagrams/architecture.svg", />v(\d+\.\d+\.\d+) \/ MIT</],
  ["skill/assets/diagrams/architecture.svg", />v(\d+\.\d+\.\d+) \/ MIT</],
  ["installers/install.sh", /\|\| echo "(\d+\.\d+\.\d+)"/],
  ["installers/install.ps1", /else \{ "(\d+\.\d+\.\d+)" \}/],
  ["skill/scripts/doctor.mjs", /catch \{ return "(\d+\.\d+\.\d+)"; \}/],
  ["skill/scripts/audit.mjs", /return "(\d+\.\d+\.\d+)";/]
];

const writes = new Map();
const read = (f) => writes.get(f) ?? fs.readFileSync(path.join(root, f), "utf8");
for (const [file, re] of VERSION_SITES) {
  const text = read(file);
  const m = text.match(re);
  if (!m) { console.error(`${file}: version pattern not found`); process.exit(1); }
  const at = m.index + m[0].indexOf(m[1]);
  writes.set(file, text.slice(0, at) + next + text.slice(at + m[1].length));
}

let log = read("CHANGELOG.md");
if (!/^## \[Unreleased\]\n\n###/m.test(log)) {
  console.error("CHANGELOG.md: the [Unreleased] section is empty; record the changes first.");
  process.exit(1);
}
log = log.replace(/^## \[Unreleased\]\n/m, `## [Unreleased]\n\n## [${next}] — ${date}\n`);
log = log.replace(/^(\[\d+\.\d+\.\d+\]: )/m, `[Unreleased]: https://github.com/acf1210/bureau/compare/v${next}...HEAD\n[${next}]: https://github.com/acf1210/bureau/compare/v${prev}...v${next}\n$1`);
log = log.replace(/^\[Unreleased\]: .*\n(?=\[Unreleased\]: )/m, "");
writes.set("CHANGELOG.md", log);

for (const [file, text] of writes) {
  if (dry) console.log(`would update ${file}`);
  else fs.writeFileSync(path.join(root, file), text);
}
console.log(`${dry ? "Dry run: " : ""}${prev} → ${next} (${date}). Next: npm run og, commit, PR, merge, tag v${next}, release.`);
