# Cold Email Evaluator

An open-source AI skill for evaluating cold emails using a 5-point rubric:

- Relevant
- Specific
- Clear
- Human
- Low friction

Inspired by principles from Majorana's cold outreach workshop at Founders, Inc.

---

# What This Project Does

This repository provides:

- A reusable AI skill (`SKILL.md`)
- A detailed cold outreach rubric (`references/cold-email-principles.md`)
- Example evaluation cases (`examples/`)
- An optional React demo UI (`assets/evaluator.jsx`)

The goal is to help AI systems evaluate cold emails realistically instead of giving vague or overly positive feedback.

---

# Core Philosophy

Good cold outreach should:

- sound human
- feel specific
- reduce friction
- make the ask clear
- show relevance

The goal is not perfect writing.

The goal is getting replies.

---

# Rubric

The evaluator scores emails on:

| Category | Description |
|---|---|
| Relevant | Tailored to the recipient |
| Specific | Feels handcrafted |
| Clear | Easy to understand |
| Human | Sounds natural |
| Low friction | Easy to reply to |

Each category receives a score from 1–5.

---

# Repository Structure

```txt
cold-email-evaluator/
├── SKILL.md
├── README.md
├── LICENSE
├── .gitignore
├── references/
│   └── cold-email-principles.md
├── examples/
│   ├── weak-email.md
│   └── strong-email.md
└── assets/
    └── evaluator.jsx


# Cold Email Evaluator

A public AI-assisted website that evaluates cold emails using a 5-point rubric:
- Relevant
- Specific
- Clear
- Human
- Low friction

The project uses AI-assisted web development and is open-source friendly.
