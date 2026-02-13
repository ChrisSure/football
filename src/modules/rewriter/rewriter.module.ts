import type { Job } from 'bullmq';
import type { FilteredJobData, FilteredJobResult, QueueProvider } from '../../core/queue/types';
import type { AiProvider } from '../../core/ai/types';
import { FILTERED_QUEUE_NAME } from '../../core/queue/constants/filtered/filtered.constant';
import { AiRewriterService } from './services';
import type { RewriterService } from './types';

export class Rewriter {
  private readonly queueProvider: QueueProvider;
  private readonly rewriterService: RewriterService;

  public constructor(queueProvider: QueueProvider, aiProvider: AiProvider) {
    this.queueProvider = queueProvider;
    this.rewriterService = new AiRewriterService(aiProvider);
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

    const rewrittenTitle = await this.rewriterService.rewriteTitle(job.data.title);

    console.log(`[Rewriter] Original: "${job.data.title}" -> Rewritten: "${rewrittenTitle}"`);

    return { processedAt: new Date().toISOString(), rewrittenTitle };
  }
}
