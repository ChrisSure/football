import TelegramBot from 'node-telegram-bot-api';
import { getTelegramConfigFromEnv } from '../constants/telegram.constant';
import type { TelegramProvider, TelegramConfig } from '../types';

export class TelegramBotProvider implements TelegramProvider {
  public readonly bot: TelegramBot;
  public readonly chatId: string;

  public constructor(config: TelegramConfig) {
    this.bot = new TelegramBot(config.token, { polling: false });
    this.chatId = config.chatId;
  }
}

export const createTelegramProvider = (): TelegramProvider => {
  const config: TelegramConfig = getTelegramConfigFromEnv();
  return new TelegramBotProvider(config);
};
