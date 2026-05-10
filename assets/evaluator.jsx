/**
 * Cold Email Evaluator — React Demo UI
 *
 * This file is an example frontend implementation
 * for the cold email evaluator skill.
 *
 * It demonstrates:
 * - subject line input
 * - email body input
 * - AI-powered scoring
 * - rubric visualization
 * - actionable feedback panels
 *
 * This file may require adaptation depending on
 * the AI provider or backend being used.
 */

import { useState } from "react";

// ─── Rubric criteria displayed in the scorecard ───────────────────────────
const CRITERIA = [
  { key: "relevant",     label: "Relevant",     icon: "ti-target",      desc: "Right person, tailored to them" },
  { key: "specific",     label: "Specific",     icon: "ti-fingerprint", desc: "Not a generic blast" },
  { key: "clear",        label: "Clear",        icon: "ti-bulb",        desc: "Simple ask, easy to skim" },
  { key: "human",        label: "Human",        icon: "ti-user",        desc: "Sounds like a real person" },
  { key: "low_friction", label: "Low friction", icon: "ti-bolt",        desc: "Easy to say yes or no" },
];

// ─── System prompt (mirrors references/cold-email-principles.md) ──────────
const SYSTEM_PROMPT = `You are a cold email coach trained on these exact principles from a cold outreach workshop
by Majorana at Founders, Inc. (who cold-emailed her way into a job, $100K in revenue in
high school, extra scholarship money, and a tweet that hit 1M views).

CORE DEFINITION
Cold outreach = a respectful one-on-one request for attention from someone who does not know
you and who owes you nothing. The goal is a reply — not a perfect essay.

THE 5-POINT RUBRIC (score each criterion 1–5)

1. RELEVANT
   - Is this reaching the right person? Is the message tailored to them and their context?
   - Does it show you know who they are — their role, their investments, their work?
   - A message sent to the wrong person or with irrelevant context = 1.
   - A message that shows deep research into exactly this person = 5.

2. SPECIFIC
   - Could this exact message be sent to 500 people? If yes → score low.
   - Is it handcrafted for this one individual? Is there something only they would recognize?
   - Generic "newsletter blast" energy = 1. Hyper-personalized, un-copy-pasteable = 5.

3. CLEAR
   - Is the ask short and unmuddied? Can you skim it in 5 seconds and know what they want?
   - Shorter is better. Long is fine only if the ask is crystal clear throughout.
   - Buried ask, wall of text, multiple competing requests = 1. One crisp ask = 5.

4. HUMAN
   - Does it sound like a real person wrote it, not an AI or a PR agency?
   - Red flags: em-dashes (—), overly formal language, buzzwords, AI phrasing patterns.
   - Typos are fine. "Write like you speak" is the gold standard.
   - Robot-speak = 1. Sounds like a text from a friend = 5.

5. LOW FRICTION
   - Can the reader say "hell yeah" or "no" immediately? Or are they confused?
   - Hedging destroys friction scores: "I was hoping maybe if you had the time..."
   - Ambiguous ask = 1. Crystal clear yes/no ask = 5.

BODY COPY RULES
- The ask must be UNMISTAKABLE. No hedging.
- Show research: reference something specific (their portfolio, a post, shared alma mater).
- Answer: who are you? why are you reaching out? why THIS person? what do you want?
- Write like you speak. No em-dashes. Typos are fine.
- Find common ground: shared school, shared investor, a joke, a pun — anything human.
- Flattery + clear value + easy ask = winning combo.

SUBJECT LINE RULES
- Must feel written for exactly ONE person.
- NO EM-DASHES (—). Dead giveaway for AI. Use a regular dash (-) instead.
- Vague openers fail: "Quick note", "No pitch here", "Checking in".
- What works: humor/puns, shared context, curiosity gaps, real traction numbers.

COMMON MISTAKES TO FLAG
1. Em-dashes (—) anywhere in the email.
2. Vague subject lines.
3. Urgency without personalization.
4. Irrelevant offer for this specific person.
5. Hedged ask.
6. Missing context (who you are, why them, what you want).
7. Generic flattery with no specific reference.
8. AI-generated tone (formal structures, buzzword stacking).
9. Wall of text.
10. Wrong audience.

OUTPUT FORMAT — return ONLY valid JSON, no markdown, no backticks:
{
  "overall_score": <number 1-5>,
  "verdict": "<one sentence brutal honest verdict, max 20 words>",
  "scores": {
    "relevant": <1-5>,
    "specific": <1-5>,
    "clear": <1-5>,
    "human": <1-5>,
    "low_friction": <1-5>
  },
  "what_works": ["<specific thing that works>", ...],
  "what_to_fix": ["<specific actionable fix>", ...],
  "rewritten_subject": "<improved subject line or null>",
  "quick_tip": "<one punchy tip from the principles above>"
}`;

