# Changelog

All notable changes to BUREAU are recorded here. The format follows Keep a Changelog; the project uses Semantic Versioning.

## [Unreleased]

## [5.0.0] — 2026-10-27

### Breaking

- Gate 1 requires `.bureau/research/survey.json`: five references verified in queue order from five of the 25 requested sources, covering at least three lenses, with the shared pattern (shown by three or more of them), the creative departure and what may not be taken. A source that cannot be verified is skipped with its reason and the next one is taken; a pending source ahead of a verified one is an error.
- The jury loop is time-boxed to ten minutes. `jury.json` records `loop` and scored `rounds`; `--final` takes the best round recorded inside the window, requires the delivered source to be that round's revision, rejects late rounds and a score that does not match the votes, and caps the verdict at conditional when the best round has dissent. Records made under 4.0.0 need `--jury-start` and at least one `--jury-round`.

### Added

- `survey.mjs --init --need <need> [--probe] | --check` and `lib/sources.mjs`, the registry of the 25 sources with identity status, needs and lens; `--probe` checks robots.txt reachability in queue order, skips unreachable or redirected sources and stops after seven reachable ones. Reference `30-reference-survey.md`.
- `review.mjs --jury-start`, `--jury-round`, `--jury-status` and `--regate` (replays the ten gates after a fix in one command). Jurors can write separate files in `.bureau/review/jurors/` and vote in parallel.

### Changed

- "Pintura / Hover Statues" is read as Hover States (hoverstat.es), a probable match to confirm; UX Archive (uxarchive.com) is recorded as unavailable; Godly's robots.txt redirects to recent.design. Canvas remains unidentified. `source-monitor.mjs` reads the shared registry.

## [4.0.0] — 2026-10-27

### Breaking

- Final review requires a 10–15-member jury record with unanimous gate votes and a complete Laws of UX assessment tied to the current source hash. Existing reviews must add `.bureau/review/jury.json` before finalization.

### Added

- `review.mjs --jury-init` creates an unfilled jury record without overwriting an existing one.

### Fixed

- `visual-audit --full` waits at most 3 s for images before the full-page capture; lazy images that never enter the viewport had made it hang indefinitely.
- Landing content remains visible without JavaScript; keyboard navigation, copy failure, mobile layout and motion preferences are handled explicitly.
- Visual audit reports include their generation timestamp; documentation and landing counts reflect the current reference and template inventory.
- The demo index is generated from the template catalogue, lists all thirteen templates, is linked from the landing and appears in the sitemap with every demo page; it had shipped with three hardcoded entries and no inbound link.
- The install command wraps instead of clipping at 320 px, the copy control reports success through a polite live region and names its target, gallery links carry a separated accessible name, and section weights are no longer hidden from assistive technology.
- The film no longer autoplays: markup carries no `autoplay` and no motion runs without JavaScript or under reduced motion.
- The landing's own copy drops the "award-grade" claim and the unsupported "shares no fingerprint" line; the READMEs' visual-audit claim now names the two templates with saved reports.
- `DESIGN.md` and `MOTION.md` describe what ships: the display clamp, the deprecated `aria-pressed`, the progress rule's transform, the metric fallbacks, the small-text tier and the no-JS panels.
- Documentation prose is set to 60 characters and the frontmatter lede is no longer repeated as the first paragraph.
- Without JavaScript all four install commands are now reachable and the inert tab strip and copy controls are hidden; the `js` class is set in the head and only where `IntersectionObserver` exists, so the wordmark is no longer painted, hidden and re-entered.
- The footer is a `contentinfo` landmark outside `main`, the skip link moves focus into `main`, and the host tab strip supports Home/End.
- Copy controls keep their accessible name in sync with their state, and the film pauses when it leaves the viewport.
- The wordmark fits a 320 px viewport under the WCAG text-spacing override, and the circuit figure links to its full-size SVG.
- The manifesto uses typographic quotes; the READMEs no longer claim 25 references or 25 tests (30 and 33).

