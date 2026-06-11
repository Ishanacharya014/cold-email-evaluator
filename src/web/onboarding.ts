import type { AuthRole } from "../auth/auth-types.js";
import { createClientKey } from "../auth/key-manager.js";

export interface CreateClientOnboardingInput {
  name: string;
  role: AuthRole;
}

export interface ClientPermissionsSummary {
  can_evaluate: boolean;
  can_rewrite: boolean;
  can_suggest_subject: boolean;
  can_explain_score: boolean;
  can_check_fixed_suggestions: boolean;
  can_manage_skill: boolean;
  can_manage_imports: boolean;
  can_manage_clients: boolean;
}

export interface CreateClientOnboardingResult {
  client: {
    id: string;
    name: string;
    role: AuthRole;
    status: string;
    created_at: string;
    updated_at: string;
    last_used_at: string | null;
  };
  secret_api_key: string;
  permissions: ClientPermissionsSummary;
  allowed_actions: string[];
  blocked_actions: string[];
  instructions: string[];
}

function getPermissions(role: AuthRole): ClientPermissionsSummary {
  if (role === "admin") {
    return {
      can_evaluate: true,
      can_rewrite: true,
      can_suggest_subject: true,
      can_explain_score: true,
      can_check_fixed_suggestions: true,
      can_manage_skill: true,
      can_manage_imports: true,
      can_manage_clients: true,
    };
  }

  return {
    can_evaluate: true,
    can_rewrite: true,
    can_suggest_subject: true,
    can_explain_score: true,
    can_check_fixed_suggestions: true,
    can_manage_skill: false,
    can_manage_imports: false,
    can_manage_clients: false,
  };
}

function getAllowedActions(role: AuthRole): string[] {
  const base = [
    "evaluate_email",
    "rewrite_email",
    "suggest_cold_email_subject",
    "explain_cold_email_score",
    "check_fixed_suggestions",
  ];

  if (role === "admin") {
    return [
      ...base,
      "import_knowledge",
      "list_imported_knowledge",
      "read_imported_knowledge",
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
  }

  return base;
}

function getBlockedActions(role: AuthRole): string[] {
  if (role === "admin") {
    return [];
  }

  return [
    "import_knowledge",
    "list_imported_knowledge",
    "read_imported_knowledge",
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
}

export function createClientOnboarding(
  input: CreateClientOnboardingInput
): CreateClientOnboardingResult {
  const name = input.name.trim();

  if (!name) {
    throw new Error("Client name is required.");
  }

  const result = createClientKey({
    name,
    role: input.role,
  });

  return {
    client: {
      id: result.client.id,
      name: result.client.name,
      role: result.client.role,
      status: result.client.status,
      created_at: result.client.created_at,
      updated_at: result.client.updated_at,
      last_used_at: result.client.last_used_at ?? null,
    },
    secret_api_key: result.secret_api_key,
    permissions: getPermissions(input.role),
    allowed_actions: getAllowedActions(input.role),
    blocked_actions: getBlockedActions(input.role),
    instructions: [
      "Copy the API key now. It is shown only once.",
      "Store it securely in the AI client or secret manager.",
      "Use the key as api_key when calling MCP tools.",
      "Rotate the key immediately if it is exposed.",
    ],
  };
}