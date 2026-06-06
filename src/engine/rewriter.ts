import type { EmailInput } from "./types.js";
import { suggestSubject } from "./subject.js";

function improveBody(body: string): string {
  let result = body.trim();

  result = result.replace(
    /\bI would love to connect and discuss how we can work together\b/gi,
    "I’m reaching out because I think this may be a good fit"
  );

  result = result.replace(
    /\bI would love to connect\b/gi,
    "I’m reaching out"
  );

  result = result.replace(
    /\bPlease let me know if you have time this week\b/gi,
    "Would you be open to a quick 15-minute chat next Tuesday or Wednesday?"
  );

  result = result.replace(
    /\blet me know if useful\b/gi,
    "If useful, I can send a short teardown."
  );

  result = result.replace(
    /\bI was hoping maybe if you had the time\b/gi,
    "Would you be open to"
  );

  result = result.replace(
    /\bQuick note\b/gi,
    "Quick question"
  );

  result = result.replace(
    /\bNo pitch here\b/gi,
    ""
  );

  result = result.replace(/\n{3,}/g, "\n\n").trim();

  return result;
}

export function rewriteEmail(input: EmailInput): {
  subject: string;
  body: string;
  changes: string[];
} {
  const subjectSuggestion = suggestSubject(input);
  const finalSubject =
    (subjectSuggestion.subject ?? input.subject.trim()) || "Quick question";

  const finalBody = improveBody(input.body);

  const changes: string[] = [];

  if (finalSubject !== input.subject.trim()) {
    changes.push("Improved the subject line.");
  }

  if (finalBody !== input.body.trim()) {
    changes.push("Tightened the body copy.");
  }

  if (changes.length === 0) {
    changes.push("Kept the draft mostly intact.");
  }

  return {
    subject: finalSubject,
    body: finalBody,
    changes
  };
}