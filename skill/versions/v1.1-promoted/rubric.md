# Cold Email Rubric

## Purpose
This file defines how to score a cold email consistently and strictly.

The evaluator must use this rubric as the active scoring standard for the skill.

## Source of Truth
This rubric must stay aligned with:
- `SKILL.md`
- `references/cold-email-principles.md`

If the skill is updated later, the rubric may be extended in a new version, but the core five criteria must remain intact unless the version is intentionally changed.

## Core Definition
Cold outreach is a respectful one-on-one request for attention from someone who does not know you and who owes you nothing.

The goal is a reply, not a perfect essay.

## The 5 Criteria

### 1. Relevant
Does the email reach the right person?
Does it show the sender understands the recipient’s role, work, context, or situation?

Score low if:
- the email could go to almost anyone
- the recipient is clearly the wrong audience
- there is no evidence of research or tailoring

Score high if:
- the message is clearly aimed at this specific person
- it references something real about their work, role, or context
- the reason for reaching out is tied to them specifically

### 2. Specific
Does the email feel handcrafted instead of copy-pasted?

Score low if:
- it could be sent to hundreds of people without changing anything
- the offer, context, or ask is vague
- the message uses generic phrases instead of concrete details

Score high if:
- it contains concrete details
- it includes real numbers, actions, outcomes, or references
- it feels written for one person, not a blast list

### 3. Clear
Is the ask short, direct, and easy to understand?

Score low if:
- the request is buried
- there are multiple asks
- the reader has to work to understand what is being asked

Score high if:
- the message has one crisp ask
- the purpose is obvious within a few seconds
- the email is easy to skim

### 4. Human
Does the email sound like a real person wrote it?

Score low if:
- it sounds formal, robotic, or AI-generated
- it uses overly polished corporate language
- it contains unnatural phrasing or obvious AI patterns

Score high if:
- it sounds natural and conversational
- it feels like something a real person would actually send
- it avoids stiff, artificial language

### 5. Low friction
Is it easy for the recipient to respond?

Score low if:
- the ask feels expensive or complicated
- the next step is unclear
- the recipient cannot easily say yes or no

Score high if:
- the ask is small and bounded
- the response is obvious
- the recipient can answer quickly without effort

## Score Scale
Each category is scored from 1 to 5.

- 1 = very weak
- 2 = weak
- 3 = okay
- 4 = good
- 5 = excellent

## Scoring Behavior
The evaluator must:
- score only the current subject and body
- avoid using stale feedback from previous drafts
- remove suggestions that are already fixed
- avoid repeating the same suggestion if it no longer applies
- only show feedback that matches the current email

## Feedback Rules
Feedback should:
- be direct
- be practical
- explain why something is weak
- give concrete fixes
- avoid generic praise
- avoid vague coaching language

## Output Expectations
The evaluator should return structured results that include:
- overall score
- per-category scores
- what works
- what to fix
- rewritten subject line if needed
- rewrite output if requested
- evidence for suggestions when possible

## Guardrails
Do not:
- invent new scoring criteria
- weaken the rubric
- drift away from the source files
- give feedback that does not apply to the current email
- repeat fixed suggestions
- treat style preferences as more important than the rubric