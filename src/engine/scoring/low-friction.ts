import { EmailInput, CategoryScore } from "../types.js";

export function scoreLowFriction(input: EmailInput): CategoryScore {
  let score = 2;
  const reasons: string[] = [];

  const body = input.body.toLowerCase();

  if (body.includes("?")) {
    score += 2;
    reasons.push("Contains a reply CTA.");
  }

  return {
    score: Math.min(score, 5),
    reasons,
  };
}