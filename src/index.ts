import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import { createDbProvider } from './core/db/providers';
import type { DbProvider } from './core/db/types';
import { MySqlSourceRepository } from './core/db/repositories';
import { createQueueProvider } from './core/queue/providers';
import { createScraperProvider } from './core/scraper/providers';
import { Collector } from './modules/collector';

export const app = express();

app.get('/', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

const initDatabase = async (): Promise<DbProvider> => {
  const db = createDbProvider();
  await db.connect();
  return db;
};

const startCollector = async (): Promise<void> => {
  const db = await initDatabase();
  const sourceRepository = new MySqlSourceRepository(db);
  const queueProvider = createQueueProvider();
  const scraperProvider = createScraperProvider();
  const collector = new Collector(sourceRepository, queueProvider, scraperProvider);
  await collector.start();
};

export const startServer = async (): Promise<void> => {
  await startCollector();

  const port: number = Number(process.env.PORT ?? 3000);

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer();
