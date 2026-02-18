import type TelegramBot from 'node-telegram-bot-api';

export interface TelegramProvider {
  readonly bot: TelegramBot;
  readonly chatId: string;
}

export interface TelegramConfig {
  token: string;
  chatId: string;
}
