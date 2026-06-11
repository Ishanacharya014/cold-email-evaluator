import { listAllClients, createClientKey } from "./key-manager.js";

function bootstrapAdmin() {
  const existingAdmins = listAllClients().filter(
    (client) => client.role === "admin" && client.status === "active"
  );

  if (existingAdmins.length > 0) {
    console.log("An active admin already exists. No new admin was created.");
    console.log(
      JSON.stringify(
        {
          existing_admins: existingAdmins.map((client) => ({
            id: client.id,
            name: client.name,
            role: client.role,
            status: client.status,
            created_at: client.created_at,
            updated_at: client.updated_at,
          })),
        },
        null,
        2
      )
    );
    return;
  }

  const result = createClientKey({
    name: "Initial Admin",
    role: "admin",
  });

  console.log("Initial admin created successfully.");
  console.log(
    JSON.stringify(
      {
        client: {
          id: result.client.id,
          name: result.client.name,
          role: result.client.role,
          status: result.client.status,
          created_at: result.client.created_at,
          updated_at: result.client.updated_at,
        },
        secret_api_key: result.secret_api_key,
      },
      null,
      2
    )
  );
}

bootstrapAdmin();