## [3.0.0] — 2026-10-26

### Added

- Source availability monitor producing timestamped reports without collecting project content.
- An Awwwards-inspired, evidence-backed quality comparison distinct from customer approval and the official award score.
- An independent five-dimension design-quality rubric, paired comparison protocol and reviewer scorecard.
- Collaborative studio protocol for design handoffs, technical illustration, external creative tools and evidence-based iteration.
- Editable handoff, technical illustration and motion study models for project evidence.
- A paired evaluation protocol for measuring approval rates on real briefs.
- A research and qualification protocol with an evidence-led brief, an optional weighted candidate rubric and a reusable worksheet.
- Expanded the research menu to 25 requested entries with source-specific limits and selection by project need.

### Fixed

- The immersive template pauses WebGL when reduced motion is enabled and restores its scene after context loss.
- The planning template identifies its illustrative chart correctly, exposes the selected scenario to assistive technology and respects reduced-motion changes.
- Typography, motion-tool selection and WebGL lifecycle guidance for accessible visual production.

## [2.0.0] — 2026-10-26

### Breaking

The review circuit asks for more evidence. Projects reviewed under 1.0.0 need these files before their gates pass again:

- Gate 1: `.bureau/comps/blend.md` and a six-axis `critique` in the scores file.
- Gate 2: `.bureau/evidence/divergence.json`.
- Gate 7: ten `heuristics` in the scores file.
- Final: a clean `.bureau/review/delivery.md` (`review.mjs --delivery-init`) and `"method"` in `tribunal.json`.
- `bureau-ignore` waives nothing without a rule ID and a reason of 20+ characters, and never waives a P0.

### Added

- **Versioning on every update**: `scripts/release.mjs <x.y.z>` bumps every version reference and dates the changelog; `tests/version.test.mjs` fails if any reference drifts.

- **Ten new templates**, each a different professional world with its own blend, signature move and designed mobile composition: `legal-practice` (Sutnar × Rand × Ruder), `architecture-studio` (Ando × Mies × Scarpa), `restaurant-table` (Barragán × Wyman × J. Albers), `private-bank` (Müller-Brockmann × Crouwel × Tufte), `clinic-care` (Hara × Kare × Tanaka), `developer-api` (Gerstner × Weingart × Greiman), `fashion-atelier` (Brodovitch × A. Albers × B. Thompson), `record-label` (Reid Miles × Saville × Brody), `museum-archive` (Bo Bardi × Lustig × Munari), `hardware-store` (Rams × Sottsass × Castiglioni). All thirteen pass the static and visual audits with no P0 or P1 from 320 to 1920 px; the closest pair shares 0.197 of its fingerprint.
- **Metric-matched font fallbacks** (`size-adjust`, ascent and descent overrides, measured per face and, for width-axis faces, per width) keep CLS ≤ 0.013 while web fonts load.
- **Canon** grows to forty designers; `catalog.json` describes every template; `scripts/gallery.mjs` regenerates the showcase and README galleries from it (`--check` in tests); `capture-demos.mjs` captures desktop and mobile for every template and builds the README banner.
- **READMEs rebuilt** in three languages: a banner mosaic, a desktop and mobile gallery, the workflow and circuit diagrams, binding tiers, lineage, and updated counts.

- **Lineage and blend** (`references/23-lineage-and-blend.md`): a canon of 18 designers cited by documented work, a three-part blend recipe (dominant × counter × accent, one axis each), a mutation checklist and four originality tests.
- **Refinement passes** (`references/24-refinement-passes.md`): seven passes from structure to detail, with thresholds and evidence.
- **Divergence** (`divergence.mjs`, `lib/fingerprint.mjs`): compares palette (perceptual bins), faces, easing, declarations, class vocabulary, section skeleton and favicon; exits 1 above `--max` (default 0.35).
- `LINEAGE.md` in every template; anti-slop tells BS-C11 (template drift) and BS-C12 (tribute act).
- Tests for template divergence, lineage files, reskin detection and scaffold media.

