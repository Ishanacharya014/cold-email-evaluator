import { readFile } from "../utils/files.js";
import type { SkillManifest } from "./skill-types.js";

export function loadManifest(): SkillManifest {
  const raw = readFile("skill/manifest.json");

  return JSON.parse(raw) as SkillManifest;
}