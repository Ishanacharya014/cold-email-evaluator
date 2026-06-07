import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import fs from "node:fs";
import path from "node:path";

function readText(filePath: string): string {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Resource file not found: ${filePath}`);
  }

  return fs.readFileSync(absolutePath, "utf8");
}

export function registerResourceRegistry(server: McpServer): void {
  server.registerResource(
    "active_rubric",
    "skill://active/rubric",
    {
      title: "Active Rubric",
      description: "Current scoring rubric for cold emails.",
      mimeType: "text/markdown",
    },
    async () => ({
      contents: [
        {
          uri: "skill://active/rubric",
          text: readText("skill/active/rubric.md"),
        },
      ],
    })
  );

  server.registerResource(
    "examples",
    "skill://active/examples",
    {
      title: "Examples",
      description: "Strong cold email examples.",
      mimeType: "text/markdown",
    },
    async () => ({
      contents: [
        {
          uri: "skill://active/examples",
          text: readText("skill/active/examples.md"),
        },
      ],
    })
  );

  server.registerResource(
    "anti_examples",
    "skill://active/anti-examples",
    {
      title: "Anti Examples",
      description: "Weak cold email examples.",
      mimeType: "text/markdown",
    },
    async () => ({
      contents: [
        {
          uri: "skill://active/anti-examples",
          text: readText("skill/active/anti_examples.md"),
        },
      ],
    })
  );

  server.registerResource(
    "rewrite_rules",
    "skill://active/rewrite-rules",
    {
      title: "Rewrite Rules",
      description: "Rules for rewriting cold emails.",
      mimeType: "text/markdown",
    },
    async () => ({
      contents: [
        {
          uri: "skill://active/rewrite-rules",
          text: readText("skill/active/rewrite_rules.md"),
        },
      ],
    })
  );

  server.registerResource(
    "subject_rules",
    "skill://active/subject-rules",
    {
      title: "Subject Rules",
      description: "Rules for subject line improvements.",
      mimeType: "text/markdown",
    },
    async () => ({
      contents: [
        {
          uri: "skill://active/subject-rules",
          text: readText("skill/active/subject_rules.md"),
        },
      ],
    })
  );

  server.registerResource(
    "active_version",
    "skill://active/version",
    {
      title: "Active Version",
      description: "Current active skill version metadata.",
      mimeType: "application/json",
    },
    async () => ({
      contents: [
        {
          uri: "skill://active/version",
          text: readText("skill/manifest.json"),
        },
      ],
    })
  );

  server.registerResource(
    "changelog",
    "skill://changelog",
    {
      title: "Changelog",
      description: "Skill version history.",
      mimeType: "text/markdown",
    },
    async () => ({
      contents: [
        {
          uri: "skill://changelog",
          text: readText("skill/changelog.md"),
        },
      ],
    })
  );

  server.registerResource(
    "evaluation_schema",
    "skill://schema/evaluation",
    {
      title: "Evaluation Schema",
      description: "JSON schema for evaluation results.",
      mimeType: "application/json",
    },
    async () => ({
      contents: [
        {
          uri: "skill://schema/evaluation",
          text: readText("schemas/evaluation.schema.json"),
        },
      ],
    })
  );
}