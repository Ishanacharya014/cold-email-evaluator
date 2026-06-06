import { EmailInput, CategoryScore } from "../types.js";

export function scoreRelevant(input: EmailInput): CategoryScore {
  let score = 1;
  const reasons: string[] = [];

  const body = input.body.toLowerCase();

  if (body.includes("noticed") || body.includes("saw") || body.includes("read")) {
    score += 2;
    reasons.push("References recipient context.");
  }

  if (body.includes("your company") || body.includes("your team")) {
    score += 1;
    reasons.push("Mentions recipient.");
  }

  return {
    score: Math.min(score, 5),
    reasons,
  };
}