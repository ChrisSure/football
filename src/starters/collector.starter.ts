import type { DbProvider } from '../core/db/types';
import { MySqlSourceRepository, MySqlArticleRepository } from '../core/db/repositories';
import type { QueueProvider } from '../core/queue/types';
import { createScraperProvider } from '../core/scraper/providers';
import { Collector } from '../modules/collector';

export const startCollector = async (
  db: DbProvider,
  queueProvider: QueueProvider,
): Promise<void> => {
  const sourceRepository = new MySqlSourceRepository(db);
  const articleRepository = new MySqlArticleRepository(db);
  const scraperProvider = createScraperProvider();
  const collector = new Collector(
    sourceRepository,
    articleRepository,
    queueProvider,
    scraperProvider,
  );
  await collector.start();
};
