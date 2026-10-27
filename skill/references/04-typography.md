# 04 — Typography

Typography carries 90% of the perceived quality. If the type is wrong, nothing else can save the page.

## 1. Choosing type

Choose by **voice**, not by trend.

| Voice | Display candidates | Body candidates | Use |
|---|---|---|---|
| Editorial authority | Bodoni Moda, Playfair Display, Instrument Serif, Fraunces | Source Serif 4, Newsreader, Literata | culture, luxury, publishing |
| Technical precision | Archivo Expanded, Space Grotesk (careful), IBM Plex Sans Condensed, Saira Condensed | IBM Plex Sans, Public Sans, Geist | engineering, data, security |
| Warm humanism | Fraunces Soft, Recoleta (paid), Lora | Source Sans 3, Work Sans, Karla | health, education, community |
| Brutalist confidence | Anton, Archivo Black, Bebas Neue | Archivo, Inter Tight, Space Mono | sports, events, fashion |
| Experimental | Syne, Unbounded, Monument Extended (paid) | Sora, Manrope | AI, creative tech |
| Classical calm | Cormorant Garamond, EB Garamond | Crimson Pro, Spectral | architecture, law, heritage |
| Playful craft | Bricolage Grotesque, Gochi Hand (sparingly) | Nunito Sans, Figtree | food, family, toys |

**Never** default to Inter, Manrope, or Space Grotesk for both display and body. They are fine body faces; as the entire identity they signal "AI default".

### Pairing rules

- Contrast on at least two axes: **structure** (serif/sans/mono), **width**, **weight**, or **historical voice**.
- Maximum: 2 families + 1 mono. A third display face must be justified by a real editorial need.
- Test the pairing on: a 96 px headline, a 16 px paragraph, a 12 px label, a number, an accent, an em dash, and a Portuguese/Spanish accent set (ã, ç, é, ñ, ü).
- Check the **italic**, **small caps**, and **tabular figures** exist if the design uses them.

### Proven free pairings

1. Bodoni Moda + Archivo + JetBrains Mono — editorial fashion/tech.
2. Instrument Serif + Geist + IBM Plex Mono — modern culture.
3. Fraunces + Public Sans + Space Mono — warm intelligence.
4. Newsreader + Archivo + IBM Plex Mono — documentary.
5. Cormorant Garamond + Work Sans + JetBrains Mono — restrained luxury.
6. Anton + Archivo + Space Mono — sports/broadcast.
7. Syne + Sora + JetBrains Mono — experimental technology.
8. Bricolage Grotesque + Figtree + Space Mono — playful product.
9. Playfair Display + Source Sans 3 + IBM Plex Mono — classic editorial.
10. IBM Plex Sans Condensed + IBM Plex Sans + IBM Plex Mono — one-family system with width contrast.
11. Unbounded + Manrope + JetBrains Mono — AI/space.
12. Literata + Karla + Spline Sans Mono — reading-first.

Verify licenses (most Google Fonts are OFL) and self-host. Open font platforms, foundries and licence checks: `38-open-fonts.md`.

## 2. Type system

Legibility concerns recognition of individual characters; readability concerns sustained reading. Treat 16–18 px body type, 1.5–1.7 line-height and 45–75 characters per line as starting points, not universal laws. Check the actual typeface, language, viewport and user zoom. Kerning adjusts individual pairs, tracking adjusts a range of letters, and leading sets line spacing. Test each in context rather than applying headline settings to body copy.

### Roles

Define tokens by **job**, not by size:

```css
:root {
  --font-display: "Bodoni Moda", "Times New Roman", serif;
  --font-body: "Archivo", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  --text-display-1: clamp(3.5rem, 9vw, 9.5rem);
  --text-display-2: clamp(2.5rem, 6vw, 5.5rem);
  --text-h1: clamp(2.25rem, 4.5vw, 4rem);
  --text-h2: clamp(1.75rem, 3vw, 2.75rem);
  --text-h3: clamp(1.25rem, 1.8vw, 1.6rem);
  --text-body-lg: clamp(1.125rem, 1.4vw, 1.3rem);
  --text-body: clamp(1rem, 1.1vw, 1.0625rem);
  --text-small: 0.875rem;
  --text-micro: 0.6875rem;

  --leading-display: 0.92;
  --leading-heading: 1.08;
  --leading-body: 1.6;
  --leading-small: 1.45;

  --tracking-display: -0.03em;
  --tracking-heading: -0.015em;
  --tracking-body: 0;
  --tracking-micro: 0.12em;
}
```

### Rules

