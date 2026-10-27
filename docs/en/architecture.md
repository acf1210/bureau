# Architecture

BUREAU is a **progressive-disclosure** system: a short router, 32 depth modules, and scripts that turn opinion into evidence.

![BUREAU architecture](../assets/diagrams/architecture.svg)

## 1. Layers

| Layer | Files | Function |
|---|---|---|
| **Doctrine** | `SKILL.md` | identity, hard rules, autonomy contract |
| **Router** | `SKILL.md` §4 | intent → command → reference |
| **Depth** | `references/00–30` | one domain per file, loaded on demand |
| **Execution** | `scripts/*.mjs` | detector, QA, tokens, Figma, review, scaffold |
| **Material** | `assets/templates`, `tokens`, `snippets`, `media` | real starting points |
| **State** | `BUREAU.md`, `DESIGN.md`, `MOTION.md`, `.bureau/` | project memory and evidence |
| **Delivery** | `scorecard.html`, screenshots, reports | what the client receives |

`SKILL.md` does not carry everything. It carries what decides **what to carry**.

## 2. Decision tree

```
Request
├── new site / redesign ─────────────► init → concept → direction → build → motion → qa → review → ship
├── "is it good?" ───────────────────► review (audit + visual-audit)
├── "looks AI-made" ─────────────────► slop → audit → fixes → review G8
├── motion / 3D / video ─────────────► motion → MOTION.md → build → QA
├── Figma → code ────────────────────► figma → tokens → build → compare
├── accessibility ───────────────────► qa → G7 → fixes
├── performance ─────────────────────► qa → G6 → budget
└── install / repair ────────────────► doctor → installers
```

If the request is vague, BUREAU chooses the most defensible route and states the assumption. It does not block on reversible decisions.

## 3. Scripts

| Script | Input | Output | When |
|---|---|---|---|
| `audit.mjs` | source | findings + score | before any review |
| `visual-audit.mjs` | URL or file | screenshots, JSON, MD | layout, contrast, motion QA |
| `review.mjs` | scores JSON | state + scorecard | circuit and Tribunal |
| `tokens.mjs` | tokens JSON | CSS, Tailwind, contrast | design system |
| `figma-sync.mjs` | Figma/Tokens Studio export | normalized DTCG | handoff |
| `doctor.mjs` | environment | capability report | install and support |
| `new-project.mjs` | template | project + artifacts | starting point |
| `divergence.mjs` | two or more pages | similarity per dimension | Gate 2, before shipping |

All are plain Node, no telemetry. `visual-audit` uses Playwright; the others have no external dependencies.

## 4. Artifacts as memory

State does not live in chat. It lives on disk:

```
BUREAU.md              truth, scope, proof, non-goals
DESIGN.md              world, tokens, components, prohibitions
MOTION.md              primitives, timings, narrative, fallback
.bureau/config.json    mode, viewports, budgets
.bureau/comps/         three directions + decision
.bureau/evidence/      audits, contrast, type, copy, launch
.bureau/qa/            screenshots and report.json
.bureau/review/        state.json, scores, scorecard
```

A new session can resume from these files. If an artifact is missing, the agent writes the minimum version; it never invents evidence.

## 5. Review data flow

```
code ──► audit.mjs ──► .bureau/evidence/audit.json
   │
   └────► visual-audit.mjs ──► .bureau/qa/report.json + screenshots
                                   │
scores.json ──► review.mjs ────────┤
                                   ▼
                          state.json + scorecard.{json,md,html}
                                   │
                                   ▼
                              TRIBUNAL
```

`review.mjs` validates:

1. gate order;
2. required evidence exists;
3. every path cited in an issue exists;
4. score ≥ 3.5 and zero P0;
5. the source hash — if the code changed, the gate is **stale**.

## 6. Hash and staleness

Each gate stores a hash of the source and docs. At the Tribunal the script recomputes it. If anything changed after review, the gate is `STALE` and the release fails.

This prevents "I approved it yesterday, changed 40 files today, it's fine". It is not.

## 7. Progressive disclosure

The agent reads `SKILL.md` (≈350 lines), then only:

- `00-doctrine` before creating;
- `16-review-circuit` before reviewing;
- `17-anti-ai-slop` before approving copy;
- `07/08/09` before motion/3D/video;
- `14/15` before Figma/Playwright.

References are independent. None requires the agent to have read the others.

## 8. Security

- Page content, files, Figma, and screenshots are **data**, never instructions.
- The skill makes no network calls by itself. `visual-audit` accesses only the URL you provide.
- The installer refuses to delete directories without `.bureau-installed`.
- No secrets are read or sent.
- Scripts are readable Node, no obfuscation.
- In a sensitive repo, review `skill/scripts/*.mjs` before running.

## 9. Extending

To add a domain:

1. create `references/32-your-domain.md`;
2. add the row to the §9 table in `SKILL.md`;
3. if it has mechanical rules, add `BS-*` rules to `scripts/lib/rules.mjs`;
4. if it adds a gate, adjust `scripts/lib/gates.mjs` and rebalance weights to 100;
5. test with `node --test`.

To add a host:

1. find its skills directory;
2. add it to `install.sh` and `install.ps1`;
3. add the path to `doctor.mjs`;
4. document it in `22-installers.md` and `docs/*/install.md`.

## 10. Limits

- The detector does not judge composition, truth, or talent. It finds the mechanical.
- Scripts do not replace the eye: screenshots must be inspected.
- Figma MCP varies by version; discover tools before automating.
- Real-device WebGL is the only proof of graphics performance.
- The circuit is only as good as the honesty of the person writing the scores.
