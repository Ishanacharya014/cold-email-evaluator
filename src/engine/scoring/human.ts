import { EmailInput, CategoryScore } from "../types.js";

export function scoreHuman(input: EmailInput): CategoryScore {
  let score = 3;
  const reasons: string[] = [];

  if (input.body.includes("I'm") || input.body.includes("you're")) {
    score += 1;
    reasons.push("Uses natural contractions.");
  }

  return {
    score: Math.min(score, 5),
    reasons,
  };
}