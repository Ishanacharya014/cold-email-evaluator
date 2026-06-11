import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { NodeStreamableHTTPServerTransport } from "@modelcontextprotocol/node";

import { registerToolRegistry } from "./tool-registry.js";
import { registerResourceRegistry } from "./resource-registry.js";
import { registerPromptRegistry } from "./prompt-registry.js";
import { registerImportReviewRegistry } from "./import-review-registry.js";
import { registerImportPublishRegistry } from "./import-publish-registry.js";
import { registerAuthRegistry } from "./auth-registry.js";

const HOST = process.env.HOST ?? "127.0.0.1";
const PORT = Number(process.env.PORT ?? 3001);
const MCP_PATH = "/mcp";

function setCorsHeaders(res: ServerResponse): void {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Mcp-Protocol-Version, Mcp-Session-Id, Last-Event-ID"
  );
}

function sendJson(res: ServerResponse, statusCode: number, payload: unknown): void {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload, null, 2));
}

async function main(): Promise<void> {
  const mcpServer = new McpServer({
    name: "cold-email-evaluator",
    version: "1.0.0",
  });

  registerToolRegistry(mcpServer);
  registerResourceRegistry(mcpServer);
  registerPromptRegistry(mcpServer);
  registerImportReviewRegistry(mcpServer);
  registerImportPublishRegistry(mcpServer);
  registerAuthRegistry(mcpServer);

  // Stateless mode is the simplest first HTTP setup.
  const transport = new NodeStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

  await mcpServer.connect(transport);

  const httpServer = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    setCorsHeaders(res);

    if (req.method === "OPTIONS") {
      res.statusCode = 204;
      res.end();
      return;
    }

    const url = new URL(
      req.url ?? "/",
      `http://${req.headers.host ?? `${HOST}:${PORT}`}`
    );

    if (url.pathname === "/health") {
      sendJson(res, 200, {
        ok: true,
        service: "cold-email-evaluator-mcp-http",
        transport: "streamable-http",
      });
      return;
    }

    if (url.pathname !== MCP_PATH) {
      sendJson(res, 404, { ok: false, error: "Not found" });
      return;
    }

    if (req.method !== "GET" && req.method !== "POST") {
      res.setHeader("Allow", "GET,POST,OPTIONS");
      res.statusCode = 405;
      res.end("Method Not Allowed");
      return;
    }

    try {
      await transport.handleRequest(req, res);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown HTTP MCP server error";
      sendJson(res, 500, { ok: false, error: message });
    }
  });

  httpServer.listen(PORT, HOST, () => {
    console.log(
      `Cold Email Skill MCP HTTP server running at http://${HOST}:${PORT}${MCP_PATH}`
    );
    console.log(`Health check at http://${HOST}:${PORT}/health`);
  });
}

main().catch((error) => {
  console.error("Fatal error in HTTP MCP server:", error);
  process.exit(1);
});