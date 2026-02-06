import type { Source, SourceRepository } from '../../core/db/types';
import type { CollectorJobData, CollectorJobResult, QueueProvider } from '../../core/queue/types';
import type { ScraperProvider } from '../../core/scraper/types';
import { FootballScraper } from './scrapers/football/football.scraper';
import {
  COLLECTOR_QUEUE_NAME,
  COLLECTOR_REPEAT_INTERVAL,
  COLLECTOR_REPEAT_INTERVAL_1_MIN,
} from '../../core/queue/constants/collector/collector.constants';

export class Collector {
  private readonly sourceRepository: SourceRepository;
  private readonly queueProvider: QueueProvider;
  private readonly scraperProvider: ScraperProvider;

  public constructor(
    sourceRepository: SourceRepository,
    queueProvider: QueueProvider,
    scraperProvider: ScraperProvider,
  ) {
    this.sourceRepository = sourceRepository;
    this.queueProvider = queueProvider;
    this.scraperProvider = scraperProvider;
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
      case 'football': {
        const scraper = new FootballScraper(this.scraperProvider);
        await scraper.scrap(source);
        break;
      }
      default:
        console.warn(`Unknown source key: ${source.key}`);
        break;
    }
  }

  private registerWorker(): void {
    this.queueProvider.createWorker<CollectorJobData, CollectorJobResult>(
      COLLECTOR_QUEUE_NAME,
      async () => {
        await this.run();
        return { processedAt: new Date().toISOString() };
      },
    );
  }

  private async scheduleRepeatableJob(): Promise<void> {
    const queue = this.queueProvider.createQueue<CollectorJobData, CollectorJobResult>(
      COLLECTOR_QUEUE_NAME,
    );

    await queue.add(
      'collector-run',
      { triggeredAt: new Date().toISOString() },
      { repeat: { every: COLLECTOR_REPEAT_INTERVAL_1_MIN } },
    );
  }
}
