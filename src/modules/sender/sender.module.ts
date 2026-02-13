import type { Job } from 'bullmq';
import type { FinalJobData, FinalJobResult, QueueProvider } from '../../core/queue/types';
import type { TelegramProvider } from '../../core/telegram/types';
import { FINAL_QUEUE_NAME } from '../../core/queue/constants/final/final.constant';
import { TelegramSenderService } from './services';
import type { SenderService } from './types';

export class Sender {
  private readonly queueProvider: QueueProvider;
  private readonly senderService: SenderService;

  public constructor(queueProvider: QueueProvider, telegramProvider: TelegramProvider) {
    this.queueProvider = queueProvider;
    this.senderService = new TelegramSenderService(telegramProvider);
  }

  public async start(): Promise<void> {
    this.registerWorker();
  }

  private registerWorker(): void {
    this.queueProvider.createWorker<FinalJobData, FinalJobResult>(
      FINAL_QUEUE_NAME,
      (job) => this.processJob(job),
      { removeOnComplete: { count: 0 } },
    );
  }

  private async processJob(job: Job<FinalJobData, FinalJobResult>): Promise<FinalJobResult> {
    await this.senderService.send(job.data);
    return { processedAt: new Date().toISOString() };
  }
}
