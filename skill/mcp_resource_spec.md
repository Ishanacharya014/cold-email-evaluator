# MCP Resource Specification

## Purpose

This file defines all MCP resources exposed by the Cold Email Skill MCP Server.

Resources are read-only knowledge sources available to AI clients.

Resources must reflect the currently active skill version.

---

## Resource Design Rules

Resources must:

- be read-only
- be version aware
- stay aligned with the active skill
- never expose stale draft content
- never expose unpublished changes

---

## Resource: active_rubric

### Purpose

Provide the current scoring rubric.

### Source

skill/active/rubric.md

### Contents

- Relevant
- Specific
- Clear
- Human
- Low friction

---

## Resource: examples

### Purpose

Provide positive examples.

### Source

skill/active/examples.md

### Contents

- strong cold emails
- expected scores
- explanation of strengths

---

## Resource: anti_examples

### Purpose

Provide weak examples.

### Source

skill/active/anti_examples.md

### Contents

- poor cold emails
- expected scores
- explanation of weaknesses

---

## Resource: rewrite_rules

### Purpose

Provide rewriting guidance.

### Source

skill/active/rewrite_rules.md

---

## Resource: subject_rules

### Purpose

Provide subject line guidance.

### Source

skill/active/subject_rules.md

---

## Resource: active_version

### Purpose

Provide metadata about the current active skill version.

### Source

skill/manifest.json

### Contents

- version
- status
- creation date
- notes

---

## Resource: changelog

### Purpose

Provide version history.

### Source

skill/changelog.md

---

## Resource: schema

### Purpose

Provide evaluation output structure.

### Source

schemas/evaluation.schema.json

---

## Validation Rules

Resources must:

- exist
- be readable
- match the active version

If validation fails:

- return an error
- do not fabricate content

---

## Guardrails

Resources must not:

- expose unpublished drafts
- expose deleted versions
- expose incomplete files
- expose stale content