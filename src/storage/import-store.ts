import fs from "node:fs";
import path from "node:path";

function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function itemPath(draftVersionId: string, itemFileName: string): string {
  return path.resolve("skill/drafts", draftVersionId, itemFileName);
}

function statusPath(draftVersionId: string, itemFileName: string): string {
  return path.resolve(
    "skill/drafts",
    draftVersionId,
    `${itemFileName}.status.json`
  );
}

export type ImportedKnowledgeStatus = "pending" | "approved" | "rejected";

export function writeImportedItem(
  draftVersionId: string,
  itemFileName: string,
  content: string
): void {
  const dirPath = path.resolve("skill/drafts", draftVersionId);
  ensureDir(dirPath);

  fs.writeFileSync(itemPath(draftVersionId, itemFileName), content, "utf8");

  writeImportedItemStatus(draftVersionId, itemFileName, "pending");
}

export function listImportedItems(draftVersionId: string): string[] {
  const dirPath = path.resolve("skill/drafts", draftVersionId);

  if (!fs.existsSync(dirPath)) {
    return [];
  }

  return fs
    .readdirSync(dirPath)
    .filter((file) => file.endsWith(".md"));
}

export function readImportedItem(
  draftVersionId: string,
  itemFileName: string
): string {
  const filePath = itemPath(draftVersionId, itemFileName);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Imported item not found: ${itemFileName}`);
  }

  return fs.readFileSync(filePath, "utf8");
}

export function writeImportedItemStatus(
  draftVersionId: string,
  itemFileName: string,
  status: ImportedKnowledgeStatus
): void {
  const dirPath = path.resolve("skill/drafts", draftVersionId);
  ensureDir(dirPath);

  const payload = {
    status,
    updated_at: new Date().toISOString(),
  };

  fs.writeFileSync(
    statusPath(draftVersionId, itemFileName),
    JSON.stringify(payload, null, 2),
    "utf8"
  );
}

export function readImportedItemStatus(
  draftVersionId: string,
  itemFileName: string
): ImportedKnowledgeStatus {
  const filePath = statusPath(draftVersionId, itemFileName);

  if (!fs.existsSync(filePath)) {
    return "pending";
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = JSON.parse(raw) as { status?: string };

  if (
    parsed.status === "approved" ||
    parsed.status === "rejected" ||
    parsed.status === "pending"
  ) {
    return parsed.status;
  }

  return "pending";
}