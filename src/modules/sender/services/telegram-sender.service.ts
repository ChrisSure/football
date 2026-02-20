import type { TelegramProvider } from '../../../core/telegram/types';
import type { FinalJobData } from '../../../core/queue/types';
import type { SenderService } from '../types';
import { TITLE_EMOJIS } from '../constants/emojis.constant';

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

  private getRandomEmoji(): string {
    return TITLE_EMOJIS[Math.floor(Math.random() * TITLE_EMOJIS.length)];
  }

  private formatCaption(data: FinalJobData): string {
    const emoji = this.getRandomEmoji();
    const lines: string[] = [
      `<b>${emoji} ${data.title} ${emoji}</b>`,
      '',
      `Source: ${data.source}`,
    ];

    return lines.join('\n');
  }
}
