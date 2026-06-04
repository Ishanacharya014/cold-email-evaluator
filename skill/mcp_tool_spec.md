# MCP Tool Spec

## Purpose
This file defines the tools exposed by the cold email skill MCP server.

The server must use these tools as the public AI-facing interface in version 1.

## Source of Truth
The tools must follow:
- `PRODUCT_SPEC.md`
- `skill/manifest.json`
- `skill/loader_spec.md`
- `skill/evaluation_engine_spec.md`
- `schemas/evaluation.schema.json`

The skill content files remain the source of evaluation behavior.

## Tool Design Rules
All tools must:
- operate on the current input only
- avoid stale data
- return structured machine-readable output
- stay aligned with the active skill version
- fail clearly when input is invalid
- never invent missing context

## Tool 1: evaluate_email
### Purpose
Score a cold email and return structured feedback.

### Input
- subject: string
- body: string

### Output
Must match `schemas/evaluation.schema.json`.

### Behavior
- score the email on the 5 rubric categories
- generate what works
- generate what to fix
- generate suggestions with evidence
- mark suggestions as open, fixed, or not_applicable
- include the active skill version

## Tool 2: rewrite_email
### Purpose
Rewrite the current email using the latest evaluation result.

### Input
- subject: string
- body: string
- evaluation_result: object

### Output
- rewritten subject
- rewritten body
- changes made
- active skill version

### Behavior
- preserve the original meaning
- fix only active weaknesses
- do not add fake context or numbers
- keep the rewrite short and human
- avoid repeating already fixed suggestions

## Tool 3: suggest_subject
### Purpose
Suggest a stronger subject line if the current one is weak.

### Input
- subject: string
- body: string

### Output
- rewritten_subject: string or null
- reason: string
- active skill version

### Behavior
- improve only if needed
- keep good subjects unchanged
- keep the suggestion aligned with the body
- keep the subject short and natural

## Tool 4: explain_score
### Purpose
Explain the score in plain language for AI clients.

### Input
- subject: string
- body: string

### Output
- score breakdown
- short explanation for each category
- summary verdict
- quick tip
- active skill version

### Behavior
- use the active rubric only
- do not add new evaluation rules
- stay consistent with the current draft

## Tool 5: compare_versions
### Purpose
Compare two skill versions or compare two evaluations.

### Input
- version_a: string
- version_b: string
- sample_subject: string
- sample_body: string

### Output
- version differences
- score differences
- suggestion differences
- rewrite differences

### Behavior
- show how the skill changed
- help validate whether a new version is better or worse
- do not mutate any skill content

## Tool 6: validate_skill_version
### Purpose
Check whether a skill version is valid before publishing.

### Input
- version_id: string

### Output
- valid: boolean
- issues: array of strings
- notes: array of strings

### Behavior
- verify required files exist
- verify schema compatibility
- verify rubric consistency
- verify no missing required content

## Tool 7: import_knowledge
### Purpose
Import external text into a draft skill version.

### Input
- source_text: string
- source_type: string
- tags: array of strings

### Output
- imported_items: array
- draft_version_id: string
- issues: array of strings

### Behavior
- do not publish directly
- classify text into rule, example, anti-example, rewrite rule, or subject rule
- keep traceability to the source
- require review before publish

## Tool 8: create_skill_draft
### Purpose
Create a new draft skill version from the active published version.

### Input
- base_version_id: string
- changes: array of strings

### Output
- draft_version_id: string
- base_version_id: string
- summary: string

### Behavior
- duplicate the active version as a starting point
- apply only requested changes
- keep version history intact

## Tool 9: publish_skill_version
### Purpose
Publish a draft skill version.

### Input
- version_id: string

### Output
- published: boolean
- active_version_id: string
- notes: array of strings

### Behavior
- require validation first
- do not publish invalid content
- update the active version in the manifest

## Tool 10: rollback_skill_version
### Purpose
Roll back the active skill version to an earlier published version.

### Input
- version_id: string

### Output
- rolled_back: boolean
- active_version_id: string
- notes: array of strings

### Behavior
- only allow rollback to a previously published version
- do not delete history
- update the active version in the manifest

## Tool Error Rules
All tools must fail clearly when:
- required input is missing
- the active skill version is missing
- the schema is invalid
- the requested version does not exist
- the draft is not valid for publish

Error messages must be direct and specific.

## Guardrails
Tools must not:
- guess missing information
- invent evaluation outcomes
- silently change versions
- return unstructured text instead of machine-readable output
- override the rubric from the skill files
- reuse stale results