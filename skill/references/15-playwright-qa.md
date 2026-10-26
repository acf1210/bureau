# 15 — Playwright QA

Playwright is the bureau's camera and crash-test rig. It produces the evidence the review circuit demands.

## 1. Two modes

| Mode | Use | Tool |
|---|---|---|
| **Scripted audit** | Reproducible screenshots, metrics, contrast, overflow, reduced motion | `skill/scripts/visual-audit.mjs` |
| **Exploratory** | Click flows, inspect snapshots, debug layout, test interactions | Playwright MCP / browser tools |

Use both. Scripts catch regressions; exploration finds what the script did not think to measure.

## 2. Setup

```bash
# Node 20+
node --version

# Install the library (no browsers yet)
npm install

# Install Chromium for Playwright
npx playwright install chromium

# Optional: system deps on Linux
npx playwright install-deps chromium
```

If Chromium is already installed and Playwright's bundled version matches, no download may be needed. The script reports which engine it used.

## 3. The audit command

```bash
node scripts/visual-audit.mjs http://localhost:3000 \
  --out .bureau/qa \
  --viewports 390x844,768x1024,1440x900,1920x1080 \
  --full \
  --motion \
  --json
```

Local files work too:

```bash
node scripts/visual-audit.mjs ./dist/index.html --out .bureau/qa
```

Outputs:

```
.bureau/qa/
  report.json
  report.md
  screenshots/
    mobile-390x844-fold.png
    mobile-390x844-full.png
    ...
    reduced-motion-1440x900-fold.png
  traces/            (when --trace)
```

## 4. The viewport matrix

| Name | Size | DPR | Why |
|---|---|---|---|
| Small phone | 320×568 | 2 | worst-case reflow |
| Phone | 390×844 | 3 | modern baseline |
| Large phone | 430×932 | 3 | Pro Max class |
| Tablet portrait | 768×1024 | 2 | breakpoint shift |
| Tablet landscape | 1024×768 | 2 | nav/density |
| Laptop | 1440×900 | 1 | primary design target |
| Desktop | 1920×1080 | 1 | max container |
| Wide | 2560×1440 | 1 | measure and max-width |

Test at 200% and 400% zoom manually; automation cannot fully judge reflow.

## 5. What to measure

### Layout
- `scrollWidth > clientWidth` (horizontal overflow).
- Elements extending beyond the viewport.
- Overlapping fixed/sticky elements.
- Text clipped by `overflow: hidden`.
- Images stretched or letterboxed unexpectedly.
- Broken grid at each breakpoint.

### Typography
- Computed font families (max 3 + mono).
- Body line length (characters per line).
- Font sizes below 12 px for meaningful text.
- Contrast of every visible text node against its effective background.
- Truncation and orphaned headings.

### Interaction
- Console errors and page errors.
- Failed requests (4xx/5xx, blocked fonts/images).
- Focus visibility on Tab.
- Tap target size < 24 px.
- Hover-only content.
- Forms: labels, errors, disabled states.

### Motion
- `prefers-reduced-motion` run: active animations, video playback, parallax transforms.
- Long tasks (> 50 ms) during load and scroll.
- Layout shifts (CLS).
- LCP element and time.
- Off-screen canvases still rendering.

### Media
- Broken images (`naturalWidth === 0`).
- Missing `alt`.
- Autoplay video without `muted`/`playsinline`.
- Hero media size.

## 6. Reading the report

The report is **evidence, not a verdict**. For every issue:

1. Open the screenshot.
2. Decide: real defect, acceptable trade-off, or false positive.
3. If real, fix at the source, not in the screenshot.
4. Re-run the exact same command.
5. Keep before/after pairs.

Severity:

- **P0** — blocks use or truth: broken layout at a target viewport, inaccessible control, contrast failure on body text, autoplay audio, console error that breaks a feature.
- **P1** — visible craft defect: overflow, inconsistent spacing, missing state, jank, oversized media.
- **P2** — polish: minor contrast, alignment, copy, metadata.

## 7. Exploratory playbook

Using Playwright MCP or a browser:

1. Load the page, take a snapshot, read the accessibility tree.
2. Click the primary action. Where does it go? Does it work?
3. Tab through the page. Can you reach and see everything?
4. Open the mobile menu. Escape. Focus returns?
5. Submit the form empty. Are errors clear and announced?
6. Resize to 320. Anything broken?
7. Emulate reduced motion. Does the page still make sense?
8. Emulate slow 4G. What appears first? Is the LCP element visible?
9. Turn off JavaScript. Is the content still readable?
10. Check the 404 and the empty states.

Record findings with a screenshot and the exact step.

## 8. Visual regression

Once a page is approved:

```bash
# Create or update baselines intentionally
node scripts/visual-audit.mjs http://localhost:3000 --out .bureau/qa --baseline .bureau/qa/baseline --update-baseline

# Compare
node scripts/visual-audit.mjs http://localhost:3000 --out .bureau/qa --baseline .bureau/qa/baseline
```

- Baselines are per viewport and per locale.
- A diff is a question, not a failure.
- Never auto-accept a diff without looking.
- Store baselines in git only if the repo is small and the team agrees; otherwise use an artifact store.

## 9. CI

```yaml
- run: npm ci
- run: npx playwright install --with-deps chromium
- run: node skill/scripts/audit.mjs . --fail-on p0
- run: node skill/scripts/visual-audit.mjs ./dist/index.html --out .bureau/qa --fail-on p0
- uses: actions/upload-artifact@v4
  with:
    name: bureau-qa
    path: .bureau/qa
```

CI should fail on P0 and on budget breaches. Upload screenshots and reports for humans.

## 10. Testing locales

- Run the matrix for each locale (`pt-BR`, `en-US`, `es-ES`).
- Check longer strings in nav, buttons, cards.
- Check date/number formats.
- Check `lang` attributes and font coverage.
- Check RTL if applicable (not in the default trio).

## 11. Gate 6/7 evidence

- `report.json` + `report.md`.
- Fold and full-page screenshots at 4 viewports.
- Reduced-motion screenshot.
- Console/network summary.
- LCP/CLS/long-task numbers.
- A before/after pair for every fixed P0/P1.
- Exploratory notes with steps.

If the report is missing a viewport, it is not evidence.
