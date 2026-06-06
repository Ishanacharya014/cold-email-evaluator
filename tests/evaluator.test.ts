import { describe, expect, it } from "vitest";
import { evaluateEmail } from "../src/engine/evaluator.js";
import strongEmail from "./fixtures/strong-email.json";
import weakEmail from "./fixtures/weak-email.json";

describe("evaluateEmail", () => {
  it("scores the strong email higher than the weak email", () => {
    const strong = evaluateEmail(strongEmail);
    const weak = evaluateEmail(weakEmail);

    expect(strong.overall_score).toBeGreaterThan(weak.overall_score);
  });

  it("returns a valid full result for the strong email", () => {
    const result = evaluateEmail(strongEmail);

    expect(result.skill_version).toBe("v1.0");
    expect(result.suggestions.length).toBeGreaterThan(0);
    expect(result.rewrite.subject.length).toBeGreaterThan(0);
    expect(result.rewrite.body.length).toBeGreaterThan(0);
  });

  it("flags weak email issues", () => {
    const result = evaluateEmail(weakEmail);

    expect(result.what_to_fix.length).toBeGreaterThan(0);
    expect(result.suggestions.some((s) => s.status === "open")).toBe(true);
  });
});