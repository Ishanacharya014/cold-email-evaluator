import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { evaluateEmail } from "../engine/evaluator.js";

export function registerToolRegistry(server: McpServer): void {
  server.registerTool(
    "evaluate_email",
    {
      description: "Score a cold email using the active cold-email skill.",
      inputSchema: {
        subject: z.string().default(""),
        body: z.string().min(1),
      },
    },
    async ({ subject, body }) => {
      const result = evaluateEmail({ subject, body });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );
}