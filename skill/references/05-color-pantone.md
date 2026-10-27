# 05 — Color and Pantone

Color is the fastest emotional signal and the easiest place to look generic. Build it as a system with a story.

## 1. Pantone, correctly

Pantone is a **standardized color language** used in print, textiles, plastics, and brand guidelines. It is not a CSS color space.

- **PMS / Solid Coated-Uncoated** — print inks.
- **TCX / TPG** — textiles (Cotton/Paper).
- **Pantone Connect / Libraries** — licensed digital swatches.
- **sRGB/hex values are approximations** and vary by rendering, calibration, and substrate.

Use Pantone to **name and anchor** a palette in a brief ("the ground is Cloud Dancer, the accent is a vermilion two steps hotter than 18-1664"), then implement in OKLCH and verify contrast on screen. Never claim a screen color *is* Pantone. For print, use licensed libraries and proof physically.

### Color of the Year — reference table

Approximate sRGB for screen exploration only.

| Year | Pantone | Name | Approx. hex | Character |
|---|---|---|---|---|
| 2026 | 11-4201 | Cloud Dancer | `#F0EEE9` | soft, airy off-white; quiet ground |
| 2025 | 17-1230 | Mocha Mousse | `#A47864` | warm, edible brown; comfort |
| 2024 | 13-1023 | Peach Fuzz | `#FFBE98` | tender, tactile peach |
| 2023 | 18-1750 | Viva Magenta | `#BE3455` | assertive, carmine energy |
| 2022 | 17-3938 | Very Peri | `#6667AB` | periwinkle optimism |
| 2021 | 17-5104 | Ultimate Gray | `#939597` | stable, weathered gray |
| 2021 | 13-0647 | Illuminating | `#F5DF4D` | solar yellow |
| 2020 | 19-4052 | Classic Blue | `#0F4C81` | dependable, deep blue |
| 2019 | 16-1546 | Living Coral | `#FF6F61` | warm, social coral |
| 2018 | 18-3838 | Ultra Violet | `#5F4B8B` | cosmic, artistic violet |
| 2017 | 15-0343 | Greenery | `#88B04B` | fresh, botanical |
| 2016 | 13-1520 | Rose Quartz | `#F7CAC9` | gentle pink |
| 2016 | 15-3919 | Serenity | `#92A8D1` | calm blue |
| 2015 | 18-1438 | Marsala | `#955251` | fortified wine |
| 2014 | 18-3224 | Radiant Orchid | `#B163A3` | expressive purple-pink |
| 2013 | 17-5641 | Emerald | `#009473` | jewel green |
| 2012 | 17-1463 | Tangerine Tango | `#DD4124` | energetic orange-red |
| 2011 | 18-2120 | Honeysuckle | `#D94F70` | lively pink |
| 2010 | 15-5519 | Turquoise | `#45B5AA` | tropical calm |
| 2009 | 14-0848 | Mimosa | `#F0C05A` | optimistic yellow |
| 2008 | 18-3943 | Blue Iris | `#5A5B9F` | blue-violet |
| 2007 | 19-1557 | Chili Pepper | `#9B1B30` | deep spice red |
| 2006 | 13-1106 | Sand Dollar | `#DECDBE` | neutral warmth |
| 2005 | 15-5217 | Blue Turquoise | `#53B0AE` | aquatic |
| 2004 | 18-1651 | Tigerlily | `#E2583E` | orange flower |
| 2003 | 14-4811 | Aqua Sky | `#7BC4C4` | airy aqua |
| 2002 | 19-1664 | True Red | `#BF1932` | classic red |
| 2001 | 17-2031 | Fuchsia Rose | `#C74375` | vivid rose |
| 2000 | 15-4020 | Cerulean | `#98B2D1` | sky blue |

**Source of names/codes:** Pantone Color Institute announcements. Hex values are BUREAU approximations, not official conversions.

### Using a COY without being lazy

A Pantone Color of the Year is a **cultural timestamp**, not a palette. Use it as:

- a **narrative anchor** ("this brand is about quiet confidence after noise" → Cloud Dancer ground),
- a **material reference** (paper, textile, glaze),
- a **secondary accent**, never an automatic primary,
- a **brief-level constraint** that forces a distinctive ground.

Do not ship "COY + black + white" as the whole identity. Build a 5–7 color system around it with roles.

### 2026 direction: Cloud Dancer as ground

A screen palette that treats off-white as material, not as "white":

```css
:root {
  --ground: oklch(95.2% 0.008 85);      /* Cloud Dancer-ish */
  --surface: oklch(97.5% 0.006 85);
  --ink: oklch(18% 0.012 70);           /* warm near-black */
  --muted: oklch(52% 0.014 70);
  --line: oklch(30% 0.01 70 / 0.14);
  --accent: oklch(56% 0.19 32);          /* terracotta signal */
  --accent-ink: oklch(97% 0.01 80);
  --signal: oklch(78% 0.16 92);          /* warm chartreuse */
}
```

Pair with a hard black section for contrast and one saturated accent. Add texture (paper grain at 3–5% opacity) only if it belongs to the concept.

## 2. Color science for screens

Libraries that generate, extract and verify colour (Color.js, Chroma.js, Leonardo, ColorBox, Color Thief, Poline), by production phase: `34-color-tooling.md`.

### Use OKLCH for systems

OKLCH is perceptually uniform: equal lightness steps look equal. It also keeps hue stable when you change lightness, unlike HSL.

