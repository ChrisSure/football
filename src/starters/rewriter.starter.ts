import type { DbProvider } from '../core/db/types';
import { MySqlArticleRepository } from '../core/db/repositories';
import type { QueueProvider } from '../core/queue/types';
import { createAiProvider } from '../core/ai/providers';
import { Rewriter } from '../modules/rewriter';

export const startRewriter = async (
  db: DbProvider,
  queueProvider: QueueProvider,
): Promise<void> => {
  const articleRepository = new MySqlArticleRepository(db);
  const aiProvider = createAiProvider();
  const rewriter = new Rewriter(articleRepository, queueProvider, aiProvider);
  await rewriter.start();
};
