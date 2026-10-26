# Lineage — Halden Rocha (`legal-practice`)

A worked example of a blend (`references/23-lineage-and-blend.md`). It is not your lineage. Write your own before you change the CSS.

| Role | Lineage | Principle | Axis | Becomes, here | Not copied |
|---|---|---|---|---|---|
| Dominant 55% | Ladislav Sutnar, *Catalog Design Progress* (1950) | Information is structure; signals tell the reader where they are | Content logic | Numbered clauses, a practice catalogue table, four phases with an owner each | His catalogue spreads |
| Counter 30% | Paul Rand, *Thoughts on Design* (1947) | Wit through reduction; one sign does the work | Voice | The Legal / Plain switch: the same clause, said twice | The IBM logotype |
| Accent 15% | Emil Ruder, *Typographie* (1967) | White space is a form equal to the text | Density | A quiet letter on a cool brief ground; one seal colour | His specimen pages |

- **Tension:** Sutnar's dense structure against Rand's light touch.
- **Subject-only ingredient:** the defined terms of a contract, opened in place with the native Popover API.
- **Signature move:** every engagement clause switches between the binding text and what it means.
- **Dials:** ENERGY 1 / RHYTHM 2 / MOTION 1. Calm authority; the switch is the only motion.
- **Technological proof:** native `popover` definitions with no script; clause registers switched by one data attribute, so nothing shifts.

## Mobile composition

The letter goes full bleed and its header (title and the Legal / Plain switch) sticks to the top while you read; definitions open as a bottom sheet; the practice table becomes stacked records.

## Fingerprint

| Dimension | This template |
|---|---|
| Faces | Spectral + Public Sans |
| Palette | brief `#EEF0F3`, counsel `#14213D`, seal `#8E1F2F` |
| Easing | `cubic-bezier(.33,0,.15,1)` |
| Footer | a professional notice: fictional firm, not advice |
| Favicon | a seal with an H |
| Fonts loading | metric-matched fallbacks (`size-adjust`, ascent and descent overrides), so the page keeps its shape while fonts load |

## What a project must change

1. The lineage: three new rows for your subject.
2. The firm, its clauses and its defined terms: all fictional.
3. The signature move: the two registers belong to a practice that sells clarity.
4. Faces, palette and easing: at least two of the three.
5. Then run `node "$BUREAU_DIR/scripts/divergence.mjs" index.html --templates` and stay at or below 0.35.
