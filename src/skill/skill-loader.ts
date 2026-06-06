import { loadManifest } from "./manifest-loader.js";
import { readFile } from "../utils/files.js";
import { LoadedSkill } from "./skill-types.js";

export function loadSkill(): LoadedSkill {
  const manifest = loadManifest();

  return {
    version: manifest.active_version,

    rubric: readFile(
      manifest.active_files.rubric
    ),

    examples: readFile(
      manifest.active_files.examples
    ),

    antiExamples: readFile(
      manifest.active_files.anti_examples
    ),

    rewriteRules: readFile(
      manifest.active_files.rewrite_rules
    ),

    subjectRules: readFile(
      manifest.active_files.subject_rules
    )
  };
}