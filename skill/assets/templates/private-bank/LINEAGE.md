# Lineage — Halvø (`private-bank`)

A worked example of a blend (`references/23-lineage-and-blend.md`). It is not your lineage. Write your own before you change the CSS.

| Role | Lineage | Principle | Axis | Becomes, here | Not copied |
|---|---|---|---|---|---|
| Dominant 55% | Josef Müller-Brockmann, *Grid Systems in Graphic Design* (1981) | The modular grid as objective order | Grid | An eight-column module that every block snaps to | His concert posters |
| Counter 30% | Wim Crouwel, *New Alphabet* (1967) | Letterforms that obey the system | Voice | Martian Mono at a wide setting for every figure | The New Alphabet glyphs |
| Accent 15% | Edward Tufte, *The Visual Display of Quantitative Information* (1983) | Data-ink and direct labels | Data | Bars without gridlines, one label at the end, four quarters as small multiples | His book layouts |

- **Tension:** The grid's coolness against the warmth of patience as a promise.
- **Subject-only ingredient:** the compounding formula itself, written under the result.
- **Signature move:** move four sliders and the future value, the bars and the formula agree.
- **Dials:** ENERGY 1 / RHYTHM 2 / MOTION 1. Still; the numbers move only when you do.
- **Technological proof:** the full compounding formula computed in the page, with the money you put in separated from growth.

## Mobile composition

The model stacks under the headline with 44 px slider tracks; chart labels grow so they stay legible; the fee table becomes two-line records.

## Fingerprint

| Dimension | This template |
|---|---|
| Faces | Schibsted Grotesk + Martian Mono |
| Palette | vault `#E9ECE8`, ledger `#0D1F1A`, green `#24573F`, marker `#C6402A` |
| Easing | `cubic-bezier(.25,.1,0,1)` |
| Footer | a disclosure: fictional, not regulated, not advice |
| Favicon | stepped bars with one red mark |
| Fonts loading | metric-matched fallbacks (`size-adjust`, ascent and descent overrides), so the page keeps its shape while fonts load |

## What a project must change

1. The lineage: three new rows for your subject.
2. Every fee and the sample report: invented.
3. Any real deployment needs regulatory review of every sentence.
4. Faces, palette and easing: at least two of the three.
5. Then run `node "$BUREAU_DIR/scripts/divergence.mjs" index.html --templates` and stay at or below 0.35.
