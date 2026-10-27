# CLAUDE.md

See [AGENTS.md](AGENTS.md) for the full repository instructions.

BUREAU is a design skill and toolkit. Before changing it, read `skill/SKILL.md`, `skill/references/16-review-circuit.md`, and `skill/references/17-anti-ai-slop.md`.

Run before every PR:

```bash
npm test
node skill/scripts/audit.mjs skill/assets/templates showcase site/index.html --fail-on p1
npm run docs:build
```

No P0/P1 findings. No fabricated proof. Keep PT-BR, EN, ES docs structurally identical. MIT license.
