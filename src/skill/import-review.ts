import {
  listImportedItems,
  readImportedItem,
  readImportedItemStatus,
  writeImportedItemStatus,
  type ImportedKnowledgeStatus,
} from "../storage/import-store.js";

export interface ImportedKnowledgeItem {
  item_file_name: string;
  status: ImportedKnowledgeStatus;
}

export function listImportedKnowledge(
  draftVersionId: string
): ImportedKnowledgeItem[] {
  return listImportedItems(draftVersionId).map((item_file_name) => ({
    item_file_name,
    status: readImportedItemStatus(draftVersionId, item_file_name),
  }));
}

export function readImportedKnowledge(
  draftVersionId: string,
  itemFileName: string
): string {
  return readImportedItem(draftVersionId, itemFileName);
}

export function approveImportedKnowledge(
  draftVersionId: string,
  itemFileName: string
): { ok: boolean; status: ImportedKnowledgeStatus; item_file_name: string } {
  writeImportedItemStatus(draftVersionId, itemFileName, "approved");

  return {
    ok: true,
    status: "approved",
    item_file_name: itemFileName,
  };
}

export function rejectImportedKnowledge(
  draftVersionId: string,
  itemFileName: string
): { ok: boolean; status: ImportedKnowledgeStatus; item_file_name: string } {
  writeImportedItemStatus(draftVersionId, itemFileName, "rejected");

  return {
    ok: true,
    status: "rejected",
    item_file_name: itemFileName,
  };
}