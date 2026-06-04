# Skill Loader Spec

## Purpose
This file defines how the cold email skill should be loaded by the evaluator engine.

The loader must always use the active skill version and the current skill files declared in the manifest.

## Source of Truth
The loader must read:
- `skill/manifest.json`
- `skill/active/rubric.md`
- `skill/active/examples.md`
- `skill/active/anti_examples.md`
- `skill/active/rewrite_rules.md`
- `skill/active/subject_rules.md`
- `skill/versions/<active_version>/`
- `schemas/evaluation.schema.json`

The original files in the repository remain source material, but the loader must rely on the manifest and active skill files for runtime behavior.

## Load Order
The loader must follow this order:

1. Read `skill/manifest.json`
2. Read `active_version`
3. Load the active skill files from `skill/active/`
4. Validate the output schema in `schemas/evaluation.schema.json`
5. Load the matching version folder in `skill/versions/<active_version>/`
6. Use the loaded skill content to evaluate the email

## Required Files
The loader must fail if any of these are missing:
- `skill/manifest.json`
- `skill/active/rubric.md`
- `skill/active/examples.md`
- `skill/active/anti_examples.md`
- `skill/active/rewrite_rules.md`
- `skill/active/subject_rules.md`
- `schemas/evaluation.schema.json`

## Version Rules
The loader must only use the version declared in `skill/manifest.json`.

If the active version is missing, invalid, or incomplete:
- stop execution
- return a clear error
- do not invent a fallback

## Skill Behavior Rules
When loading the skill, the evaluator must preserve these rules:
- use the 5-point rubric
- score only the current subject and body
- avoid stale suggestions
- avoid duplicate suggestions
- mark suggestions as open, fixed, or not_applicable
- keep rewrites grounded in the current draft
- keep subject suggestions aligned with the body

## Validation Rules
Before evaluation, the loader must verify:
- the manifest is valid JSON
- the active version exists
- the schema file exists
- the required skill files exist
- the active files are readable

If validation fails, the loader must not continue.

## Output Contract
The loader must make the schema available to the evaluator engine so that every result follows the same structured format.

## Guardrails
The loader must not:
- guess missing content
- silently fall back to another version
- merge unrelated rules from old drafts
- override the rubric with UI behavior
- ignore the manifest