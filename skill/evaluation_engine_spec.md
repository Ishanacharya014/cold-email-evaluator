# Evaluation Engine Spec

## Purpose
This file defines how the cold email evaluator calculates scores, generates feedback, and creates rewrites.

The engine must follow the active rubric and the current skill version only.

## Inputs
The engine receives:
- subject line
- email body
- active skill version
- evaluation schema

## Output
The engine must return structured data that matches:
- `schemas/evaluation.schema.json`

The output must include:
- skill version
- overall score
- verdict
- category scores
- what works
- what to fix
- rewritten subject line
- quick tip
- structured suggestions
- rewrite output

## Scoring Rules
The engine must score each email on:
- Relevant
- Specific
- Clear
- Human
- Low friction

Each category is scored from 1 to 5.

## Scoring Behavior
The engine must:
- analyze only the current subject and body
- score based on the active rubric
- avoid using old feedback from previous drafts
- avoid hidden assumptions that are not supported by the text

## Suggestion Rules
Each suggestion must:
- have a stable id
- belong to one rubric category
- include evidence from the current draft
- have a status:
  - open
  - fixed
  - not_applicable

Suggestions must not:
- repeat if already fixed
- appear if irrelevant to the current draft
- rely on stale data
- contradict the current body or subject

## Fixed Suggestion Rules
A suggestion becomes fixed when:
- the current draft already satisfies it
- the evidence shows the weakness is no longer present

Fixed suggestions must:
- move out of the open issues list
- be marked green in the UI later
- remain visible only as historical context if needed

## Rewrite Rules
The rewrite engine must:
- use only the current draft
- preserve the original meaning
- fix only active weaknesses
- keep the rewrite short and human
- avoid inventing facts, numbers, or context
- keep strong parts intact

## Subject Line Rules
The subject suggestion system must:
- improve weak subjects only when needed
- keep good subjects unchanged
- stay aligned with the body
- remain short and natural

## Validation Rules
Before returning output, the engine must check:
- whether any suggestion is duplicated
- whether any suggestion is stale
- whether any suggestion has no evidence
- whether the output matches the schema
- whether the skill version is valid

If validation fails, the engine must not return a fake success.

## Version Rules
The engine must use the active skill version from the manifest.

It must not:
- guess a version
- merge rules from multiple versions
- silently fall back to older rules

## Guardrails
The engine must not:
- invent new rubric categories
- weaken the rubric
- drift from `SKILL.md`
- ignore `references/cold-email-principles.md`
- rely on frontend behavior
- reuse stale suggestions