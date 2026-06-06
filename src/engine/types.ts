export interface EmailInput {
  subject: string;
  body: string;
}

export interface CategoryScore {
  score: number;
  reasons: string[];
}

export interface EvaluationResult {
  relevant: CategoryScore;
  specific: CategoryScore;
  clear: CategoryScore;
  human: CategoryScore;
  lowFriction: CategoryScore;
  overall: number;
}