# Lineage — Glifo (`showcase/foundry`)

A showcase model: design first, performance last. It is a worked example of a blend (`skill/references/23-lineage-and-blend.md`), not a template to copy.

| Role | Lineage | Principle | Axis | Becomes, here | Not copied |
|---|---|---|---|---|---|
| Dominant 55% | Anni Albers, *On Weaving* (1965) | The thread is the structure | Grid | A loom of letters: columns are weight, rows are casualness; a slant wave passes like a shuttle | Her weavings |
| Counter 30% | Paula Scher, The Public Theater identity (from 1994) | Typographic volume; mixed weights as the noise of the street | Voice | The headline is the specimen, set at fifteen per cent of the width and pulled by the hand | The Public Theater posters |
| Accent 15% | Muriel Cooper, *Information Landscapes* (1994) | Zoom and transparency as navigation | Depth | Opening a letter stacks its eight weights as transparent layers | The VLW demos |

- **Tension:** Albers's patient grid against Scher's shouting volume.
- **Subject-only ingredient:** five real axes of one family, shown at every corner of their design space.
- **Signature move:** the weave: a field of letters that shows the whole design space at once and opens in depth.
- **Dials:** ENERGY 3 / RHYTHM 3 / MOTION 2. Loud type, a slow shuttle.
- **Technological proof:** CSS `font-variation-settings` on five axes, pointer-mapped weight and casualness, a modal lens with focus return and Escape.

## Mobile composition

The loom turns to seven columns and eight rows under the copy; the axis cards become rows with the sample beside its description.

## Fingerprint

| Dimension | This model |
|---|---|
| Faces | Recursive (one family; the sans, mono and casual voices are axes) |
| Palette | proof `#F1EFE8`, press `#141414`, red `#C92E17`, cyan `#0087BA` |
| Easing | `cubic-bezier(.62,.04,.28,1)` |
| Favicon | a white g on red |

## Priorities

Design leads every decision here. The page spends GPU time, large type and live rendering freely; it still keeps the floor: real contrast, a keyboard path, reduced motion designed as a still, all copy readable without JavaScript, and nothing that pretends to send.
