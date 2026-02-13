import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import { createDbProvider } from './core/db/providers';
import type { DbProvider } from './core/db/types';
import { MySqlArticleRepository, MySqlSourceRepository } from './core/db/repositories';
import { createQueueProvider } from './core/queue/providers';
import type { QueueProvider } from './core/queue/types';
import { createScraperProvider } from './core/scraper/providers';
import { Collector } from './modules/collector';
import { createAiProvider } from './core/ai/providers';
import { Deduplicator, AiDeduplicatorService } from './modules/deduplicator';
import { Rewriter } from './modules/rewriter';

export const app = express();

app.get('/', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

const initDatabase = async (): Promise<DbProvider> => {
  const db = createDbProvider();
  await db.connect();
  return db;
};

const initQueueProvider = (): QueueProvider => {
  return createQueueProvider();
};

const startCollector = async (db: DbProvider, queueProvider: QueueProvider): Promise<void> => {
  const sourceRepository = new MySqlSourceRepository(db);
  const scraperProvider = createScraperProvider();
  const collector = new Collector(sourceRepository, queueProvider, scraperProvider);
  await collector.start();
};

const startDeduplicator = async (db: DbProvider, queueProvider: QueueProvider): Promise<void> => {
  const articleRepository = new MySqlArticleRepository(db);
  const aiProvider = createAiProvider();
  const deduplicatorService = new AiDeduplicatorService(aiProvider);
  const deduplicator = new Deduplicator(articleRepository, queueProvider, deduplicatorService);
  await deduplicator.start();
};

const startRewriter = async (db: DbProvider, queueProvider: QueueProvider): Promise<void> => {
  const aiProvider = createAiProvider();
  const rewriter = new Rewriter(queueProvider, aiProvider);
  await rewriter.start();
};

export const startServer = async (): Promise<void> => {
  const db = await initDatabase();
  const queueProvider = initQueueProvider();

  await startCollector(db, queueProvider);
  await startDeduplicator(db, queueProvider);
  await startRewriter(db, queueProvider);

  const port: number = Number(process.env.PORT ?? 3000);

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer().then();
