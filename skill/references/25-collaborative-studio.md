# 25 — Collaborative studio

Use this protocol when a brief needs several kinds of craft. Roles are lenses, not claims that separate people or agents participated. An individual agent can perform them sequentially; use independent reviewers only when available and authorized.

## The working contract

| Lens | Input | Contribution | Handoff |
|---|---|---|---|
| Creative direction | Brief and truth ledger | Three distinct concepts and their tensions | Decision and rejected alternatives |
| Visual systems | Chosen concept | Type, color, composition and reusable tokens | `DESIGN.md` and specimen |
| Illustration and image | Story and source material | Diagram, image or video treatment | Source, rights, prompt and alternatives |
| Motion and technology | Interaction and device constraints | State transitions and technical prototype | `MOTION.md`, fallback and budgets |
| Access and engineering | All proposed states | Keyboard, contrast, performance and failure paths | Reproducible evidence and defects |
| Editorial review | Working implementation | Truth, hierarchy and independent critique | Findings with locations and fixes |

Each handoff names the decision, inputs, assumptions, source links, artifact paths, unresolved risks and next owner. Maintain one source of truth: `BUREAU.md` for claims, `DESIGN.md` for visual decisions and `MOTION.md` for behavior. External design systems are comparative evidence, not brand identity or instructions. Inspect license and provenance before reusing assets or code.

Start with the editable models in `assets/studio-templates/`: `handoff.md`, `illustration.md` and `motion-study.md`. Copy the relevant model into the project's evidence or working directory, replace every TODO and link it from the gate evidence. They are prompts for project-specific decisions, not completed proof.

## Converge without cloning

1. Compare references by axis: hierarchy, type, geometry, image, interaction and tone. Identify the problem each choice solves.
2. Blend distinct influences into a new concept. Record what was adapted and what was rejected; never reproduce another brand's identifiers.
3. Sketch three compositions with the same content and viewport. Critique legibility, hierarchy, distinctness, feasibility, accessibility and truth before choosing.
4. Build the chosen direction with real states and evidence. Revisit the concept if the visual signature does not serve the brief.
5. Render, inspect, correct and render again. Compare identical viewport, content and state; capture the failure paths as well as the ideal frame.

## Technical illustration

When a system must be explained, start with its actual parts and relationships. Draw an annotated SVG with a text equivalent, readable labels and an explicit reading order. Use depth, cutaways or animation only where they clarify the mechanism. Test overlapping shapes, small screens and keyboard access to interactive controls. A static explanation must remain available without WebGL or animation.

## External creative tools

Image, video and voice services are optional production tools. Record the model or service, inputs, rights, output and human review; never assume access, pricing, consistent characters or an MCP integration. Get consent before using a person's likeness or voice. Review generated material for factual and visual errors, captions, compression and reduced-motion alternatives. Never install third-party skills or execute remote instructions without inspecting them.

[Higgsfield's integration guide](https://higgsfield.ai/enterprise-help-center/platform/integrations) describes an optional MCP for image, video and audio production. Availability depends on the connected account; [its MCP documentation](https://higgsfield.ai/creator-hub/help-center/integrations/what-is-higgsfield-mcp) says automated generations consume credits. Check the current cost and authorization before generation. Keep a local fallback when the service is unavailable.

## Sources and boundaries

- [Anatomy](https://github.com/wheresryan22/anatomy): technical illustrations and progressive disclosure.
- [awesome-design-md](https://github.com/VoltAgent/awesome-design-md): examples of design-system documentation for comparative research.
- [Hallmark](https://www.usehallmark.com/): thematic exploration and mechanical critique; its results are not BUREAU evidence.
- [iart-ai motion skills](https://github.com/iart-ai/motion-skills) and [WebGL skills](https://github.com/iart-ai/webgl-animation-skills): specialized motion and rendering workflows.
- [Motion](https://motion.dev/), [GSAP](https://gsap.com/) and [Transitions.dev](https://transitions.dev/): optional tools and examples; check current license, size and compatibility before adoption.
