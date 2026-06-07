import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { evaluateEmail } from "../engine/evaluator.js";
import {
  createSkillDraft,
  validateSkillVersion,
  publishSkillVersion,
  rollbackSkillVersion,
} from "../skill/version-manager.js";

function jsonText(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

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
            text: jsonText(result),
          },
        ],
      };
    }
  );

  server.registerTool(
    "create_skill_draft",
    {
      description: "Create a draft skill version by copying an existing version.",
      inputSchema: {
        base_version_id: z.string().min(1),
        draft_version_id: z.string().min(1),
      },
    },
    async ({ base_version_id, draft_version_id }) => {
      createSkillDraft(base_version_id, draft_version_id);

      return {
        content: [
          {
            type: "text",
            text: jsonText({
              ok: true,
              message: `Created draft version ${draft_version_id} from ${base_version_id}.`,
            }),
          },
        ],
      };
    }
  );

  server.registerTool(
    "validate_skill_version",
    {
      description: "Validate that a skill version contains all required files.",
      inputSchema: {
        version_id: z.string().min(1),
      },
    },
    async ({ version_id }) => {
      const result = validateSkillVersion(version_id);

      return {
        content: [
          {
            type: "text",
            text: jsonText(result),
          },
        ],
      };
    }
  );

  server.registerTool(
    "publish_skill_version",
    {
      description: "Publish a validated skill version and make it active.",
      inputSchema: {
        version_id: z.string().min(1),
      },
    },
    async ({ version_id }) => {
      const result = publishSkillVersion(version_id);

      return {
        content: [
          {
            type: "text",
            text: jsonText(result),
          },
        ],
      };
    }
  );

  server.registerTool(
    "rollback_skill_version",
    {
      description: "Roll back the active skill version to a previous version.",
      inputSchema: {
        version_id: z.string().min(1),
      },
    },
    async ({ version_id }) => {
      const result = rollbackSkillVersion(version_id);

      return {
        content: [
          {
            type: "text",
            text: jsonText(result),
          },
        ],
      };
    }
  );
}