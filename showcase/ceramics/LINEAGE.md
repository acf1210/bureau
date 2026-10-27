# Lineage — Torno (`showcase/ceramics`)

A showcase model: design first, performance last. It is a worked example of a blend (`skill/references/23-lineage-and-blend.md`), not a template to copy.

| Role | Lineage | Principle | Axis | Becomes, here | Not copied |
|---|---|---|---|---|---|
| Dominant 55% | Ikko Tanaka, *Nihon Buyo* poster (1981) | A figure reduced to flat geometric planes | Composition, colour | The wheel sits on three flat planes, clay, slip and kiln, with one disc; nothing else decorates it | The poster face |
| Counter 30% | Carlo Scarpa, Brion tomb, San Vito d'Altivole (1968–78) | The joint is where the building speaks | Detail | Foot, belly, shoulder, neck and lip are named and drawn; the glaze line is a joint you set | His drawings |
| Accent 15% | Saul Bass, title sequences (1958–59) | Motion that cuts instead of fading | Motion | Choosing a form cuts to the new profile; only the sliders move it continuously | His cut-paper figures |

- **Tension:** Tanaka's flat planes against a pot shaded in full relief.
- **Subject-only ingredient:** clay weight, volume and price computed from the profile the visitor sets.
- **Signature move:** a lathe surface shaded per pixel from a profile texture, turning with its throwing lines and glaze drips.
- **Dials:** ENERGY 2 / RHYTHM 2 / MOTION 2. The wheel turns; everything else holds still.
- **Technological proof:** a WebGL shader reading a 256-step profile texture (monotone cubic, no ripples), glaze edge with drips, speckled raw foot, antialiased silhouette.

## Mobile composition

The pot comes first, full width, then the bench; sliders go one column under 420 px.

## Fingerprint

| Dimension | This model |
|---|---|
| Faces | Gloock + Albert Sans |
| Palette | slip `#EFE3D3`, clay `#B8653F`, kiln `#1E1714`, celadon `#9DB4A4`, cobalt `#2D4E8A` |
| Easing | `steps(1,end)` for cuts, `cubic-bezier(.2,.7,.1,1)` |
| Favicon | a black jar on clay |

## Priorities

Design leads every decision here. The page spends GPU time, large type and live rendering freely; it still keeps the floor: real contrast, a keyboard path, reduced motion designed as a still, all copy readable without JavaScript, and nothing that pretends to send.
