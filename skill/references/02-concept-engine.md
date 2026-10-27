# 02 — Concept Engine

Gate 1. A concept is a compression of the brand's argument into a visual behavior.

## 1. The formula

```
CONCEPT = SUBJECT × TENSION × FORM
```

- **Subject**: the literal thing being sold or said (a bank, a font, a climate dataset, a hotel).
- **Tension**: the contradiction the brand resolves (speed vs care, machine vs hand, scale vs intimacy, precision vs play).
- **Form**: the visual/behavioral language that makes the tension visible (material, type, motion, data, space).

Example: *A wealth platform for founders.* Subject: private markets. Tension: enormous complexity vs a calm decision. Form: a ledger-like editorial world where heavy data is set in quiet type and numbers land with surgical motion. Signature: a portfolio that assembles as a single continuous line, each investment a node.

Weak concept: "Modern, clean, trustworthy fintech." No tension, no form, no ownership.

## 2. Survey before you generate

Run the five-source survey in `30-reference-survey.md` first. Its `pattern` is what the category's users expect; its `creative` field is the departure this project owns. Each direction below states how it treats that pattern: kept, bent or replaced, and why. A direction that only restates the pattern is a gallery entry, not a concept.

## 3. Generate three, not one

Three directions force a real decision. They must differ on **at least three of the four axes** (ground, voice, light, motion), on the signature move, and on the lineage: no source may appear in two directions.

For each direction write:

```markdown
## Direction <A/B/C> — <name>
- Thesis: <one sentence>
- Tension: <the contradiction it resolves>
- Emotional target: <three specific adjectives>
- Ground / Voice / Light / Motion: <one line each>
- Signature move: <one sentence, testable>
- Technological proof: <one sentence>
- Content logic: <how the real content will be organized>
- Risk: <what could make it fail>
- Lineage: <dominant × counter × accent — designer, work, axis each (see the blend reference)>
- Precedent (not to copy): <2 links / works>
```

### Lenses for generating directions

Use a lens to escape the first obvious idea.

| Lens | Question | Produces |
|---|---|---|
| **Material** | What physical material is this brand made of? | paper, glass, chrome, clay, textile, asphalt |
| **Editorial** | What would this be as a magazine? | grid, masthead, captions, folios, pull quotes |
| **Systemic** | What is the underlying system? | diagrams, maps, ledgers, flows, schemas |
| **Spatial** | What would this be as a room? | threshold, corridor, atrium, vitrine, archive |
| **Temporal** | What happens over time? | decay, growth, tide, broadcast, ritual |
| **Instrumental** | What tool does the audience use? | oscilloscope, mixing desk, loom, camera, cockpit |
| **Documentary** | What is the evidence? | contact sheets, field notes, transcripts, specimens |
| **Play** | What is the toy version? | physics, construction, reveal, collection |

A strong direction often fuses two lenses: *Documentary × Instrumental* for a security company; *Material × Editorial* for a fashion house.

## 4. Concept quality test

Score each direction 0–2 on five criteria. Anything below 7/10 is not ready.

| Criterion | 0 | 1 | 2 |
|---|---|---|---|
| **Ownable** | any brand could use it | fits the category | only this brand could own it |
| **Legible** | needs explanation | understood after a beat | understood in 3 seconds |
| **Generative** | one hero only | extends to 3 sections | generates the whole system |
| **Feasible** | needs unavailable tech | expensive but possible | buildable within budget |
| **Ethical** | manipulates or fabricates | neutral | reinforces the user's goal |

## 5. Selection

Use a weighted matrix tied to the brief, not to personal preference.

