# 09 — Video and Parallax

Video is the closest thing the web has to cinema. Parallax is the closest thing to depth. Both are easy to overuse.

**Realism first.** Source the film in the order set by `39-realism-engine.md`: original footage, licensed footage, commissioned production, photoreal generation, physically based render. Camera grammar, temporal integrity and frame-by-frame verification are `40-cinematic-video.md`. A slow zoom on a still is a still with a camera move; label it that way and never present it as footage.

## 1. Video as material

Use video when **motion is the content**: a product in use, a place, a face, fabric, weather, a process, a performance.

Do not use video for:

- a generic abstract loop behind generic copy,
- a 12 MB hero that delays LCP,
- background noise with no story,
- autoplaying audio.

## 2. The video brief

Stock video sources and their licences: `36-stock-media.md` §3.

```markdown
- Duration: 4–8s loop (hero), 15–45s (narrative)
- Subject: <what moves, what stays still>
- Camera: <locked / slow push / handheld / macro>
- Light: <hard / soft / practical>
- Palette: <3 world colors>
- Grade: <neutral / warm highlights / cool shadows>
- Motion: <one dominant movement>
- Loop: <seamless / hard cut / crossfade>
- Audio: <none / opt-in with captions>
- Text safe area: <where copy will sit>
- Must not contain: <text, logos, faces looking at camera, rapid cuts>
```

The first frame is the poster. Compose it as a still.

## 3. Encoding ladder

| Use | Format | Target |
|---|---|---|
| Hero loop | AV1/WebM + H.264 MP4 | ≤ 1.5 MB, 6–10s, 1080p max |
| Narrative | AV1/WebM + H.264 MP4 | ≤ 6 MB, 30–45s, 1080p |
| Mobile | H.264 MP4 | ≤ 800 KB, 720p |
| Poster | AVIF/WebP | ≤ 120 KB |

```bash
# H.264 MP4 (broad compatibility)
ffmpeg -i source.mov -an -vf "scale=1920:-2,fps=30" \
  -c:v libx264 -profile:v high -crf 23 -preset slow \
  -movflags +faststart hero.mp4

# WebM VP9
ffmpeg -i source.mov -an -vf "scale=1920:-2,fps=30" \
  -c:v libvpx-vp9 -crf 32 -b:v 0 -row-mt 1 hero.webm

# AV1 (best compression, newer decoders)
ffmpeg -i source.mov -an -vf "scale=1920:-2,fps=30" \
  -c:v libsvtav1 -crf 35 -preset 6 hero.av1.webm

# Poster at 1s
ffmpeg -ss 1 -i hero.mp4 -frames:v 1 -q:v 2 poster.jpg

# Short camera move from a still (a still, not footage: label it)
ffmpeg -loop 1 -i still.jpg -vf "scale=1920:-2,zoompan=z='min(zoom+0.0004,1.08)':d=180:s=1920x1080:fps=30,format=yuv420p" \
  -t 6 -an -c:v libx264 -crf 24 -movflags +faststart ambient.mp4
```

## 4. Markup

```html
<video
  class="hero__video"
  autoplay muted loop playsinline
  preload="metadata"
  poster="/media/hero-poster.avif"
  aria-hidden="true"
  tabindex="-1"
  disablepictureinpicture
>
  <source src="/media/hero.av1.webm" type="video/webm; codecs=av01.0.05M.08">
  <source src="/media/hero.webm" type="video/webm; codecs=vp9">
  <source src="/media/hero.mp4" type="video/mp4">
</video>
```

- `muted` + `playsinline` are required for autoplay.
- `preload="metadata"` (not `auto`) to protect LCP.
- `poster` must be the composed first frame.
- Decorative video: `aria-hidden="true"`, no controls.
- Meaningful video: controls, captions, transcript, and no autoplay audio.
- Pause when off-screen and when `prefers-reduced-motion`.
- Do not use `video` for UI backgrounds if an image/gradient works.

