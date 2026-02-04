import type { QueueRedisConfig } from '../types';

import { DEFAULT_EMPTY, DEFAULT_REDIS_DB, DEFAULT_REDIS_PORT } from '../constants/queue.constants';

const parseNumber = (value: string | undefined): number | undefined => {
  if (!value) {
    return undefined;
  }

  const parsed: number = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const parseBoolean = (value: string | undefined): boolean => {
  if (!value) {
    return false;
  }

  return value.toLowerCase() === 'true';
};

const emptyToUndefined = (value: string | undefined): string | undefined => {
  if (!value) {
    return undefined;
  }

  return value;
};

export const getQueueRedisConfigFromEnv = (): QueueRedisConfig => {
  const port: number = parseNumber(process.env.QUEUE_REDIS_PORT) ?? DEFAULT_REDIS_PORT;
  const db: number = parseNumber(process.env.QUEUE_REDIS_DB) ?? DEFAULT_REDIS_DB;
  const tlsEnabled: boolean = parseBoolean(process.env.QUEUE_REDIS_TLS);

  return {
    host: process.env.QUEUE_REDIS_HOST ?? DEFAULT_EMPTY,
    port,
    password: emptyToUndefined(process.env.QUEUE_REDIS_PASSWORD ?? DEFAULT_EMPTY),
    db,
    tls: tlsEnabled ? {} : undefined,
  };
};
