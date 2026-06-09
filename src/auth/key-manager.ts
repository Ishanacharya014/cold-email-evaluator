import crypto from "node:crypto";
import {
  findClientByApiKey,
  findClientById,
  listClients,
  upsertClient,
} from "../storage/client-store.js";
import type {
  AuthClient,
  CreateClientInput,
  CreateClientResult,
  RotateClientResult,
} from "./auth-types.js";

function now(): string {
  return new Date().toISOString();
}

function generateApiKey(): string {
  return `cex_${crypto.randomBytes(24).toString("hex")}`;
}

function generateClientId(): string {
  return crypto.randomUUID();
}

export function createClientKey(input: CreateClientInput): CreateClientResult {
  const secret_api_key = generateApiKey();
  const timestamp = now();

  const client: AuthClient = {
    id: generateClientId(),
    name: input.name,
    api_key: secret_api_key,
    role: input.role,
    status: "active",
    created_at: timestamp,
    updated_at: timestamp,
    last_used_at: null,
  };

  upsertClient(client);

  return {
    client,
    secret_api_key,
  };
}

export function rotateClientKey(clientId: string): RotateClientResult {
  const existing = findClientById(clientId);

  if (!existing) {
    throw new Error(`Client not found: ${clientId}`);
  }

  const secret_api_key = generateApiKey();
  const updated: AuthClient = {
    ...existing,
    api_key: secret_api_key,
    updated_at: now(),
    status: "active",
  };

  upsertClient(updated);

  return {
    client: updated,
    secret_api_key,
  };
}

export function revokeClientKey(clientId: string): AuthClient {
  const existing = findClientById(clientId);

  if (!existing) {
    throw new Error(`Client not found: ${clientId}`);
  }

  const revoked: AuthClient = {
    ...existing,
    status: "revoked",
    updated_at: now(),
  };

  upsertClient(revoked);
  return revoked;
}

export function listAllClients(): AuthClient[] {
  return listClients();
}

export function getClientByApiKey(apiKey: string): AuthClient | null {
  return findClientByApiKey(apiKey);
}

export function markClientUsed(clientId: string): void {
  const existing = findClientById(clientId);

  if (!existing) {
    return;
  }

  upsertClient({
    ...existing,
    last_used_at: now(),
    updated_at: now(),
  });
}