export function readPort(value: string | undefined, fallback: number): number {
  if (!value) return fallback;

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0 || parsed > 65535) {
    throw new Error(`Invalid port value: ${value}`);
  }

  return parsed;
}

export const config = {
  host: process.env.HOST ?? "127.0.0.1",
  mcpPort: readPort(process.env.MCP_PORT ?? process.env.PORT, 3001),
  webPort: readPort(process.env.WEB_PORT, 3002),
  activeSkillVersion: process.env.ACTIVE_SKILL_VERSION ?? "v1.0",
  authDataDir: process.env.AUTH_DATA_DIR ?? "data/auth",
};