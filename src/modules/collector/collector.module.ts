import type { Source, SourceRepository } from '../../core/db/types';
import type {
  CollectorJobData,
  CollectorJobResult,
  QueueProvider,
  TimerJobData,
  TimerJobResult,
} from '../../core/queue/types';
import type { ScraperProvider } from '../../core/scraper/types';
import { SourceKey } from './enums';
import { FootballScraper } from './scrapers/football/football.scraper';
import type { ArticleQueue } from './types/scraper.types';
import { COLLECTOR_QUEUE_NAME } from '../../core/queue/constants/collector/collector.constant';
import {
  COLLECTOR_REPEAT_INTERVAL_1_MIN,
  TIMER_QUEUE_NAME,
} from '../../core/queue/constants/timer/timer.constant';

export class Collector {
  private readonly sourceRepository: SourceRepository;
  private readonly queueProvider: QueueProvider;
  private readonly scraperProvider: ScraperProvider;
  private readonly articleQueue: ArticleQueue;

  public constructor(
    sourceRepository: SourceRepository,
    queueProvider: QueueProvider,
    scraperProvider: ScraperProvider,
  ) {
    this.sourceRepository = sourceRepository;
    this.queueProvider = queueProvider;
    this.scraperProvider = scraperProvider;
    this.articleQueue = this.queueProvider.createQueue<CollectorJobData, CollectorJobResult>(
      COLLECTOR_QUEUE_NAME,
    );
  }

  public async start(): Promise<void> {
    //await this.scheduleRepeatableJob();
    //this.registerWorker();
    await this.run();
  }

  private async run(): Promise<void> {
    const sources = await this.sourceRepository.getLastActive();

    for (const source of sources) {
      await this.processSource(source);
    }
  }

  private async processSource(source: Source): Promise<void> {
    switch (source.key) {
      case SourceKey.Football: {
        const scraper = new FootballScraper(this.scraperProvider, this.articleQueue);
        await scraper.scrap(source);
        break;
      }
      default:
        console.warn(`Unknown source key: ${source.key}`);
    }
  }

  private registerWorker(): void {
    this.queueProvider.createWorker<TimerJobData, TimerJobResult>(TIMER_QUEUE_NAME, async () => {
      await this.run();
      return { processedAt: new Date().toISOString() };
    });
  }

  private async scheduleRepeatableJob(): Promise<void> {
    const queue = this.queueProvider.createQueue<TimerJobData, TimerJobResult>(TIMER_QUEUE_NAME);

    await queue.add(
      'collector-run',
      { triggeredAt: new Date().toISOString() },
      { repeat: { every: COLLECTOR_REPEAT_INTERVAL_1_MIN } },
    );
  }
}
