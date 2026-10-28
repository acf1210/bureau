# BUREAU — the repository's own site

> Brief for the artifact this repository ships: the landing at `site/index.html`, the documentation under `docs/`, the ShowCase and the thirteen scaffold templates. Rewritten for the 8.0.0 Realism First update on 2026-10-28. Every claim below is checkable in this checkout.

## Truth

- **Product:** an open-source agent skill that gives a coding model a design bureau's workflow — concept, art direction, type, motion, WebGL, Figma handoff, Playwright evidence, accessibility, performance, and an adversarial review circuit. It installs into Claude Code, Codex, Antigravity and Hermes.
- **Audience:** developers and designers who already use a coding agent to produce client or product pages, and who can tell that the output is generic. Their current alternative is prompting the model directly, or buying a template.
- **Job to be done:** decide in one visit whether this is a serious design instrument, then install it or leave.
- **Offer:** the skill, its scripts, thirteen scaffold templates and the ShowCase, MIT licensed, no account, no telemetry, no paid tier.
- **Proof (sourced, this checkout, 2026-10-27):**
  - `npm test` → 61 tests, 61 pass.
  - The detector: 32 regex rules in `skill/scripts/lib/rules.mjs`, 21 project checks in `skill/scripts/audit.mjs`, and 6 mechanical realism checks in `skill/scripts/lib/realism.mjs`.
  - The landing's specimen: the same 32 rules mark `site/assets/specimen/generic.html` 18 times (three P0) and `reviewed.html` 0 times; `scripts/proof.mjs --check` keeps the static list on the page equal to that output.
  - Thirteen scaffold templates, forty-two references, five ShowCase models, four hosts, three languages: counted from `skill/assets/templates`, `skill/references`, `showcase/catalog.json`, `installers/`, `docs/`.
- **Claims we cannot make:** adoption or user counts; results on client work; awards or nominations; comparative benchmark superiority over other tools; uptime or SLA; security certification; WCAG conformance beyond the automated audit and the manual keyboard checks recorded in `.bureau/evidence/`.
- **Non-goals:** no hosted product or account system; no analytics or tracking; no CMS; no invented testimonials, logos, metrics or awards; no claim that the 13 templates are client work.

## Direction

- **Mode:** PERSUADE for the landing; READ for the documentation.
- **Emotional target:** exacting, unsentimental, alive. A studio that has already rejected three of its own drafts.
- **Must never look like:** a purple-gradient AI SaaS page; a template marketplace; an award-site with a custom cursor and no content; an agency portfolio with fabricated clients.
- **Signature move:** the proof. A deliberately generic generated hero is set on a proof sheet; the detector's real rules run in the browser and mark it like an editor's proof, mark by mark; a toggle shows the reviewed version with zero marks, and one button proofs the landing itself.
- **Technological proof:** the marks are not illustrations. `proof-engine.mjs` applies `rules.mjs`, the file the CLI uses, to the fetched source, and draws each finding at the element it names. Without JavaScript the same findings are listed, generated at build time from the same code.

## Constraints

- **Stack:** hand-written HTML, CSS and JavaScript. No framework, no build step for the landing. `marked` and `playwright` are the only dependencies.
- **Hosting:** static, GitHub Pages at `https://acf1210.github.io/bureau`, built from `site/` and `docs/` into `dist/` by `scripts/build-docs.mjs`.
- **Locales:** pt-BR, en-US, es-ES. Structure, links, code and numbers stay identical; only prose is translated.
- **Accessibility:** WCAG 2.2 AA. Keyboard path, skip link, focus states, 24 px minimum targets (44 px on primary actions and navigation), reduced motion, no autoplaying audio.
- **Performance:** LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1, JS ≤ 250 KB gzip.
- **Brand assets:** Archivo (variable width and weight) and JetBrains Mono under OFL, self-hosted in `site/assets/fonts`; screenshots and diagrams generated from this repository.
- **Legal:** MIT for code and documentation; the templates are fictional and labelled as such; third-party type licences recorded in `NOTICE.md`.

## Success

- **Primary metric:** a visitor runs the install command or opens the repository. No analytics are installed, so this is measured by repository traffic, not by the page.
- **Secondary:** the documentation is read past installation; a ShowCase model is opened.
- **Instrumentation:** none on the page. That is a deliberate constraint, not an oversight.
- **Definition of done:** all ten gates pass, the jury is unanimous, the Delivery Gate is clean, `npm test` is green and the version is tagged.

## Open questions

- Without analytics there is no on-page conversion signal; the trade-off is accepted for privacy, and the consequence is named rather than hidden.
- The three locales are maintained by hand; drift is caught by tests on structure and counts, not by translation review.
- Automated accessibility coverage stops where judgement begins; the record says so instead of claiming conformance.
