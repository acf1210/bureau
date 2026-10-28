/* @bureau-internal — motion research record validation */
export const TARGET = 5;
const text = (x) => typeof x === "string" && x.trim().length >= 12;
const url = (x) => {
  try { const u = new URL(x); return ["http:", "https:"].includes(u.protocol) && u.pathname !== "/" && !u.username && !u.password; }
  catch { return false; }
};
const date = (x) => typeof x === "string" && /^\d{4}-\d{2}-\d{2}$/.test(x) && !Number.isNaN(Date.parse(`${x}T00:00:00Z`)) && new Date(`${x}T00:00:00Z`).toISOString().slice(0, 10) === x;

export function draftMotionResearch(target = TARGET) {
  return { references: Array.from({ length: target }, () => ({ project: "", projectUrl: "", award: "", awardUrl: "", accessedAt: "", viewportAndState: "", observation: "", principle: "", avoid: "", evidence: "" })), synthesis: { sharedPattern: "", departure: "", briefConnection: "", fallback: "" } };
}

export function validateMotionResearch(data, evidenceExists, options = {}) {
  const target = Number.isInteger(options.target) && options.target >= 3 ? options.target : TARGET;
  const errors = [];
  if (!data || typeof data !== "object" || !Array.isArray(data.references)) return { errors: ["references array missing"], count: 0 };
  if (data.references.length < target) errors.push(`at least ${target} awarded projects required`);
  const projects = new Set();
  for (const [i, ref] of data.references.entries()) {
    const label = `reference ${i + 1}`;
    if (!ref || typeof ref !== "object") { errors.push(`${label}: invalid record`); continue; }
    if (typeof ref.project !== "string" || !ref.project.trim()) errors.push(`${label}: project missing`);
    if (!url(ref.projectUrl)) errors.push(`${label}: project URL must point to a page`);
    else { const key = new URL(ref.projectUrl).href.replace(/\/$/, "").toLowerCase(); if (projects.has(key)) errors.push(`${label}: duplicate project URL`); projects.add(key); }
    if (!text(ref.award) || !url(ref.awardUrl)) errors.push(`${label}: award name and evidence URL required`);
    if (!date(ref.accessedAt)) errors.push(`${label}: valid access date required`);
    for (const key of ["viewportAndState", "observation", "principle", "avoid"]) if (!text(ref[key])) errors.push(`${label}: ${key} needs a specific description`);
    if (typeof ref.evidence !== "string" || !ref.evidence.trim() || !evidenceExists(ref.evidence)) errors.push(`${label}: local observation evidence missing`);
  }
  for (const key of ["sharedPattern", "departure", "briefConnection", "fallback"]) if (!text(data.synthesis?.[key])) errors.push(`synthesis: ${key} needs a specific description`);
  return { errors, count: data.references.length };
}
