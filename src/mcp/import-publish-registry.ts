import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { promoteImportedKnowledge } from "../skill/import-publisher.js";

export function registerImportPublishRegistry(server: McpServer): void {
  server.registerTool(
    "promote_imported_knowledge",
    {
      description:
        "Promote approved imported knowledge into a new draft skill version.",
      inputSchema: {
        base_version_id: z.string().min(1),
        source_draft_version_id: z.string().min(1),
        target_version_id: z.string().min(1),
      },
    },
    async ({ base_version_id, source_draft_version_id, target_version_id }) => {
      const result = promoteImportedKnowledge({
        base_version_id,
        source_draft_version_id,
        target_version_id,
      });

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