- Display: tight leading (0.9–0.98), negative tracking (-0.02 to -0.04em).
- Body: 60–75 characters per line (`max-width: 65ch`), 1.55–1.7 line-height.
- Small text: never below 12 px for meaningful content; 11 px only for metadata with strong contrast.
- All-caps micro-labels: add 0.08–0.14em tracking and use sparingly.
- Numbers: `font-variant-numeric: tabular-nums` for tables/metrics; proportional for prose.
- Headlines: `text-wrap: balance`; paragraphs: `text-wrap: pretty`.
- Avoid justified text on the web. Avoid hyphenation in display type.

## 3. Optical details that separate craft from template

1. **Hanging punctuation** and proper quotes (`“ ” ‘ ’`), em dashes (—), en dashes (–).
2. **Optical margin** on large quotes and display lines (`text-indent: -0.05em`).
3. **Baseline alignment** between columns and captions.
4. **Line-break authorship**: use `<br>` or spans to control the hero, then remove at small sizes.
5. **Small caps** for labels instead of uppercase when the face supports it.
6. **Oldstyle figures** in editorial prose if the face has them.
7. **Ligatures** on for display; disable for code (`font-variant-ligatures: none`).
8. **Slab/italic contrast** in pull quotes.
9. **Measure**: no paragraph wider than 75ch, including on ultra-wide screens.
10. **Color**: body text at 85–92% opacity on dark, never pure white; never gray-on-color without checking contrast.

## 4. Fluid type without chaos

- Use `clamp(min, preferred, max)` with a viewport unit.
- Test at 320, 390, 768, 1024, 1440, 1920, 2560.
- Cap the max: a 12rem headline on a 2560 screen is a poster, not a website.
- Use container queries for components in sidebars; viewport queries for page-level type.
- Do not scale body text with viewport width below 16 px.

```css
.hero__title {
  font-family: var(--font-display);
  font-size: var(--text-display-1);
  line-height: var(--leading-display);
  letter-spacing: var(--tracking-display);
  text-wrap: balance;
}
```

## 5. Font loading

```html
<link rel="preload" href="/fonts/display.woff2" as="font" type="font/woff2" crossorigin>
```

```css
@font-face {
  font-family: "Display";
  src: url("/fonts/display.woff2") format("woff2");
  font-weight: 400 700;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0100-024F, U+2000-206F;
}
```

- Self-host. Subset to Latin + needed accents (`U+0100-024F` covers Portuguese/Spanish).
- Max 4 files. Prefer variable fonts.
- Match the fallback metrics (`size-adjust`, `ascent-override`) to reduce CLS.
- Never load 6 weights of 3 families.

## 6. Type tells (anti-slop)

- Space Grotesk + Inter for yet another AI startup.
- All text in uppercase with 0.2em tracking.
- A 12 px eyebrow above every section.
- Gradient text on the headline.
- 8 different font sizes without a scale.
- Centered body paragraphs longer than 3 lines.
- Display face used for buttons and labels.
- Fake "editorial" serif with no editorial content.
- 100ch paragraphs on a 27" monitor.
- Font weight 300 body text on a light background.

## 7. Type specimen

Before building components, produce a specimen page with:

- Alphabet upper/lower, numerals, punctuation, accents (ã ç é ñ ü).
- Display line at 3 sizes.
- Body paragraph at 3 widths.
- Labels, buttons, captions, code.
- A dark and light context.
- A 320 px mobile view.

This catches 80% of type problems before they spread.

## 8. Icons and type

Icons are type at small size. Match:

- Stroke weight to the body weight (1.5–2 px at 20–24 px).
- Optical size to the label.
- Corner radius to the world.
- Alignment to the cap height, not the bounding box.

Font Awesome is acceptable as a fallback for standard metaphors (search, arrow, play, close), but a page whose identity is Font Awesome icons has no identity. Prefer a small custom set (8–16 icons) drawn for the world. See `10-imagery-art.md`.

## 9. Multilingual type

- Test Portuguese: ã, õ, ç, é, ê, ó, ô, á, à, ü.
- Test Spanish: ñ, ¿, ¡, á, é, í, ó, ú, ü.
- German/French if relevant: ß, œ, accents.
- Check line-length differences: PT/ES run ~15–25% longer than EN. Buttons and nav must survive.
- Avoid display faces without full Latin support.
- Use `lang` attributes per section for correct hyphenation and screen-reader pronunciation.

## 10. Checklist

- [ ] Max 2 families + 1 mono.
- [ ] Display has a distinct voice; body is readable at 16 px.
- [ ] Fluid scale tested at 6 widths.
- [ ] No paragraph > 75ch.
- [ ] Tabular numbers in data.
- [ ] Real punctuation and accents.
- [ ] Fonts subset, preloaded, swapped, licensed.
- [ ] Contrast passes for all text roles.
- [ ] Type survives grayscale and 320 px.
- [ ] No default-AI pairing.
