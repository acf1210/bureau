# Contributing

BUREAU is opinionated by design. Contributions are welcome when they make the bureau more precise, more honest, or more useful — not merely larger.

## Before you start

- Read `SKILL.md`, `references/16-review-circuit.md`, and `references/17-anti-ai-slop.md`.
- Run `node skill/scripts/doctor.mjs`.
- Open an issue for a new gate, a new host, or a schema change before writing code.

## Setup

```bash
git clone https://github.com/acf1210/bureau.git
cd bureau
npm install --no-bin-links
npx playwright install chromium
npm test
```

## What to contribute

| Kind | Where | Notes |
|---|---|---|
| A design reference | `skill/references/` | one domain per file; add the route in `SKILL.md` |
| A detector rule | `skill/scripts/lib/rules.mjs` | stable `BS-*` ID, severity, why, fix, test |
| A review gate | `skill/scripts/lib/gates.mjs` | weights must sum to 100; update diagram + docs |
| A host installer | `installers/` | update `install.sh`, `install.ps1`, `doctor.mjs`, docs |
| A template | `skill/assets/templates/` | self-contained; must pass `audit --fail-on p1` and visual audit |
| A docs fix | `docs/pt-BR`, `en`, `es` | keep all three in sync |
| A translation | `docs/es`, `README.es.md` | preserve code, links, numbers, IDs |

## Quality gate

```bash
npm test
node skill/scripts/audit.mjs skill/assets/templates site/index.html --fail-on p1
npm run docs:build
```

For UI changes, also:

```bash
node scripts/serve.mjs dist 4173 &
node skill/scripts/visual-audit.mjs http://localhost:4173 --out .bureau/qa --fail-on p0
```

Open the screenshots. A green JSON is not a review.

## Rules

- No fabricated metrics, logos, testimonials, or awards.
- No P0/P1 anti-slop findings in shipped examples.
- No dependency without a written reason. Current dependencies: `marked` (docs build) and `playwright` (QA).
- No telemetry. Scripts read local files and the URL the user provides.
- Keep the three locales structurally identical. Translate prose, never code or paths.
- Do not copy skill text or assets from another project. Reference principles, not files.
- Keep the installer safe: refuse unmarked deletions.

## Commit style

```
feat(skill): add video-first narrative reference
fix(audit): suppress false positive on gradient metadata
docs(es): translate review circuit
test(review): cover stale gates
```

Use the imperative. One concern per commit.

## PR checklist

- [ ] `npm test` passes.
- [ ] Static audit has no P0/P1 on examples.
- [ ] Visual audit run for UI changes; screenshots attached.
- [ ] Docs updated in PT-BR, EN, ES.
- [ ] `CHANGELOG.md` updated for user-facing changes.
- [ ] No secrets, tokens, or personal data.
- [ ] New code is MIT-compatible.

## License

By contributing, you agree that your contribution is licensed under the MIT License.