- **Anti-slop circuit, hardened** (informed by Hallmark, antislop, Diagram Design and Impeccable's critique method; see NOTICE):
  - Binding tiers: P0 Floor can never be waived; P1 waivers need the rule ID and a page-specific reason of 20+ characters; rejected waivers (BS-E12) and repeated waivers (BS-E13) are findings; the audit JSON carries a `waivers` ledger.
  - New detectors with failing and passing fixtures: BS-E10 dead in-page link, BS-A13 broken ARIA/label reference, BS-W14 fake send, BS-E11 unthemed browser surfaces, BS-K11 side stripe, BS-K12 hard offset shadow, BS-W13 template punctuation, BS-B11 content hidden at rest.
  - Render tier: VA-FOLD (h1 and first action above the fold at ≥ 1024 px), VA-BUDGET (words per 900 px window), VA-HEAD (crowded section heads).
  - Gate 1 requires a six-axis pre-build critique; Gate 7 requires Nielsen's ten heuristics; the final requires a clean Delivery Gate (`--delivery-init`, 19 items, evidence on every PASS) and a declared Tribunal method; a degraded Tribunal cannot reach Award Track.
  - Taxonomy grows by BS-C13–C17, BS-T11–T14, BS-K11–K13, BS-W13–W15, BS-B11–B13; liveliness dials (ENERGY / RHYTHM / MOTION) in `DESIGN.md`.

### Changed

- Detector fixes found while building: implicit `<label>` wrapping now counts as a label (BS-A05); fallback faces are not counted as families (BS-E05); BS-K12 catches offset shadows with a spread value; the visual audit skips `aria-hidden` decoration in contrast checks (WCAG 1.4.3); `divergence.mjs` no longer truncates large JSON on a pipe; the fingerprint ignores `@font-face` mechanics.
- The showcase scopes its reveal under `.js` and keeps it visible under reduced motion.

- Templates and the showcase drop eyebrows, template punctuation and the accented headline word; forms say plainly that nothing was sent; the showcase scopes its reveal under `.js`.
- **Templates rebuilt** so they share no fingerprint (highest pair 0.08, was 0.39): each has its own faces, palette, easing, favicon, labels, separators, footer and signature move. No template uses a reveal on every section any more.
- Immersive film gains a pause control; Kinetic and Product no longer ship an unused video.
- Gate 1 requires `.bureau/comps/blend.md`; Gate 2 requires `.bureau/evidence/divergence.json`.
- Scaffold copies media only when the template uses it, adds a lineage section to `DESIGN.md`, and prints the divergence step.

## [1.0.0] — 2026-10-26

### Added

- **Skill**: `SKILL.md` with doctrine, autonomy contract, routing, hard rules, tool protocol, autopilot mode and the review circuit.
- **23 references**: doctrine, intake, concept, art direction, typography, Pantone/OKLCH color, layout, motion, WebGL, video/parallax, imagery, interaction, accessibility, performance, Figma, Playwright, review circuit, anti-slop, copy/truth, stack recipes, reference library, ship/evolve, installers.
- **Deterministic audit** (`audit.mjs`): 28 regex rules plus project-level checks for anti-slop and accessibility, with `BS-*` IDs, suppression comments, scoring and JSON/Markdown output.
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

[Unreleased]: https://github.com/acf1210/bureau/compare/v5.0.0...HEAD
[5.0.0]: https://github.com/acf1210/bureau/compare/v4.0.0...v5.0.0
[4.0.0]: https://github.com/acf1210/bureau/compare/v3.0.0...v4.0.0
[3.0.0]: https://github.com/acf1210/bureau/compare/v2.0.0...v3.0.0
[2.0.0]: https://github.com/acf1210/bureau/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/acf1210/bureau/releases/tag/v1.0.0
