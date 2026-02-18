import type { TelegramConfig } from '../types';

const DEFAULT_EMPTY: string = '';

export const getTelegramConfigFromEnv = (): TelegramConfig => {
  return {
    token: process.env.TELEGRAM_BOT_TOKEN ?? DEFAULT_EMPTY,
    chatId: process.env.TELEGRAM_CHAT_ID ?? DEFAULT_EMPTY,
  };
};
