# 03 — Art Direction

Gate 2. Art direction is the discipline of making every element belong to the same world.

## 1. The world sheet

Before components, write a one-page world sheet:

```markdown
# World: <name>
- Concept: <one sentence>
- Ground: <material + exact color>
- Light: <source, hardness, direction>
- Voice: <display face, body face, mono>
- Palette: <5 swatches with roles, not just names>
- Material: <grain, paper, glass, metal, mist, none>
- Motion: <3 primitives + speed character>
- Image treatment: <crop, grade, grain, duotone, none>
- Signature move: <one sentence>
- Forbidden: <5 things this world must never do>
```

If two elements cannot be traced back to a line in this sheet, one of them is wrong.

## 2. Archetypes (starting points, not templates)

| Archetype | Ground | Voice | Motion | Risk |
|---|---|---|---|---|
| **Editorial Ink** | bone/near-black paper | high-contrast serif + grotesk | precise reveals, no bounce | can become a magazine pastiche |
| **Terminal Garden** | near-black with phosphor accent | mono + humanist sans | typing, scanning, cursor | cliché hacker aesthetic |
| **Cold Storage** | cool gray, steel, fog | neo-grotesk, tight tracking | slow parallax, condensation | cold and unwelcoming |
| **Warm Archive** | cream, ochre, dust | old-style serif + sans | page turns, stamps, fades | nostalgia without idea |
| **Vitrine** | deep color, glass, spotlight | display serif, small caps | object rotation, light shifts | luxury cliché |
| **Broadcast** | black, signal colors | condensed grotesk + mono | cuts, wipes, ticker | noisy, dated |
| **Field Survey** | map paper, moss, clay | humanist sans + mono | draw-on lines, pins | busy, infographic |
| **Liquid Chrome** | black, iridescent metal | wide grotesk | fluid distortion, reflection | 2022 trend, heavy GPU |
| **Paper Radio** | warm off-white, red | grotesk + typewriter | mechanical, rhythmic | twee |
| **Nocturne** | deep blue-black, warm light | serif + mono | slow fades, glow | generic "premium dark" |

Pick one primary archetype and one **counter-accent** (e.g., Terminal Garden + Warm Archive) to avoid category cosplay.

## 3. The first viewport

The hero is the thesis, not a header. Choose one composition and execute it fully:

### A. Statement
Massive type, one supporting line, one action, one visual proof. The type *is* the image. Needs exceptional line breaks and optical spacing.

### B. Object
A single product/artifact at the center, lit like a museum object. Text orbits it. Needs a real object, not a stock mockup.

### C. Stage
Full-bleed film/video/shader with a restrained overlay. The moving image carries the emotion; the type stays quiet. Needs a poster and reduced-motion still.

### D. Split Argument
Two unequal columns: claim vs evidence (text vs live product, before vs after, problem vs solution). The split ratio is meaningful.

### E. Index
The page opens as a table of contents / map / archive. Ideal for cultural, editorial, and multi-product sites. Needs a strong typographic system.

### F. Threshold
A nearly empty frame with one precise invitation ("Enter", a door, a date). High risk, high memorability. Needs confident copy.

### G. Live Proof
The product itself runs above the fold: a calculator, a demo, a data feed, a configurator. The strongest hero for OPERATE and developer tools.

Avoid the default: centered eyebrow pill + H1 + gray paragraph + primary/secondary buttons + abstract gradient. If you use a centered hero, earn it with type, material, or a live element.

## 4. Making it feel expensive

Expensive is not gold. It is **evidence of care**:

1. **Optical typography**: tight display tracking, corrected punctuation, real hanging quotes, balanced line breaks, no orphans.
2. **Spacing rhythm**: a small set of spacing values used consistently; generous negative space around the focal element.
3. **Contrast hierarchy**: one black, one bone, one accent; grays are tinted, never default.
4. **Material consistency**: if there is grain, it is in the images and the ground, not randomly on cards.
5. **Image discipline**: one grade, one crop logic, one subject scale. No random stock collage.
6. **Micro-detail**: focus rings, selection color, scrollbar, 404, loading, empty states, hover timing.
7. **Restraint**: one accent, one display size, one ambient motion.
8. **Finish**: no misaligned baselines, no inconsistent radii, no 3 different shadow recipes.

## 5. Composition systems

### The grid is a score, not a cage

- Start with a 12-column grid and a baseline grid.
- Allow elements to cross 2–3 columns for tension.
- Use a **dominant column** (5–7 cols) and a **margin column** (3–4 cols) for captions, metadata, and asides.
- Break the grid exactly once per page, at the signature moment.

