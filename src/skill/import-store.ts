import fs from "node:fs";
import path from "node:path";

function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function writeImportedItem(
  draftVersionId: string,
  itemId: string,
  content: string
): void {
  const dirPath = path.resolve("skill/drafts", draftVersionId);
  ensureDir(dirPath);

  const filePath = path.resolve(dirPath, `${itemId}.md`);
  fs.writeFileSync(filePath, content, "utf8");
}

export function listImportedItems(draftVersionId: string): string[] {
  const dirPath = path.resolve("skill/drafts", draftVersionId);

  if (!fs.existsSync(dirPath)) {
    return [];
  }

  return fs.readdirSync(dirPath).filter((file) => file.endsWith(".md"));
}

export function readImportedItem(draftVersionId: string, itemId: string): string {
  const filePath = path.resolve("skill/drafts", draftVersionId, `${itemId}.md`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Imported item not found: ${itemId}`);
  }

  return fs.readFileSync(filePath, "utf8");
}