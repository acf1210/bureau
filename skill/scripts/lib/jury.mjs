/* @bureau-internal — independent jury validation */
export const UX_LAWS = ["aesthetic-usability-effect", "choice-overload", "chunking", "cognitive-bias", "cognitive-load", "doherty-threshold", "fitts-law", "flow", "goal-gradient-effect", "hicks-law", "jakobs-law", "law-of-common-region", "law-of-proximity", "law-of-pragnanz", "law-of-similarity", "law-of-uniform-connectedness", "mental-model", "millers-law", "occams-razor", "paradox-of-the-active-user", "pareto-principle", "parkinsons-law", "peak-end-rule", "postels-law", "selective-attention", "serial-position-effect", "teslers-law", "von-restorff-effect", "working-memory", "zeigarnik-effect"];

// The jury loop is time-boxed: rounds may be recorded for ten minutes after the loop starts;
// the decision is the best-scoring round recorded inside that window.
export const JURY_BUDGET_SECONDS = 600;

export function validateMembers(members, categories, evidenceExists) {
  const errors = [];
  if (!Array.isArray(members) || members.length < 10 || members.length > 15) return ["jury needs 10–15 members"];
  const ids = new Set();
  const specialties = new Set();
  for (const member of members) {
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
        if (!vote || !["pass", "fail", "na"].includes(vote.result)) { errors.push(`${id}: ${kind}/${key} unresolved`); continue; }
        if (kind === "categories" && vote.result === "na") errors.push(`${id}: category ${key} cannot be n/a`);
        if (typeof vote.reason !== "string" || !vote.reason.trim()) errors.push(`${id}: ${kind}/${key} needs a rationale`);
        if (typeof vote.evidence !== "string" || !vote.evidence.trim() || !evidenceExists(vote.evidence)) errors.push(`${id}: ${kind}/${key} evidence missing`);
      }
      for (const key of Object.keys(votes)) if (!required.includes(key)) errors.push(`${id}: unknown ${kind}/${key}`);
    }
  }
  return errors;
}

// Score = passing votes over applicable votes (n/a excluded), 0–100. Unanimous = no fail anywhere.
export function scoreMembers(members, categories) {
  let passes = 0;
  let applicable = 0;
  const fails = [];
  for (const member of members) {
    for (const [kind, required] of [["categories", categories], ["laws", UX_LAWS]]) {
      for (const key of required) {
        const result = member?.[kind]?.[key]?.result;
        if (result === "na") continue;
        applicable += 1;
        if (result === "pass") passes += 1;
        else fails.push(`${member?.id}: ${kind}/${key}`);
      }
    }
  }
  const score = applicable ? Math.round((passes / applicable) * 1000) / 10 : 0;
  return { score, passes, applicable, unanimous: applicable > 0 && fails.length === 0, fails };
}

export function deadline(loop) {
  const start = Date.parse(loop?.startedAt || "");
  if (!Number.isFinite(start)) return null;
  return start + (Number(loop.budgetSeconds) || JURY_BUDGET_SECONDS) * 1000;
}

// Highest score wins; a tie goes to the later round, which carries more fixes.
export function bestRound(rounds, end) {
  let best = null;
  for (const round of rounds || []) {
    if (end !== null && Date.parse(round.closedAt) > end) continue;
    if (!best || round.score >= best.score) best = round;
  }
  return best;
}

export function issueErrors(issues, evidenceExists, requireResolved) {
  const errors = [];
  if (!Array.isArray(issues)) return ["jury findings must be recorded"];
  for (const issue of issues) {
    if (!issue || typeof issue.description !== "string" || !issue.description.trim()) { errors.push("each jury finding needs a description"); continue; }
    if (issue.status !== "resolved") { if (requireResolved) errors.push("jury has unresolved findings"); continue; }
    if (typeof issue.fix !== "string" || !issue.fix.trim() || typeof issue.evidence !== "string" || !issue.evidence.trim() || !evidenceExists(issue.evidence)) errors.push("resolved finding needs description, fix and evidence");
  }
  return errors;
}

// Final check: the loop ran, its best round lies inside the time box, the delivered source is that
// round's revision, and the round's votes are complete. A best round with dissent caps the verdict.
export function validateJury(jury, categories, currentHash, evidenceExists) {
  if (!jury || typeof jury !== "object") return { errors: ["jury record missing"], best: null };
  const end = deadline(jury.loop);
  if (end === null) return { errors: ["jury loop never started (review.mjs --jury-start)"], best: null };
  if (!Array.isArray(jury.rounds) || !jury.rounds.length) return { errors: ["no jury round recorded (review.mjs --jury-round)"], best: null };
  const errors = [];
  const late = jury.rounds.filter((r) => !(Date.parse(r.closedAt) <= end));
  if (late.length) errors.push(`${late.length} round(s) recorded after the ${Math.round((end - Date.parse(jury.loop.startedAt)) / 60000)}-minute time box`);
  const best = bestRound(jury.rounds, end);
  if (!best) return { errors: [...errors, "no round inside the time box"], best: null };
  if (best.sourceHash !== currentHash) errors.push(`best round ${best.n} judged another revision; restore it or record a new round inside the time box`);
  errors.push(...validateMembers(best.members, categories, evidenceExists));
  const tally = scoreMembers(best.members || [], categories);
  if (tally.score !== best.score) errors.push(`round ${best.n} score does not match its votes`);
  errors.push(...issueErrors(best.issues, evidenceExists, tally.unanimous));
  return { errors, best, unanimous: tally.unanimous, fails: tally.fails };
}
