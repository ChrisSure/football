import type { TelegramProvider } from '../../../core/telegram/types';
import type { FinalJobData } from '../../../core/queue/types';
import type { SenderService } from '../types';

export class TelegramSenderService implements SenderService {
  private readonly telegramProvider: TelegramProvider;

  public constructor(telegramProvider: TelegramProvider) {
    this.telegramProvider = telegramProvider;
  }

  public async send(data: FinalJobData): Promise<void> {
    const caption = this.formatCaption(data);

    try {
      await this.telegramProvider.bot.sendPhoto(this.telegramProvider.chatId, data.image, {
        caption,
        parse_mode: 'HTML',
      });
    } catch {
      await this.telegramProvider.bot.sendMessage(this.telegramProvider.chatId, caption, {
        parse_mode: 'HTML',
      });
    }
  }

  private formatCaption(data: FinalJobData): string {
    const lines: string[] = [`<b>${data.title}</b>`, '', `Source: ${data.source}`];

    return lines.join('\n');
  }
}
