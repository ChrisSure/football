import type { Job } from 'bullmq';
import type { Article, ArticleRepository } from '../../core/db/types';
import type { ArticleFilter } from '../../core/filter';
import type { CollectorJobData, CollectorJobResult, QueueProvider } from '../../core/queue/types';
import { COLLECTOR_QUEUE_NAME } from '../../core/queue/constants/collector/collector.constant';

export class Deduplicator {
  private readonly articleRepository: ArticleRepository;
  private readonly queueProvider: QueueProvider;
  private readonly articleFilter: ArticleFilter;

  public constructor(
    articleRepository: ArticleRepository,
    queueProvider: QueueProvider,
    articleFilter: ArticleFilter,
  ) {
    this.articleRepository = articleRepository;
    this.queueProvider = queueProvider;
    this.articleFilter = articleFilter;
  }

  public async start(): Promise<void> {
    this.registerWorker();
    const latestArticles = await this.getLatestArticles();
    if (latestArticles.length) {
      console.log(latestArticles, 'latestArticles');
    }
  }

  private getLatestArticles(): Promise<readonly Article[]> {
    return this.articleRepository.getLastActiveAll(24);
  }

  private registerWorker(): void {
    this.queueProvider.createWorker<CollectorJobData, CollectorJobResult>(
      COLLECTOR_QUEUE_NAME,
      async (job) => {
        console.log(`[Deduplicator] Received job ${job.id}`, job.data);

        const isValid = this.articleFilter.check({ title: job.data.title });

        if (!isValid) {
          await this.discardJob(job);
          return { processedAt: new Date().toISOString() };
        }

        return { processedAt: new Date().toISOString() };
      },
    );
  }

  private async discardJob(job: Job<CollectorJobData, CollectorJobResult>): Promise<void> {
    await job.remove();
  }
}
