# 12 — Accessibility and Inclusion

Accessibility is not a compliance layer added at the end. It is the proof that the design works for actual humans.

**Target: WCAG 2.2 AA**, with selected AAA where it matters (body contrast, captions). The bureau treats these as hard failures, not backlog items.

## 1. The four promises (POUR)

- **Perceivable** — content can be seen, heard, or felt through at least one sense.
- **Operable** — every function works with keyboard, switch, voice, or touch.
- **Understandable** — language, behavior, and errors are predictable.
- **Robust** — semantic structure survives assistive technology.

## 2. Semantics

```html
<header> ... <nav aria-label="Primary"> ... </nav> </header>
<main id="main">
  <h1>One per page</h1>
  <section aria-labelledby="proof-title">
    <h2 id="proof-title">Proof</h2>
  </section>
</main>
<footer> ... </footer>
```

- One `<h1>` per page; no skipped heading levels.
- Landmarks: `header`, `nav`, `main`, `aside`, `footer`.
- Buttons do things; links go places. Never a `<div onclick>`.
- Lists for lists; tables for tabular data with `<caption>` and `<th scope>`.
- Language: `<html lang="pt-BR">`; mark inline language changes with `lang`.
- Page title unique and descriptive: `Page — Brand`.

## 3. Keyboard

- Every interactive element reachable with Tab, in visual/DOM order.
- Visible focus at all times (`:focus-visible`, 3:1 contrast, 2 px+).
- No keyboard traps. Modals trap focus **and** release it on close, restoring the trigger.
- Escape closes overlays.
- Skip link to main content.
- Custom widgets implement expected keys (arrows, Home/End, Enter/Space).
- Drag-only interactions have a keyboard alternative (WCAG 2.5.7).

```html
<a class="skip" href="#main">Skip to content</a>
```

## 4. Color and contrast

- Body text ≥ 4.5:1; large text ≥ 3:1; UI boundaries and icons ≥ 3:1.
- Text over images: use a scrim, a solid area, or pick a crop with contrast. Test the worst pixel.
- Never use color alone to convey state (add icon, text, underline, pattern).
- Focus indicator ≥ 3:1 against both the component and the background.
- Test both themes and all states.
- `prefers-contrast: more` support is a plus.

## 5. Motion and vestibular safety

- Honor `prefers-reduced-motion` everywhere.
- No flashing above 3 Hz.
- Parallax, pinning, and autoplay video disabled in reduced motion.
- Any motion > 5 s gets a pause control (WCAG 2.2.2).
- Scroll hijacking is prohibited.
- Avoid large-area zoom/pan that can trigger nausea.

## 6. Media

- Captions for speech; transcript for audio-only.
- Audio description for visual-only information in video.
- No autoplay audio.
- Video controls keyboard accessible.
- Decorative media `aria-hidden="true"`; meaningful media has a text alternative.

## 7. Forms and errors (WCAG 2.2 additions)

- Labels programmatically associated.
- Required fields marked in text, not just color/asterisk.
- Errors: identify the field, describe the problem, suggest a fix; announced via `role="alert"` or `aria-live`.
- Do not clear input on error.
- Redundant entry: don't ask for the same information twice (3.3.7).
- Accessible authentication: allow paste/password managers; no cognitive puzzles (3.3.8).
- Consistent help: help mechanisms in the same relative place (3.2.6).

## 8. Target size and pointer

- Minimum 24×24 CSS px, or sufficient spacing (WCAG 2.5.8).
- 44×44 recommended for primary mobile actions.
- Do not rely on hover to reveal essential content.
- Pointer gestures: provide a simple alternative for multipoint/path gestures (2.5.1).
- Dragging: provide a non-drag alternative (2.5.7).

## 9. Content and cognition

- Plain language; short sentences; one idea per paragraph.
- Expand acronyms on first use.
- Consistent naming: the button that says "Start free" leads to a page that says "Start free".
- No time limits without an extension option.
- Avoid unexpected context changes on focus.
- Provide help consistently.

## 10. Responsive and zoom

- 200% text zoom without loss of content or function.
- 400% zoom reflows to a single column at 1280×1024 (WCAG 1.4.10).
- No horizontal scrolling at 320 CSS px (except data tables with a deliberate scroll region).
- Text spacing overrides do not clip content (1.4.12).
- Orientation works in both portrait and landscape (1.3.4).

## 11. Testing stack

### Automated (necessary, not sufficient)

```bash
npx axe http://localhost:3000 --exit
```

- `@axe-core/playwright` in the QA script.
- Lighthouse accessibility audit.
- Our `visual-audit.mjs` contrast and label checks.

### Manual (mandatory)

1. Tab through the entire page; note focus order and traps.
2. Use only the keyboard to complete the primary task.
3. Zoom to 200% and 400%.
4. Turn on reduced motion; reload; verify meaning survives.
5. Test with VoiceOver (macOS/iOS), NVDA (Windows), or TalkBack (Android).
6. Check the page with images disabled.
7. Check the page in grayscale.
8. Read the page aloud: does the order make sense?

### Screen reader script

- Landmarks and headings announce correctly.
- Buttons and links have distinct names.
- Form errors are announced and associated.
- Dynamic updates use live regions appropriately.
- Modals announce their title and return focus.

## 12. Common failures in "award" sites

- Custom cursor removes the pointer and breaks precision.
- Scroll-jacked narrative traps keyboard users.
- Text over video fails contrast at some frames.
- Hamburger menu has no focus trap or Escape.
- Hover-only project previews.
- `aria-hidden` on focusable elements.
- Buttons made of `<div>` with no role.
- Autoplay video with sound.
- Marquee with no pause.
- 10 px uppercase labels at 2.8:1 contrast.
- Animations ignore reduced motion.
- Form placeholders used as labels.

## 13. Gate 7 evidence

- Automated report (axe or visual audit).
- Keyboard walkthrough notes with focus screenshots.
- Reduced-motion screenshot.
- Contrast table for text roles and states.
- Screen-reader notes (at least one browser/reader pair).
- List of known exceptions with rationale and owner.

Gate 7 passes at **≥ 3.5/5** and only with zero P0 access failures.
