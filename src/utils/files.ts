import fs from "node:fs";
import path from "node:path";

export function readFile(filePath: string): string {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  return fs.readFileSync(absolutePath, "utf8");
}