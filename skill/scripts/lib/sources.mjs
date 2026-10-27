/* @bureau-internal — reference source registry and survey validation */

// The 25 requested references. `status` records whether the name resolves to one service:
// identified (checked origin), probable (a likely match that the researcher must confirm),
// unidentified (no single service; skipped by the survey until someone identifies it).
export const SOURCES = [
  { id: "awwwards", name: "Awwwards", origin: "https://www.awwwards.com", status: "identified", needs: ["interactive", "landing", "editorial"], lens: "visual" },
  { id: "fwa", name: "FWA", origin: "https://thefwa.com", status: "identified", needs: ["interactive", "experimental"], lens: "interaction" },
  { id: "css-design-awards", name: "CSS Design Awards", origin: "https://www.cssdesignawards.com", status: "identified", needs: ["interactive", "landing"], lens: "interaction" },
  { id: "siteinspire", name: "SiteInspire", origin: "https://www.siteinspire.com", status: "identified", needs: ["editorial", "minimal", "portfolio"], lens: "structure" },
  { id: "godly", name: "Godly", origin: "https://godly.website", status: "identified", needs: ["interactive", "experimental", "landing"], lens: "visual" },
  { id: "behance", name: "Behance", origin: "https://www.behance.net", status: "identified", needs: ["portfolio", "editorial"], lens: "visual" },
  { id: "dribbble", name: "Dribbble", origin: "https://dribbble.com", status: "identified", needs: ["product", "portfolio"], lens: "visual" },
  { id: "mobbin", name: "Mobbin", origin: "https://mobbin.com", status: "identified", needs: ["product", "saas"], lens: "flow" },
  { id: "landbook", name: "Landbook", origin: "https://land-book.com", status: "identified", needs: ["landing", "saas", "portfolio"], lens: "structure" },
  { id: "minimal-gallery", name: "Minimal Gallery", origin: "https://minimal.gallery", status: "identified", needs: ["minimal", "editorial", "portfolio"], lens: "visual" },
  { id: "lapa-ninja", name: "Lapa Ninja", origin: "https://www.lapa.ninja", status: "identified", needs: ["landing", "saas"], lens: "structure" },
  { id: "one-page-love", name: "One Page Love", origin: "https://onepagelove.com", status: "identified", needs: ["landing", "portfolio", "editorial"], lens: "structure" },
  { id: "curated-design", name: "Curated Design", origin: "https://curated.design", status: "identified", needs: ["landing", "editorial", "saas"], lens: "structure" },
  { id: "saasframe", name: "SaaSFrame", origin: "https://www.saasframe.io", status: "identified", needs: ["saas", "product"], lens: "flow" },
  { id: "saas-landing-page", name: "SaaS Landing Page", origin: "https://saaslandingpage.com", status: "identified", needs: ["saas", "landing"], lens: "flow" },
  { id: "dark-mode-design", name: "Dark Mode Design", origin: "https://www.darkmodedesign.com", status: "identified", needs: ["dark", "interactive"], lens: "visual" },
  { id: "brutalist-websites", name: "Brutalist Websites", origin: "https://brutalistwebsites.com", status: "identified", needs: ["experimental", "editorial"], lens: "visual" },
  { id: "hover-states", name: "Hover States", origin: "https://www.hoverstat.es", status: "identified", needs: ["interactive", "experimental"], lens: "interaction", note: "Requested as \"Pintura / Hover Statues\"; the requester confirmed Hover States (hoverstat.es) on 2026-10-27." },
  { id: "ui-sources", name: "UI Sources", origin: "https://www.uisources.com", status: "identified", needs: ["product"], lens: "flow", note: "Redirected to ScreensDesign when checked; verify identity and terms." },
  { id: "refero", name: "Refero", origin: "https://refero.design", status: "identified", needs: ["product", "saas"], lens: "flow" },
  { id: "ux-archive", name: "UX Archive", origin: "https://uxarchive.com", status: "probable", needs: ["product"], lens: "flow", note: "The domain answered with a Cloudflare error page on 2026-10-27; treat as unavailable until it serves content." },
  { id: "goodbrief", name: "Goodbrief", origin: "https://goodbrief.io", status: "identified", needs: ["practice"], lens: "structure", note: "Generates fictional briefs; never counts as an observed shipped pattern." },
  { id: "canvas", name: "Canvas", origin: null, status: "unidentified", needs: ["experimental"], lens: "visual", note: "The name is ambiguous; identify the intended product before use." },
  { id: "webflow-showcase", name: "Webflow Showcase", origin: "https://webflow.com/made-in-webflow", status: "identified", needs: ["landing", "interactive", "portfolio"], lens: "interaction" },
  { id: "layers", name: "Layers", origin: "https://layers.to", status: "identified", needs: ["interactive", "portfolio"], lens: "visual" }
];

