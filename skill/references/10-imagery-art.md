# 10 — Imagery, Objects, and Icons

Images are not filler. Each one is a claim about the world.

**Realism first.** The default material is photography and film. Work the hierarchy in `39-realism-engine.md` before considering an illustration: original shoot, licensed photograph, commissioned production, photoreal generation, physically based render. A missing photograph is never permission to draw a decorative vector. Film follows `40-cinematic-video.md`; inspection follows `41-media-validation.md`.

## 1. Image direction

Every image gets a brief (see `03-art-direction.md`). The brief protects against stock-photo drift and AI slop.

### The four image jobs

| Job | What it does | Example |
|---|---|---|
| **Evidence** | proves the product/place/person is real | product macro, team at work, installation |
| **Atmosphere** | establishes the world | material texture, weather, light |
| **Explanation** | shows how something works | cutaway, diagram, sequence |
| **Emotion** | creates desire or recognition | portrait, gesture, color field |

A page needs at most 1–2 of each. If an image has no job, cut it.

## 2. Art-directing generated images

AI images fail when the prompt is a mood. Write it like a photography/art-direction brief:

```
Subject: a single ceramic cup, handmade, uneven rim, steam rising
Composition: centered, 4:5, shot from slightly above, generous negative space
Lens: 85mm, f/2.8, shallow depth of field
Light: single hard window light from the left, warm 3200K, deep shadow
Material: matte glaze, fine speckle, visible finger marks
Palette: bone, terracotta, warm gray — no blue
Grade: neutral highlights, slightly lifted shadows, fine 35mm grain
Must not contain: text, logos, extra cups, plastic sheen, perfect symmetry,
generic bokeh, HDR glow, oversaturated orange
```

Workflow:

1. Generate a **contact sheet** of 6–12 options (same prompt, varied seed).
2. Choose for composition first, then material, then color.
3. Grade into the palette; crop to the layout.
4. Remove artifacts at 100% zoom.
5. Composite real UI/text in code, never in the image.
6. Keep the source and prompt for provenance.

### AI tells to reject

- Plastic skin, perfectly symmetrical faces, dead eyes.
- Impossible hands, merged objects, floating geometry.
- Generic cinematic bokeh with no subject.
- Over-sharpened HDR, teal-orange grade.
- Text that is almost right.
- "Luxury" = gold + marble + orchid.
- Overly smooth surfaces with no material history.
- A person looking directly at the camera in a stock-photo pose.

## 3. Photography treatment

Where to find licensed photos and video when there is no shoot, and how to record each licence: `36-stock-media.md`. Logo files, brand marks and placeholder logos: `37-logo-sources.md`.

- **One grade** across the site: temperature, contrast, grain, black point.
- **One crop logic**: all portraits 4:5, all environments 16:9, all details 1:1.
- **One light story**: hard sun, overcast, tungsten, neon. Do not mix.
- **Color**: pull 2–3 colors from the world; desaturate the rest.
- **Grain**: fine, 2–4% opacity, monochrome; not on text.
- **Duotone**: only if it is the concept; otherwise it flattens everything.

```css
.image {
  filter: saturate(0.92) contrast(1.04);
}
.image::after {
  content: "";
  position: absolute; inset: 0;
  background: var(--accent);
  mix-blend-mode: soft-light;
  opacity: 0.08;
  pointer-events: none;
}
```

## 4. Responsive images

```html
<picture>
  <source type="image/avif" srcset="hero-800.avif 800w, hero-1600.avif 1600w" sizes="100vw">
  <source type="image/webp" srcset="hero-800.webp 800w, hero-1600.webp 1600w" sizes="100vw">
  <img src="hero-1200.jpg" alt="..." width="1600" height="900" loading="eager" fetchpriority="high" decoding="async">
</picture>
```

- AVIF first, WebP fallback, JPEG last.
- Always set `width`/`height` or `aspect-ratio`.
- `loading="lazy"` below the fold; `fetchpriority="high"` only for the LCP image.
- `alt` describes the **job**, not the pixels. Decorative → `alt=""`.
- Use a CDN transform if available.

## 5. Object imagery and cutaways

The "exploded object" is one of the strongest signature moves (see Colorfigures). It works because it turns a product into an argument.

Rules:

- One object, one scale, one light.
- Explode along a meaningful axis (assembly order, layers, materials).
- Label with the brand's voice, not a manual's.
- Animate the assembly in sync with scroll; allow manual control.
- Provide a static labeled diagram for reduced motion and print.
- Do not explode 20 parts; 3–7 is legible.
- Keep the parts physically plausible.

Implementation options:

- **Pre-rendered sequence** (video or image sequence) — cheapest, most controllable.
- **CSS 3D transforms** — for simple stacked layers.
- **Three.js** — for real 3D rotation and labels.
- **SVG** — for diagrams and cutaways with crisp labels.

## 6. Texture and material

Texture is a seasoning:

- Paper grain: 3–5% opacity, fixed, monochrome.
- Noise: used to prevent gradient banding, not as a brand.
- Scanlines: only for a screen/CRT concept.
- Glass: only when the concept is transparency/light.
- Chrome: only when the concept is reflection/material.

Never stack grain + glass + glow + gradient as a default "premium" recipe.

## 7. Iconography

Icons are a language, not a sticker pack.

### Custom set (preferred)

- Grid: 24×24, 2 px safe area.
- Stroke: 1.5–2 px, consistent caps and joins.
- Corner radius: matches the world (0, 2, or 4).
- Optical size: align to cap height, not bounding box.
- Metaphor: drawn from the product's world, not generic Lucide.
- Count: 8–16 icons; more means you need a system, not more drawings.

### Font Awesome (fallback)

Font Awesome Free is a legitimate fallback for universal metaphors (search, arrow, play, close, external link). Rules:

- Use the SVG individual icons or the JS library, not the full CSS kit.
- Match size and color to the type.
- Never use an icon as the only label for a non-obvious action.
- Icons are not illustrations. A page built from Font Awesome is a wireframe.
- Check the license for the specific icons/style (Free vs Pro).

### Emoji

Emoji are content, not iconography. Never use them as UI icons, feature bullets, or a design system. They render differently per OS and undermine craft.

## 8. Illustration

Illustration is a commissioned language, not a fallback. It is allowed when the brand's subject is genuinely drawn (a publisher, a game, a children's product, a technical explainer) and the work commits to one technique with a made library. It is forbidden as the automatic answer to a missing photograph, and a vector scene must never be the dominant hero image of a page whose subject exists in the physical world.

A diagram is not an illustration. Logos, icons, maps, plans, data graphics and interface primitives stay in SVG; they are exempt from the realism check.

If illustration is part of the world:

- Choose one technique: line, flat, isometric, collage, 3D, generative.
- Keep a consistent stroke, palette, and perspective.
- Build a small library (6–12) with the same rules.
- Use it to explain, not to decorate.
- Provide alt text that conveys the explanation.

## 9. Image audit

- [ ] Every image has a job.
- [ ] One grade, one crop logic, one light story.
- [ ] No AI tells at 100% zoom.
- [ ] No fake text/logos in images.
- [ ] No stock-photo clichés.
- [ ] Responsive sources + dimensions (no CLS).
- [ ] Alt text meaningful or empty.
- [ ] No image is the only carrier of essential information.
- [ ] Texture is subtle and consistent.
- [ ] Icons share a grid, stroke, and optical size.
- [ ] Every photograph and film has a provenance record (source, owner, licence, date).
- [ ] A synthetic asset is labelled synthetic and is never evidence of a real product, person or event.
- [ ] No vector illustration is doing the job of a photograph.
