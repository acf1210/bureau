# AGENTS.md — working on BUREAU

BUREAU is a design skill, a toolkit, and a review system. Treat the repository as a design artifact: it must pass its own audit.

## Read first

1. `SKILL.md` — doctrine, routing, hard rules.
2. `references/16-review-circuit.md` — the review rubric.
3. `references/17-anti-ai-slop.md` — what not to ship.
4. `docs/` — the public contract.

## Commands

```bash
npm install --no-bin-links
npx playwright install chromium

npm test
npm run audit -- skill/assets/templates
npm run docs:build
npm run docs:serve
node skill/scripts/doctor.mjs
```

## Rules

- **Realism first.** Photography, film and physical material are the default; vector illustration is never the fallback for a missing photograph. SVG stays for logos, icons, diagrams and interface. `skill/references/39-realism-engine.md` is the contract.
- **No P0 or P1** in templates, landing, or docs. P2 is acceptable only with a rationale.
- **Review modes.** Fast (6 gates), Standard (10 gates, default) and Signature (10 gates + jury). Only Signature can reach Award Track. The mode is a product contract; do not add a hidden fourth.
- **One idea per file.** References are independent; do not create circular reads.
- **Evidence over opinion.** Scripts must produce artifacts, not claims.
- **No fabricated proof.** No fake metrics, logos, testimonials, or awards anywhere, including demos. A synthetic image is never evidence of a real product, person, place or event.
- **Truth in docs.** If a command, path, or flag is documented, it must work.
- **Three languages.** PT-BR, EN, ES. Keep structure, links, code and numbers identical; translate prose only.
- **No dependency creep.** `marked` and `playwright` are the only runtime/tooling dependencies. Justify anything else.
- **Accessibility floor.** WCAG 2.2 AA; reduced motion; keyboard; contrast.
- **Performance budgets.** LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1, JS ≤ 250 KB gzip.
- **No secrets.** Never commit tokens, `.env`, or Figma credentials.

## Changing the skill

- New domain → `skill/references/NN-name.md` + a row in `SKILL.md` §9.
- New mechanical rule → `skill/scripts/lib/rules.mjs` with a `BS-*` ID and a test.
- New gate → `skill/scripts/lib/gates.mjs`; rebalance weights to 100; update docs and diagram.
- New host → `installers/install.sh`, `install.ps1`, `doctor.mjs`, `22-installers.md`, `docs/*/install.md`.
- Breaking state schema → bump `STATE_VERSION` and document migration.

## Version every update

Every change that reaches `main` ships as a version. No exceptions for small fixes.

```bash
node scripts/release.mjs <x.y.z>   # bumps every version reference, dates the CHANGELOG
npm run og                          # the social card prints the version
```

Semver: changed circuit, script or file contract → major; new capability → minor; fix or docs → patch. After the merge, tag `vX.Y.Z` on the merge commit and publish a GitHub release with the CHANGELOG section as notes. `tests/version.test.mjs` fails if a version reference drifts.

## Review before a PR

```bash
npm test
node skill/scripts/audit.mjs skill/assets/templates showcase site/index.html --fail-on p1
node skill/scripts/realism.mjs skill/assets/templates showcase site/index.html --fail-on p1
node skill/scripts/visual-audit.mjs http://localhost:4173 --out .bureau/qa --fail-on p0
npm run docs:build
```

If you cannot run the visual audit, say so in the PR.

## Style

- Direct, specific, no hype adjectives.
- Use real examples and numbers with sources.
- Prefer short sentences and concrete nouns.
- No emoji as UI or documentation icons.
- Markdown: one H1, sentence-case headings, tables for comparisons.

## License

Contributions are MIT. By contributing you confirm you have the right to license the work.
