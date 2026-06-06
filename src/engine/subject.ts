import type { EmailInput } from "./types.js";

export interface SubjectSuggestion {
  subject: string | null;
  reason: string;
}

function isGenericSubject(subject: string): boolean {
  const value = subject.trim().toLowerCase();

  return (
    value === "quick note" ||
    value === "checking in" ||
    value === "quick question" ||
    value === "no pitch here" ||
    value === "follow up" ||
    value === "follow-up" ||
    value === "just wanted to reach out" ||
    value === "any plans at x?"
  );
}

export function suggestSubject(input: EmailInput): SubjectSuggestion {
  const current = input.subject.trim();
  const body = input.body.toLowerCase();

  if (current && current.length <= 50 && !isGenericSubject(current)) {
    return {
      subject: null,
      reason: "Subject is already short enough and not obviously generic."
    };
  }

  if (body.includes("onboarding")) {
    return {
      subject: "Quick question about onboarding",
      reason: "It matches the body and stays specific."
    };
  }

  if (body.includes("drop-off") || body.includes("drop off")) {
    return {
      subject: "Quick idea to reduce drop-off",
      reason: "It matches the main outcome mentioned in the email."
    };
  }

  if (body.includes("billing")) {
    return {
      subject: "Quick question about billing",
      reason: "It is short and aligned with the body."
    };
  }

  if (body.includes("emails") || body.includes("email")) {
    return {
      subject: "Quick question about the emails",
      reason: "It stays close to the message and is easy to scan."
    };
  }

  if (body.includes("demo")) {
    return {
      subject: "Quick question about the demo",
      reason: "It reflects the topic without sounding generic."
    };
  }

  return {
    subject: "Quick question",
    reason: "The current subject is weak, generic, or missing."
  };
}