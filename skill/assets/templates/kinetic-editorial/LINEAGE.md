# Lineage — Marginal / Night (`kinetic-editorial`)

A worked example of a blend (`references/23-lineage-and-blend.md`). It is not your lineage. Write your own before you change the CSS.

| Role | Lineage | Principle | Axis | Becomes, here | Not copied |
|---|---|---|---|---|---|
| Dominant 55% | Jan Tschichold, *Die neue Typographie* (1928) | Asymmetric, functional hierarchy; no centred axis | Composition | Folio column, one reading column, a margin column for notes; heads hang left | Period rules and ornaments |
| Counter 30% | Herb Lubalin, *Avant Garde* (1968–71) | Letters set tight until words become images | Display voice | Bodoni Moda set at −0.055 em, the third line upright and heavy against two italic lines | The Avant Garde logotype |
| Accent 15% | Saul Bass, title sequences (1958–59) | Motion that cuts instead of fading | Motion | The headline arrives in three stepped cuts (`steps(5)`), then the page is still | His cut-paper figures |

- **Tension:** Tschichold's order against Lubalin's collision.
- **Subject-only ingredient:** the sodium-vapour amber of street lamps, and the live Lisbon hour placed on a 22:00–06:00 axis.
- **Signature move:** the index filed by the hour each story happened; the amber line is now.
- **Dials:** ENERGY 3 / RHYTHM 3 / MOTION 1. Loud type, asymmetric bands, one entrance and then stillness.
- **Technological proof:** live time zone arithmetic; CSS `:has()` links each margin note to its marker without JS.

## Mobile composition

The folio and margin columns fold into the reading column: the issue contents follow the lede, the margin notes follow the essay instead of interrupting it, and the hour axis becomes a vertical list that keeps the live amber line.

## Fingerprint

| Dimension | This template |
|---|---|
| Faces | Bodoni Moda + Newsreader; no mono |
| Palette | asphalt `#11151C`, sodium-paper `#EDE4D3`, moon `#A3A8B2`, sodium `#F2A12E` |
| Easing | `steps(5,end)`, `cubic-bezier(.7,0,.3,1)` |
| Labels | serif small caps, running heads with folios |
| Separators | ground shift and running heads; one amber rule before the colophon |
| Footer | a colophon: typefaces, grid, specimen notice |
| Favicon | an M over an amber baseline |

## What a project must change

1. The lineage: three new rows for your subject.
2. Faces, palette and easing: at least two of the three.
3. The signature move: the hour axis belongs to a night journal.
4. Every story, note and name: this issue is fictional.
5. Then run `node "$BUREAU_DIR/scripts/divergence.mjs" index.html --templates` and stay at or below 0.35.
