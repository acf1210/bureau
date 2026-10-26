# 21 — Ship and Evolve

A launch is a transition of state, not a party. The work is done when it can be found, measured, recovered, and improved.

## 1. Pre-launch checklist

### Truth and content
- [ ] `BUREAU.md` claims all sourced.
- [ ] No lorem ipsum, no fake logos/testimonials/metrics.
- [ ] Legal pages (privacy, terms, cookies) accurate for the jurisdictions served.
- [ ] Contact and support paths work.
- [ ] Pricing, availability, and dates correct in every locale.

### Technical
- [ ] Production build passes from a clean clone (`npm ci`).
- [ ] No console errors, failed requests, or mixed content.
- [ ] Primary action tested on production domain.
- [ ] 404 and 500 pages designed.
- [ ] Redirects for changed URLs (301).
- [ ] Sitemap + robots.txt correct.
- [ ] Canonical URLs per locale.
- [ ] Security headers set.
- [ ] No secrets in client bundles or repo history.

### Performance
- [ ] LCP ≤ 2.5 s mobile (field or lab with throttling).
- [ ] INP ≤ 200 ms; CLS ≤ 0.1.
- [ ] Images AVIF/WebP, sized, lazy below fold.
- [ ] Fonts subset/preloaded; ≤ 4 files.
- [ ] Hero video compressed, poster, muted, pausable.
- [ ] CDN + compression + cache headers.

### Access
- [ ] Keyboard path complete; focus visible.
- [ ] Contrast passes in both themes.
- [ ] Reduced motion tested.
- [ ] Forms labeled and errors announced.
- [ ] Video captions/transcript where speech matters.
- [ ] 200% and 400% zoom tested.

### Analytics and consent
- [ ] Measurement plan documented.
- [ ] Consent banner (if required) blocks non-essential scripts before consent.
- [ ] Events fire once and carry no personal data.
- [ ] Error monitoring (Sentry or equivalent) with release tags.
- [ ] Uptime/status monitoring.
- [ ] Dashboards shared with the owner.

## 2. Metadata and social

```html
<title>…</title>
<meta name="description" content="…">
<link rel="canonical" href="https://example.com/">
<meta property="og:type" content="website">
<meta property="og:title" content="…">
<meta property="og:description" content="…">
<meta property="og:image" content="https://example.com/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0A0A0B">
```

- OG image 1200×630, text legible at 400 px wide.
- No text-only OG; include the signature visual.
- Test with a real link preview (Slack, WhatsApp, X, LinkedIn).
- Favicon: SVG + 32 px PNG + apple-touch-icon.
- `manifest.webmanifest` for installable experiences.

## 3. Launch sequence

```
T−7 days   freeze content; final review gates; load test; accessibility pass
T−3 days   staging QA on production-like data; analytics validation; rollback rehearsal
T−1 day    DNS/TLS check; backup; incident contacts; comms draft
T−0        deploy; smoke test; monitor 60 min; announce
T+1 hour   check errors, LCP, conversions, support inbox
T+1 day    review field data; fix P1s; publish changelog
T+7 days   retrospective; iterate on the top metric
```

Do not launch on a Friday afternoon without a rollback plan and an on-call human.

## 4. Monitoring

- **Errors**: Sentry/GlitchTip with release, source maps, breadcrumbs.
- **Web vitals**: RUM (Vercel Speed Insights, Cloudflare, or a small beacon) for LCP/INP/CLS by route/device.
- **Availability**: external uptime check for the primary page and the primary action.
- **Business**: conversion, qualified leads, activation, support volume.
- **Consent**: verify tags do not fire before consent.

Alert thresholds should be actionable, not noisy. One alert per real failure mode.

## 5. Rollback and recovery

- Keep the previous deploy addressable.
- Feature flags for risky changes.
- Database migrations reversible or forward-only with a plan.
- Backups tested, not just scheduled.
- Incident template: impact, detection, cause, fix, prevention.
- Postmortem blameless within 5 business days.

## 6. Post-launch iteration

The first launch is a hypothesis. Iterate on evidence:

1. Watch the primary metric for 7 days.
2. Watch field vitals for 14 days.
3. Read support conversations and session recordings (with consent).
4. Run a 5-user test on the primary task.
5. Fix the highest-friction step, not the prettiest detail.
6. Re-run the review circuit for material changes.

### What to iterate first

| Signal | Likely fix |
|---|---|
| High bounce on hero | offer clarity, LCP, headline specificity |
| CTA clicks but no conversion | expectation mismatch, form friction, trust |
| Low scroll depth | first fold too heavy, no reason to continue |
| High mobile INP | third-party JS, long tasks |
| Support repeats one question | microcopy or info architecture |
| Low demo plays | affordance, contrast, label |
| High exit on pricing | missing objection handling, hidden costs |

## 7. Design system evolution

- Tokens are versioned (`tokens@1.2.0`).
- Component changes require a visual regression baseline update.
- Deprecate, don't delete silently.
- Document decisions in `DESIGN.md` and a changelog.
- Re-run Gate 3/4 after a system change.

## 8. Content operations

- Who can edit what; approval flow.
- Localization workflow and review.
- Image guidelines (crop, grade, alt).
- Claims review (legal/compliance) before publishing.
- Archive policy for outdated pages (redirect, don't 404).

## 9. Changelog voice

Write changelogs for humans:

```markdown
## 1.4.0 — 2026-10-26
### Added
- The project index now filters by year and sector, with keyboard support.
### Changed
- Hero video replaced by an AVIF sequence; mobile LCP down from 3.8s to 1.9s.
### Fixed
- Focus lost after closing the mobile menu.
```

No "misc improvements". Name the change and the effect.

## 10. The evolution loop

```
Measure → Diagnose → Hypothesize → Design → Build → Review → Ship → Measure
```

Keep the loop small. One hypothesis per iteration. One metric per hypothesis. One week per loop when possible.

## 11. Retirement

Sites die. Plan for it:

- Archive content with a clear status.
- Redirect high-value URLs.
- Keep the design source and tokens in the repo.
- Publish a final changelog.
- Remove analytics and third parties.

A graceful ending is part of the craft.
