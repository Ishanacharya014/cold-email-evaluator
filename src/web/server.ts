import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { config } from "../config.js";
import { createClientOnboarding } from "./onboarding.js";
import type { AuthClient, AuthRole } from "../auth/auth-types.js";
import { authenticateAndAuthorize } from "../auth/auth-check.js";
import {
  listAllClients,
  rotateClientKey,
  revokeClientKey,
} from "../auth/key-manager.js";

function setCorsHeaders(res: ServerResponse): void {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

function sendJson(
  res: ServerResponse,
  statusCode: number,
  payload: unknown
): void {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload, null, 2));
}

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  let body = "";

  for await (const chunk of req) {
    body += chunk.toString("utf8");
  }

  if (!body.trim()) {
    return {};
  }

  return JSON.parse(body);
}

function isAuthRole(value: unknown): value is AuthRole {
  return value === "read_only" || value === "admin";
}

function redactClient(client: AuthClient): Omit<AuthClient, "api_key"> {
  const { api_key, ...safe } = client;
  return safe;
}

function requireAdminKey(apiKey: unknown, action: "list_clients" | "rotate_client_key" | "revoke_client_key") {
  if (typeof apiKey !== "string" || !apiKey.trim()) {
    return {
      ok: false,
      status: 400,
      error: "api_key is required.",
    } as const;
  }

  const auth = authenticateAndAuthorize(apiKey.trim(), action);

  if (!auth.ok) {
    return {
      ok: false,
      status: 403,
      error: auth.reason ?? "Unauthorized.",
    } as const;
  }

  return {
    ok: true,
    client: auth.client,
  } as const;
}

const server = createServer(async (req, res) => {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  const url = new URL(
    req.url ?? "/",
    `http://${req.headers.host ?? `${config.host}:${config.webPort}`}`
  );

  if (url.pathname === "/health") {
    sendJson(res, 200, {
      ok: true,
      service: "cold-email-evaluator-web",
    });
    return;
  }

  if (url.pathname === "/api/onboarding/client") {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST,OPTIONS");
      sendJson(res, 405, {
        ok: false,
        error: "Method not allowed",
      });
      return;
    }

    try {
      const body = (await readJsonBody(req)) as {
        name?: unknown;
        role?: unknown;
      };

      const name = typeof body.name === "string" ? body.name.trim() : "";
      const role = body.role;

      if (!name) {
        sendJson(res, 400, {
          ok: false,
          error: "Client name is required.",
        });
        return;
      }

      if (!isAuthRole(role)) {
        sendJson(res, 400, {
          ok: false,
          error: "Role must be either 'read_only' or 'admin'.",
        });
        return;
      }

      const result = createClientOnboarding({
        name,
        role,
      });

      sendJson(res, 200, {
        ok: true,
        ...result,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown server error";

      sendJson(res, 500, {
        ok: false,
        error: message,
      });
    }

    return;
  }

  if (url.pathname === "/api/clients/list") {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST,OPTIONS");
      sendJson(res, 405, {
        ok: false,
        error: "Method not allowed",
      });
      return;
    }

    try {
      const body = (await readJsonBody(req)) as { api_key?: unknown };
      const auth = requireAdminKey(body.api_key, "list_clients");

      if (!auth.ok) {
        sendJson(res, auth.status, {
          ok: false,
          error: auth.error,
        });
        return;
      }

      const clients = listAllClients().map(redactClient);

      sendJson(res, 200, {
        ok: true,
        clients,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown server error";

      sendJson(res, 500, {
        ok: false,
        error: message,
      });
    }

    return;
  }

  if (url.pathname === "/api/clients/rotate") {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST,OPTIONS");
      sendJson(res, 405, {
        ok: false,
        error: "Method not allowed",
      });
      return;
    }

    try {
      const body = (await readJsonBody(req)) as {
        api_key?: unknown;
        client_id?: unknown;
      };

      const auth = requireAdminKey(body.api_key, "rotate_client_key");

      if (!auth.ok) {
        sendJson(res, auth.status, {
          ok: false,
          error: auth.error,
        });
        return;
      }

      const clientId =
        typeof body.client_id === "string" ? body.client_id.trim() : "";

      if (!clientId) {
        sendJson(res, 400, {
          ok: false,
          error: "client_id is required.",
        });
        return;
      }

      const result = rotateClientKey(clientId);

      sendJson(res, 200, {
        ok: true,
        client: redactClient(result.client),
        secret_api_key: result.secret_api_key,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown server error";

      sendJson(res, 500, {
        ok: false,
        error: message,
      });
    }

    return;
  }

  if (url.pathname === "/api/clients/revoke") {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST,OPTIONS");
      sendJson(res, 405, {
        ok: false,
        error: "Method not allowed",
      });
      return;
    }

    try {
      const body = (await readJsonBody(req)) as {
        api_key?: unknown;
        client_id?: unknown;
      };

      const auth = requireAdminKey(body.api_key, "revoke_client_key");

      if (!auth.ok) {
        sendJson(res, auth.status, {
          ok: false,
          error: auth.error,
        });
        return;
      }

      const clientId =
        typeof body.client_id === "string" ? body.client_id.trim() : "";

      if (!clientId) {
        sendJson(res, 400, {
          ok: false,
          error: "client_id is required.",
        });
        return;
      }

      const client = revokeClientKey(clientId);

      sendJson(res, 200, {
        ok: true,
        client: redactClient(client),
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown server error";

      sendJson(res, 500, {
        ok: false,
        error: message,
      });
    }

    return;
  }

  sendJson(res, 404, {
    ok: false,
    error: "Not found",
  });
});

server.listen(config.webPort, config.host, () => {
  console.log(
    `Cold Email onboarding server running at http://${config.host}:${config.webPort}`
  );
  console.log(`Health check at http://${config.host}:${config.webPort}/health`);
  console.log(
    `Onboarding endpoint at http://${config.host}:${config.webPort}/api/onboarding/client`
  );
  console.log(
    `Client list endpoint at http://${config.host}:${config.webPort}/api/clients/list`
  );
  console.log(
    `Client rotate endpoint at http://${config.host}:${config.webPort}/api/clients/rotate`
  );
  console.log(
    `Client revoke endpoint at http://${config.host}:${config.webPort}/api/clients/revoke`
  );
});