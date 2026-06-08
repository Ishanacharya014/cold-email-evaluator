import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerToolRegistry } from "./tool-registry.js";
import { registerResourceRegistry } from "./resource-registry.js";
import { registerPromptRegistry } from "./prompt-registry.js";
import { registerImportReviewRegistry } from "./import-review-registry.js";
import { registerImportPublishRegistry } from "./import-publish-registry.js";

const server = new McpServer({
  name: "cold-email-evaluator",
  version: "1.0.0",
});

registerToolRegistry(server);
registerResourceRegistry(server);
registerPromptRegistry(server);
registerImportReviewRegistry(server);
registerImportPublishRegistry(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Cold Email Skill MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in MCP server:", error);
  process.exit(1);
});