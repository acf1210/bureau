# Cinematic video

> A film earns its place by showing something a still cannot: duration, change,
> scale, process or performance. If a still does the job, ship the still.

## 1. Source hierarchy

Same order as photography (`39-realism-engine.md`): original footage, licensed
footage, commissioned production, photoreal generation, physically based render.
A slow zoom on a still is not footage. Label it as a still with a camera move.

## 2. Camera grammar

Use a move because the story needs it, not to signal production value.

| Move | Says | Watch |
|---|---|---|
| Locked off | Control, product, architecture | Dust and micro-shake if the scene is real |
| Dolly in / out | Draw attention, reveal context | Speed constant; no ease at both ends by reflex |
| Tracking | Follow a subject through space | Parallax must match depth |
| Pan / tilt | Survey a space | Speed matched to focal length; no whip unless motivated |
| Crane / rise | Scale, arrival, departure | Horizon stays consistent |
| Handheld, controlled | Immediacy, documentary | Small amplitude; no seasick drift |
| Orbit | Examine a product | Constant radius; no impossible occlusion |

Reject: impossible moves through solid objects, morphing, anatomical
deformation, objects that change shape, light that changes direction inside a
shot, crowds that teleport, a "camera" that passes through a surface.

## 3. Temporal integrity

Check the film as a sequence, not only as a poster.

- Frame 1 and the last frame belong to the same scene.
- Light direction and colour temperature hold across the cut unless the cut is
  the point.
- Shadows move consistently with the subject and the light.
- Fabric, hair, water and smoke behave with plausible inertia.
- No frame-to-frame texture crawl on skin, walls or fabric.
- No resolution pumping, banding or blocking in gradients.
- Audio, if present, matches the space; otherwise ship muted.

Generated footage gets the same test on three passes: full speed, frame by
frame, and the first/last second looped. If the loop is broken, cut the shot.

## 4. Story without narration

Even an ambient loop needs a before and after:

- A process completes.
- A surface is revealed.
- A space is entered.
- A scale is established, then a detail.
- A person does one thing and stops.

If nothing changes, the asset is a still. That is allowed; it is cheaper, sharper
and honest.

## 5. Duration and performance

There is no fixed duration. Choose from the content and the budget:

| Use | Typical range | Notes |
|---|---|---|
| Hero ambient loop | 6-15 s | Seamless loop; poster is frame 1 |
| Process film | 10-40 s | Scrub or play; captions if speech carries meaning |
| Product detail | 3-8 s | Short loop; no audio |
| Scroll-scrubbed sequence | 2-6 s of source | Encode for seeking; keyframe every 0.5 s |

Budgets: hero media ≤ 1.5 MB on mobile, poster ≤ 120 KB, lazy-load below the
fold, `preload="metadata"` for off-screen film. Formats: AV1 or HEVC plus H.264
fallback, WebM where it helps. Always a poster frame from the film itself.

## 6. Accessibility

- `muted`, `playsinline`, `loop` for ambient; no autoplay with sound.
- A visible pause control; the state is in the label, not only in colour.
- `prefers-reduced-motion`: pause the film, show the poster, keep the content.
- Captions or a transcript when speech carries meaning.
- The film is decorative only if the same information exists in text; otherwise
  give it a label and a description.

## 7. Verification

Store the evidence next to the film:

- `.bureau/evidence/film-<name>-frames/` — first, middle, last frames.
- `.bureau/evidence/film-<name>-loop.md` — first/last second comparison.
- `.bureau/evidence/film-<name>-format.md` — codec, dimensions, bitrate, size.
- `.bureau/evidence/film-<name>-review.md` — the 1-5 score on anatomy, geometry,
  light, motion and continuity; pass/fail with the reason.

A film that cannot be inspected frame by frame is not verified.

## 8. Failure modes to name in review

- The morph: a subject changes identity between frames.
- The soup: texture and edges crawl because the model cannot hold the surface.
- The two-sun shot: shadows and highlights disagree.
- The rubber world: architecture bends as the camera moves.
- The false zoom: a still pushed in and called footage.
- The loop break: last frame does not meet the first.
- The black start: no poster, so the hero begins as a rectangle.
- The silent story: nothing changes, so the film is decoration.
