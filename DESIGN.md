# DESIGN — the BUREAU site (Proof)

> Visual contract for `site/index.html`, `site/assets/docs.css` and `site/og.html`. Tokens are normative. Rebuilt 2026-10-27 for 7.5.0; hero, palette and type lightened in 7.9.1; hero redrawn as a line diagram and the landing made light-only in 7.9.2; lineage and decision in `.bureau/comps/blend.md` and `decision.md`.

## Concept

**Every page gets a proof.** The site is a print bureau's proofing table: a generic generated page arrives as a galley, the detector marks it in red pencil with the real rules, and the reviewed proof comes back clean. The landing then proofs itself.

- **Hero: the line guide.** The review circuit drawn as a transit diagram after Harry Beck (London Underground, 1933) and Massimo Vignelli (New York subway, 1972): only 90° and 45° lines, stations as equal dots. Ten gates G0–G9 are stations with their real weights; three lines by phase (Concept G0–G2 magenta, Craft G3–G7 cyan, Truth G8–G9 ink); the Tribunal is a pencil diamond interchange with a dashed spur back to G1 ("fails: back for changes"). A car rides the line once on entry, lighting each gate, and holds at the Tribunal; reduced motion shows the finished ride. Below 720 px the stations are a vertical ordered list, which is also the accessible text everywhere.
- **Signature move:** the live proof sheet, now the section right after the hero (marks drawn at the elements the findings name; marked ↔ reviewed; proof this page).
- **Technological proof:** `proof-engine.mjs` runs `rules.mjs` (the CLI's file) on fetched source in the browser; the no-JS list is generated from the same code at build time.
- **Lineage:** Tschichold (composition) × Bradbury Thompson (overprinted colour) × Munari (playful reading).
- **Dials:** ENERGY 2 · RHYTHM 3 · MOTION 2.

## Colour (light in every colour scheme; only the masthead and footer are black)

| Token | Value | Retired dark value | Role | Contrast on ground |
|---|---|---|---|---|
| `--paper` | `#F7F6F2` | `#141416` | ground | — |
| `--sheet` | `#FDFDFB` | `#1B1B1F` | proof sheet, panels | — |
| `--ink` | `#17171A` | `#ECEBE6` | text | 16.5 / 15.4 |
| `--muted` | `#5C5B63` | `#A5A3AB` | secondary text | 6.2 / 7.4 |
| `--rule` | `#E0DED6` | `#323138` | hairlines | non-text |
| `--wash` | `#EDF3F6` | `#171C20` | hero ground | — |
| `--wash-c` `--wash-m` `--wash-y` | `#E3EFF6` `#F7E8EF` `#FAF3D6` | `#15212A` `#24171E` `#23200F` | pale plate tints for fact, threshold and doc cells; text stays `--ink`/`--muted` | — |
| `--bar` | `#0F0F11` | — | masthead and colophon, the only black surfaces | — |
| `--bar-ink` `--bar-muted` | `#F3F2EE` `#ABAAB2` | same | text on the bar | 17.6 / 8.3 |
| `--pencil` | `#C8102E` | `#FF5A4E` | proof marks, the one accent | 5.0 / 6.1 |
| `--cyan` `--magenta` `--yellow` | `#0089C4` `#C4006A` `#F3D000` | same | overprint planes only, `mix-blend-mode: multiply` (light) / `screen` (dark); never text | — |

Red is the editor's pencil and nothing else: no red buttons, no red headings.

## Type

- **Archivo** variable, self-hosted (`archivo-var-latin*.woff2`, wght 100–900, wdth 62–125%, OFL).
  - Display: wght 300, wdth 100%, tracking −0.035em, line-height 1.04; sizes `clamp(2.6rem, 4.3vw, 4.8rem)` (h1), `clamp(2.1rem, 4vw, 4rem)` (h2). Figures in fact and threshold cells also wght 300.
  - Body: wght 400, wdth 100%, 17–19 px, line-height 1.6, measure ≤ 62ch; emphasis and buttons wght 500.
  - Brand: wght 600, wdth 112%, tracking .06em, on the black bar.
  - Labels: wght 600, wdth 87%, 13–14 px uppercase only for the slug rail.
- **JetBrains Mono** (OFL): rule IDs, line numbers, commands, the slug.
- Two families. Bodoni Moda is retired from the site.

## Space and grid

- 12 columns, gutter `clamp(16px, 2vw, 28px)`, page padding `clamp(16px, 4vw, 56px)`, max 1520 px.
- The slug rail takes columns 1–2 at ≥ 1100 px; content never centres on the page axis.
- Section rhythm: 8–12 rem between sections; hairline `--rule` rules, not boxes.
- Radii: 0. Shadows: none, except the proof sheet's 1 px edge and a paper lift `0 1px 0 var(--rule)`.

## Components

- **Proof sheet:** `--sheet` panel, 1 px edge, a 3-plate overprint strip at its head, the specimen iframe scaled to fit, a margin column of marks; leader lines in `--pencil`, 1.5 px.
- **Mark:** circled symbol (del, wf, qy, ins, mo, eng) + rule ID in mono + title; severity as P0/P1/P2 text, not colour.
- **Gate ledger:** ten rows, bar length = weight (out of 15), overprint fill; the totals row states the pass thresholds.
- **Buttons:** ink on paper, 48 px tall, square; secondary = 1 px ink outline. Focus: 3 px `--pencil` outline, 3 px offset.

## Responsive

- < 1100 px: the line diagram goes full width under the headline; the proof sheet spans the column; marks list below the sheet with numbered leaders.
- < 720 px: the diagram becomes the vertical station list; the specimen scales to the column; marks show as a numbered list (numbers placed on the sheet); the ledger keeps bars, labels wrap.

## Browser surfaces

`::selection` pencil on paper; `caret-color` pencil; `scrollbar-color` rule on paper; `text-underline-offset: .22em`; tabular figures for numbers.
