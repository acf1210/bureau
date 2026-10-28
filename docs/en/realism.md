# Realism first

BUREAU treats photography, film and physical material as the default visual language. A page should look produced, not generated. Vector illustration is a tool for logos, icons and diagrams; it is not the fallback for a missing photograph.

## The media hierarchy

Choose the highest available source that fits the brief. Never skip a level because the next one is easier.

| Rank | Source | Use when |
|---|---|---|
| 1 | Original photography or film from the project | The subject exists and can be shot |
| 2 | Licensed real photography or footage | The subject exists but cannot be shot |
| 3 | Commissioned production | The budget covers a shoot |
| 4 | Photoreal generation | No real asset exists, and the subject is not evidence |
| 5 | Physically based render | A product or space must be shown and no photograph exists |

A synthetic image is never evidence of a real product, person, place or event. If no level produces a usable asset, ship a typographic or material composition. Do not fill the hole with a decorative vector.

## The photographic brief

Every visually relevant asset starts with a brief. A brief without these fields is not a brief.

| Field | Question |
|---|---|
| Subject | What is in frame, and what must it prove? |
| Story | What happened one second before and after? |
| Composition | Wide, medium, close or overhead? Where is the subject? |
| Lens | Focal length, aperture, distance, depth of field |
| Light | Source, direction, hardness, colour temperature, time of day |
| Material | Visible surfaces and how they react to the light |
| Imperfection | Dust, wear, asymmetry, a crease, a wet edge |
| Exclusions | Logos, faces, brands, artefacts, elements to add in code |
| Use | Aspect ratios, crops, safe areas, text overlay zones |
| Rights | Owner, licence, territory, duration, credit |

Write photography language, not mood language. "35 mm at f/2, window light from camera left, 4300 K" beats "moody premium lighting".

## What is rejected

- Vector illustration as the dominant image of a page.
- Flat, isometric or geometric drawings used as art direction.
- Floating 3D objects with no physical justification.
- Chrome spheres, blobs, abstract particles, generic digital sculpture.
- Glowing circuits, digital brains and holograms as "AI".
- Gradients used in place of an image.
- Geometric decoration with no informational job.
- Plastic textures, impossible reflections, synthetic materials.
- Motion that simulates impossible objects.
- Visible generation artefacts: merged geometry, inconsistent light, impossible depth of field.

A technically perfect image that still reads as generated fails.

## What stays in SVG

Logos, functional icons, data graphics, technical maps, plans, scale indicators and interface primitives. A diagram is not an illustration. The mechanical check ignores `aria-hidden`, `role="img"` and `role="graphics-document"` SVGs, and only fires when a page has no photograph or film at all.

## Cinematic video

Film earns its place by showing duration, change, scale, process or performance. Source it in the same hierarchy as photography.

| Check | Failure |
|---|---|
| Camera grammar | A move through a solid object, morphing, a false zoom on a still |
| Temporal integrity | Light changes direction inside a shot, objects change shape |
| Loop | The last frame does not meet the first |
| First paint | Autoplaying film with no poster |
| Accessibility | No pause, no reduced-motion state, audio autoplay |
| Format | No H.264 fallback, no dimensions, hero film over 1.5 MB on mobile |

Store first, middle and last frames, a loop comparison and a format record next to the film. A film that cannot be inspected frame by frame is not verified.

## Validation

| Layer | What it checks | Tool |
|---|---|---|
| Mechanical | Media present, poster, provenance, licence, vector-hero and gradient/blur habits | `scripts/realism.mjs`, `scripts/audit.mjs` |
| Human | Anatomy, geometry, material, light, optics, perspective, continuity, authenticity | Rendered screenshots and film frames at 100% |

A clean mechanical report is not a realism pass. A human pass without the mechanical check is not a pass either: the provenance may be invented.

## Provenance

`.bureau/media/provenance.json` records every image and film:

```json
{
  "media": [
    {
      "src": "media/atelier-hero.avif",
      "kind": "photograph",
      "owner": "Project owner",
      "source": "Commissioned shoot, 2026-10-12",
      "licence": "All rights, web use",
      "date": "2026-10-12",
      "synthetic": false
    }
  ]
}
```

The audit checks that every `<img>` and `<video>` carries `data-provenance` or appears in this file. It cannot judge the licence; a human does that at Gate 8.

## Review modes

The realism work is judged by the same circuit at three depths.

| Mode | Required gates | Tribunal | Jury | Highest verdict |
|---|---|---|---|---|
| **Fast** | 6 | Optional | None | Pass |
| **Standard** | 10 | Required | None | Pass |
| **Signature** | 10 | Required, isolated | 10–15 reviewers | Award |

Set the mode with `review.mjs --mode fast|standard|signature`, or with `review.mode` in `.bureau/config.json`. A Standard project that wants an award judgement switches to Signature and completes the jury.

## Limits

The mechanical checks cannot see. They catch a missing photograph, a poster-less film, an unrecorded licence, a vector hero, a gradient standing in for an image and a blurred orb. They cannot tell whether the light is right, the hands are real or the product could exist. That is a human review on rendered artefacts, and it is recorded as evidence, not asserted.
