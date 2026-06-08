import { createSkillDraft } from "./version-manager.js";
import { listImportedKnowledge, readImportedKnowledge } from "./import-review.js";
import { readVersionFile, writeVersionFile } from "../storage/version-store.js";

export type ImportedKnowledgeType =
  | "rule"
  | "example"
  | "anti_example"
  | "rewrite_rule"
  | "subject_rule";

export interface PromoteImportedKnowledgeInput {
  base_version_id: string;
  source_draft_version_id: string;
  target_version_id: string;
}

export interface PromoteImportedKnowledgeResult {
  ok: boolean;
  base_version_id: string;
  source_draft_version_id: string;
  target_version_id: string;
  promoted_items: string[];
  skipped_items: string[];
  updated_files: string[];
  notes: string[];
}

function parseImportedType(content: string): ImportedKnowledgeType {
  const match = content.match(/^Type:\s*(.+)$/im);
  const raw = (match?.[1] ?? "rule").trim().toLowerCase();

  if (raw === "example") return "example";
  if (raw === "anti_example" || raw === "anti-example") return "anti_example";
  if (raw === "rewrite_rule" || raw === "rewrite-rule") return "rewrite_rule";
  if (raw === "subject_rule" || raw === "subject-rule") return "subject_rule";

  return "rule";
}

function targetFileForType(type: ImportedKnowledgeType): string {
  switch (type) {
    case "example":
      return "examples.md";
    case "anti_example":
      return "anti_examples.md";
    case "rewrite_rule":
      return "rewrite_rules.md";
    case "subject_rule":
      return "subject_rules.md";
    case "rule":
    default:
      return "rubric.md";
  }
}

function buildAppendBlock(
  itemFileName: string,
  importedType: ImportedKnowledgeType,
  sourceDraftVersionId: string,
  content: string
): string {
  return [
    "",
    "",
    "---",
    `<!-- imported:${itemFileName} -->`,
    `## Imported Knowledge: ${itemFileName}`,
    "",
    `Type: ${importedType}`,
    `Source Draft: ${sourceDraftVersionId}`,
    "",
    content.trim(),
    "",
  ].join("\n");
}

export function promoteImportedKnowledge(
  input: PromoteImportedKnowledgeInput
): PromoteImportedKnowledgeResult {
  createSkillDraft(input.base_version_id, input.target_version_id);

  const importedItems = listImportedKnowledge(input.source_draft_version_id);

  const promotedItems: string[] = [];
  const skippedItems: string[] = [];
  const updatedFiles = new Set<string>();
  const notes: string[] = [];

  for (const item of importedItems) {
    if (item.status !== "approved") {
      skippedItems.push(item.item_file_name);
      continue;
    }

    const content = readImportedKnowledge(
      input.source_draft_version_id,
      item.item_file_name
    );

    const importedType = parseImportedType(content);
    const targetFile = targetFileForType(importedType);
    const marker = `<!-- imported:${item.item_file_name} -->`;

    const existing = readVersionFile(input.target_version_id, targetFile);

    if (existing.includes(marker)) {
      skippedItems.push(item.item_file_name);
      notes.push(`Skipped duplicate import: ${item.item_file_name}`);
      continue;
    }

    const updated = `${existing.trimEnd()}${buildAppendBlock(
      item.item_file_name,
      importedType,
      input.source_draft_version_id,
      content
    )}`;

    writeVersionFile(input.target_version_id, targetFile, updated);

    promotedItems.push(item.item_file_name);
    updatedFiles.add(targetFile);
  }

  notes.push(`Promoted ${promotedItems.length} approved item(s).`);
  notes.push(`Skipped ${skippedItems.length} item(s).`);

  return {
    ok: true,
    base_version_id: input.base_version_id,
    source_draft_version_id: input.source_draft_version_id,
    target_version_id: input.target_version_id,
    promoted_items: promotedItems,
    skipped_items: skippedItems,
    updated_files: [...updatedFiles],
    notes,
  };
}