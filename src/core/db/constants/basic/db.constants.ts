import type { MySqlConfig } from '../../types';

const DEFAULT_EMPTY: string = '';

export const getMySqlConfigFromEnv = (): MySqlConfig => {
  const portRaw: string | undefined = process.env.DB_PORT;
  const port: number | undefined = portRaw ? Number(portRaw) : undefined;

  return {
    host: process.env.DB_HOST ?? DEFAULT_EMPTY,
    user: process.env.DB_USER ?? DEFAULT_EMPTY,
    password: process.env.DB_PASSWORD ?? DEFAULT_EMPTY,
    database: process.env.DB_NAME ?? DEFAULT_EMPTY,
    port,
  };
};
