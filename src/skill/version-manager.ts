import fs from "node:fs";
import path from "node:path";
import { copyVersionFolder, listVersionFolders, readVersionFile, writeVersionFile } from "../storage/version-store.js";
import { loadManifest } from "./manifest-loader.js";

function updateManifestActiveVersion(versionId: string): void {
  const manifestPath = path.resolve("skill/manifest.json");
  const manifest = loadManifest();

  manifest.active_version = versionId;

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
}

export function createSkillDraft(baseVersionId: string, draftVersionId: string): void {
  copyVersionFolder(baseVersionId, draftVersionId);
}

export function validateSkillVersion(versionId: string): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  const requiredFiles = [
    "rubric.md",
    "examples.md",
    "anti_examples.md",
    "rewrite_rules.md",
    "subject_rules.md"
  ];

  for (const file of requiredFiles) {
    try {
      readVersionFile(versionId, file);
    } catch {
      issues.push(`Missing file: ${file}`);
    }
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

export function publishSkillVersion(versionId: string): { published: boolean; issues: string[] } {
  const validation = validateSkillVersion(versionId);

  if (!validation.valid) {
    return {
      published: false,
      issues: validation.issues
    };
  }

  updateManifestActiveVersion(versionId);

  return {
    published: true,
    issues: []
  };
}

export function rollbackSkillVersion(versionId: string): { rolledBack: boolean; issues: string[] } {
  const available = listVersionFolders();

  if (!available.includes(versionId)) {
    return {
      rolledBack: false,
      issues: [`Version not found: ${versionId}`]
    };
  }

  updateManifestActiveVersion(versionId);

  return {
    rolledBack: true,
    issues: []
  };
}