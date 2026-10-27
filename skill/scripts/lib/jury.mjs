/* @bureau-internal — independent jury validation */
export const UX_LAWS = ["aesthetic-usability-effect", "choice-overload", "chunking", "cognitive-bias", "cognitive-load", "doherty-threshold", "fitts-law", "flow", "goal-gradient-effect", "hicks-law", "jakobs-law", "law-of-common-region", "law-of-proximity", "law-of-pragnanz", "law-of-similarity", "law-of-uniform-connectedness", "mental-model", "millers-law", "occams-razor", "paradox-of-the-active-user", "pareto-principle", "parkinsons-law", "peak-end-rule", "postels-law", "selective-attention", "serial-position-effect", "teslers-law", "von-restorff-effect", "working-memory", "zeigarnik-effect"];

export function validateJury(jury, categories, currentHash, evidenceExists) {
  const errors = [];
  if (!jury || typeof jury !== "object") return ["jury record missing"];
  if (jury.sourceHash !== currentHash) errors.push("jury source hash missing or stale");
  if (!Array.isArray(jury.members) || jury.members.length < 10 || jury.members.length > 15) return [...errors, "jury needs 10–15 members"];
  const ids = new Set();
  const specialties = new Set();
  for (const member of jury.members) {
    if (!member || typeof member !== "object" || Array.isArray(member)) { errors.push("invalid jury member"); continue; }
    const id = typeof member.id === "string" ? member.id.trim() : "";
    const specialty = typeof member.specialty === "string" ? member.specialty.trim().toLowerCase() : "";
    if (!id || ids.has(id)) errors.push("each juror needs a unique id");
    ids.add(id);
    if (!specialty || specialties.has(specialty)) errors.push(`${id || "juror"}: specialty must be unique`);
    specialties.add(specialty);
    if (!member.independent || typeof member.independent !== "string" || !member.independent.trim()) errors.push(`${id}: independence must be documented`);
    for (const [kind, required] of [["categories", categories], ["laws", UX_LAWS]]) {
      const votes = member[kind];
      if (!votes || typeof votes !== "object" || Array.isArray(votes)) { errors.push(`${id}: ${kind} votes missing`); continue; }
      for (const key of required) {
        const vote = votes[key];
        if (!vote || !["pass", "na"].includes(vote.result)) { errors.push(`${id}: ${kind}/${key} unresolved`); continue; }
        if (kind === "categories" && vote.result === "na") errors.push(`${id}: category ${key} must pass`);
        if (typeof vote.reason !== "string" || !vote.reason.trim()) errors.push(`${id}: ${kind}/${key} needs a rationale`);
        if (typeof vote.evidence !== "string" || !vote.evidence.trim() || !evidenceExists(vote.evidence)) errors.push(`${id}: ${kind}/${key} evidence missing`);
      }
      for (const key of Object.keys(votes)) if (!required.includes(key)) errors.push(`${id}: unknown ${kind}/${key}`);
    }
  }
  if (!Array.isArray(jury.issues)) errors.push("jury findings must be recorded");
  else for (const issue of jury.issues) {
    if (!issue || issue.status !== "resolved") { errors.push("jury has unresolved findings"); continue; }
    if (typeof issue.description !== "string" || !issue.description.trim() || typeof issue.fix !== "string" || !issue.fix.trim() || typeof issue.evidence !== "string" || !issue.evidence.trim() || !evidenceExists(issue.evidence)) errors.push("resolved finding needs description, fix and evidence");
  }
  return errors;
}
