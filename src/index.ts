import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import { createDbProvider } from './core/db/providers';
import { MySqlSourceRepository } from './core/db/repositories';
import { Collector } from './modules/collector';

export const app = express();

app.get('/', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

const startCollector = async (): Promise<void> => {
  const db = createDbProvider();
  await db.connect();

  const sourceRepository = new MySqlSourceRepository(db);
  const collector = new Collector(sourceRepository);
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
