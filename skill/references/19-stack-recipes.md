# 19 — Stack Recipes

Choose the smallest stack that can carry the concept. The stack is not the identity.

## 1. Decision table

| Situation | Stack | Why |
|---|---|---|
| Marketing site, 1–8 pages, motion-heavy | **Astro** + islands | static speed, selective hydration, view transitions |
| Content site with editors | **Astro + CMS** (Sanity, Contentful, Directus, Decap) | static output + structured content |
| Product app / dashboard | **Next.js** (App Router) or **SvelteKit** | routing, server components, auth |
| Highly interactive marketing + app | **Next.js** | shared components, RSC, ecosystem |
| Single immersive experience | **Vite + vanilla TS** (or Three.js) | smallest payload, full control |
| Docs | **Astro Starlight** or plain MDX | search, nav, i18n built in |
| Commerce | **Shopify Hydrogen** or Next + commerce API | cart/checkout primitives |
| Multi-tenant / edge personalization | **Next.js on edge** or Astro + edge middleware | request-time variation |

Avoid adding a framework to a one-page site. A 60 KB vanilla page will beat a 300 KB hydrated one on every metric that matters.

## 2. Vanilla (the reference implementation)

```
index.html
styles/
  tokens.css
  base.css
  layout.css
  components.css
  motion.css
scripts/
  main.js
  motion.js
  scene.js        (dynamic import)
assets/
  fonts/
  img/
  video/
```

Rules:

- Semantic HTML first.
- CSS layers: `@layer reset, tokens, base, layout, components, utilities, motion`.
- ES modules; no bundler until you need one.
- Dynamic-import heavy scenes.
- Keep JS under 30 KB for a marketing page.

```css
@layer reset, tokens, base, layout, components, utilities, motion;

@layer tokens { :root { /* ... */ } }
@layer base { *, *::before, *::after { box-sizing: border-box; } }
```

## 3. Astro

```bash
npm create astro@latest my-site -- --template minimal
cd my-site
npm install
```

```
src/
  layouts/Base.astro
  pages/index.astro
  components/Hero.astro
  components/Motion.astro
  styles/tokens.css
public/
  fonts/ img/ video/
```

- Use `.astro` for static structure; hydrate only interactive islands (`client:visible`).
- Use `<ViewTransitions />` for cross-page transitions.
- Content collections for structured copy.
- `@astrojs/sitemap` + `@astrojs/i18n` for locales.
- Keep the design system in CSS custom properties, not in component props.

```astro
---
import Base from "../layouts/Base.astro";
import Hero from "../components/Hero.astro";
---
<Base title="…" description="…">
  <Hero />
</Base>
```

## 4. Next.js (App Router)

```bash
npx create-next-app@latest my-site --ts --app --tailwind=false --eslint
```

```
app/
  layout.tsx
  page.tsx
  globals.css
  (marketing)/...
  (app)/dashboard/...
components/
  ui/...
  motion/...
lib/
  tokens.ts
public/
```

- Server Components for static content; Client Components only for interaction.
- `next/font` with self-hosted or Google fonts; subset Latin.
- `next/image` with AVIF/WebP and explicit sizes.
- Route groups for marketing vs app.
- `generateMetadata` for OG/Twitter; `alternates` for locales.
- Middleware only when needed (auth, geo, A/B).
- Avoid client-side data fetching for above-the-fold content.

```tsx
export const metadata = {
  title: "…",
  description: "…",
  openGraph: { images: ["/og.png"] },
  alternates: { canonical: "/", languages: { "pt-BR": "/pt-br", "en-US": "/en", "es-ES": "/es" } }
};
```

## 5. SvelteKit

- `+page.svelte`, `+layout.svelte`, `+page.server.ts`.
- `adapter-static` for marketing; `adapter-node`/`adapter-vercel` for app.
- Svelte transitions are excellent for local UI; use CSS for scroll.
- `svelte:head` for metadata.
- Keep stores small; prefer props and context.

## 6. Styling

| Approach | Use when |
|---|---|
| **CSS custom properties + layers** | default; maximum control, zero runtime |
| **Tailwind CSS v4** | large teams, utility discipline; define tokens in `@theme` |
| **CSS Modules** | component-scoped CSS in React/Next |
| **Vanilla Extract / Linaria** | typed styles at build time |
| **styled-components / Emotion** | legacy; avoid for new work |

Rules:

- Tokens are the source of truth; utilities consume tokens.
- No arbitrary values in production (`mt-[13px]`) without a reason.
- Component variants, not one-off overrides.
- Dark mode via tokens and `[data-theme]`, not duplicated classes.

## 7. Motion stack

| Need | Library |
|---|---|
| CSS scroll-driven reveals | native |
| Complex timelines / pinning | GSAP + ScrollTrigger |
| React layout/gesture | Motion (Framer Motion) |
| Smooth scroll | Lenis (sparingly) |
| 3D | Three.js / R3F |
| State-machine characters | Rive |
| Page transitions | View Transitions API / GSAP |
| Data viz animation | D3 + CSS/Canvas |

One motion system per project. Do not mix GSAP, Framer Motion, and Anime.js on the same page.

## 8. Content and i18n

- **CMS**: Sanity (structured, real-time), Contentful (enterprise), Directus (self-host), Decap (git-based), Payload (code-first).
- **i18n**: `astro-i18n` / `next-intl` / `svelte-i18n`; JSON or YAML dictionaries; locale routing; `hreflang`.
- **Copy**: keep strings in the repo for small sites; CMS for editors.
- **Images**: alt text and captions are content, not metadata afterthoughts.

## 9. Forms and email

- Server action / API route with validation (Zod).
- Honeypot + rate limit; avoid CAPTCHA where possible.
- Transactional email via Resend/Postmark/SES.
- Store consent and timestamp.
- Confirm to the user what happens next.

```ts
const schema = z.object({
  email: z.string().email(),
  message: z.string().min(10).max(2000),
  consent: z.literal(true)
});
```

## 10. Analytics and consent

- Privacy-first default: Plausible, Fathom, Umami, or self-hosted.
- GA4 only with consent mode and a real cookie banner.
- Track outcomes, not vanity: CTA clicks, form starts/completions, demo plays, scroll depth at 25/50/75/100.
- No personal data in event names.
- Document the measurement plan in `BUREAU.md`.

## 11. Deployment

| Host | Best for |
|---|---|
| Vercel | Next.js, previews, edge |
| Netlify | Astro/static, forms, edge functions |
| Cloudflare Pages | static + workers, global edge |
| Fly.io / Railway | Node services, WebSocket |
| GitHub Pages | docs and static showcases (no server) |

Checklist:

- [ ] Build reproducible (`npm ci`, lockfile committed).
- [ ] Env vars documented; no secrets in the repo.
- [ ] Preview deploy per PR.
- [ ] Cache headers correct.
- [ ] Redirects for changed URLs.
- [ ] Error monitoring (Sentry or equivalent).
- [ ] Rollback plan (previous deploy, feature flag).
- [ ] Domain, TLS, HSTS, security headers.

## 12. Security headers

```
Content-Security-Policy: default-src 'self'; img-src 'self' data: https:; media-src 'self' https:; style-src 'self' 'unsafe-inline'; script-src 'self'
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

Adjust for the actual third parties. Do not ship `unsafe-eval`.

## 13. Stack anti-patterns

- A 400 KB React app for a static landing page.
- Three animation libraries.
- A CMS for five pages that change twice a year.
- Client-side rendering the hero.
- 12 Google Fonts weights.
- A component library dropped in without art direction.
- A build that only works on the original author's machine.
- `latest` tags without a lockfile.
