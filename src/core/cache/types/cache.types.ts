import type { RedisOptions } from 'ioredis';

export interface CacheProvider {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds: number): Promise<void>;
  del(key: string): Promise<void>;
}

export type CacheRedisConfig = RedisOptions;