// ─── Sub-components ────────────────────────────────────────────────────────

function ScoreBar({ score }) {
  const colors = ["", "#E24B4A", "#EF9F27", "#EF9F27", "#1D9E75", "#1D9E75"];
  const labels = ["", "Terrible", "Weak", "Okay", "Good", "Great"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <div
          key={n}
          style={{
            height: 6,
            flex: 1,
            borderRadius: 3,
            background: n <= score ? colors[score] : "var(--color-border-tertiary)",
            transition: "background 0.3s",
          }}
        />
      ))}
      <span style={{
        fontSize: 12,
        color: colors[score] || "var(--color-text-tertiary)",
        fontWeight: 500,
        minWidth: 48,
      }}>
        {score ? labels[score] : "—"}
      </span>
    </div>
  );
}

function ScoreRing({ score }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const pct = score / 5;
  const colors = { 1: "#E24B4A", 2: "#EF9F27", 3: "#EF9F27", 4: "#1D9E75", 5: "#1D9E75" };
  const labels = { 1: "Poor", 2: "Weak", 3: "Okay", 4: "Good", 5: "Great" };
  return (
    <div style={{ position: "relative", width: 96, height: 96 }}>
      <svg width="96" height="96" style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx="48" cy="48" r={r}
          fill="none"
          stroke="var(--color-border-tertiary)"
          strokeWidth="7"
        />
        <circle
          cx="48" cy="48" r={r}
          fill="none"
          stroke={colors[score] || "var(--color-border-tertiary)"}
          strokeWidth="7"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: 22, fontWeight: 500, color: colors[score] || "var(--color-text-secondary)" }}>
          {score || "—"}
        </span>
        <span style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>
          {score ? labels[score] : "/ 5"}
        </span>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────

