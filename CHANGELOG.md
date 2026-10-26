# Changelog

All notable changes to BUREAU are recorded here. The format follows Keep a Changelog; the project uses Semantic Versioning.

## [1.0.0] — 2026-10-26

### Added

- **Skill**: `SKILL.md` with doctrine, autonomy contract, routing, hard rules, tool protocol and the review circuit.
- **23 references**: doctrine, intake, concept, art direction, typography, Pantone/OKLCH color, layout, motion, WebGL, video/parallax, imagery, interaction, accessibility, performance, Figma, Playwright, review circuit, anti-slop, copy/truth, stack recipes, reference library, ship/evolve, installers.
- **Deterministic audit** (`audit.mjs`): 40+ anti-slop and accessibility rules with `BS-*` IDs, suppression comments, scoring and JSON/Markdown output.
- **Playwright visual audit** (`visual-audit.mjs`): multi-viewport screenshots, contrast, overflow, touch targets, labels, images, fonts, console, failed requests, LCP/CLS/long tasks, reduced-motion pass, baseline hashes.
- **Review circuit** (`review.mjs`): Gate Zero + nine weighted gates, evidence validation, source-hash staleness, Tribunal, Markdown/JSON/HTML scorecards.
- **Tokens** (`tokens.mjs`): W3C DTCG, Tokens Studio and flat JSON input; CSS, Tailwind v4 and OKLCH output; contrast report.
- **Figma sync** (`figma-sync.mjs`): Tokens Studio, DTCG and Figma Variables export normalization.
- **Scaffold** (`new-project.mjs`): three self-contained templates with brief, design and motion artifacts.
- **Doctor** (`doctor.mjs`): environment, dependency, project and host-install report.
- **Three templates**: Kinetic Editorial, Product Surface, Immersive Experience, each with media, reduced-motion behavior and accessible markup.
- **Showcase site**: trilingual landing page, nine docs pages per locale (PT-BR, EN, ES), four detailed SVG diagrams, search, theme toggle, copy buttons.
- **Installers**: Claude Code, Codex, Antigravity, Hermes; bash and PowerShell; dry-run, link, force, uninstall; safety marker.
- **Tests**: 9 Node tests covering the detector, suppression, tokens, contrast failure, installer, gate order and a full award-path review.
- **Docs**: PT-BR, EN and ES quickstart, architecture, workflow, circuit, commands, anti-slop, visual language and install.

### Security

- No telemetry.
- Installer refuses unmarked deletions.
- Target content is treated as untrusted data.

### Known limitations

- The detector covers the mechanical subset only; taste and truth require human review.
- Figma MCP tool names vary by server version; discover them at runtime.
- `visual-audit` uses hash-level screenshot comparison, not pixel diff.
- The three templates use fictional demo content, clearly labeled where it could be mistaken for proof.

[1.0.0]: https://github.com/acf1210/bureau/releases/tag/v1.0.0
