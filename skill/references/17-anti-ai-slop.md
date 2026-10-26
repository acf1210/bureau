# 17 — Anti-AI-Slop

AI-generated design has a fingerprint. This file names it, so the bureau can remove it.

**Slop budget: zero.** A single P0 tell can define the whole page.

## 1. What slop is

Slop is not "made by AI". It is **the average of the internet, reproduced without a decision**. It happens when a model (or a rushed human) reaches for the most statistically likely layout, palette, phrase, and motion instead of the most specific one.

The cure is not "more design". The cure is **specificity**: a real subject, a real constraint, a real point of view.

## 2. The three-second slop test

Show the first viewport for three seconds. Ask:

1. Could this be any AI startup from 2023–2026?
2. Is the brand identifiable without the logo?
3. Is there one element that could only belong to this subject?
4. Does the copy say something falsifiable or specific?
5. Is the motion doing a job, or performing "premium"?

Three or more "no" answers → the page is slop, regardless of polish.

## 3. The taxonomy

### A. Composition tells

| ID | Tell | Why it reads as AI | Fix |
|---|---|---|---|
| BS-C01 | Centered eyebrow pill → H1 → gray subtitle → two buttons → abstract visual | The default LLM hero | Commit to a composition: object, stage, split argument, index, or live proof |
| BS-C02 | Three equal icon cards in a row | The default feature model | Use a hierarchy, a comparison, a ledger, a sequence, or one deep proof |
| BS-C03 | Numbered sections 01/02/03 with no meaning | Decorative editorialism | Number only if order matters, or remove |
| BS-C04 | Bento grid because it is trendy | Layout as fashion | Use it only if the content is genuinely modular and of unequal weight |
| BS-C05 | Every section the same height and rhythm | No density map | Vary density and scale; give each band one job |
| BS-C06 | Cards nested in cards | Container reflex | Flatten; use lines, spacing, and typographic hierarchy |
| BS-C07 | 24 px radius on everything | Component-library default | Choose a radius family tied to the world |
| BS-C08 | Everything centered, nothing aligned to a spine | No composition decision | Introduce a dominant column and asymmetric weight |
| BS-C09 | Giant footer wordmark + four link columns | Template ending | Make the footer a closing argument, not a sitemap dump |
| BS-C10 | Full-screen hero with CTA below the fold | Cinematic reflex | Compose the fold as a complete thought |

### B. Type tells

| ID | Tell | Fix |
|---|---|---|
| BS-T01 | Space Grotesk + Inter (or Inter + Inter) | Choose a display face with a voice; keep Inter only as body if justified |
| BS-T02 | Display uses the default UI font | Give display its own role and face |
| BS-T03 | All-caps micro-labels above every section | Use labels only where they add information |
| BS-T04 | Body text at 11–12 px | 16 px minimum for prose; 12 px only for metadata |
| BS-T05 | 8 unrelated font sizes | Use the type scale; remove orphans |
| BS-T06 | Gradient text on the headline | Never; use color or material instead |
| BS-T07 | 100ch paragraphs on desktop | Cap at 65–75ch |
| BS-T08 | Fake "editorial" serif with no editorial content | Either do editorial structure or pick another voice |
| BS-T09 | Light-weight gray body on white | Increase contrast and weight |
| BS-T10 | Display type set with default tracking and leading | Tighten display; open body |

### C. Color tells

| ID | Tell | Fix |
|---|---|---|
| BS-K01 | Purple/indigo → pink/blue gradient as the brand | Start from a material/story; use the Pantone reference as an anchor |
| BS-K02 | Gradient text | Never |
| BS-K03 | Pure `#000` ground and `#fff` text | Tint both; recompute contrast |
| BS-K04 | Glassmorphism + glow + grain as the "premium" recipe | Pick one material and commit |
| BS-K05 | Six accent colors with no roles | 5–7 semantic roles; one accent |
| BS-K06 | Accent used 10 times above the fold | ≤ 3 intentional uses |
| BS-K07 | Gray-on-color without contrast check | Test every state |
| BS-K08 | Dark mode as a simple inversion | Recompute surfaces, ink, accent, borders |
| BS-K09 | Random mesh gradient blob | Use a concept-driven field, or none |
| BS-K10 | Rainbow data palette | Colorblind-safe, labeled, role-based |

