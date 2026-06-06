import fs from "node:fs";
import path from "node:path";

export function loadEvaluationSchema() {
  const schemaPath = path.resolve("schemas/evaluation.schema.json");
  const raw = fs.readFileSync(schemaPath, "utf8");
  return JSON.parse(raw);
}