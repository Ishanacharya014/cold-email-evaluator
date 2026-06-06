export interface Suggestion {
  id: string;
  category: "relevant" | "specific" | "clear" | "human" | "low_friction";
  status: "open" | "fixed" | "not_applicable";
  text: string;
  evidence: string;
}

export interface RewriteResult {
  subject: string;
  body: string;
  changes: string[];
}

export interface FullEvaluationResult {
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
  suggestions: Suggestion[];
  rewrite: RewriteResult;
}