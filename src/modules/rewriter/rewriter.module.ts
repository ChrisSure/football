import type { Job } from 'bullmq';
import type { FilteredJobData, FilteredJobResult, QueueProvider } from '../../core/queue/types';
import { FILTERED_QUEUE_NAME } from '../../core/queue/constants/filtered/filtered.constant';

export class Rewriter {
  private readonly queueProvider: QueueProvider;

  public constructor(queueProvider: QueueProvider) {
    this.queueProvider = queueProvider;
  }

  public async start(): Promise<void> {
    this.registerWorker();
  }

  private registerWorker(): void {
    this.queueProvider.createWorker<FilteredJobData, FilteredJobResult>(
      FILTERED_QUEUE_NAME,
      (job) => this.processJob(job),
      { removeOnComplete: { count: 0 } },
    );
  }

  private async processJob(
    job: Job<FilteredJobData, FilteredJobResult>,
  ): Promise<FilteredJobResult> {
    console.log(`[Rewriter] Processing job ${job.id}:`, job.data);

    return { processedAt: new Date().toISOString() };
  }
}
