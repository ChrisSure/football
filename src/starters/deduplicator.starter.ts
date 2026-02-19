import type { DbProvider } from '../core/db/types';
import { MySqlArticleRepository } from '../core/db/repositories';
import type { QueueProvider } from '../core/queue/types';
import { createAiProvider } from '../core/ai/providers';
import { Deduplicator, AiDeduplicatorService } from '../modules/deduplicator';

export const startDeduplicator = async (db: DbProvider, queueProvider: QueueProvider): Promise<void> => {
  const articleRepository = new MySqlArticleRepository(db);
  const aiProvider = createAiProvider();
  const deduplicatorService = new AiDeduplicatorService(aiProvider);
  const deduplicator = new Deduplicator(articleRepository, queueProvider, deduplicatorService);
  await deduplicator.start();
};
