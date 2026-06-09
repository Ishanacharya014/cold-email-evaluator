import type { AuthAction } from "../auth/auth-types.js";
import { authenticateAndAuthorize } from "../auth/auth-check.js";

export function requireAuth(apiKey: string, action: AuthAction) {
  const result = authenticateAndAuthorize(apiKey, action);

  if (!result.ok || !result.client) {
    throw new Error(result.reason ?? "Unauthorized.");
  }

  return result.client;
}