```css
--accent-500: oklch(62% 0.18 28);
--accent-600: oklch(55% 0.17 28);
--accent-300: oklch(78% 0.12 28);
```

- **L** 0–100% (lightness)
- **C** chroma (0 = gray; max depends on hue/lightness)
- **H** hue angle in degrees

For gamut safety, provide hex fallbacks for critical colors:

```css
color: #b23a2a;
color: oklch(54% 0.16 30);
```

### Contrast

- WCAG 2.2 AA: 4.5:1 body, 3:1 large text (≥24 px or ≥18.66 px bold), 3:1 UI boundaries.
- AAA: 7:1 body.
- APCA is a better perceptual model for future work; do not replace WCAG compliance with it yet.
- Compute with the script: `node scripts/tokens.mjs --check`.
- Test **states**: hover, focus, disabled, selected, error, on-image text.

### Dark mode is not inversion

Recompute the system:

- Ground: near-black with a hue tint (never `#000`).
- Surface: 2–4% lighter than ground.
- Ink: 88–94% white, not 100%.
- Accent: lower chroma and higher lightness than in light mode.
- Borders: white at 8–14% opacity.
- Shadows: replaced by glow/edge light; shadows on black are invisible.
- Images: slight lift or a warm grade to avoid a pasted look.

## 3. Semantic token system

Never use raw hex in components. Name by role:

```css
:root {
  --color-ground: ...;
  --color-surface: ...;
  --color-surface-raised: ...;
  --color-ink: ...;
  --color-ink-muted: ...;
  --color-ink-faint: ...;
  --color-line: ...;
  --color-accent: ...;
  --color-accent-hover: ...;
  --color-accent-ink: ...;
  --color-focus: ...;
  --color-success: ...;
  --color-warning: ...;
  --color-danger: ...;
  --color-info: ...;
}
```

Then a **data palette**:

```css
--chart-1: ...; --chart-2: ...; --chart-3: ...;
--chart-4: ...; --chart-5: ...; --chart-6: ...;
```

Data colors must be distinguishable in deuteranopia/protanopia. Do not encode meaning by hue alone; use shape, label, or pattern too.

## 4. Palette construction

### 60/30/10 with intent

- **60%** ground (the world).
- **30%** ink + surfaces + images.
- **10%** accent and signal.
- Accent above the fold: ≤ 3 uses.

### Five-swatch brief

Every palette must answer:

1. **Ground** — what does the page sit on?
2. **Ink** — what does reading feel like?
3. **Structure** — lines, borders, rules.
4. **Accent** — what deserves emphasis?
5. **Signal** — states, data, alerts.

Add a **sixth**: the "unexpected" color used once, at the signature moment.

### Gradients

Allowed only when they represent something: light, heat, depth, material, data. Rules:

- Interpolate in OKLCH (`in oklch`) to avoid muddy midpoints.
- Never gradient text on a headline (anti-slop P0).
- Add subtle noise/dither to prevent banding on large fields.
- Provide a flat fallback.
- Test on OLED and low-quality panels.

```css
background: linear-gradient(120deg in oklch, var(--ground), var(--surface));
```

## 5. Color and culture

- Red: luck/prosperity in parts of Asia; danger/love in the West; revolution in politics.
- Green: nature/health; also money (US), infidelity (some cultures), sacred (Islam).
- White: purity (West), mourning (parts of Asia).
- Purple: luxury/creativity; also mourning (Brazil, some contexts).
- Yellow: optimism; caution; sacred (India).

For PT-BR / ES markets, avoid importing US-only associations without checking. When in doubt, use material and typography to carry meaning, not hue alone.

## 6. Pantone-inspired palettes

Original BUREAU palettes, anchored to the 2026 ground. Hex values are starting points; convert to OKLCH and adjust.

### A. Quiet Precision
Cloud Dancer ground, graphite ink, vermilion accent.

```
#F0EEE9  #161616  #6E6A63  #C8402A  #D8D2C6
```

### B. Night Archive
Near-black, bone, amber, oxidized green.

```
#0C0D0C  #EDE7DA  #B7791F  #2F6B5E  #4A4A45
```

### C. Cold Signal
Fog gray, steel blue, acid chartreuse.

```
#E7E9E6  #1B2226  #5B7C8D  #C6F04A  #9AA3A0
```

### D. Warm Instrument
Terracotta, cream, ink, brass.

```
#E9DFD0  #2A1F1A  #B4553A  #A98A4E  #6B5B4E
```

### E. Botanical Modern
Deep green, chalk, citrus, clay.

```
#10251C  #E8E5D8  #89A85C  #E0B94A  #B87352
```

### F. Chrome Bloom
Graphite, silver, orchid, electric blue (use with restraint).

```
#111214  #D9D9D6  #B98BC4  #4D7CFE  #6E7175
```

## 7. Color checklist

- [ ] Palette has a named story, not just swatches.
- [ ] 5–7 roles, no orphan hex values in components.
- [ ] Body contrast ≥ 4.5:1 in every state.
- [ ] Dark mode recomputed, not inverted.
- [ ] Accent used ≤ 3 times above the fold.
- [ ] No default purple-blue gradient.
- [ ] No gradient text.
- [ ] Grayscale hierarchy still works.
- [ ] Data palette is colorblind-safe and labeled.
- [ ] Images graded into the palette.
- [ ] Print/Pantone claims are honest.
