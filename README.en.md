# BUREAU

**The autonomous digital design bureau.** An agent skill that turns a language model into creative direction, art direction, motion design, creative technology, accessibility, performance, and adversarial review.

[Português](README.md) · [English](README.en.md) · [Español](README.es.md) · [Docs](https://acf1210.github.io/bureau/en/index.html)

![BUREAU](site/assets/img/og.png)

---

## The problem

Models are trained on the average of the internet. Without direction they produce the same centered hero, the same purple gradient, the same three icon cards, the same empty copy. That is not a CSS problem. It is a lack of **concept, specificity, and review**.

- **Concept before pixels.** Three distinct directions, one argued choice, one signature move.
- **Verifiable craft.** Type, color, composition, motion, accessibility, and performance with explicit rubrics.
- **Adversarial review.** Ten independent gates and a Tribunal with veto power.
- **Zero fabrication.** Unsourced metrics, logos, quotes, or awards are P0.

---

## The circuit

```
G0 Intake → G1 Concept → G2 Direction → G3 Type & Color → G4 Composition
→ G5 Motion → G6 Engineering → G7 Access → G8 Truth → G9 Launch → TRIBUNAL
```

| Verdict | Score |
|---|---:|
| Award Track | ≥ 90 |
| Pass | 82–89 |
| Conditional | 72–81 |
| Fail | < 72 |

Any P0, any gate below 3.5/5, missing evidence, or a source changed after review **fails the release**. A 95 with one accessibility P0 is a Fail.

[Read the circuit →](docs/en/review-circuit.md)

---

## Included

| Layer | Content |
|---|---|
| **Skill** | doctrine, autonomy contract, router, hard rules, tool protocol |
| **Depth** | 23 references: concept, direction, type, Pantone/OKLCH, layout, motion, WebGL, video, image, interaction, access, performance, Figma, Playwright, circuit, anti-slop, copy, stack, references, ship, installers |
| **Scripts** | anti-slop detector, Playwright visual audit, review circuit with state, token generator, Figma sync, doctor, scaffold |
| **Templates** | 3 self-contained projects: kinetic editorial, product surface with a live demo, WebGL experience |
| **Assets** | DTCG tokens, motion snippets, generated media, detailed SVG diagrams |
| **Docs** | 9 pages × 3 languages (PT-BR, EN, ES) |
| **Installers** | Claude Code, Codex, Antigravity, Hermes; bash and PowerShell |

---

## Install

```bash
git clone https://github.com/acf1210/bureau.git
cd bureau
bash installers/install.sh --agent all --scope user --dry-run
bash installers/install.sh --agent all --scope user
```

Windows:

```powershell
powershell -ExecutionPolicy Bypass -File installers/install.ps1 -Agent all -Scope user -DryRun
powershell -ExecutionPolicy Bypass -File installers/install.ps1 -Agent all -Scope user
```

Restart the agent and run `/bureau`, or ask naturally: *"Use BUREAU to design my brand site."*

[Full install guide →](docs/en/install.md)

---

## First run

```bash
node skill/scripts/doctor.mjs
node skill/scripts/new-project.mjs my-site --template kinetic-editorial
cd my-site

node ../skill/scripts/audit.mjs . --out .bureau/evidence/audit.json
node ../skill/scripts/visual-audit.mjs http://localhost:4173 --out .bureau/qa --full --motion
node ../skill/scripts/review.mjs --status
```

[First 15 minutes →](docs/en/quickstart.md)

---

## Demos

| Demo | What it proves |
|---|---|
| [Kinetic Editorial](https://acf1210.github.io/bureau/demos/kinetic-editorial/index.html) | editorial type, index-as-argument, scroll narrative, video, time rail |
| [Product Surface](https://acf1210.github.io/bureau/demos/product-surface/index.html) | technical product, live scenario model, SVG, form, precise motion |
| [Immersive Experience](https://acf1210.github.io/bureau/demos/immersive-experience/index.html) | raw WebGL, pointer response, phase palette, static fallback |

---

## Commands

`/bureau` `auto` `init` `concept` `direction` `build` `motion` `figma` `qa` `review` `slop` `ship` `doctor`

[Command reference →](docs/en/commands.md)

---

## Anti-AI-slop

The detector covers the mechanical subset: purple gradient, gradient text, pure ground, default fonts, generic lexicon, lorem ipsum, placeholders, autoplay, accessibility overflow, `transition: all`, scroll hijack, `div onclick`, and more.

```bash
node skill/scripts/audit.mjs .
node skill/scripts/audit.mjs . --fail-on p0
node skill/scripts/audit.mjs --list-rules
```

It does not judge talent, composition, or truth. That is what the circuit is for.

[Taxonomy →](docs/en/antislop.md)

---

## Structure

```
skill/                  installable skill
  SKILL.md              router + doctrine + contract
  references/           23 modules
  scripts/              audit, visual-audit, review, tokens, figma-sync, doctor, scaffold
  assets/               templates, tokens, snippets, media, diagrams
installers/             Claude, Codex, Antigravity, Hermes + bash/PowerShell
docs/                   PT-BR, EN, ES
  assets/diagrams/      architecture, circuit, workflow, anti-slop
site/                   landing and static docs
scripts/                build-docs, capture-demos, og, serve
tests/                  node --test
```

---

## Credits

BUREAU is original. It publicly references [Impeccable](https://github.com/pbakaus/impeccable), [Colorfigures](https://april-zhu.com/colorfigures), [Font Awesome](https://github.com/FortAwesome/Font-Awesome), and the galleries in `skill/references/20-reference-library.md`.

PANTONE® is a trademark of Pantone LLC. BUREAU is not affiliated; hex values are screen approximations. Archivo, Bodoni Moda, and JetBrains Mono are OFL. The film loop was generated for this repository.

MIT. See [LICENSE](LICENSE) and [NOTICE](NOTICE.md).
