---
name: cold-email-evaluator
description: >
  Evaluates cold emails using a 5-point rubric:
  relevant, specific, clear, human, and low friction.

  Use this skill whenever a user wants to:
  - review a cold email
  - rate outreach quality
  - improve a subject line
  - check whether an email will likely get replies
  - evaluate DMs or outreach messages

  The evaluator gives structured scoring and actionable feedback.
---

# Cold Email Evaluator Skill

This skill evaluates cold emails using principles adapted from
Majorana's cold outreach workshop at Founders, Inc.

The goal is not perfect writing.

The goal is:
- getting replies
- sounding human
- reducing friction
- making the ask clear
- showing relevance

---

# Evaluation Rubric

The email is scored on 5 dimensions:

1. Relevant
2. Specific
3. Clear
4. Human
5. Low friction

Each category receives a score from 1–5.

---

# When to use this skill

Use this skill when:
- a user pastes a cold email
- a user asks for outreach feedback
- a user wants subject line feedback
- a user asks "is this email good?"
- a user wants reply-rate improvement suggestions

---

# Expected Input

Input should contain:
- subject line
- email body

Example:

Subject:
Quick idea for onboarding

Body:
Hey Sarah,
...

---

# Expected Output

Return:
- overall score
- category scores
- verdict
- what works
- what to fix
- optional rewritten subject line
- quick improvement tip

---

# Scoring Logic

Read:
`references/cold-email-principles.md`

Use that file as the primary evaluation rubric.

Do not weaken or simplify the scoring criteria.

---

# Optional UI Demo

The repository includes:
`assets/evaluator.jsx`

This is an optional React demo interface showing how the evaluator can be implemented visually.

The skill itself is model-agnostic and can be used in:
- ChatGPT
- Claude
- Cursor
- local AI systems
- custom agent frameworks

---

# Feedback Style

Feedback should:
- be direct
- be practical
- explain WHY something is weak
- avoid generic praise
- identify vague or AI-generated language

---

# Important Rules

- Penalize generic outreach
- Penalize vague asks
- Penalize AI-sounding writing
- Reward specificity
- Reward clear value
- Reward authentic tone
- Reward low-friction asks