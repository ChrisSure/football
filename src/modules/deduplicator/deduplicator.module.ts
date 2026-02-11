import type { Article, ArticleRepository } from '../../core/db/types';
import type { CollectorJobData, CollectorJobResult, QueueProvider } from '../../core/queue/types';
import { COLLECTOR_QUEUE_NAME } from '../../core/queue/constants/collector/collector.constant';

export class Deduplicator {
  private readonly articleRepository: ArticleRepository;
  private readonly queueProvider: QueueProvider;

  public constructor(articleRepository: ArticleRepository, queueProvider: QueueProvider) {
    this.articleRepository = articleRepository;
    this.queueProvider = queueProvider;
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
        return { processedAt: new Date().toISOString() };
      },
    );
  }
}
