# DESIGN — the BUREAU site (Proof)

> Visual contract for `site/index.html`, `site/assets/docs.css` and `site/og.html`. Tokens are normative. Rebuilt 2026-10-27 for 7.5.0; lineage and decision in `.bureau/comps/blend.md` and `decision.md`.

## Concept

**Every page gets a proof.** The site is a print bureau's proofing table: a generic generated page arrives as a galley, the detector marks it in red pencil with the real rules, and the reviewed proof comes back clean. The landing then proofs itself.

- **Signature move:** the live proof sheet (marks drawn at the elements the findings name; marked ↔ reviewed; proof this page).
- **Technological proof:** `proof-engine.mjs` runs `rules.mjs` (the CLI's file) on fetched source in the browser; the no-JS list is generated from the same code at build time.
- **Lineage:** Tschichold (composition) × Bradbury Thompson (overprinted colour) × Munari (playful reading).
- **Dials:** ENERGY 2 · RHYTHM 3 · MOTION 2.

## Colour (light is the default; dark is "plate")

| Token | Light | Dark | Role | Contrast on ground |
|---|---|---|---|---|
| `--paper` | `#EDECE7` | `#111113` | ground | — |
| `--sheet` | `#F7F6F2` | `#19191C` | proof sheet, panels | — |
| `--ink` | `#121214` | `#ECEBE6` | text | 15.8 / 15.8 |
| `--muted` | `#57565F` | `#A5A3AB` | secondary text | 6.1 / 7.6 |
| `--rule` | `#C9C7BF` | `#34333A` | hairlines | non-text |
| `--pencil` | `#C8102E` | `#FF5A4E` | proof marks, the one accent | 5.0 / 6.1 |
| `--cyan` `--magenta` `--yellow` | `#0089C4` `#C4006A` `#F3D000` | same | overprint planes only, `mix-blend-mode: multiply` (light) / `screen` (dark); never text | — |

Red is the editor's pencil and nothing else: no red buttons, no red headings.

## Type

- **Archivo** variable, self-hosted (`archivo-var-latin*.woff2`, wght 100–900, wdth 62–125%, OFL).
  - Display: wght 800, wdth 125%, tracking −0.035em, line-height .86; sizes `clamp(3.2rem, 9.4vw, 9.6rem)` (h1), `clamp(2.2rem, 5vw, 4.6rem)` (h2).
  - Body: wght 400, wdth 100%, 17–19 px, line-height 1.55, measure ≤ 62ch.
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

- < 1100 px: the slug rail becomes a top strip; the proof sheet goes full width under the headline; marks list below the sheet with numbered leaders.
- < 640 px: the specimen scales to the column; marks show as a numbered list (numbers placed on the sheet); the ledger keeps bars, labels wrap.

## Browser surfaces

`::selection` pencil on paper; `caret-color` pencil; `scrollbar-color` rule on paper; `text-underline-offset: .22em`; tabular figures for numbers.
