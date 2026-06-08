import { writeImportedItem } from "./import-store.js";
import { createSkillDraft } from "./version-manager.js";

export type ImportedKnowledgeType =
  | "rule"
  | "example"
  | "anti_example"
  | "rewrite_rule"
  | "subject_rule";

export interface ImportKnowledgeInput {
  source_text: string;
  source_type: string;
  tags: string[];
  base_version_id: string;
  draft_version_id: string;
}

export interface ImportedKnowledgeResult {
  draft_version_id: string;
  imported_type: ImportedKnowledgeType;
  item_id: string;
  tags: string[];
  notes: string[];
}

function classifyImportedText(sourceText: string): ImportedKnowledgeType {
  const text = sourceText.toLowerCase();

  if (text.includes("subject") && text.includes("rules")) {
    return "subject_rule";
  }

  if (
    text.includes("rewrite") ||
    text.includes("improve") ||
    text.includes("reword")
  ) {
    return "rewrite_rule";
  }

  if (
    text.includes("weak") ||
    text.includes("bad") ||
    text.includes("anti")
  ) {
    return "anti_example";
  }

  if (
    text.includes("example") ||
    text.includes("strong") ||
    text.includes("good")
  ) {
    return "example";
  }

  return "rule";
}

export function importKnowledge(
  input: ImportKnowledgeInput
): ImportedKnowledgeResult {
  createSkillDraft(input.base_version_id, input.draft_version_id);

  const importedType = classifyImportedText(input.source_text);
  const itemId = `imported-${Date.now()}`;

  const content = [
    `# Imported Knowledge`,
    ``,
    `Type: ${importedType}`,
    `Source Type: ${input.source_type}`,
    `Tags: ${input.tags.join(", ")}`,
    ``,
    input.source_text,
  ].join("\n");

  writeImportedItem(input.draft_version_id, itemId, content);

  return {
    draft_version_id: input.draft_version_id,
    imported_type: importedType,
    item_id: itemId,
    tags: input.tags,
    notes: [
      "Imported knowledge stored in draft version.",
      "Review before publishing.",
    ],
  };
}