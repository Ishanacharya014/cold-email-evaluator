import fs from "node:fs";
import path from "node:path";
import type { AuthClient } from "../auth/auth-types.js";

const CLIENT_STORE_PATH = path.resolve("data/auth/clients.json");

function ensureStoreFile(): void {
  const dirPath = path.dirname(CLIENT_STORE_PATH);

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  if (!fs.existsSync(CLIENT_STORE_PATH)) {
    fs.writeFileSync(CLIENT_STORE_PATH, "[]", "utf8");
  }
}

export function loadClients(): AuthClient[] {
  ensureStoreFile();

  const raw = fs.readFileSync(CLIENT_STORE_PATH, "utf8");

  try {
    const parsed = JSON.parse(raw) as AuthClient[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveClients(clients: AuthClient[]): void {
  ensureStoreFile();
  fs.writeFileSync(CLIENT_STORE_PATH, JSON.stringify(clients, null, 2), "utf8");
}

export function findClientByApiKey(apiKey: string): AuthClient | null {
  const clients = loadClients();
  return clients.find((client) => client.api_key === apiKey) ?? null;
}

export function findClientById(clientId: string): AuthClient | null {
  const clients = loadClients();
  return clients.find((client) => client.id === clientId) ?? null;
}

export function upsertClient(client: AuthClient): AuthClient {
  const clients = loadClients();
  const index = clients.findIndex((item) => item.id === client.id);

  if (index >= 0) {
    clients[index] = client;
  } else {
    clients.push(client);
  }

  saveClients(clients);
  return client;
}

export function listClients(): AuthClient[] {
  return loadClients();
}