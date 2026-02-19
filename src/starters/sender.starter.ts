import type { DbProvider } from '../core/db/types';
import { MySqlArticleRepository } from '../core/db/repositories';
import type { QueueProvider } from '../core/queue/types';
import { createTelegramProvider } from '../core/telegram/providers';
import { Sender } from '../modules/sender';

export const startSender = async (db: DbProvider, queueProvider: QueueProvider): Promise<void> => {
  const articleRepository = new MySqlArticleRepository(db);
  const telegramProvider = createTelegramProvider();
  const sender = new Sender(articleRepository, queueProvider, telegramProvider);
  await sender.start();
};
