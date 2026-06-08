import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { importKnowledge } from "../src/skill/import-manager.js";
import {
  approveImportedKnowledge,
  listImportedKnowledge,
} from "../src/skill/import-review.js";
import { promoteImportedKnowledge } from "../src/skill/import-publisher.js";
import { validateSkillVersion } from "../src/skill/version-manager.js";
import { readVersionFile } from "../src/storage/version-store.js";

function cleanupVersion(versionId: string): void {
  fs.rmSync(path.resolve("skill/versions", versionId), {
    recursive: true,
    force: true,
  });

  fs.rmSync(path.resolve("skill/drafts", versionId), {
    recursive: true,
    force: true,
  });
}

describe("import workflow", () => {
  it("imports, approves, promotes, and validates knowledge", () => {
    const suffix = Date.now().toString();
    const draftVersionId = `v1.1-import-${suffix}`;
    const targetVersionId = `v1.1-promoted-${suffix}`;

    try {
      const importResult = importKnowledge({
        source_text:
          "A good subject line should be short, personal, and aligned with the body.",
        source_type: "note",
        tags: ["subject", "rewrite"],
        base_version_id: "v1.0",
        draft_version_id: draftVersionId,
      });

      const itemFileName = `${importResult.item_id}.md`;

      const before = listImportedKnowledge(draftVersionId);
      expect(before.length).toBe(1);
      expect(before[0].status).toBe("pending");

      const approved = approveImportedKnowledge(draftVersionId, itemFileName);
      expect(approved.status).toBe("approved");

      const after = listImportedKnowledge(draftVersionId);
      expect(after[0].status).toBe("approved");

      const promoted = promoteImportedKnowledge({
        base_version_id: "v1.0",
        source_draft_version_id: draftVersionId,
        target_version_id: targetVersionId,
      });

      expect(promoted.ok).toBe(true);
      expect(promoted.promoted_items).toContain(itemFileName);

      const validation = validateSkillVersion(targetVersionId);
      expect(validation.valid).toBe(true);

      const rubric = readVersionFile(targetVersionId, "rubric.md");
      expect(rubric).toContain("Imported Knowledge");
    } finally {
      cleanupVersion(draftVersionId);
      cleanupVersion(targetVersionId);
    }
  });
});