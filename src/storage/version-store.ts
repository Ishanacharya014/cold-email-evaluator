import fs from "node:fs";
import path from "node:path";

function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function listVersionFolders(): string[] {
  const baseDir = path.resolve("skill/versions");

  if (!fs.existsSync(baseDir)) {
    return [];
  }

  return fs
    .readdirSync(baseDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

export function readVersionFile(versionId: string, fileName: string): string {
  const filePath = path.resolve("skill/versions", versionId, fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing version file: ${filePath}`);
  }

  return fs.readFileSync(filePath, "utf8");
}

export function writeVersionFile(
  versionId: string,
  fileName: string,
  content: string
): void {
  const versionDir = path.resolve("skill/versions", versionId);
  ensureDir(versionDir);

  const filePath = path.resolve(versionDir, fileName);
  fs.writeFileSync(filePath, content, "utf8");
}

export function copyVersionFolder(sourceVersionId: string, targetVersionId: string): void {
  const sourceDir = path.resolve("skill/versions", sourceVersionId);
  const targetDir = path.resolve("skill/versions", targetVersionId);

  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Source version not found: ${sourceVersionId}`);
  }

  ensureDir(targetDir);

  const files = fs.readdirSync(sourceDir);

  for (const file of files) {
    const sourceFile = path.resolve(sourceDir, file);
    const targetFile = path.resolve(targetDir, file);

    if (fs.statSync(sourceFile).isFile()) {
      fs.copyFileSync(sourceFile, targetFile);
    }
  }
}