export const NEEDS = ["general", "landing", "saas", "interactive", "product", "editorial", "minimal", "dark", "experimental", "portfolio"];
export const LENSES = ["visual", "interaction", "structure", "flow"];
export const SURVEY_TARGET = 5;
const byId = new Map(SOURCES.map((s) => [s.id, s]));

// Sources that fit the need come first, then the rest in registry order, so a fallback
// always has somewhere to go. Unidentified names and practice generators are queued as skipped.
export function surveyQueue(need = "general") {
  if (!NEEDS.includes(need)) throw new Error(`Unknown need "${need}". Use one of: ${NEEDS.join(", ")}`);
  const fit = need === "general" ? SOURCES : SOURCES.filter((s) => s.needs.includes(need));
  const rest = SOURCES.filter((s) => !fit.includes(s));
  return [...fit, ...rest].map((s) => {
    if (s.status === "unidentified") return { source: s.id, status: "skipped", reason: `Unidentified: ${s.note}` };
    if (s.needs.includes("practice")) return { source: s.id, status: "skipped", reason: "Practice brief generator; it shows no shipped work to observe." };
    return { source: s.id, status: "pending" };
  });
}

const filled = (value, min = 12) => typeof value === "string" && value.trim().length >= min;

// A survey closes with five verified references from five different sources, taken in queue order:
// every source ahead of the last verified one is verified or skipped with a reason (no silent cherry-picking).
export function validateSurvey(survey) {
  const errors = [];
  if (!survey || typeof survey !== "object" || !Array.isArray(survey.queue)) return ["survey record missing or has no queue"];
  const seen = new Set();
  let lastVerified = -1;
  survey.queue.forEach((entry, i) => {
    const source = byId.get(entry?.source);
    if (!source) { errors.push(`queue[${i}]: unknown source "${entry?.source}"`); return; }
    if (seen.has(source.id)) errors.push(`${source.id}: listed twice`);
    seen.add(source.id);
    if (entry.status === "verified") lastVerified = i;
  });
  const verified = [];
  survey.queue.forEach((entry, i) => {
    const source = byId.get(entry?.source);
    if (!source) return;
    if (entry.status === "pending" && i < lastVerified) errors.push(`${source.id}: still pending ahead of a verified source; verify it or skip it with a reason`);
    if (entry.status === "skipped" && !filled(entry.reason, 20)) errors.push(`${source.id}: a skip needs the reason it could not be verified (20+ characters)`);
    if (entry.status === "verified") {
      if (source.status === "unidentified") errors.push(`${source.id}: unidentified sources cannot be verified until identified`);
      if (source.needs.includes("practice")) errors.push(`${source.id}: a generated brief is not an observed reference`);
      let url;
      try { url = new URL(entry.url); } catch { errors.push(`${source.id}: project url missing or invalid`); }
      if (url && source.origin && url.href.replace(/\/$/, "") === source.origin) errors.push(`${source.id}: cite the project page, not the gallery home`);
      if (!/^\d{4}-\d{2}-\d{2}/.test(entry.accessedAt || "")) errors.push(`${source.id}: accessedAt must be an ISO date`);
      if (!LENSES.includes(entry.lens)) errors.push(`${source.id}: lens must be one of ${LENSES.join(", ")}`);
      for (const field of ["observation", "principle", "avoid"]) if (!filled(entry[field])) errors.push(`${source.id}: ${field} needs a specific sentence`);
      verified.push({ ...entry, source: source.id });
    } else if (!["pending", "skipped"].includes(entry.status)) errors.push(`${source.id}: status must be pending, skipped or verified`);
  });
  if (verified.length < SURVEY_TARGET) errors.push(`${verified.length}/${SURVEY_TARGET} sources verified; move to the next source in the queue`);
  const lenses = new Set(verified.map((v) => v.lens));
  if (verified.length >= SURVEY_TARGET && lenses.size < 3) errors.push(`verified references cover ${lenses.size} lens(es); at least 3 of ${LENSES.join(", ")}`);
  const s = survey.synthesis || {};
  const ids = new Set(verified.map((v) => v.source));
  if (!filled(s.pattern, 20)) errors.push("synthesis.pattern: name the convention the references share");
  if (!Array.isArray(s.patternSources) || new Set(s.patternSources.filter((id) => ids.has(id))).size < 3) errors.push("synthesis.patternSources: at least 3 verified sources must show the pattern");
  if (!filled(s.creative, 20)) errors.push("synthesis.creative: name the constructive departure this project makes from the pattern");
  if (!filled(s.avoid, 20)) errors.push("synthesis.avoid: name what none of the references may lend (identity, code, imagery, copy)");
  return { errors, verified: verified.length, lenses: [...lenses] };
}
