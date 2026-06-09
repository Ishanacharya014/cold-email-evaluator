import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { evaluateEmail } from "../engine/evaluator.js";
import { rewriteEmail } from "../engine/rewriter.js";
import { suggestSubject } from "../engine/subject.js";
import { requireAuth } from "./auth-guard.js";

import type { AuthClient, AuthRole } from "../auth/auth-types.js";


import { importKnowledge } from "../skill/import-manager.js";

import {
  createSkillDraft,
  publishSkillVersion,
  rollbackSkillVersion,
  validateSkillVersion,
} from "../skill/version-manager.js";

function jsonText(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function redactClient(client: AuthClient) {
  const { api_key, ...safe } = client;
  return safe;
}

export function registerToolRegistry(server: McpServer): void {
  server.registerTool(
    "evaluate_email",
    {
      description: "Score a cold email using the active cold-email skill.",
      inputSchema: {
        api_key: z.string().min(1),
        subject: z.string().default(""),
        body: z.string().min(1),
      },
    },
    async ({ api_key, subject, body }) => {
      requireAuth(api_key, "evaluate_email");

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
    "rewrite_email",
    {
      description: "Rewrite a cold email using the active skill.",
      inputSchema: {
        api_key: z.string().min(1),
        subject: z.string().default(""),
        body: z.string().min(1),
      },
    },
    async ({ api_key, subject, body }) => {
      requireAuth(api_key, "rewrite_email");

      const result = rewriteEmail({ subject, body });

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
    "suggest_cold_email_subject",
    {
      description: "Suggest a stronger cold email subject line if needed.",
      inputSchema: {
        api_key: z.string().min(1),
        subject: z.string().default(""),
        body: z.string().min(1),
      },
    },
    async ({ api_key, subject, body }) => {
      requireAuth(api_key, "suggest_cold_email_subject");

      const result = suggestSubject({ subject, body });

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
    "explain_cold_email_score",
    {
      description: "Explain the cold email score in simple language.",
      inputSchema: {
        api_key: z.string().min(1),
        subject: z.string().default(""),
        body: z.string().min(1),
      },
    },
    async ({ api_key, subject, body }) => {
      requireAuth(api_key, "explain_cold_email_score");

      const result = evaluateEmail({ subject, body });

      return {
        content: [
          {
            type: "text",
            text: jsonText({
              skill_version: result.skill_version,
              overall_score: result.overall_score,
              verdict: result.verdict,
              scores: result.scores,
              what_works: result.what_works,
              what_to_fix: result.what_to_fix,
              quick_tip: result.quick_tip,
            }),
          },
        ],
      };
    }
  );

  server.registerTool(
    "check_fixed_suggestions",
    {
      description: "Check which suggestions are already fixed in the current draft.",
      inputSchema: {
        api_key: z.string().min(1),
        subject: z.string().default(""),
        body: z.string().min(1),
      },
    },
    async ({ api_key, subject, body }) => {
      requireAuth(api_key, "check_fixed_suggestions");

      const result = evaluateEmail({ subject, body });

      return {
        content: [
          {
            type: "text",
            text: jsonText({
              skill_version: result.skill_version,
              suggestions: result.suggestions,
            }),
          },
        ],
      };
    }
  );

  server.registerTool(
    "import_knowledge",
    {
      description: "Import external text into a draft skill version.",
      inputSchema: {
        api_key: z.string().min(1),
        source_text: z.string().min(1),
        source_type: z.string().min(1),
        tags: z.array(z.string()).default([]),
        base_version_id: z.string().min(1),
        draft_version_id: z.string().min(1),
      },
    },
    async ({
      api_key,
      source_text,
      source_type,
      tags,
      base_version_id,
      draft_version_id,
    }) => {
      requireAuth(api_key, "import_knowledge");

      const result = importKnowledge({
        source_text,
        source_type,
        tags,
        base_version_id,
        draft_version_id,
      });

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
        api_key: z.string().min(1),
        base_version_id: z.string().min(1),
        draft_version_id: z.string().min(1),
      },
    },
    async ({ api_key, base_version_id, draft_version_id }) => {
      requireAuth(api_key, "create_skill_draft");

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
        api_key: z.string().min(1),
        version_id: z.string().min(1),
      },
    },
    async ({ api_key, version_id }) => {
      requireAuth(api_key, "validate_skill_version");

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
        api_key: z.string().min(1),
        version_id: z.string().min(1),
      },
    },
    async ({ api_key, version_id }) => {
      requireAuth(api_key, "publish_skill_version");

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
        api_key: z.string().min(1),
        version_id: z.string().min(1),
      },
    },
    async ({ api_key, version_id }) => {
      requireAuth(api_key, "rollback_skill_version");

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