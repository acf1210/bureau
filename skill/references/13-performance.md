# 13 — Performance

Performance is the first aesthetic judgment a visitor makes. Before they see the type, they experience the wait.

## 1. Budgets

| Metric | Mobile p75 | Desktop |
|---|---|---|
| LCP | ≤ 2.5 s | ≤ 1.8 s |
| INP | ≤ 200 ms | ≤ 150 ms |
| CLS | ≤ 0.1 | ≤ 0.05 |
| TTFB | ≤ 800 ms | ≤ 500 ms |
| Initial JS (gzip) | ≤ 250 KB marketing / 400 KB app | same |
| Initial CSS (gzip) | ≤ 60 KB | same |
| Hero image | ≤ 250 KB AVIF | ≤ 400 KB |
| Hero video | ≤ 1.5 MB | ≤ 2.5 MB |
| Fonts | ≤ 3 families, ≤ 4 files | same |
| Third parties | ≤ 3 | ≤ 5 |

Write the budget into `.bureau/config.json` and enforce it in review.

## 2. The critical path

```
HTML → critical CSS → LCP resource → fonts → JS → below-fold media
```

- Inline or preload the critical CSS (≤ 14 KB) for static pages.
- Preload the LCP image/font, not everything.
- Defer non-critical CSS and JS.
- Avoid render-blocking third parties.
- Keep the initial HTML meaningful without JS.

```html
<link rel="preload" href="/fonts/display.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/media/hero.avif" as="image" fetchpriority="high">
```

## 3. Images

- AVIF → WebP → JPEG fallback.
- Correct dimensions and `srcset`/`sizes`.
- `loading="lazy"` below the fold; never on the LCP image.
- `decoding="async"` for non-critical images.
- Use `aspect-ratio` / width+height to prevent CLS.
- Compress at the final display size, not 4000 px.
- Use a CDN with automatic format negotiation.

```bash
# AVIF at quality 45
magick hero.jpg -resize 1600x -quality 45 hero.avif
# WebP
magick hero.jpg -resize 1600x -quality 72 hero.webp
```

## 4. Fonts

- Self-host, subset, WOFF2, variable.
- Max 4 files; preload only the display face used above the fold.
- `font-display: swap` + metric-compatible fallback.
- Avoid loading italic/small-caps variants unless used.
- Do not load icon fonts for 6 icons.

```css
@font-face {
  font-family: "Display";
  src: url("/fonts/display.woff2") format("woff2");
  font-weight: 300 800;
  font-display: swap;
  size-adjust: 100%;
  ascent-override: 90%;
  descent-override: 22%;
  line-gap-override: 0%;
}
```

## 5. JavaScript

- Ship less. Remove unused dependencies.
- Code-split by route and by interaction.
- Dynamic-import heavy libraries (Three.js, charts, editors).
- Prefer native browser APIs over libraries.
- Avoid hydration for static content (Astro islands, server components).
- Use `defer`/`type="module"`; no inline blocking scripts.
- Debounce/throttle scroll and resize; prefer `IntersectionObserver` and `ResizeObserver`.
- Keep third-party scripts behind consent and `async`.

```js
const { initViewer } = await import("./viewer.js");
```

## 6. CSS

- Keep the critical path small; purge unused selectors.
- Avoid deeply nested selectors and huge utility payloads.
- Use `content-visibility: auto` for long below-fold sections.
- Use `contain` for independent components.
- Animate compositor-friendly properties.
- Avoid `@import` in production CSS (waterfall).
- Use modern layout (grid/flex) instead of hacks.

```css
.below-fold {
  content-visibility: auto;
  contain-intrinsic-size: 1px 800px;
}
```

## 7. Server and delivery

- CDN + Brotli + HTTP/2/3.
- Cache static assets immutably (`max-age=31536000, immutable`).
- HTML: short cache + revalidate.
- Image CDN with format negotiation.
- Edge rendering for personalization, static for the rest.
- Compression for HTML/CSS/JS/SVG.
- Early Hints / 103 where applicable.

## 8. Core Web Vitals specifics

### LCP

- Identify the LCP element (hero image, h1, video poster).
- Preload it; do not lazy-load it; avoid client-side rendering for it.
- Reduce TTFB; inline critical CSS.
- Do not animate the LCP element's opacity from 0 on load (it delays paint).

### INP

- Break long tasks (> 50 ms).
- Yield with `scheduler.yield()` or `setTimeout`.
- Avoid heavy work on input; debounce expensive handlers.
- Keep DOM size reasonable (< 1,500 nodes for marketing).
- Avoid layout thrash and synchronous XHR.

### CLS

- Reserve space for media (`aspect-ratio`).
- Font metric overrides.
- No injected banners above content without reserved space.
- Skeleton dimensions match final content.

## 9. Measurement

```bash
# Lighthouse (mobile, throttled)
npx lighthouse http://localhost:3000 --preset=desktop --output=json --output-path=.bureau/evidence/lh.json
npx lighthouse http://localhost:3000 --form-factor=mobile --throttling-method=simulate --output=json
```

- Use field data (CrUX/RUM) for truth; lab data for diagnosis.
- Record LCP/INP/CLS in `.bureau/evidence/`.
- Test on a real mid-tier Android, not only desktop DevTools.
- Throttle CPU 4× and network "Slow 4G" for the worst case.
- Compare before/after with the same conditions.

## 10. Performance and design

Sometimes the design is the problem:

- A 4 MB video behind text.
- 12 font files.
- A shader on every section.
- A 30,000-node DOM.
- 40 third-party tags.
- A 2 MB hero image because "it looks sharper".

Fix the design, not just the build. A lighter composition often looks better.

## 11. Checklist

- [ ] LCP element identified and preloaded.
- [ ] No lazy-loading above the fold.
- [ ] Images AVIF/WebP with dimensions.
- [ ] Fonts subset and preloaded (max 4).
- [ ] JS code-split; heavy libs dynamic.
- [ ] Third parties ≤ 3 and deferred.
- [ ] No layout shift from media/fonts/banners.
- [ ] 60 fps motion at 4× throttle.
- [ ] Budgets recorded and met.
- [ ] Field data plan exists (RUM/CrUX).
