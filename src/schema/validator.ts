import { loadEvaluationSchema } from "./evaluation-schema.js";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

export function validateEvaluationResult(result: unknown): void {
  // Ensures the schema file exists and can be parsed.
  loadEvaluationSchema();

  if (!isObject(result)) {
    throw new Error("Evaluation result must be an object.");
  }

  const requiredTopLevel = [
    "skill_version",
    "overall_score",
    "verdict",
    "scores",
    "what_works",
    "what_to_fix",
    "rewritten_subject",
    "quick_tip",
    "suggestions",
    "rewrite",
  ] as const;

  for (const key of requiredTopLevel) {
    if (!(key in result)) {
      throw new Error(`Missing required field: ${key}`);
    }
  }

  if (!isString(result.skill_version)) {
    throw new Error("skill_version must be a string.");
  }

  if (!isNumber(result.overall_score)) {
    throw new Error("overall_score must be a number.");
  }

  if (!isString(result.verdict)) {
    throw new Error("verdict must be a string.");
  }

  if (!isObject(result.scores)) {
    throw new Error("scores must be an object.");
  }

  const scoreKeys = ["relevant", "specific", "clear", "human", "low_friction"] as const;
  for (const key of scoreKeys) {
    if (!isNumber(result.scores[key])) {
      throw new Error(`scores.${key} must be a number.`);
    }
  }

  if (!isStringArray(result.what_works)) {
    throw new Error("what_works must be an array of strings.");
  }

  if (!isStringArray(result.what_to_fix)) {
    throw new Error("what_to_fix must be an array of strings.");
  }

  if (!(isString(result.rewritten_subject) || result.rewritten_subject === null)) {
    throw new Error("rewritten_subject must be a string or null.");
  }

  if (!isString(result.quick_tip)) {
    throw new Error("quick_tip must be a string.");
  }

  if (!Array.isArray(result.suggestions)) {
    throw new Error("suggestions must be an array.");
  }

  for (const suggestion of result.suggestions) {
    if (!isObject(suggestion)) {
      throw new Error("Each suggestion must be an object.");
    }

    if (!isString(suggestion.id)) {
      throw new Error("Each suggestion.id must be a string.");
    }

    if (!isString(suggestion.category)) {
      throw new Error("Each suggestion.category must be a string.");
    }

    if (!isString(suggestion.status)) {
      throw new Error("Each suggestion.status must be a string.");
    }

    if (!isString(suggestion.text)) {
      throw new Error("Each suggestion.text must be a string.");
    }

    if (!isString(suggestion.evidence)) {
      throw new Error("Each suggestion.evidence must be a string.");
    }
  }

  if (!isObject(result.rewrite)) {
    throw new Error("rewrite must be an object.");
  }

  if (!isString(result.rewrite.subject)) {
    throw new Error("rewrite.subject must be a string.");
  }

  if (!isString(result.rewrite.body)) {
    throw new Error("rewrite.body must be a string.");
  }

  if (!isStringArray(result.rewrite.changes)) {
    throw new Error("rewrite.changes must be an array of strings.");
  }
}