```js
const reduce = matchMedia("(prefers-reduced-motion: reduce)");
const video = document.querySelector(".hero__video");
function sync() {
  if (reduce.matches) { video.pause(); video.removeAttribute("autoplay"); }
  else video.play().catch(() => {});
}
reduce.addEventListener("change", sync);
sync();
```

## 5. Captions and transcripts

- Speech → captions (WebVTT) + transcript.
- Sound effects that carry meaning → captions.
- Music only → no captions required, but offer a pause.
- Captions: high contrast, 2 lines max, safe area above controls.
- Never bake text into video if it can be live text.

```html
<video controls>
  <source src="film.mp4" type="video/mp4">
  <track kind="captions" src="film.en.vtt" srclang="en" label="English" default>
  <track kind="captions" src="film.pt-BR.vtt" srclang="pt-BR" label="Português">
</video>
```

## 6. Parallax that reads as depth

Parallax works when layers have a **spatial logic**:

```
background  speed 0.2×
midground   speed 0.5×
subject     speed 1.0×
foreground  speed 1.4×
```

- Maximum displacement: 6–12% of the layer height.
- Use `transform: translate3d`; never `top`.
- Disable on touch if it janks; provide a static composition.
- Do not parallax text that must be read.
- Do not parallax every section; choose one.
- Ensure the composition still works when motion is off.

```css
.layer--back  { --speed: 0.2; }
.layer--mid   { --speed: 0.5; }
.layer--front { --speed: 1.2; }

.layer {
  transform: translate3d(0, calc(var(--scroll, 0) * var(--speed) * -1px), 0);
  will-change: transform;
}
@media (prefers-reduced-motion: reduce) {
  .layer { transform: none; will-change: auto; }
}
```

```js
let raf = 0;
addEventListener("scroll", () => {
  if (raf) return;
  raf = requestAnimationFrame(() => {
    document.documentElement.style.setProperty("--scroll", String(scrollY * 0.1));
    raf = 0;
  });
}, { passive: true });
```

## 7. Scroll narrative

A strong narrative has 4–6 **beats**, not 20:

1. **Establish** — the world, the promise.
2. **Destabilize** — the tension, the problem.
3. **Reveal** — the mechanism/product.
4. **Prove** — evidence, detail, scale.
5. **Resolve** — the transformed state.
6. **Invite** — the action.

Each beat gets one visual state. Transitions between beats are where motion lives. Pinning is optional; if used, keep it to one scene and always allow scroll to continue.

```html
<section class="scene" style="--beats: 3">
  <div class="scene__stage">
    <h2 class="scene__title">...</h2>
    <canvas class="scene__canvas"></canvas>
  </div>
</section>
```

```css
.scene { min-height: calc(100svh * var(--beats)); }
.scene__stage { position: sticky; top: 0; height: 100svh; overflow: clip; }
```

## 8. Combining video, parallax, and type

The most cinematic composition is usually **three layers**:

- a slow video or shader ground,
- a midground object/image with parallax,
- live type that stays optically still.

Keep type out of the busiest area. Use a subtle scrim or a localized gradient for contrast (not a global dark overlay). Let one layer move at a different speed; the rest hold.

## 9. Performance checklist

- [ ] Poster ≤ 120 KB; video ≤ 1.5 MB hero.
- [ ] `preload="metadata"` and lazy loading for below-fold video.
- [ ] Pause off-screen and on `visibilitychange`.
- [ ] Reduced-motion pause + static poster.
- [ ] No audio autoplay.
- [ ] Captions/transcript for meaningful speech.
- [ ] Parallax uses transforms only, capped displacement.
- [ ] No scroll hijack; keyboard and wheel both work.
- [ ] Video does not block LCP (poster is the LCP candidate).
- [ ] Test on mobile Safari and a mid-tier Android.

## 10. Anti-patterns

- 8 MB autoplay loop with no poster.
- Text baked into video.
- Video with audio autoplay.
- Parallax on every layer, including body text.
- Scroll-jacked "cinematic" experience with no escape.
- Stock footage of people shaking hands.
- Abstract loop that could advertise anything.
- Video that restarts on every scroll into view.
