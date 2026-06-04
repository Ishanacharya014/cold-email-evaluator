export interface SkillManifest {
  skill_name: string;
  active_version: string;
  source_of_truth: string[];
  active_files: {
    rubric: string;
    examples: string;
    anti_examples: string;
    rewrite_rules: string;
    subject_rules: string;
  };
  versions: Record<string, string>;
  output_schema: string;
}