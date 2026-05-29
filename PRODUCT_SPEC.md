# Cold Email Skill MCP Server — Product Spec

## 1. Product Name
Cold Email Skill MCP Server

## 2. Product Goal
This product helps AI systems evaluate and improve cold emails using a strict 5-point rubric:
- Relevant
- Specific
- Clear
- Human
- Low friction

The product is designed for AI clients first. Human use is secondary and limited to an admin control surface.

## 3. What the Product Is
This is not a normal website-first app.
It is:
- an MCP-based skill service
- a versioned cold email evaluation engine
- an editable skill knowledge system
- a small admin console for managing skill content

## 4. Who Uses It
### Primary users
AI clients that need to:
- evaluate cold emails
- rewrite cold emails
- suggest subject lines
- explain scoring
- compare versions
- validate whether suggestions are still relevant

### Secondary user
The project owner, who needs to:
- edit the skill
- import knowledge
- test changes
- publish versions
- roll back versions

## 5. Source of Truth
The product must follow these files:
- `SKILL.md`
- `references/cold-email-principles.md`
- `examples/weak-email.md`
- `examples/strong-email.md`

The optional React demo in `assets/evaluator.jsx` is only a UI reference and must not override the skill rules.

## 6. Core Rubric
Every evaluation must use the 5 criteria:
- Relevant
- Specific
- Clear
- Human
- Low friction

Each criterion is scored from 1 to 5.

The evaluation rubric must remain consistent with SKILL.md and references/cold-email-principles.md. New knowledge may extend the skill but must not override the core rubric without an explicit skill version update.

## 7. Expected Behavior
The evaluator must:
- analyze the current subject and body only
- produce structured machine-readable output
- explain what works
- explain what needs fixing
- suggest a subject line when needed
- generate a rewrite when asked
- mark suggestions as open, fixed, or not applicable
- avoid repeating suggestions that were already fixed
- avoid stale or reused feedback

## 8. Output Contract
The evaluator must return structured JSON with:
- overall score
- grade or verdict
- per-category scores
- what works
- what to fix
- subject suggestion
- rewrite output
- evidence for suggestions
- skill version used

## 9. MCP-First Requirement
Version 1 must expose the skill through MCP tools, resources, and prompts.
The product should not depend on a human-first public website for its primary use.

## 10. Skill Editing Requirements
The skill content must be editable and versioned.
The system must support:
- skill drafts
- published versions
- archived versions
- rollback
- imported knowledge
- test cases

Imported knowledge must be reviewed before publication.

## 11. Non-Goals for Version 1
Version 1 does not need:
- a public marketing site
- a human-first writing assistant
- login-heavy consumer features
- social features
- analytics dashboards
- database-backed user accounts unless required for skill versioning

The frontend is not the primary product in Version 1 and should only serve as an admin console for testing, editing, and publishing the skill.

## 12. Admin Console Scope
The admin console may be minimal and should only support:
- viewing the active skill version
- editing skill rules
- adding examples
- importing knowledge
- testing emails
- publishing versions
- rolling back versions

## 13. Quality Rules
The product must not:
- invent new rubric rules
- reuse stale suggestions
- repeat fixed suggestions
- show irrelevant feedback
- drift away from the skill files

## 14. Success Criteria
The product is successful when:
- AI clients can use it through MCP
- outputs are stable and structured
- skill updates are versioned safely
- fixed suggestions stop repeating
- weak and strong examples behave as expected
- the active skill can be changed without breaking the evaluator
