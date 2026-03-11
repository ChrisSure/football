import type { TelegramProvider } from '../../../core/telegram/types';
import type { FinalJobData } from '../../../core/queue/types';
import { ImageProcessorService } from '../../../core/image';
import { logger } from '../../../core/logger/providers';
import type { SenderService } from '../types';
import { TITLE_EMOJIS } from '../constants/emojis.constant';

export class TelegramSenderService implements SenderService {
  private readonly telegramProvider: TelegramProvider;
  private readonly imageProcessor: ImageProcessorService;

  public constructor(telegramProvider: TelegramProvider) {
    this.telegramProvider = telegramProvider;
    this.imageProcessor = new ImageProcessorService();
  }

  public async send(data: FinalJobData): Promise<void> {
    const caption = this.formatCaption(data);

    try {
      const imageBuffer = await this.imageProcessor.process({
        title: data.title,
        source: data.source,
        imageUrl: data.image,
      });

      await this.telegramProvider.bot.sendPhoto(this.telegramProvider.chatId, imageBuffer, {
        caption,
        parse_mode: 'HTML',
      });
    } catch (error: unknown) {
      logger.warn(`Image processing failed, sending text-only: ${error}`);

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
      `<i>Джерело: ${data.source}</i>`,
    ];

    return lines.join('\n');
  }
}
