# Cold Email Rewrite Rules

## Purpose
This file defines how the evaluator should rewrite a cold email after scoring it.

The rewrite must improve the email without changing its meaning, inventing context, or drifting away from the active skill rules.

## Source of Truth
The rewrite engine must stay aligned with:
- `SKILL.md`
- `references/cold-email-principles.md`
- the active rubric
- the current evaluation result

If the skill changes later, rewrite behavior may be updated in a new version, but the current version must remain internally consistent.

## Rewrite Goal
A good rewrite should:
- preserve the original intent
- improve relevance where possible
- increase specificity
- make the ask clearer
- sound more human
- reduce friction
- remove weak or artificial phrasing

The rewrite should not become overly polished, salesy, or generic.

## Rewrite Principles

### 1. Rewrite only what is actually weak
Do not rewrite parts of the email that are already strong.

If the draft already has:
- a clear ask
- a natural tone
- good specificity
- a good subject line

then keep those parts unless the evaluation says they are weak.

### 2. Keep the original meaning
The rewrite must not:
- change the offer
- change the intent
- invent a new company
- invent a new trigger event
- invent fake numbers or results
- add claims that were not supported by the draft

### 3. Use the current draft only
The rewrite must use:
- the current subject line
- the current body
- the current evaluation result

Do not reuse stale suggestions from older versions of the email.

### 4. Address active issues first
If the email is weak in a category, fix that category directly.

Examples:
- If relevance is weak, add real context only if the draft supports it.
- If specificity is weak, add concrete details or tighten the language.
- If clarity is weak, shorten and simplify the ask.
- If human tone is weak, remove robotic phrasing and make it sound natural.
- If low friction is weak, make the next step smaller and easier.

### 5. Avoid over-rewriting
Do not make the email longer than needed.

A rewrite should usually:
- remove unnecessary words
- sharpen the opening
- clarify the ask
- make the response easier

Do not add extra paragraphs unless needed.

### 6. Keep the tone natural
The rewrite should sound like a real person wrote it.

Avoid:
- buzzwords
- corporate filler
- stiff phrasing
- overly formal sentence structure
- AI-sounding language
- em-dashes if they are unnecessary

### 7. Make the ask unmistakable
The rewritten email should make it obvious:
- who is being contacted
- why they are being contacted
- what is being asked for
- what the recipient gets in return

### 8. Reduce friction
The rewrite should make it easy to reply.

Prefer:
- short asks
- bounded time commitments
- yes/no questions
- simple next steps

Avoid:
- vague invitations
- hedged asks
- open-ended requests that require too much effort

## Rewrite Process
When generating a rewrite:

1. Read the current subject and body.
2. Read the current evaluation result.
3. Identify only the active weaknesses.
4. Rewrite only those weak parts.
5. Keep strong parts intact.
6. Check that the rewrite still matches the original intent.
7. Return the improved subject and body in a structured form.

## What to Improve First
Prioritize in this order:
1. clarity of the ask
2. relevance to the recipient
3. specificity
4. human tone
5. low friction

If the subject line is weak, improve it only if it clearly helps.

## Subject Line Behavior
If the subject line is weak:
- make it more specific
- make it less generic
- keep it short
- keep it natural
- match the body

If the subject line is already acceptable:
- do not replace it just for the sake of changing it

## What Not to Do
Do not:
- add fake personalization
- add fake company references
- add fake metrics
- change the core meaning
- repeat already-fixed suggestions
- rewrite the email into a generic sales pitch
- make the email sound over-engineered
- use rules that are not in the skill files

## Output Standard
A rewrite should ideally include:
- improved subject line, if needed
- improved body
- short note about what changed, if the system supports it

The rewrite should still feel like cold outreach, not a marketing email.