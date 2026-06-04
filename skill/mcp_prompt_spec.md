# MCP Prompt Specification

## Purpose
This file defines the reusable prompts exposed by the Cold Email Skill MCP Server.

Prompts help AI clients use the skill in a consistent way without needing to guess the workflow.

## Source of Truth
The prompts must stay aligned with:
- `PRODUCT_SPEC.md`
- `skill/manifest.json`
- `skill/loader_spec.md`
- `skill/evaluation_engine_spec.md`
- `skill/mcp_tool_spec.md`
- `skill/mcp_resource_spec.md`
- `schemas/evaluation.schema.json`

## Prompt Design Rules
All prompts must:
- be reusable
- stay aligned with the active skill version
- avoid stale behavior
- reference only the current input
- produce machine-readable results when possible
- not invent rubric rules

---

## Prompt 1: evaluate_cold_email

### Purpose
Evaluate a cold email using the active skill version.

### User Input
- subject
- body

### Workflow
1. Load the active skill.
2. Score the email on the 5-point rubric.
3. Generate what works.
4. Generate what to fix.
5. Mark suggestions as open, fixed, or not_applicable.
6. Return structured output.

### Expected Result
A complete evaluation result matching the output schema.

---

## Prompt 2: rewrite_cold_email

### Purpose
Rewrite the current cold email using the latest evaluation result.

### User Input
- subject
- body
- optional evaluation result

### Workflow
1. Read the current draft.
2. Read the current evaluation.
3. Rewrite only the active weaknesses.
4. Keep the original meaning.
5. Keep the rewrite short and human.
6. Return subject and body rewrite output.

### Expected Result
A better subject line and body that fix only the current issues.

---

## Prompt 3: suggest_cold_email_subject

### Purpose
Suggest a stronger subject line if needed.

### User Input
- subject
- body

### Workflow
1. Read the current subject and body.
2. Check whether the subject is weak.
3. If weak, suggest a better one.
4. If already acceptable, keep it.

### Expected Result
A rewritten subject line or null if no change is needed.

---

## Prompt 4: explain_cold_email_score

### Purpose
Explain the score in plain language for AI clients.

### User Input
- subject
- body

### Workflow
1. Score the draft.
2. Explain each category briefly.
3. Summarize strengths and weaknesses.
4. Return a quick tip.

### Expected Result
A compact explanation of the evaluation result.

---

## Prompt 5: compare_skill_versions

### Purpose
Compare two skill versions using the same sample email.

### User Input
- version A
- version B
- sample subject
- sample body

### Workflow
1. Evaluate the sample using version A.
2. Evaluate the sample using version B.
3. Compare score differences.
4. Compare suggestion differences.
5. Show which version is stronger for the sample.

### Expected Result
A clear version comparison report.

---

## Prompt 6: check_fixed_suggestions

### Purpose
Check whether the current draft has already fixed earlier issues.

### User Input
- subject
- body
- previous suggestions if available

### Workflow
1. Re-read the current draft.
2. Compare it to the previous suggestions.
3. Mark each suggestion as open, fixed, or not_applicable.
4. Remove stale suggestions from open feedback.

### Expected Result
A clean suggestion status report.

---

## Prompt Guardrails
Prompts must not:
- invent new scoring logic
- override the rubric
- return stale feedback
- ignore the active skill version
- mutate skill content
- publish drafts
- bypass validation
- expose unpublished versions unless explicitly allowed

## Prompt Output Rules
Prompt results should:
- be concise
- be structured
- be safe for AI clients to consume directly
- remain compatible with the schema

## Notes
The prompts are the reusable workflows of the MCP server.
The tools do the actions.
The resources provide the context.
The prompts guide the task flow.