import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import {
  approveImportedKnowledge,
  listImportedKnowledge,
  readImportedKnowledge,
  rejectImportedKnowledge,
} from "../skill/import-review.js";

export function registerImportReviewRegistry(server: McpServer): void {
  server.registerTool(
    "list_imported_knowledge",
    {
      description: "List imported knowledge items inside a draft skill version.",
      inputSchema: {
        draft_version_id: z.string().min(1),
      },
    },
    async ({ draft_version_id }) => {
      const items = listImportedKnowledge(draft_version_id);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                draft_version_id,
                items,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  server.registerTool(
    "read_imported_knowledge",
    {
      description: "Read one imported knowledge item from a draft version.",
      inputSchema: {
        draft_version_id: z.string().min(1),
        item_file_name: z.string().min(1),
      },
    },
    async ({ draft_version_id, item_file_name }) => {
      const content = readImportedKnowledge(draft_version_id, item_file_name);

      return {
        content: [
          {
            type: "text",
            text: content,
          },
        ],
      };
    }
  );

  server.registerTool(
    "approve_imported_knowledge",
    {
      description: "Approve one imported knowledge item.",
      inputSchema: {
        draft_version_id: z.string().min(1),
        item_file_name: z.string().min(1),
      },
    },
    async ({ draft_version_id, item_file_name }) => {
      const result = approveImportedKnowledge(draft_version_id, item_file_name);

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

  server.registerTool(
    "reject_imported_knowledge",
    {
      description: "Reject one imported knowledge item.",
      inputSchema: {
        draft_version_id: z.string().min(1),
        item_file_name: z.string().min(1),
      },
    },
    async ({ draft_version_id, item_file_name }) => {
      const result = rejectImportedKnowledge(draft_version_id, item_file_name);

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