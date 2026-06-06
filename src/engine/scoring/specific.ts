import { EmailInput, CategoryScore } from "../types.js";

export function scoreSpecific(input: EmailInput): CategoryScore {
  let score = 1;
  const reasons: string[] = [];

  const hasNumber = /\d+/.test(input.body);

  if (hasNumber) {
    score += 2;
    reasons.push("Contains concrete numbers.");
  }

  if (input.body.length > 80) {
    score += 1;
    reasons.push("Provides additional detail.");
  }

  return {
    score: Math.min(score, 5),
    reasons,
  };
}