# Lineage — Cerro Lumen (`showcase/observatory`)

A showcase model: design first, performance last. It is a worked example of a blend (`skill/references/23-lineage-and-blend.md`), not a template to copy.

| Role | Lineage | Principle | Axis | Becomes, here | Not copied |
|---|---|---|---|---|---|
| Dominant 55% | Karl Gerstner, *Designing Programmes* (1964) | Design the rules, not one solution | System, content logic | Every power of ten is the same programme: exponent, object, distance, light-travel time, one sentence | His programme diagrams |
| Counter 30% | László Moholy-Nagy, *Light Prop for an Electric Stage* (1930) | Light is the medium, not an effect on a surface | Light | The fragment shader is the only light on the page; type sits on veils cut out of it | The kinetic sculpture |
| Accent 15% | Charles and Ray Eames, *Powers of Ten* (1977) | One continuous move through scale by a constant factor | Scroll narrative | The scroll zooms the sky from the ridge to a spiral galaxy; the rail reads the exponent | The film's framing |

- **Tension:** Gerstner's fixed programme against Moholy-Nagy's uncontained light.
- **Subject-only ingredient:** the Moon decides which nights can be booked; the page computes its phase for the next seven evenings.
- **Signature move:** a powers-of-ten scroll drawn by one shader, with the exponent on a single rail.
- **Dials:** ENERGY 2 / RHYTHM 2 / MOTION 3. The sky is always moving; the type never does.
- **Technological proof:** a WebGL fragment shader (star field, nebula, log-spiral galaxy, horizon) driven by scroll; moon phase and local sidereal time computed in the browser.

## Mobile composition

The rail becomes a strip at the foot of the screen that keeps the current exponent in view; each power stacks exponent over card; the seven evenings go four up.

## Fingerprint

| Dimension | This model |
|---|---|
| Faces | Major Mono Display (lowercase voice) + Sora |
| Palette | night `#06080F`, star `#ECE6D6`, sodium `#F0A04B`, teal `#5CC2B5` |
| Easing | `cubic-bezier(.16,.84,.24,1)` |
| Favicon | a white dome with an amber star |

## Priorities

Design leads every decision here. The page spends GPU time, large type and live rendering freely; it still keeps the floor: real contrast, a keyboard path, reduced motion designed as a still, all copy readable without JavaScript, and nothing that pretends to send.