| Criterion | Weight |
|---|---:|
| Audience fit | 25 |
| Differentiation | 20 |
| Content fit (works with real assets) | 20 |
| Feasibility (time, tech, budget) | 15 |
| Longevity (won't date in 6 months) | 10 |
| Accessibility risk (inverse) | 10 |

Write the scores and the reasoning in `.bureau/comps/decision.md`. Include the rejected directions and why. This is how a future session avoids reopening a settled decision.

## 6. Comps

Comps are **arguments**, not decoration. Make three cheap, high-fidelity-enough artifacts:

- **Code sketch** (preferred): a single HTML file per direction, real type, real palette, real hero composition. No responsive polish, no components.
- **Figma frame**: 1440×900 plus a mobile frame. Use real content and variables.
- **Generated image**: acceptable for atmosphere, but must be paired with a type/layout sketch. Never approve a concept from an image alone.

Rules:

- Comp the **first viewport and the signature moment**, not five generic sections.
- Use the real headline, the real product, the real proof.
- Keep all three at the same viewport for honest comparison.
- Do not let the comp become the build by accident; label it `comp-*` and rebuild with the design system.

## 7. Naming the direction

A direction needs a name the team can say in a meeting: *The Ledger*, *Cold Storage*, *Field Notes*, *The Loom*, *Night Shift*, *The Vitrine*, *Paper Radio*, *Terminal Garden*.

Avoid names that are just adjectives (*Modern*, *Bold*, *Clean*). A name should imply a world.

## 8. Common concept failures

| Failure | Symptom | Fix |
|---|---|---|
| **Mood board concept** | beautiful images, no behavior | write the signature move first |
| **Tech demo concept** | shader with no argument | remove the tech; if the page dies, the concept was the tech |
| **Category cosplay** | looks like the three leaders | change two axes and the content logic |
| **One-trick concept** | hero works, page collapses | test the direction on 5 sections |
| **Nostalgia concept** | relies on a trend | ask what it means in 2029 |
| **Committee concept** | every stakeholder added something | return to the one-sentence thesis |
| **Inaccessible concept** | depends on hover/vision/motion only | design the non-visual path now |

## 9. Concept prompts by category

Use these as starting points, never as answers.

- **AI / developer tool**: the machine's reasoning made visible as a trace, not a chat bubble. Ground: terminal paper. Voice: precise mono + humanist sans. Motion: token-by-token causality.
- **Fintech**: money as time and consequence. Ground: archival ledger. Voice: tabular figures + editorial serif. Motion: numbers settle, never bounce.
- **Luxury / fashion**: restraint as power. Ground: uncoated paper or black velvet. Voice: high-contrast display. Motion: slow, sparse, one reveal.
- **Climate / science**: scale made bodily. Ground: field survey. Voice: captions and data labels. Motion: timelines and accumulation.
- **Health**: care as attention. Ground: warm clinical. Voice: humanist sans, generous leading. Motion: breathing pace, no sudden moves.
- **Culture / museum**: the exhibit is the interface. Ground: wall + label. Voice: curatorial. Motion: vitrine transitions.
- **Security**: trust as evidence. Ground: forensic dossier. Voice: redaction, footnotes. Motion: verification, not spectacle.
- **Sports**: the body as instrument. Ground: broadcast. Voice: condensed display. Motion: acceleration, impact, replay.
- **Real estate / architecture**: space as sequence. Ground: blueprint + photography. Voice: architectural mono. Motion: threshold transitions.
- **Food / hospitality**: memory through material. Ground: linen, ceramic, steam. Voice: warm editorial. Motion: service pace.

## 10. Output of Gate 1

- `.bureau/research/survey.json`: five verified references, the shared pattern and the departure (`survey.mjs --check` exits 0).
- Three directions with the template above, each with its own lineage.
- `.bureau/comps/blend.md` for the chosen direction.
- Three comps at the same viewport.
- A decision matrix with a chosen direction.
- A one-page `decision.md` naming the signature move, the technological proof, and the first three sections.
- A recorded risk: what would make us abandon this direction.

The gate passes at **≥ 3.5/5** and only if the chosen direction is ownable, legible, and buildable with the real assets.