### D. Motion tells

| ID | Tell | Fix |
|---|---|---|
| BS-M01 | Uniform fade-up-on-scroll for every section | One entrance sequence, then quiet |
| BS-M02 | `transition: all` | Animate named properties |
| BS-M03 | Hover scale 1.05 on every card | One interaction signature; subtle lifts elsewhere |
| BS-M04 | Infinite ambient loops with no pause | One loop max; pause control; reduced motion |
| BS-M05 | Parallax on every layer | One depth story, capped |
| BS-M06 | Scroll hijacking | Never; use sticky scenes with free scroll |
| BS-M07 | `prefers-reduced-motion` ignored | Design the reduced mode |
| BS-M08 | Autoplay video with audio | Muted, inline, pausable; audio opt-in |
| BS-M09 | Motion that delays interaction | Never block the CTA |
| BS-M10 | Cursor that lags or hides the native pointer | Optional, precise, touch-safe |

### E. Content tells

| ID | Tell | Fix |
|---|---|---|
| BS-W01 | "Empower", "seamless", "elevate", "unlock", "supercharge", "revolutionary", "cutting-edge", "next-generation" | Replace with a concrete outcome and a number |
| BS-W02 | Lorem ipsum | Never in a shipped page |
| BS-W03 | "Trusted by 10,000+ teams" with no source | Remove or source it |
| BS-W04 | "99.9% uptime" with no status page | Link the evidence or cut it |
| BS-W05 | Fake testimonial with a stock face | Use a real quote with consent, or no testimonial |
| BS-W06 | "We're excited to announce" | Say what shipped and why it matters |
| BS-W07 | Three adjectives in a row ("fast, secure, scalable") | One specific claim + proof |
| BS-W08 | A CTA that says "Get started" on every page | Name the action: "Book a 20-min audit" |
| BS-W09 | Copy that describes the category, not the product | Describe the mechanism and the outcome |
| BS-W10 | Emoji as feature bullets | Use icons with a system, or no icons |
| BS-W11 | "AI-powered" with no explanation | Explain the model's job in the workflow |
| BS-W12 | Placeholder company names (Acme, Nexus, Vertex) | Use the real brand or a clearly labeled prototype |

### F. Imagery tells

| ID | Tell | Fix |
|---|---|---|
| BS-I01 | Emoji as product icons | Custom icons or a curated set |
| BS-I02 | Unsplash random / `source.unsplash.com` | Art-directed, licensed assets |
| BS-I03 | AI plastic skin / impossible hands / fake text | Regenerate, crop, or composite |
| BS-I04 | Generic dashboard screenshot with identical bar charts | Build a real product view or a diagram |
| BS-I05 | Fake logos of invented companies | Remove or use real customers with permission |
| BS-I06 | Stock "team high-five" / "handshake" | Documentary images or none |
| BS-I07 | Gold + marble + orchid = luxury | Material, type, and restraint |
| BS-I08 | Grain/glass/glow applied globally | One material, used with intent |
| BS-I09 | 3D blob with no relation to the product | A 3D object that explains the product |
| BS-I10 | Images of text that should be live text | Set it in HTML |

### G. Engineering/behavior tells

