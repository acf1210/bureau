/* @bureau-internal — excluded from design audits */
/**
 * BUREAU deterministic design detector.
 * Regex rules cover the mechanical subset of AI-slop and basic accessibility.
 * Taste is never automated; these are tripwires.
 */

export const SEVERITY_PENALTY = { p0: 20, p1: 6, p2: 2 };

export const rules = [
  {
    id: "BS-K01",
    severity: "p1",
    category: "color",
    title: "Default purple/indigo gradient",
    why: "The 2023–2026 AI-startup gradient. It signals a default palette, not a brand.",
    fix: "Anchor the palette in a material or story (see references/05-color-pantone.md).",
    pattern: /(?:linear|radial|conic)-gradient\([^;{}]*(?:#(?:7c3aed|8b5cf6|6366f1|a855f7|ec4899|d946ef|9333ea|4f46e5)|(?:from|via|to)-(?:purple|indigo|violet|fuchsia)-[0-9]{3}|\b(?:purple|indigo|violet)\b)/i
  },
  {
    id: "BS-K02",
    severity: "p0",
    category: "color",
    title: "Gradient text",
    why: "Gradient text is the most recognizable AI-landing-page tell and often fails contrast.",
    fix: "Use a solid color, a material, or a typographic treatment instead.",
    pattern: /(?:-webkit-)?background-clip\s*:\s*text/i
  },
  {
    id: "BS-K03",
    severity: "p1",
    category: "color",
    title: "Pure black or pure white ground",
    why: "Pure endpoints flatten depth and read as an unstyled default.",
    fix: "Tint the ground and ink; recompute the dark theme instead of inverting.",
    pattern: /background(?:-color)?\s*:\s*(?:#000(?:000)?|#fff(?:fff)?|black|white)\b/i
  },
  {
    id: "BS-K04",
    severity: "p2",
    category: "color",
    title: "Glassmorphism by default",
    why: "Blur + transparency as a reflex reads as a component-library default.",
    fix: "Keep only if transparency/light is the concept; otherwise use a solid material.",
    pattern: /backdrop-filter\s*:\s*blur/i
  },
  {
    id: "BS-T02",
    severity: "p1",
    category: "type",
    title: "Default UI font used for display",
    why: "A display headline set in Inter has no voice and reads as a template.",
    fix: "Give display type its own face and role (references/04-typography.md).",
    pattern: /(?:^|[},])\s*h1[^{}]*\{[^}]*font-family\s*:[^;}]*\bInter\b/i
  },
  {
    id: "BS-T03",
    severity: "p1",
    category: "type",
    title: "Uppercase body text",
    why: "All-caps body copy is hard to read and a common 'editorial' shortcut.",
    fix: "Reserve uppercase for short labels with tracking; set prose in sentence case.",
    pattern: /(?:^|[},])\s*(?:html|body)[^{}]*\{[^}]*text-transform\s*:\s*uppercase/i
  },
  {
    id: "BS-T04",
    severity: "p2",
    skipSvg: true,
    category: "type",
    title: "Very small text",
    why: "Meaningful text below 12px fails readability and often contrast in practice.",
    fix: "Use at least 12px for metadata and 16px for prose; test at 200% zoom.",
    pattern: /font-size\s*:\s*(?:0?\.(?:[0-6]\d*)rem|(?:[0-9]|1[01])px)\b/i
  },
  {
    id: "BS-W01",
    severity: "p1",
    category: "content",
    title: "Generic marketing lexicon",
    why: "Empower/seamless/elevate/unlock/supercharge describe nothing falsifiable.",
    fix: "Replace with a concrete outcome, mechanism, and source (references/18-copy-and-truth.md).",
    textOnly: true,
    pattern: /\b(?:empower(?:ing|ed|s)?|seamless(?:ly)?|elevate|unlock(?:ing|s)?|supercharge|revolutionar(?:y|ize)|cutting-edge|next-generation|game-chang(?:er|ing)|world-class|best-in-class|transformative|synerg(?:y|ies)|leverage)\b/i
  },
  {
    id: "BS-W02",
    severity: "p0",
    category: "content",
    title: "Lorem ipsum in shipped source",
    why: "Placeholder text is not a design; it hides the real content problem.",
    fix: "Write the real copy or mark the surface as a non-shippable prototype.",
    pattern: /lorem ipsum/i
  },
  {
    id: "BS-W03",
    severity: "p1",
    category: "content",
    title: "Unsourced credibility metric",
    why: "Numbers like 99.9% uptime or 10,000+ teams are routinely invented.",
    fix: "Add a source and date in BUREAU.md, or remove the claim.",
    pattern: /\b(?:99\.9|99\.99)\s*%\s*(?:uptime|availability)|\b(?:10x|500\+|10,000\+|1M\+)\s*(?:teams|customers|users|companies)/i
  },
  {
    id: "BS-W04",
    severity: "p1",
    category: "content",
    title: "Placeholder image service",
    why: "Placeholder services leak prototype state into production.",
    fix: "Replace with an art-directed, licensed asset with dimensions and alt text.",
    pattern: /logoipsum|via\.placeholder|placehold\.co|dummyimage|placekitten/i
  },
  {
    id: "BS-W06",
    severity: "p2",
    category: "content",
    title: "Announcement cliché",
    why: "'We're excited to announce' delays the actual news.",
    fix: "Lead with what shipped and why it matters.",
    pattern: /\b(?:we(?:'|’)?re|we are)\s+(?:excited|thrilled|proud)\s+to\s+(?:announce|share|launch)/i
  },
  {
    id: "BS-I01",
    severity: "p2",
    category: "imagery",
    title: "Emoji used as UI icon",
    why: "Emoji render differently per OS and undermine a designed icon language.",
    fix: "Use a consistent custom icon set or a licensed icon library.",
    pattern: /[✨🚀🔥💡🎯⚡✅💎🌟]/u
  },
  {
    id: "BS-M02",
    severity: "p1",
    category: "motion",
    title: "transition: all",
    why: "Animating every property causes layout thrash and unpredictable motion.",
    fix: "Name the properties: transform, opacity, color, background-color.",
    pattern: /transition\s*:\s*all\b/i
  },
  {
    id: "BS-M03",
    severity: "p2",
    category: "motion",
    title: "Hover scale on every card",
    why: "A 1.05 scale is the default 'interactive' gesture and blurs text.",
    fix: "Use one interaction signature; elsewhere use a 2px lift or an edge light.",
    pattern: /:hover[^{}]*\{[^}]*scale\(\s*1\.0[5-9]/i
  },
  {
    id: "BS-M04",
    severity: "p2",
    category: "motion",
    title: "Infinite animation",
    why: "Ambient loops can distract, drain battery, and ignore user control.",
    fix: "One loop maximum; pause control; reduced-motion fallback.",
    pattern: /animation(?:-name)?\s*:[^;}]*\binfinite\b/i
  },
  {
    id: "BS-M06",
    severity: "p1",
    category: "motion",
    title: "Wheel scroll hijack",
    why: "Preventing wheel scroll breaks keyboard, trackpad, and accessibility.",
    fix: "Use sticky scenes with free scroll (references/07-motion-choreography.md).",
    pattern: /(?:addEventListener\(\s*['"]wheel['"][\s\S]{0,240}?preventDefault|onwheel\s*=\s*[^>]*preventDefault)/i
  },
  {
    id: "BS-A03",
    severity: "p0",
    category: "access",
    title: "Zoom disabled",
    why: "user-scalable=no/maximum-scale=1 blocks low-vision users from zooming.",
    fix: "Use width=device-width, initial-scale=1 only.",
    pattern: /user-scalable\s*=\s*no|maximum-scale\s*=\s*1(?:\.0)?\b/i
  },
  {
    id: "BS-A09",
    severity: "p1",
    category: "access",
    title: "Positive tabindex",
    why: "Positive tabindex breaks natural focus order.",
    fix: "Use DOM order; tabindex 0 or -1 only when justified.",
    pattern: /tabindex\s*=\s*["']?[1-9]/i
  },
  {
    id: "BS-B01",
    severity: "p1",
    category: "behavior",
    title: "Native cursor hidden",
    why: "cursor:none often produces a laggy custom cursor and hurts precision.",
    fix: "Keep the native cursor unless the replacement is precise, optional, and touch-safe.",
    pattern: /cursor\s*:\s*none/i
  },
  {
    id: "BS-B02",
    severity: "p1",
    category: "behavior",
    title: "Body scroll locked",
    why: "Locking the page scroll can trap users, especially on mobile.",
    fix: "Only within a modal with a clear close/Escape and restored scroll.",
    pattern: /(?:^|[},])\s*(?:html|body)[^{}]*\{[^}]*overflow(?:-y)?\s*:\s*hidden/i
  },
  {
    id: "BS-B04",
    severity: "p1",
    category: "behavior",
    title: "div/span as a button",
    why: "A div with onclick is invisible to keyboards and assistive technology.",
    fix: "Use <button> (or <a> for navigation).",
    pattern: /<(?:div|span)[^>]*\bonclick\s*=/i
  },
  {
    id: "BS-B08",
    severity: "p0",
    category: "behavior",
    title: "Autoplay audio",
    why: "Unexpected sound is hostile and often fails accessibility.",
    fix: "Never autoplay audio. Require an explicit play action.",
    pattern: /<audio[^>]*\bautoplay\b/i
  },
  {
    id: "BS-E01",
    severity: "p2",
    category: "engineering",
    title: "console.log in source",
    why: "Debug output left in production signals an unfinished build.",
    fix: "Remove or gate behind an explicit debug flag.",
    pattern: /console\.(?:log|debug)\s*\(/
  },
  {
    id: "BS-E02",
    severity: "p2",
    category: "engineering",
    title: "TODO/FIXME in shipped source",
    why: "Open markers in shipped code are unresolved decisions.",
    fix: "Resolve, or move to the issue tracker with an owner.",
    pattern: /\b(?:TODO|FIXME|XXX)\b/
  },
  {
    id: "BS-E03",
    severity: "p1",
    category: "engineering",
    title: "Giant inline base64 image",
    why: "Inline base64 bypasses caching and bloats HTML.",
    fix: "Use an optimized file with dimensions and responsive sources.",
    pattern: /data:image\/[a-z+]+;base64,[A-Za-z0-9+/=]{2000,}/i
  },
  {
    id: "BS-C03",
    severity: "p2",
    category: "composition",
    title: "Decorative numbered sections",
    why: "01/02/03 numbering without a real sequence is editorial costume.",
    fix: "Number only when order matters; otherwise remove the label.",
    pattern: />\s*0[1-9]\s*[\/—–-]\s*0[1-9]\s*</
  },
  {
    id: "BS-C05",
    severity: "p2",
    category: "composition",
    title: "Bento grid by default",
    why: "Bento is a layout trend, not an information architecture.",
    fix: "Use it only if content is genuinely modular and of unequal weight.",
    pattern: /class\s*=\s*["'][^"']*\bbento\b/i
  },
  {
    id: "BS-K11",
    severity: "p2",
    category: "color",
    title: "Thick side stripe",
    why: "A coloured left or right border of 2px or more on a card or callout is a component-kit tell.",
    fix: "Use a hairline, a ground shift, or typographic weight instead.",
    pattern: /border-(?:left|right)\s*:\s*(?:[2-9]|\d{2,})px\s+solid/i
  },
  {
    id: "BS-K12",
    severity: "p2",
    category: "color",
    title: "Hard offset block shadow",
    why: "A zero-blur offset shadow reads as a borrowed style unless the world is genuinely neobrutalist.",
    fix: "Shadows carry offset and blur, or depth comes from lightness steps.",
    pattern: /box-shadow\s*:\s*-?[1-9]\d*px\s+-?[1-9]\d*px\s+0(?:px)?\s+(?:-?\d+(?:px)?\s+)?(?:#|rgb|hsl|oklch|var|[a-z]+\s*[;},])/i
  },
  {
    id: "BS-W13",
    severity: "p2",
    textOnly: true,
    category: "content",
    title: "Template punctuation",
    why: "Meta strings joined with middle dots (A · B · C) are the punctuation of generated pages.",
    fix: "Use line breaks, columns, a definition list, or a sentence.",
    pattern: /[^\n·]{1,60}\s·\s[^\n·]{1,60}\s·\s/
  },
  {
    id: "BS-B11",
    severity: "p1",
    category: "behavior",
    title: "Content hidden at rest",
    why: "A reveal class at opacity 0 with no .js scope ships a blank page when the script fails.",
    fix: "Hide only under a .js class added by the script, or animate from visible.",
    pattern: /(?:^|[},])\s*\.(?:reveal|fade[\w-]*|appear[\w-]*|aos[\w-]*|animate[\w-]*|scroll-in[\w-]*)\s*\{[^}]*opacity\s*:\s*0(?![.\d])/i
  }
];

export const ruleById = new Map(rules.map((r) => [r.id, r]));

export function createMatcher(rule) {
  const flags = rule.pattern.flags.includes("g") ? rule.pattern.flags : rule.pattern.flags + "g";
  return new RegExp(rule.pattern.source, flags);
}

export function stripHtmlForText(source) {
  return String(source)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}
