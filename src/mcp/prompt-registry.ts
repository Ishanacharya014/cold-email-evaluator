import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerPromptRegistry(server: McpServer): void {
  server.registerPrompt(
    "evaluate_cold_email",
    {
      title: "Evaluate Cold Email",
      description: "Evaluate a cold email using the active skill version.",
      argsSchema: {
        subject: z.string().default(""),
        body: z.string().min(1),
      },
    },
    async ({ subject, body }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text:
              `Evaluate this cold email using the active cold-email skill.\n\n` +
              `Subject:\n${subject}\n\n` +
              `Body:\n${body}\n\n` +
              `Return a structured evaluation with scores, strengths, weaknesses, a subject suggestion if needed, and a rewrite if needed.`,
          },
        },
      ],
    })
  );

  server.registerPrompt(
    "rewrite_cold_email",
    {
      title: "Rewrite Cold Email",
      description: "Rewrite a cold email using the latest evaluation result.",
      argsSchema: {
        subject: z.string().default(""),
        body: z.string().min(1),
      },
    },
    async ({ subject, body }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text:
              `Rewrite this cold email based on the active skill rules.\n\n` +
              `Preserve the original meaning.\n` +
              `Fix only the weaknesses that are actually present.\n` +
              `Do not invent context, numbers, or personalization.\n\n` +
              `Subject:\n${subject}\n\n` +
              `Body:\n${body}`,
          },
        },
      ],
    })
  );

  server.registerPrompt(
    "suggest_cold_email_subject",
    {
      title: "Suggest Cold Email Subject",
      description: "Suggest a stronger cold email subject line if needed.",
      argsSchema: {
        subject: z.string().default(""),
        body: z.string().min(1),
      },
    },
    async ({ subject, body }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text:
              `Suggest a stronger subject line for this cold email only if the current one is weak.\n\n` +
              `Keep it short, human, relevant, and aligned with the body.\n\n` +
              `Current subject:\n${subject}\n\n` +
              `Body:\n${body}`,
          },
        },
      ],
    })
  );

  server.registerPrompt(
    "explain_cold_email_score",
    {
      title: "Explain Cold Email Score",
      description: "Explain the cold email score in simple language.",
      argsSchema: {
        subject: z.string().default(""),
        body: z.string().min(1),
      },
    },
    async ({ subject, body }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text:
              `Explain why this cold email got its score.\n\n` +
              `Break down the result by:\n` +
              `- Relevant\n- Specific\n- Clear\n- Human\n- Low friction\n\n` +
              `Be direct, short, and practical.\n\n` +
              `Subject:\n${subject}\n\n` +
              `Body:\n${body}`,
          },
        },
      ],
    })
  );

  server.registerPrompt(
    "check_fixed_suggestions",
    {
      title: "Check Fixed Suggestions",
      description: "Check whether earlier suggestions have already been fixed in the current draft.",
      argsSchema: {
        subject: z.string().default(""),
        body: z.string().min(1),
      },
    },
    async ({ subject, body }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text:
              `Check which suggestions are already fixed in the current cold email draft.\n\n` +
              `Mark suggestions as open, fixed, or not_applicable.\n` +
              `Do not repeat suggestions that are already fixed.\n\n` +
              `Subject:\n${subject}\n\n` +
              `Body:\n${body}`,
          },
        },
      ],
    })
  );
}