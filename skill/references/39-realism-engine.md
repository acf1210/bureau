# Realism Engine

> One job: make the page look like it was produced, not generated. Photography
> and film are the default material; vector art is a tool, not a substitute.

## 1. The hierarchy

Choose the highest available source that fits the brief. Never skip a level
because the next one is easier.

| Rank | Source | Use when | Record |
|---|---|---|---|
| 1 | Original photography or film, supplied by the project | The subject exists and can be shot | Owner, photographer, date, licence |
| 2 | Licensed real photography or footage | The subject exists but cannot be shot | Source, licence, URL, date |
| 3 | Commissioned production | The subject exists and the budget covers a shoot | Brief, photographer, usage |
| 4 | Photoreal generation | No real asset can be produced, and the subject is not evidence | Tool, prompt, seed, reviewer, edits |
| 5 | Physically based render | A product or space must be shown and no photograph exists | Scene, materials, lighting, renderer |

**Never** use a synthetic image as evidence of a real product, person,
installation, event or client result. Label speculative imagery in the
provenance file.

If no level produces a usable asset, ship a strong typographic or material
composition. Do not fill the hole with a decorative vector.

## 2. What the engine rejects

- Vector illustration as the page's dominant image.
- Flat, isometric or geometric drawings used as art direction.
- Floating 3D objects with no physical justification.
- Chrome spheres, blobs, abstract particles and generic digital sculpture.
- Abstract representations of AI: glowing circuits, digital brains, holograms.
- Gradients used in place of an image.
- Geometric decoration with no informational job.
- Cartoon, game-art or illustration styling.
- Plastic textures, impossible reflections, synthetic materials.
- Motion that simulates impossible objects.
- Images with visible generation artefacts: warped hands, merged geometry,
  inconsistent light direction, repeating microtexture, impossible depth of field.
- A hero of text, icons and abstract shapes when the subject is photographic.

SVG remains correct for logos, functional icons, data graphics, technical maps,
scale indicators and interface primitives. A diagram is not an illustration.

## 3. The photographic brief

Every visually relevant asset starts with a brief. Store it in
`.bureau/media/brief-<asset>.md`. A brief without these fields is not a brief.

| Field | Question |
|---|---|
| Subject | What exactly is in frame, and what must it prove? |
| Story | What happened one second before and after the frame? |
| Composition | Wide establishing, medium, close detail, or overhead? Where is the subject? |
| Lens | Focal length, aperture, distance; what depth of field results? |
| Light | Source, direction, hardness, colour temperature, time of day, practicals. |
| Material | What surfaces are visible, and how do they react to the light? |
| Palette | What does the scene contribute to the page palette? |
| Imperfection | What makes it real: dust, wear, asymmetry, a crease, a wet edge? |
| Exclusions | What must not appear: logos, faces, brands, artefacts, elements the compositor would add? |
| Use | Aspect ratios, crops, safe areas, background-removal needs, text overlay zones. |
| Rights | Owner, licence, territory, duration, credit line. |

Photography language, not aesthetics language. "35 mm at f/2, window light from
camera left, 4300 K, one practical behind the subject" beats "moody premium
lighting".

## 4. Realism criteria

Score each asset 1-5. Anything below 4 is replaced or reshot, not explained.

| Criterion | Failure looks like |
|---|---|
| Anatomy | Hands, eyes, teeth, hair, posture, joint direction |
| Geometry | Impossible intersections, non-parallel parallels, melting edges |
| Material | Plastic skin, fabric with no weave, metal with no micro-scratch |
| Light | Two suns, shadows that disagree with highlights, flat fill |
| Optics | Everything sharp, impossible bokeh, focal length that contradicts perspective |
| Perspective | Horizon and vanishing points disagree between elements |
| Space | Objects float, contact shadows missing, scale inconsistent |
| Imperfection | Too clean, too symmetrical, too evenly lit |
| Continuity | Two assets in one section disagree on light or palette |
| Authenticity | The scene could not exist, or the product could not be used that way |

A technically perfect image that still reads as generated fails.

## 5. Continuity

Assets used together form one scene. Before shipping a page:

- One light direction across the section; if the story changes location, say so.
- One colour temperature per scene, recorded in `DESIGN.md`.
- One lens family per sequence; a 24 mm wide and an 85 mm portrait can coexist,
  a 14 mm and a 200 mm in the same cut usually cannot.
- One grade; do not mix a warm film emulation with a neutral digital frame
  unless the cut motivates it.
- One level of imperfection; a pristine product beside a battered environment
  needs a reason.

## 6. Provenance

`.bureau/media/provenance.json` is required when `media_provenance` is
`required` in the project config:

```json
{
  "media": [
    {
      "src": "media/atelier-hero.avif",
      "kind": "photograph",
      "owner": "Project owner",
      "source": "Commissioned shoot, 2026-10-12",
      "licence": "All rights, web use",
      "credit": "Photographer name",
      "date": "2026-10-12",
      "synthetic": false
    }
  ]
}
```

The audit checks that every `<img>` and `<video>` either carries
`data-provenance` or appears in this file. It cannot judge the licence; a human
does that at Gate 8.

## 7. Config

The scaffold writes these defaults; keep them unless the brief argues otherwise.

```json
{
  "visual_direction": {
    "realism_mode": "photographic",
    "photography_first": true,
    "cinematic_video": true,
    "physical_plausibility": "required",
    "artificial_decorative_objects": "forbidden",
    "vector_hero_illustration": "forbidden",
    "generic_abstract_visuals": "forbidden",
    "functional_svg": "allowed",
    "physically_based_rendering": "conditional"
  },
  "creative_execution": {
    "autonomy": "high",
    "review_mode": "standard",
    "unnecessary_checkpoints": false,
    "technology_selection": "contextual",
    "visual_refinement": "required",
    "media_provenance": "required"
  }
}
```

`review_mode` is one of `fast`, `standard`, `signature` (see
`16-review-circuit.md`). A project may change it at any time with
`review.mjs --mode`.

## 8. When the budget is zero

No licensed assets and no shoot is a constraint, not a licence to illustrate.
In order:

1. Use the client's own product photography, even if it needs a crop and grade.
2. Use one strong real image rather than six weak ones.
3. Build a typographic page with real material: paper, ink, rule, photograph of
   a texture that exists.
4. State the gap in the delivery limitations. Do not fill it with a vector hero.