export default function ColdEmailEvaluator() {
  const [subject, setSubject]   = useState("");
  const [body, setBody]         = useState("");
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState("");
  const [loadMsg, setLoadMsg]   = useState("");

  const loadingMessages = [
    "Checking for em-dashes...",
    "Sniffing for AI slop...",
    "Asking: would Mark Cuban reply?",
    "Grading your subject line...",
    "Checking friction levels...",
  ];

  async function evaluate() {
    if (!subject.trim() && !body.trim()) return;
    setLoading(true);
    setResult(null);
    setError("");

    let msgIdx = 0;
    setLoadMsg(loadingMessages[0]);
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % loadingMessages.length;
      setLoadMsg(loadingMessages[msgIdx]);
    }, 1800);

    try {
      const userContent = `Subject line: ${subject || "(none provided)"}

Email body:
${body || "(none provided)"}`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: userContent }],
        }),
      });

      const data = await res.json();
      const text = data.content?.map((b) => b.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (e) {
      setError("Something went wrong evaluating your email. Please try again.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "1.5rem 0", maxWidth: 660, margin: "0 auto" }}>
      {/* Header */}
      <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 4, color: "var(--color-text-primary)" }}>
        Cold email evaluator
      </h2>
      <p style={{ fontSize: 14, color: "var(--color-text-secondary)", marginBottom: 20, marginTop: 0 }}>
        Scored on Majorana's 5-point rubric: relevance, specificity, clarity, human-ness & friction.
      </p>

      {/* Subject line input */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>
          Subject line
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. MCF AI Bootcamp alumni - quick question"
          style={{ width: "100%", boxSizing: "border-box" }}
        />
      </div>

      {/* Body input */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>
          Email body
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Paste your cold email body here..."
          rows={7}
          style={{
            width: "100%",
            boxSizing: "border-box",
            resize: "vertical",
            fontFamily: "var(--font-sans)",
            fontSize: 14,
            lineHeight: 1.6,
          }}
        />
      </div>

      {/* Evaluate button */}
      <button
        onClick={evaluate}
        disabled={loading || (!subject.trim() && !body.trim())}
        style={{ width: "100%", padding: "10px 0", fontSize: 14, fontWeight: 500 }}
      >
        {loading ? loadMsg : "Evaluate my email ↗"}
      </button>

      {/* Error state */}
      {error && (
        <p style={{ color: "var(--color-text-danger)", fontSize: 14, marginTop: 12 }}>{error}</p>
      )}

      {/* Results */}
      {result && (
        <div style={{ marginTop: 24 }}>

          {/* Overall score card */}
          <div style={{
            background: "var(--color-background-secondary)",
            borderRadius: "var(--border-radius-lg)",
            padding: "1.25rem",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}>
            <ScoreRing score={result.overall_score} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, color: "var(--color-text-tertiary)", margin: "0 0 4px" }}>
                Overall score
              </p>
              <p style={{ fontSize: 15, fontWeight: 500, margin: "0 0 8px", color: "var(--color-text-primary)", lineHeight: 1.4 }}>
                {result.verdict}
              </p>
              <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: 0, fontStyle: "italic" }}>
                "{result.quick_tip}"
              </p>
            </div>
          </div>

          {/* Scorecard */}
          <div style={{
            background: "var(--color-background-primary)",
            border: "0.5px solid var(--color-border-tertiary)",
            borderRadius: "var(--border-radius-lg)",
            padding: "1rem 1.25rem",
            marginBottom: 16,
          }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)", margin: "0 0 14px" }}>
              Scorecard
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {CRITERIA.map((c) => (
                <div key={c.key}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 13, color: "var(--color-text-primary)", display: "flex", alignItems: "center", gap: 6 }}>
                      <i className={`ti ${c.icon}`} style={{ fontSize: 14 }} aria-hidden="true" />
                      {c.label}
                      <span style={{ color: "var(--color-text-tertiary)", fontWeight: 400 }}>
                        — {c.desc}
                      </span>
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)" }}>
                      {result.scores?.[c.key]}/5
                    </span>
                  </div>
                  <ScoreBar score={result.scores?.[c.key]} />
                </div>
              ))}
            </div>
          </div>

          {/* What works / Fix these */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            {result.what_works?.length > 0 && (
              <div style={{
                background: "var(--color-background-success)",
                border: "0.5px solid var(--color-border-success)",
                borderRadius: "var(--border-radius-lg)",
                padding: "1rem 1.25rem",
              }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-success)", margin: "0 0 10px" }}>
                  <i className="ti ti-check" aria-hidden="true" style={{ marginRight: 6 }} />
                  What works
                </p>
                <ul style={{ margin: 0, padding: "0 0 0 16px" }}>
                  {result.what_works.map((w, i) => (
                    <li key={i} style={{ fontSize: 13, color: "var(--color-text-success)", marginBottom: 6, lineHeight: 1.4 }}>
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {result.what_to_fix?.length > 0 && (
              <div style={{
                background: "var(--color-background-danger)",
                border: "0.5px solid var(--color-border-danger)",
                borderRadius: "var(--border-radius-lg)",
                padding: "1rem 1.25rem",
              }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-danger)", margin: "0 0 10px" }}>
                  <i className="ti ti-x" aria-hidden="true" style={{ marginRight: 6 }} />
                  Fix these
                </p>
                <ul style={{ margin: 0, padding: "0 0 0 16px" }}>
                  {result.what_to_fix.map((f, i) => (
                    <li key={i} style={{ fontSize: 13, color: "var(--color-text-danger)", marginBottom: 6, lineHeight: 1.4 }}>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Suggested subject line */}
          {result.rewritten_subject && (
            <div style={{
              background: "var(--color-background-info)",
              border: "0.5px solid var(--color-border-info)",
              borderRadius: "var(--border-radius-lg)",
              padding: "0.875rem 1.25rem",
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
            }}>
              <i className="ti ti-sparkles" style={{ fontSize: 16, color: "var(--color-text-info)", marginTop: 1 }} aria-hidden="true" />
              <div>
                <p style={{ fontSize: 12, color: "var(--color-text-info)", margin: "0 0 3px", fontWeight: 500 }}>
                  Suggested subject line
                </p>
                <p style={{ fontSize: 14, color: "var(--color-text-info)", margin: 0 }}>
                  {result.rewritten_subject}
                </p>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
