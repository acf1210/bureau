# 14 — Figma Workflow

Figma is the bureau's drawing board and contract. The goal is not "pixel-perfect handoff"; it is **one visual truth** shared by design and code.

## 1. Connect Figma to the agent

Two supported paths:

### A. Remote Figma MCP (preferred)

- Server URL: `https://mcp.figma.com/mcp`
- Authenticate with a Figma account that can view the file.
- Add it to the host's MCP configuration (Claude, Codex, Antigravity, Hermes, or any MCP client).

Example (generic JSON; field names vary by host):

```json
{
  "mcpServers": {
    "figma": {
      "type": "http",
      "url": "https://mcp.figma.com/mcp"
    }
  }
}
```

### B. Local Dev Mode MCP server

- Open the file in Figma Desktop.
- Enable the Dev Mode MCP server (Figma menu → Preferences/Dev Mode).
- Local endpoint: `http://127.0.0.1:3845/mcp`.
- Best for private files and offline-ish work; requires the desktop app and Dev Mode.

Tool names and payloads change between server versions. **Discover the available tools first**, then read capabilities. Do not hard-code a tool name in an automation that must survive updates.

Typical capabilities:

- read the current selection / node tree,
- export a screenshot or asset,
- read variables and styles,
- generate code or design-system rules from a frame,
- read metadata (names, sizes, positions).

### C. Fallback: exported artifacts

If MCP is unavailable:

1. Export the frame as PNG/PDF at 2×.
2. Export variables/tokens as JSON (Tokens Studio, Figma Variables export, or a plugin).
3. Export SVGs for icons/logos.
4. Place them in `.bureau/comps/` or `design/`.
5. State the limitation in the review evidence.

Never pretend you inspected a file you could not access.

## 2. File structure

```
00 — Cover
01 — Foundations
     Color / Type / Grid / Spacing / Motion / Elevation
02 — Components
     Primitives / Forms / Navigation / Cards / Data
03 — Patterns
     Hero / Pricing / Testimonial / FAQ / Footer
04 — Pages
     Desktop / Tablet / Mobile
05 — Comps (directional)
06 — Archive
```

Rules:

- One file per product surface; one page per breakpoint family.
- Name frames `Page / Section / State / Viewport`.
- Use Auto Layout everywhere; no absolute positioning for content.
- Components have properties, not duplicate variants.
- Variables drive color, spacing, radius, and type. No raw hex in frames.
- Modes: `Light`, `Dark`, `High contrast` (if supported).
- Annotate the signature move and motion timing on the frame.

## 3. Variables and tokens

Define variables in Figma:

```
color/ground
color/surface
color/ink
color/ink-muted
color/accent
color/accent-ink
color/line
color/focus
space/1..11
radius/sm|md|lg
type/display-1|body|micro
motion/duration-1..5
```

Then export/sync to the code token file. The mapping must be **one-to-one by role**, not by hex.

```json
{
  "color": {
    "ground": { "$type": "color", "$value": "#F0EEE9" },
    "ink": { "$type": "color", "$value": "#161616" }
  },
  "space": {
    "4": { "$type": "dimension", "$value": "16px" }
  }
}
```

Run:

```bash
node scripts/figma-sync.mjs --in design/figma-variables.json --out design/tokens.json
node scripts/tokens.mjs --in design/tokens.json --check
```

The sync script accepts W3C Design Tokens and common Tokens Studio exports; it resolves aliases and reports unresolved references.

## 4. Directional comps in Figma

For Gate 1:

1. Create three frames at 1440×900, side by side on one page.
2. Use real headlines, real product, real proof.
3. Keep the same content across all three so the comparison is honest.
4. Add a fourth frame: the signature moment (not the hero).
5. Add a fifth: mobile 390×844.
6. Label each: thesis, signature move, risk.
7. Present all three together; never one at a time (anchoring bias).

Do not build a full design system before choosing a direction. Foundations are cheap; components are expensive.

## 5. Design-to-code loop

```
Figma frame
  → screenshot (reference)
  → variables/tokens
  → code (real components)
  → Playwright screenshot at same viewport
  → side-by-side diff
  → fix the largest deviation
  → repeat
```

Rules:

- Compare at the **same viewport, same DPR, same content, same state**.
- Compare the first viewport and the signature moment first.
- Pixel differences are evidence, not the goal; optical differences matter more.
- Never "fix" a Figma mismatch by changing the design silently.
- If code and Figma disagree, decide which is the source of truth and update the other. Usually code wins after build starts; Figma wins before.

## 6. Code Connect / component mapping

If the team uses Code Connect or a similar mapping:

- Map Figma components to real code components, not to HTML snippets.
- Keep prop names aligned (`variant`, `size`, `state`).
- Document slots and content rules.
- Re-run mapping when component APIs change.

If not, write a short `design/COMPONENT-MAP.md` with the same information.

## 7. Assets

- Export SVG for logos, icons, and diagrams.
- Export 2× PNG only when transparency/raster is required.
- Optimize SVGs (SVGO) and remove editor metadata.
- Name assets by role, not by layer (`icon-arrow.svg`, not `Vector-12.svg`).
- Keep a source folder and a shipped folder.
- Respect licenses for fonts, images, and icons.

## 8. Fidelity checklist

- [ ] Variables used for every color/space/type value.
- [ ] Auto Layout on all content frames.
- [ ] Components have properties, not duplicate variants.
- [ ] Desktop, tablet, mobile frames exist.
- [ ] States: default, hover, focus, active, disabled, loading, error, empty.
- [ ] Signature move annotated with timing and trigger.
- [ ] Reduced-motion frame exists.
- [ ] Real content, no lorem ipsum.
- [ ] Screenshot compared side by side with code.
- [ ] Assets exported and optimized.

## 9. Anti-patterns

- "Figma is the source of truth" while code diverges for months.
- 47 detached components.
- Raw hex values in frames.
- One desktop frame and "make it responsive" as a note.
- Hover states drawn but not keyboard focus.
- A motion spec that says "smooth".
- Exporting 4× PNGs for a 200 px icon.
- Using Figma as a screenshot generator for an AI build.

## 10. Gate 2/3 evidence

- Figma screenshot at 1440 and 390.
- Exported variables/tokens and a diff against code tokens.
- Side-by-side code screenshot.
- A list of intentional deviations with reasons.
- The signature-move annotation.
