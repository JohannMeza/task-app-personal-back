import * as vault from 'node-vault';

interface VaultResponse {
  data: {
    data: Record<string, unknown>;
  };
}

export default async (): Promise<Record<string, unknown>> => {
  // Inicializamos el cliente apuntando a tu Vault local
  const client = vault({
    apiVersion: 'v1',
    endpoint: process.env.VAULT_ADDR || 'http://localhost:8200',
    token: process.env.VAULT_TOKEN || 'my-root-token',
  });

  // Detectamos el entorno actual (dev por defecto)
  const env = process.env.NODE_ENV || 'dev';

  try {
    // Leemos los secretos usando tu motor personalizado "task-app-personal"
    const response = (await client.read(
      `task-app-personal/data/${env}/pulumi`,
    )) as VaultResponse;
    return response.data.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`No se pudo conectar a Vault en [${env}]`, message);
    return {};
  }
};
