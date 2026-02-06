import type { CacheProvider } from '../../../cache/types';
import { SOURCES_CACHE_KEY, SOURCES_CACHE_TTL } from '../../../cache/constants/cache.constants';
import type { Source, SourceRepository } from '../../types';

export class CachedSourceRepository implements SourceRepository {
  private readonly inner: SourceRepository;
  private readonly cache: CacheProvider;

  public constructor(inner: SourceRepository, cache: CacheProvider) {
    this.inner = inner;
    this.cache = cache;
  }

  public async getLastActive(): Promise<readonly Source[]> {
    const cached = await this.cache.get<Source[]>(SOURCES_CACHE_KEY);

    if (cached) {
      return cached;
    }

    const result = await this.inner.getLastActive();
    await this.cache.set(SOURCES_CACHE_KEY, result, SOURCES_CACHE_TTL);

    return result;
  }
}
