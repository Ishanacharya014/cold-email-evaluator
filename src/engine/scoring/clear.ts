import { EmailInput, CategoryScore } from "../types.js";

export function scoreClear(input: EmailInput): CategoryScore {
  let score = 3;
  const reasons: string[] = [];

  if (input.body.length < 250) {
    score += 1;
    reasons.push("Short and easy to read.");
  }

  return {
    score: Math.min(score, 5),
    reasons,
  };
}