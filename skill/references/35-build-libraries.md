# 35 — Build libraries: styling, components, behaviour

`19-stack-recipes.md` chooses the framework. This file chooses what sits on it: the styling layer, the component layer and the behaviour layer. A library carries a default look; the bureau's job is to keep its engineering and remove its face. If a stranger can name the kit from a screenshot, the page has template drift (BS-C11) and fails the slop test (`17-anti-ai-slop.md`).

## 1. Three layers, one choice each

| Layer | Question | Default |
|---|---|---|
| Styling | How do tokens reach elements? | CSS custom properties and `@layer` (`19` §6) |
| Components | Who owns keyboard, focus, ARIA and state for dialogs, menus, tabs, comboboxes? | A headless primitive library, styled with the project's tokens |
| Behaviour | What moves or reacts? | CSS and the Web Animations API; a library only for what they cannot do (`07`, `31`) |

One library per layer. Two component kits or two motion engines on one page is an anti-pattern (`19` §13). None of these is a BUREAU dependency: they are project choices, recorded in `.bureau/config.json` (`stack`) with the reason. Versions and licences below were read from npm on 2026-10-27; check them again at install.

## 2. Styling layer

| Library | npm · licence | Use when | Watch |
|---|---|---|---|
| **Open Props** | `open-props` 1.x · MIT | Vanilla or Astro sites that want a ready scale of custom properties (sizes, easings, shadows) without a look | Import only the props used; rename or alias into the project's semantic tokens so `DESIGN.md` stays the source |
| **Tailwind CSS** | `tailwindcss` 4.x · MIT | Teams that work in markup and keep utility discipline | Define every token in `@theme`; the default palette and `rounded-xl shadow-lg` are the AI-SaaS face. No arbitrary values without a reason |
| **Bootstrap** | `bootstrap` 5.x · MIT | Internal tools and admin panels where speed and familiarity beat identity | Its default theme is instantly recognisable: replace the Sass variables (colour, type, radius, spacing) or keep it off marketing surfaces |
| **Bulma** | `bulma` 1.x · MIT | Small teams that want a readable flexbox grid and CSS-only components | No JavaScript: you write and test behaviour (menus, modals) yourself; theme through its CSS variables |
| **DaisyUI** | `daisyui` 5.x · MIT | Tailwind projects that want semantic component classes (`btn`, `card`) | Its built-in themes are another kit face; author one theme from the project tokens |

## 3. Component layer

Prefer headless primitives: they own accessibility and state, and leave every pixel to the direction. Styled kits suit dense product UI where consistency matters more than an ownable surface.

| Library | npm · licence | Kind | Use when | Watch |
|---|---|---|---|---|
| **Radix UI** (Primitives) | `radix-ui` 1.x · MIT | Headless, React | Dialogs, menus, popovers, tabs with tested keyboard and focus behaviour | Style every state (`data-state`, `data-highlighted`); do not ship unstyled focus |
| **Ark UI** | `@ark-ui/react`, `/vue`, `/solid` 5.x, `/svelte` · MIT | Headless, multi-framework (state machines from Zag.js) | One component behaviour across products built on different frameworks | Version lines differ per framework; pin each |
| **shadcn/ui** | `shadcn` CLI · MIT | Copied source (Radix or Base UI + Tailwind), owned by the project | React projects that want primitives already wired and editable | Copied code is yours to maintain. The stock zinc palette, radius and card are the most common AI-built look of 2024–2026: restyle before the first comp |
| **Chakra UI** | `@chakra-ui/react` 3.x · MIT | Styled, React (v3 builds on Ark UI) | Product UI composed from props with a theme system | Write the theme from `DESIGN.md`; its runtime styling costs bundle and INP |
| **Material UI** | `@mui/material` 9.x · MIT | Styled, React, Material Design | Products that must follow Material Design, data-heavy apps | Material is Google's identity: use it when that is the brief, not by default |
| **HeroUI** (formerly NextUI) | `@heroui/react` 3.x · MIT | Styled, React + Tailwind | Fast product screens with built-in transitions | `@nextui-org/react` is deprecated; migrate. Its default motion and blur are a recognisable kit look |
| **Vuetify** | `vuetify` 4.x · MIT | Styled, Vue, Material-based | Vue apps with dense data: tables, forms, dashboards | Same identity caveat as Material UI; tree-shake components |

## 4. Behaviour layer

| Library | npm · licence | Use when | Watch |
|---|---|---|---|
| **Alpine.js** | `alpinejs` 3.x · MIT | Small interactions on static or server-rendered pages: disclosure, tabs, toggles | Markup-driven state grows hard to follow; past a few components, move to islands. Content must exist without it (P0: content hidden without JavaScript) |
| **Motion** (formerly Framer Motion) | `motion` 14.x · MIT | React or vanilla component, layout and gesture motion with springs | `framer-motion` still publishes the same version; new code imports `motion`. Springs need a reduced-motion variant |
| **GSAP** | `gsap` 3.x · GSAP Standard "no charge" licence (not OSI open source) | Timelines, scroll pinning, scrubbed sequences, SVG and text choreography | Read the Standard Licence for the project's use; kill ScrollTriggers on route change; never hijack scroll without a keyboard path (P0) |

## 5. Pre-production: choose

At G0, write in `.bureau/config.json` the library per layer and a one-line reason tied to the brief: team, framework, surface (marketing, product, internal), budget. At G2, map `DESIGN.md` tokens into the library's theme entry point (`@theme`, Sass variables, CSS variables, theme object) before the first component. A comp built on a kit's defaults is not a direction.

## 6. Post-production: verify

| Check | Gate | How | Pass when |
|---|---|---|---|
| The kit's face is gone | G4 | `divergence.mjs --templates`; the slop test on the first viewport | ≤ 0.35; nobody names the kit |
| Tokens only | G3 | `audit.mjs`; search for default palette classes, arbitrary values and theme colours not in `DESIGN.md` | No orphan colour, radius or shadow |
| Keyboard, focus, ARIA | G7 | `visual-audit.mjs` and a manual keyboard path through each primitive | Every state styled; no trap; names present |
| Reduced motion | G5, G7 | `visual-audit.mjs --motion` | Motion and GSAP sequences have a designed reduced state |
| Weight | G6 | Build output, gzip | Initial JS ≤ 250 KB (app shell 400); unused components and plugins removed |

Record the results in `.bureau/evidence/stack.md`.

## Limits

A library speeds up construction; it does not supply a concept, a type voice or a signature move. Accessibility claimed by a library is a starting point, not evidence: test the rendered page. Licences, names and versions change; the table is a record of 2026-10-27, not a guarantee.
