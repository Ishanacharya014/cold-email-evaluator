import type { AuthAction, AuthClient, AuthCheckResult, AuthRole } from "./auth-types.js";
import { getClientByApiKey, markClientUsed } from "./key-manager.js";

const READ_ONLY_ACTIONS: AuthAction[] = [
  "evaluate_email",
  "rewrite_email",
  "suggest_cold_email_subject",
  "explain_cold_email_score",
  "check_fixed_suggestions",
  "list_imported_knowledge",
  "read_imported_knowledge",
];

const ADMIN_ACTIONS: AuthAction[] = [
  ...READ_ONLY_ACTIONS,
  "import_knowledge",
  "approve_imported_knowledge",
  "reject_imported_knowledge",
  "create_skill_draft",
  "validate_skill_version",
  "publish_skill_version",
  "rollback_skill_version",
  "promote_imported_knowledge",
  "create_client_key",
  "list_clients",
  "rotate_client_key",
  "revoke_client_key",
];

function allowedActionsForRole(role: AuthRole): AuthAction[] {
  return role === "admin" ? ADMIN_ACTIONS : READ_ONLY_ACTIONS;
}

export function canClientAccessAction(client: AuthClient, action: AuthAction): boolean {
  if (client.status !== "active") {
    return false;
  }

  return allowedActionsForRole(client.role).includes(action);
}

export function authenticateAndAuthorize(
  apiKey: string,
  action: AuthAction
): AuthCheckResult {
  const client = getClientByApiKey(apiKey);

  if (!client) {
    return {
      ok: false,
      reason: "Invalid API key.",
    };
  }

  if (client.status !== "active") {
    return {
      ok: false,
      reason: "API key is revoked or inactive.",
      client,
    };
  }

  if (!canClientAccessAction(client, action)) {
    return {
      ok: false,
      reason: `Client role "${client.role}" cannot access action "${action}".`,
      client,
    };
  }

  markClientUsed(client.id);

  return {
    ok: true,
    client,
  };
}