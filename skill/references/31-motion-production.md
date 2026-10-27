# 31 — Motion production from awarded references

For animation, 2D or 3D, sound and video, start from the actual brief and study at least five distinct awarded projects before approving G5. This complements the general five-source survey; it does not replace it. A project can appear in both records only if its separate motion observations and award evidence are documented. No reference grants permission to reproduce protected assets, identity or code.

## 1. Brief and five-project study

Record audience, purpose, output (interactive web, video, or both), content, states, duration, aspect ratios, accessibility, performance and distribution. Establish the job of each movement before selecting technology. Create a blank record:

```bash
node "$BUREAU_DIR/scripts/motion-research.mjs" --init
```

For each of five distinct projects, inspect the actual project or an authorized recording, identify the exact award and link to its source, date the visit, and save observation evidence locally. Record viewport and state, timing and trigger, what the movement communicates, a transferable principle and what must not be copied. A listed award or a reachable URL is not proof of usability, speed or commercial performance. If a reference cannot be inspected or its award confirmed, do not count it; select another. Do not present examples below as the project's completed research.

Starting points: [Finely Crafted](https://www.awwwards.com/sites/finely-crafted), [Kaleidoz](https://www.awwwards.com/sites/kaleidoztm-design-website), [Oat the Goat](https://www.awwwards.com/sites/oat-the-goat), [My Little Storybook](https://www.awwwards.com/sites/my-little-storybook), [Rhythm of Nature](https://www.awwwards.com/sites/rhythm-of-nature). Their Awwwards pages identify award entries; access and live behavior can change. Verify each before use.

Synthesize a shared pattern, a project-specific departure, a connection to the brief and a static or reduced-motion fallback. No single reference dictates the design. Then check the record from the project root:

```bash
node "$BUREAU_DIR/scripts/motion-research.mjs" --check
node "$BUREAU_DIR/scripts/motion-research.mjs" --plan
```

The checker verifies record structure, five unique project URLs, award citations, dates, descriptions and existing local evidence. `--plan` turns a complete record into `.bureau/research/motion-plan.md` with the cited principles, synthesis and production decisions to complete; it refuses to overwrite an existing plan. Neither command fetches pages, authenticates an award, assesses visual originality or verifies observations; an independent reviewer must do those things. G5 and final review reject missing or incomplete research. The record uses `.bureau/research/motion.json`; evidence paths resolve from the project root. Do not put confidential material in public artifacts.

## 2. Tool selection

Choose the minimum tools justified by the brief, stack, measured cost and current license. The following are optional project tools, not BUREAU dependencies or a mandate to install packages. Inspect their own documentation and license, including media, model weights and plugins; terms and commercial conditions can change.

| Need | Candidate | Appropriate use |
|---|---|---|
| React video | [Remotion](https://github.com/remotion-dev/remotion) | Frame-based compositions and deterministic video rendering. |
| HTML video | [HyperFrames](https://github.com/heygen-com/hyperframes) | Render HTML-based compositions; verify version and rendering support. |
| Timeline | [Anime.js](https://github.com/juliangarnier/anime) | Coordinated JavaScript motion. |
| Springs | [React Spring](https://github.com/pmndrs/react-spring) | Interruptible, spring-based React interactions. |
| GPU 2D | [PixiJS](https://github.com/pixijs/pixijs) | Rich interactive 2D scenes. |
| Generative 2D | [p5.js](https://github.com/processing/p5.js) | Creative coding and generative sketches. |
| Vector paths | [Paper.js](https://github.com/paperjs/paper.js) | Canvas-based vector geometry. |
| 2D physics | [Matter.js](https://github.com/liabru/matter-js) | Rigid-body interaction and simulation. |
| 3D scenes | [Three.js](https://github.com/mrdoob/three.js) | Cameras, geometry, materials and scene rendering. |
| Physics | [Rapier](https://github.com/dimforge/rapier) | 2D or 3D rigid bodies and collisions. |
| WebGL | [OGL](https://github.com/oframe/ogl) | Minimal WebGL scenes and shaders. |
| Particles | [tsParticles](https://github.com/tsparticles/tsparticles) | Configurable particle effects. |
| 3D assets | [glTF Transform](https://github.com/donmccurdy/glTF-Transform) | Inspect and optimize glTF assets. |
| Shader transitions | [GL Transitions](https://github.com/gl-transitions/gl-transitions) | Research transition shaders; check individual licensing. |
| Capture | [OBS Studio](https://github.com/obsproject/obs-studio) | Record real interactive behavior for review. |
| Voice | [Chatterbox](https://github.com/resemble-ai/chatterbox) | Optional generated speech; inspect model terms and obtain voice consent. |
| Web audio | [Tone.js](https://github.com/Tonejs/Tone.js) | User-initiated interactive sound. |
| Transcription | [faster-whisper](https://github.com/SYSTRAN/faster-whisper) | Draft transcripts; review and correct captions. |
| Editing | [OpenCut](https://github.com/OpenCut-app/OpenCut) | Timeline editing when compatible with the workflow. |
| Encoding | [FFmpeg](https://github.com/FFmpeg/FFmpeg) | Encode, inspect and deliver media; check codec build and licenses. |

## 3. Build, render and verify

1. Write `MOTION.md`: purpose, states, trigger, timing, easing or spring parameters, interruption, audio consent, fallback and budgets. Prototype the smallest representative sequence.
2. Implement in the existing stack. Keep content available without JavaScript. Pause loops off-screen and in hidden tabs, handle teardown and context loss, and respect reduced motion. Audio starts only after explicit interaction; controls and captions remain accessible.
3. For interactive work, capture the same viewport and states before and after changes, inspect keyboard, touch, reduced motion, no-JavaScript and failure paths, then measure on relevant devices. A screenshot does not establish frame rate.
4. For video, specify duration, dimensions, frame rate, color, safe area, audio levels and delivery codec; render a review file, inspect beginning, transitions and end, correct and render again. Include captions or transcript when speech conveys meaning; verify synchronization and rights.
5. Deliver source, reproducible commands, asset and license ledger, rendered output, evidence, limitations and the G5 decision. Do not claim a performance or award result that was not observed.