| ID | Tell | Fix |
|---|---|---|
| BS-E01 | `console.log` left in production | Remove or gate behind debug |
| BS-E02 | TODO/FIXME in shipped source | Resolve or ticket |
| BS-E03 | Giant base64 images inline | Use optimized files |
| BS-E04 | `!important` everywhere | Fix specificity |
| BS-E05 | 5+ font families | 2 + mono |
| BS-E06 | No viewport meta | Add it |
| BS-E07 | No `lang` attribute | Add the correct locale |
| BS-E08 | Images without dimensions | Reserve space |
| BS-E09 | Broken links / 404 primary action | Test the path |
| BS-B01 | `cursor: none` with no accessible replacement | Keep the native cursor |
| BS-B02 | Body scroll locked | Never without a modal reason |
| BS-B03 | Wheel/touch preventDefault for narrative | Free scroll |
| BS-B04 | `div onclick` as a button | Use `<button>` |
| BS-B05 | Marquee with no pause | Pause on hover/focus + reduced motion |
| BS-B06 | Hover-only essential content | Make it focusable/visible |
| BS-B07 | Focus outline removed | Replace, never remove |
| BS-B08 | Autoplay audio | Never |
| BS-B09 | Fake loading screens to look "cinematic" | Load fast; show real progress |
| BS-B10 | `target="_blank"` without `rel` | Add `noopener` |

## 4. Copy: the slop lexicon

Replace vague elevation with concrete consequence.

| Slop | Write instead |
|---|---|
| Empower your team | Give your ops lead a 10-minute close |
| Seamless integration | Syncs with HubSpot in one OAuth step; no CSV |
| Elevate your brand | Rebuild the identity in 6 weeks, with a working design system |
| Unlock insights | See which 3 accounts are about to churn, this morning |
| Supercharge workflows | Cut the invoice run from 4 hours to 12 minutes |
| Next-generation platform | Runs on Postgres 16; deploys in 90 seconds |
| Cutting-edge AI | A retrieval model that cites the source paragraph |
| Revolutionary approach | We removed the approval step; here is what replaced it |
| Trusted by industry leaders | [Real logos, with permission] + one named case study |
| World-class support | 2-hour response, Monday–Friday, by a human engineer |

Rules:

- One claim per sentence.
- Prefer verbs to adjectives.
- Numbers need sources.
- Name the mechanism.
- Read it aloud; if a person would not say it, rewrite it.

## 5. The cure: specificity

Specificity is the antidote to every tell:

- **Specific subject** → a composition that could only be about this.
- **Specific constraint** → a layout that solves a real problem.
- **Specific material** → a palette that is not the default.
- **Specific voice** → type and copy that sound like someone.
- **Specific proof** → numbers, demos, screenshots, sources.
- **Specific detail** → a 404 page, a loading state, a keyboard path.

Ask at every section: *what here could only exist for this brand?* If the answer is "the logo", the section is generic.

## 6. Detector

```bash
node scripts/audit.mjs .
node scripts/audit.mjs . --json --out .bureau/evidence/audit.json
node scripts/audit.mjs . --fail-on p0
```

The detector covers the mechanical subset (code-level patterns, missing alt, slop lexicon, fake placeholders, autoplay issues, etc.). It cannot judge composition or taste. It is a **tripwire**, not a critic.

Rules:

- Do not suppress a finding unless it is a proven false positive.
- If suppressed, add a comment: `<!-- bureau-ignore BS-K01: brand-mandated gradient, approved in DESIGN.md -->`.
- A P0 finding blocks Gate 8 until fixed or explicitly accepted by the Tribunal with a written reason.

## 7. The slop review (human)

For each section, answer:

1. What is the one idea?
2. Why this layout, not the default?
3. What is the evidence?
4. What would a competitor have to change to use this?
5. What would we remove if we had to cut 30%?

If the answers are weak, the section is not ready.

## 8. Exceptions

Some "tells" are legitimate when they are the concept:

- A purple gradient can be right for a brand whose subject is synthetic light. It must be specific, controlled, and not the default mesh.
- A three-card grid can be right if the content is genuinely three equal choices. It still needs hierarchy and craft.
- A dark theme can be right; it must be lit, not inverted.
- A custom cursor can be right; it must be precise, optional, and accessible.
- A centered hero can be right; the type and material must earn it.

The rule is not "never use a pattern". The rule is **never use it without a reason you can defend in public**.

## 9. Gate 8 evidence

- `audit.json` with zero unresolved P0.
- `copy-review.md` with the claims and sources.
- Screenshots of every section.
- A list of every exception with its rationale.
- A final read of the page as a stranger.

Gate 8 passes at **≥ 3.5/5** and only with zero P0 slop findings.
