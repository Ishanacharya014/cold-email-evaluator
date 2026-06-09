import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import type { AuthClient, AuthRole } from "../auth/auth-types.js";
import {
  createClientKey,
  listAllClients,
  rotateClientKey,
  revokeClientKey,
} from "../auth/key-manager.js";

function redactClient(client: AuthClient) {
  const { api_key, ...safe } = client;
  return safe;
}

export function registerAuthRegistry(server: McpServer): void {
  server.registerTool(
    "create_client_key",
    {
      description: "Create a new API key for an AI client.",
      inputSchema: {
        name: z.string().min(1),
        role: z.enum(["read_only", "admin"]),
      },
    },
    async ({ name, role }) => {
      const result = createClientKey({
        name,
        role: role as AuthRole,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                client: redactClient(result.client),
                secret_api_key: result.secret_api_key,
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
    "list_clients",
    {
      description: "List all registered client keys.",
      inputSchema: {},
    },
    async () => {
      const clients = listAllClients().map(redactClient);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                clients,
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
    "rotate_client_key",
    {
      description: "Rotate an existing client API key.",
      inputSchema: {
        client_id: z.string().min(1),
      },
    },
    async ({ client_id }) => {
      const result = rotateClientKey(client_id);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                client: redactClient(result.client),
                secret_api_key: result.secret_api_key,
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
    "revoke_client_key",
    {
      description: "Revoke an existing client API key.",
      inputSchema: {
        client_id: z.string().min(1),
      },
    },
    async ({ client_id }) => {
      const client = revokeClientKey(client_id);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                client: redactClient(client),
                ok: true,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );
}