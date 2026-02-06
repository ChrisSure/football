import Redis from 'ioredis';

import { getCacheRedisConfigFromEnv } from '../helpers/cache.helpers';
import type { CacheProvider, CacheRedisConfig } from '../types';

export class RedisCacheProvider implements CacheProvider {
  private readonly config: CacheRedisConfig;
  private client: Redis | null = null;

  public constructor(config: CacheRedisConfig) {
    this.config = config;
  }

  public async connect(): Promise<void> {
    if (this.client) {
      return;
    }

    this.client = new Redis(this.config);
    await this.client.ping();
  }

  public async disconnect(): Promise<void> {
    if (!this.client) {
      return;
    }

    await this.client.quit();
    this.client = null;
  }

  public async get<T>(key: string): Promise<T | null> {
    if (!this.client) {
      throw new Error('Cache provider is not connected.');
    }

    const value: string | null = await this.client.get(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  }

  public async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    if (!this.client) {
      throw new Error('Cache provider is not connected.');
    }

    const serialized: string = JSON.stringify(value);
    await this.client.set(key, serialized, 'EX', ttlSeconds);
  }

  public async del(key: string): Promise<void> {
    if (!this.client) {
      throw new Error('Cache provider is not connected.');
    }

    await this.client.del(key);
  }
}

export const createCacheProvider = (): CacheProvider => {
  const config: CacheRedisConfig = getCacheRedisConfigFromEnv();
  return new RedisCacheProvider(config);
};
