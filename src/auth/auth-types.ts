export type AuthRole = "read_only" | "admin";

export type AuthStatus = "active" | "revoked";

export type AuthAction =
  | "evaluate_email"
  | "rewrite_email"
  | "suggest_cold_email_subject"
  | "explain_cold_email_score"
  | "check_fixed_suggestions"
  | "import_knowledge"
  | "list_imported_knowledge"
  | "read_imported_knowledge"
  | "approve_imported_knowledge"
  | "reject_imported_knowledge"
  | "create_skill_draft"
  | "validate_skill_version"
  | "publish_skill_version"
  | "rollback_skill_version"
  | "promote_imported_knowledge"
  | "create_client_key"
  | "list_clients"
  | "rotate_client_key"
  | "revoke_client_key";

export interface AuthClient {
  id: string;
  name: string;
  api_key: string;
  role: AuthRole;
  status: AuthStatus;
  created_at: string;
  updated_at: string;
  last_used_at?: string | null;
}

export interface CreateClientInput {
  name: string;
  role: AuthRole;
}

export interface CreateClientResult {
  client: AuthClient;
  secret_api_key: string;
}

export interface RotateClientResult {
  client: AuthClient;
  secret_api_key: string;
}

export interface AuthCheckResult {
  ok: boolean;
  reason?: string;
  client?: AuthClient;
}