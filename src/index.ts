import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import { createDbProvider } from './core/db/providers';
import type { DbProvider } from './core/db/types';
import { createQueueProvider } from './core/queue/providers';
import type { QueueProvider } from './core/queue/types';
import { startCollector, startDeduplicator, startRewriter, startSender } from './starters';

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

export const startServer = async (): Promise<void> => {
  const db = await initDatabase();
  const queueProvider = initQueueProvider();

  await startCollector(db, queueProvider);
  await startDeduplicator(db, queueProvider);
  await startRewriter(db, queueProvider);
  await startSender(db, queueProvider);

  const port: number = Number(process.env.PORT ?? 3000);

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer().then();
