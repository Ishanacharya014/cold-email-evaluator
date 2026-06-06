import type { EmailInput } from "./types.js";

export type SuggestionStatus = "open" | "fixed" | "not_applicable";

export type SuggestionId =
  | "relevant-context"
  | "specific-details"
  | "clear-ask"
  | "human-tone"
  | "low-friction-ask";

function combinedText(input: EmailInput): string {
  return `${input.subject}\n${input.body}`.toLowerCase();
}

function sentenceCount(text: string): number {
  return text
    .split(/[.!?]+/)
    .map((part) => part.trim())
    .filter(Boolean).length;
}

function hasRecipientContext(text: string): boolean {
  return /(\bnoticed\b|\bsaw\b|\bread\b|\brecent\b|\bupdate\b|\blaunch\b|\byour team\b|\byour company\b|\byour product\b|\bafter testing\b)/i.test(
    text
  );
}

function hasSpecificDetail(text: string): boolean {
  return /(\d+|%|\$|15\s?-?\s?minute|15 min|two|three|four)/i.test(text);
}

function hasClearAsk(text: string): boolean {
  return sentenceCount(text) <= 6 && text.length <= 280;
}

function hasHumanTone(text: string): boolean {
  return /(\bI'm\b|\byou're\b|\bdon't\b|\bcan't\b|\bI've\b|\bwe're\b|\bit's\b)/.test(
    text
  ) && !text.includes("—");
}

function hasLowFrictionAsk(text: string): boolean {
  return /(\?|reply yes|worth a quick chat|quick chat|15\s?-?\s?minute|15 min|next monday|next tuesday|next wednesday|next thursday|next friday)/i.test(
    text
  );
}

export function getSuggestionStatus(
  input: EmailInput,
  suggestionId: SuggestionId
): SuggestionStatus {
  const text = combinedText(input);

  if (!text.trim()) {
    return "not_applicable";
  }

  switch (suggestionId) {
    case "relevant-context":
      return hasRecipientContext(text) ? "fixed" : "open";

    case "specific-details":
      return hasSpecificDetail(text) ? "fixed" : "open";

    case "clear-ask":
      return hasClearAsk(text) ? "fixed" : "open";

    case "human-tone":
      return hasHumanTone(text) ? "fixed" : "open";

    case "low-friction-ask":
      return hasLowFrictionAsk(text) ? "fixed" : "open";

    default:
      return "not_applicable";
  }
}