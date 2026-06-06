import { loadSkill } from "../skill/skill-loader.js";
import { validateEvaluationResult } from "../schema/validator.js";
import type { EmailInput } from "./types.js";

import { scoreRelevant } from "./scoring/relevant.js";
import { scoreSpecific } from "./scoring/specific.js";
import { scoreClear } from "./scoring/clear.js";
import { scoreHuman } from "./scoring/human.js";
import { scoreLowFriction } from "./scoring/low-friction.js";

import { suggestSubject } from "./subject.js";
import { rewriteEmail } from "./rewriter.js";
import { getSuggestionStatus } from "./suggestion-status.js";

type SuggestionCategory =
  | "relevant"
  | "specific"
  | "clear"
  | "human"
  | "low_friction";

type SuggestionStatus = "open" | "fixed" | "not_applicable";

interface SuggestionItem {
  id: string;
  category: SuggestionCategory;
  status: SuggestionStatus;
  text: string;
  evidence: string;
}

interface FullEvaluationResult {
  skill_version: string;
  overall_score: number;
  verdict: string;
  scores: {
    relevant: number;
    specific: number;
    clear: number;
    human: number;
    low_friction: number;
  };
  what_works: string[];
  what_to_fix: string[];
  rewritten_subject: string | null;
  quick_tip: string;
  suggestions: SuggestionItem[];
  rewrite: {
    subject: string;
    body: string;
    changes: string[];
  };
}

function roundScore(value: number): number {
  return Math.max(1, Math.min(5, Math.round(value)));
}

function buildVerdict(score: number): string {
  switch (score) {
    case 5:
      return "Strong draft with only minor polish needed.";
    case 4:
      return "Good draft, but a few weak spots still need work.";
    case 3:
      return "Passable, but it still needs a real edit pass.";
    case 2:
      return "Weak draft with several issues that will hurt replies.";
    default:
      return "Very weak and likely to be ignored.";
  }
}

function buildSuggestion(
  input: EmailInput,
  id: "relevant-context" | "specific-details" | "clear-ask" | "human-tone" | "low-friction-ask",
  category: SuggestionCategory,
  openText: string,
  fixedText: string,
  evidenceIfOpen: string,
  evidenceIfFixed: string
): SuggestionItem {
  const status = getSuggestionStatus(input, id);

  return {
    id,
    category,
    status,
    text: status === "fixed" ? fixedText : openText,
    evidence: status === "fixed" ? evidenceIfFixed : evidenceIfOpen
  };
}

export function evaluateEmail(input: EmailInput): FullEvaluationResult {
  const skill = loadSkill();

  const relevant = scoreRelevant(input);
  const specific = scoreSpecific(input);
  const clear = scoreClear(input);
  const human = scoreHuman(input);
  const lowFriction = scoreLowFriction(input);

  const scores = {
    relevant: roundScore(relevant.score),
    specific: roundScore(specific.score),
    clear: roundScore(clear.score),
    human: roundScore(human.score),
    low_friction: roundScore(lowFriction.score)
  };

  const overall_score = roundScore(
    (scores.relevant +
      scores.specific +
      scores.clear +
      scores.human +
      scores.low_friction) / 5
  );

  const suggestions: SuggestionItem[] = [
    buildSuggestion(
      input,
      "relevant-context",
      "relevant",
      "Add a specific reason for reaching out.",
      "The email already includes recipient-specific context.",
      "No strong recipient-specific context detected.",
      "Recipient-specific context is present."
    ),
    buildSuggestion(
      input,
      "specific-details",
      "specific",
      "Add one concrete detail, number, or outcome.",
      "The email already includes concrete detail.",
      "No concrete number or outcome detected.",
      "Concrete detail is already present."
    ),
    buildSuggestion(
      input,
      "clear-ask",
      "clear",
      "Make the ask shorter and easier to scan.",
      "The ask is already easy to scan.",
      "The draft still feels longer or harder to scan than it should.",
      "The draft is short enough to scan quickly."
    ),
    buildSuggestion(
      input,
      "human-tone",
      "human",
      "Add contractions and remove stiff phrasing.",
      "The tone already sounds natural.",
      "The draft still reads a bit formal or AI-like.",
      "The tone already sounds natural and conversational."
    ),
    buildSuggestion(
      input,
      "low-friction-ask",
      "low_friction",
      "Make the next step a small yes/no ask.",
      "The ask is already low-friction.",
      "The next step still feels too open-ended or expensive.",
      "The ask is already bounded and easy to answer."
    )
  ];

  const what_works: string[] = [];
  const what_to_fix: string[] = [];

  if (scores.relevant >= 4) {
    what_works.push("It is tailored to the recipient.");
  } else {
    what_to_fix.push("Add a clear reason why this person was chosen.");
  }

  if (scores.specific >= 4) {
    what_works.push("It includes concrete detail.");
  } else {
    what_to_fix.push("Add one concrete number, outcome, or detail.");
  }

  if (scores.clear >= 4) {
    what_works.push("It is easy to skim.");
  } else {
    what_to_fix.push("Make the ask shorter and easier to understand quickly.");
  }

  if (scores.human >= 4) {
    what_works.push("It sounds natural and human.");
  } else {
    what_to_fix.push("Add contractions and remove stiff phrasing.");
  }

  if (scores.low_friction >= 4) {
    what_works.push("It is easy to reply to.");
  } else {
    what_to_fix.push("Make the next step smaller and more bounded.");
  }

  const subjectSuggestion = suggestSubject(input);
  const rewrite = rewriteEmail(input);

  const result: FullEvaluationResult = {
    skill_version: skill.version,
    overall_score,
    verdict: buildVerdict(overall_score),
    scores,
    what_works,
    what_to_fix,
    rewritten_subject: subjectSuggestion.subject,
    quick_tip:
      what_to_fix[0] ??
      "Keep the message short, concrete, and easy to answer.",
    suggestions,
    rewrite
  };

  validateEvaluationResult(result);

  return result;
}