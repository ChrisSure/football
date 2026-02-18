import type { Job, Queue } from 'bullmq';
import type { Article, ArticleRepository } from '../../core/db/types';
import type {
  CollectorJobData,
  CollectorJobResult,
  FilteredJobData,
  FilteredJobResult,
  QueueProvider,
} from '../../core/queue/types';
import { COLLECTOR_QUEUE_NAME } from '../../core/queue/constants/collector/collector.constant';
import { FILTERED_QUEUE_NAME } from '../../core/queue/constants/filtered/filtered.constant';
import type { DeduplicatorService } from './types';
import { ArticleFilterService } from './services/article-filter.service';

export class Deduplicator {
  private readonly articleRepository: ArticleRepository;
  private readonly queueProvider: QueueProvider;
  private readonly articleFilter: ArticleFilterService;
  private readonly deduplicatorService: DeduplicatorService;
  private readonly filteredQueue: Queue<FilteredJobData, FilteredJobResult, string>;

  public constructor(
    articleRepository: ArticleRepository,
    queueProvider: QueueProvider,
    deduplicatorService: DeduplicatorService,
  ) {
    this.articleRepository = articleRepository;
    this.queueProvider = queueProvider;
    this.articleFilter = new ArticleFilterService();
    this.deduplicatorService = deduplicatorService;
    this.filteredQueue = this.queueProvider.createQueue<FilteredJobData, FilteredJobResult>(
      FILTERED_QUEUE_NAME,
    );
  }

  public async start(): Promise<void> {
    this.registerWorker();
  }

  private registerWorker(): void {
    this.queueProvider.createWorker<CollectorJobData, CollectorJobResult>(
      COLLECTOR_QUEUE_NAME,
      (job) => this.processJob(job),
      { removeOnComplete: { count: 0 } },
    );
  }

  private async processJob(
    job: Job<CollectorJobData, CollectorJobResult>,
  ): Promise<CollectorJobResult> {
    if (!this.checkFilter(job.data.title)) {
      return { processedAt: new Date().toISOString() };
    }

    if (!(await this.checkDuplicate(job.data.title))) {
      return { processedAt: new Date().toISOString() };
    }

    await this.enqueueFiltered(job);
    return { processedAt: new Date().toISOString() };
  }

  private checkFilter(title: string): boolean {
    return this.articleFilter.check({ title });
  }

  private async checkDuplicate(title: string): Promise<boolean> {
    const latestArticles = await this.getLatestArticles();
    const existingTitles = latestArticles.map((article) => article.title);
    const isDuplicate = await this.deduplicatorService.isDuplicate(title, existingTitles);
    return !isDuplicate;
  }

  private getLatestArticles(): Promise<readonly Article[]> {
    return this.articleRepository.getLastActiveAll(24);
  }

  private async enqueueFiltered(job: Job<CollectorJobData, CollectorJobResult>): Promise<void> {
    await this.filteredQueue.add('article', {
      title: job.data.title,
      image: job.data.image,
      source: job.data.source,
    });
  }
}