### Density map

Plan density across the page:

```
Hero        ██░░░░░░░░  low
Proof       █████░░░░░  medium
Product     ████████░░  high
Story       ███░░░░░░░  low
Detail      ███████░░░  medium
Close       ██░░░░░░░░  low
```

A page that is uniformly dense is tiring; uniformly sparse is empty. The rhythm is the design.

### Scale contrast

Use at least a 4× jump between the display size and body size. If display is 96 px, body is 16–18 px; mid sizes must earn their place.

## 6. Signature move patterns

| Pattern | Description | Best for |
|---|---|---|
| **Assembly** | parts lock into a whole as you scroll | products, architecture, hardware |
| **Cutaway** | object opens to reveal internal structure | technical products, education |
| **Ledger** | numbers and rows settle with mechanical precision | finance, data, ops |
| **Press** | type is printed, stamped, or inked in real time | editorial, culture, type brands |
| **Threshold** | a portal/door/veil transition between worlds | luxury, experiences, launches |
| **Field** | particles/agents respond to cursor and scroll | AI, networks, generative brands |
| **Broadcast** | live cuts, scoreboards, tickers | sports, news, events |
| **Specimen** | the product is dissected like a natural-history plate | science, beauty, materials |
| **Map** | navigation is spatial; the site is a territory | multi-product, archives, cities |
| **Instrument** | the page behaves like a tool (slider, dial, mixer) | audio, config, data |
| **Ritual** | a repeated, paced sequence with sound/light | fashion, launches, art |
| **Marginalia** | annotations, footnotes, redlines as a visual layer | intellectual brands, docs |

Pick one. Build it properly. Do not stack three.

## 7. Mode-specific direction

### PERSUADE

- The offer must be legible in the first viewport.
- One primary action; the secondary action is visually quieter.
- Proof near the claim. Testimonials only if real.
- The signature move should demonstrate the product's value, not distract from it.

### EXPERIENCE

- The work leads. Navigation can be minimal but must remain discoverable.
- Allow silence, duration, and a beginning/middle/end.
- Provide an exit and a skip; never trap the visitor.
- Sound is opt-in.

### OPERATE

- Familiarity is a feature. Use standard navigation and controls.
- The world lends type, palette, density, and one signature move only.
- Data density is designed: alignment, tabular figures, state colors, empty/loading/error states.
- Speed is the aesthetic.

### READ

- The reading column is sacred: 55–75 characters, 1.5–1.7 line-height, real contrast.
- The world owns the masthead, section openers, code/tables, and navigation.
- Wayfinding (contents, progress, next/previous) is part of the design.

## 8. Image direction

Write an image brief for every asset:

```markdown
- Subject: <what, who, how many>
- Crop: <full bleed / 4:5 / 1:1 / detail>
- Lens: <24mm environmental / 50mm neutral / 85mm portrait / macro>
- Light: <hard sun / overcast / single tungsten / neon rim>
- Palette: <3 colors from the world>
- Material: <skin, metal, fabric, dust, steam>
- Grade: <neutral, warm highlights, cool shadows, bleach bypass>
- Grain: <none / fine 35mm / coarse>
- Must not contain: <plastic skin, fake text, extra fingers, logos, generic bokeh>
```

For AI-generated images, generate a contact sheet of 6–12 options, choose one, then grade it into the world. Never ship the first output.

## 9. Motion as art direction

Motion has a **character**, not just a duration:

- **Precise**: 120–220 ms, `cubic-bezier(.2,.7,.2,1)`, small distances.
- **Viscous**: 600–1200 ms, long ease-out, large distances, blur.
- **Mechanical**: stepped, linear, tick-based.
- **Organic**: irregular timing, breathing, noise.
- **Cinematic**: slow in, hold, fast out; camera-like parallax.

Choose one character and use it everywhere. A page with precise hovers and bouncy entrances is incoherent.

## 10. The world audit

Before Gate 2 passes, answer:

- Can I name the world in one word?
- Does every section belong to it?
- Is there exactly one signature move?
- Is the accent used fewer than 5 times above the fold?
- Are there at most 2 type families + 1 mono?
- Does the page look like the category, or like itself?
- Does it survive grayscale? (If hierarchy disappears, color is doing too much.)
- Does it survive at 320 px? (If not, the composition is not real.)

## 11. Output of Gate 2

- `DESIGN.md` with normative tokens and the world sheet.
- A type specimen and color-in-context sheet.
- The first viewport at 1440, 768, and 390.
- A one-line statement of the signature move and where it lives.
- A list of forbidden moves for this world.
