import { evaluateEmail } from "./engine/evaluator.js";

const result = evaluateEmail({
  subject: "Quick question",
  body: `
Hi Sarah,

I noticed your onboarding flow.

I think I can reduce drop-off by 20%.

Worth a quick chat?
`
});

console.log(JSON.stringify(result, null, 2));