import type { Job, Queue } from 'bullmq';
import type {
  FilteredJobData,
  FilteredJobResult,
  FinalJobData,
  FinalJobResult,
  QueueProvider,
} from '../../core/queue/types';
import type { AiProvider } from '../../core/ai/types';
import type { Article, ArticleRepository } from '../../core/db/types';
import { FILTERED_QUEUE_NAME } from '../../core/queue/constants/filtered/filtered.constant';
import { FINAL_QUEUE_NAME } from '../../core/queue/constants/final/final.constant';
import { ArticleStatus } from '../../core/db/enums';
import { AiRewriterService } from './services';
import type { RewriterService } from './types';

export class Rewriter {
  private readonly queueProvider: QueueProvider;
  private readonly rewriterService: RewriterService;
  private readonly articleRepository: ArticleRepository;
  private readonly finalQueue: Queue<FinalJobData, FinalJobResult, string>;

  public constructor(
    articleRepository: ArticleRepository,
    queueProvider: QueueProvider,
    aiProvider: AiProvider,
  ) {
    this.articleRepository = articleRepository;
    this.queueProvider = queueProvider;
    this.rewriterService = new AiRewriterService(aiProvider);
    this.finalQueue = this.queueProvider.createQueue<FinalJobData, FinalJobResult>(
      FINAL_QUEUE_NAME,
    );
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

    const article = this.buildArticle(rewrittenTitle, job.data);

    await this.saveArticle(article);

    return { processedAt: new Date().toISOString(), rewrittenTitle };
  }

  private buildArticle(
    rewrittenTitle: string,
    data: FilteredJobData,
  ): Omit<Article, 'id' | 'created'> {
    return {
      title: rewrittenTitle,
      image: data.image,
      source: data.source,
      status: ArticleStatus.New,
    };
  }

  private async saveArticle(article: Omit<Article, 'id' | 'created'>): Promise<void> {
    await this.articleRepository.create(article);

    await this.finalQueue.add('article', {
      title: article.title,
      image: article.image,
      source: article.source,
    });
  }
}
