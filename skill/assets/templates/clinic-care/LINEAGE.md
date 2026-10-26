# Lineage — Respira (`clinic-care`)

A worked example of a blend (`references/23-lineage-and-blend.md`). It is not your lineage. Write your own before you change the CSS.

| Role | Lineage | Principle | Axis | Becomes, here | Not copied |
|---|---|---|---|---|---|
| Dominant 55% | Kenya Hara, *Designing Design* (2007) | Emptiness as a receptacle the visitor fills | Density | Wide margins, one idea per band, nothing decorative | Muji's art direction |
| Counter 30% | Susan Kare, original Macintosh icons (1984) | Meaning inside a tiny grid | Icons | Four service icons drawn on a 16-unit pixel grid | The Mac icons |
| Accent 15% | Ikko Tanaka, *Nihon Buyo* poster (1981) | A figure reduced to flat geometric planes | Imagery | Lungs and a sun as three flat shapes | The poster face |

- **Tension:** Hara's silence against Kare's friendliness.
- **Subject-only ingredient:** box breathing at four counts, and the city's emergency number, 107.
- **Signature move:** a breathing guide that starts only when pressed and stops after one minute.
- **Dials:** ENERGY 1 / RHYTHM 1 / MOTION 2. Calm; the only motion is the breath you choose to follow.
- **Technological proof:** a timed pacer that becomes a counting text in reduced motion; Atkinson Hyperlegible chosen for low-vision readers.

## Mobile composition

Headline first, the pacer under it at a smaller size; a fixed pair of buttons, call and book, sits above the home indicator; day choices are 48 px pills.

## Fingerprint

| Dimension | This template |
|---|---|
| Faces | Atkinson Hyperlegible + Gilda Display |
| Palette | air `#F3F6F5`, mist `#CFE5E3`, deep `#16322F`, leaf `#236A65`, sun `#E9B44C` |
| Easing | `cubic-bezier(.37,0,.63,1)` |
| Footer | the emergency line first |
| Favicon | flat lungs on a mist circle |
| Fonts loading | metric-matched fallbacks (`size-adjust`, ascent and descent overrides), so the page keeps its shape while fonts load |

## What a project must change

1. The lineage: three new rows for your subject.
2. The clinic, services and hours: fictional.
3. Medical copy needs clinical review; the pacer is not a treatment.
4. Faces, palette and easing: at least two of the three.
5. Then run `node "$BUREAU_DIR/scripts/divergence.mjs" index.html --templates` and stay at or below 0.35.
