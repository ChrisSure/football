import type { DbProvider } from '../core/db/types';
import { MySqlArticleRepository } from '../core/db/repositories';
import type { QueueProvider } from '../core/queue/types';
import { createAiProvider } from '../core/ai/providers';
import {
  Deduplicator,
  AiDeduplicatorService,
  AiTranslationService,
  AiContentQualityService,
} from '../modules/deduplicator';

export const startDeduplicator = async (
  db: DbProvider,
  queueProvider: QueueProvider,
): Promise<void> => {
  const articleRepository = new MySqlArticleRepository(db);
  const aiProvider = createAiProvider();
  const deduplicatorService = new AiDeduplicatorService(aiProvider);
  const translationService = new AiTranslationService(aiProvider);
  const contentQualityService = new AiContentQualityService(aiProvider);
  const deduplicator = new Deduplicator(
    articleRepository,
    queueProvider,
    deduplicatorService,
    translationService,
    contentQualityService,
  );
  await deduplicator.start();
};
