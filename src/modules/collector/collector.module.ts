import cron from 'node-cron';
import type { Source, SourceRepository } from '../../core/db/types';
import { logger } from '../../core/logger/providers';
import type { CollectorJobData, CollectorJobResult, QueueProvider } from '../../core/queue/types';
import type { ScraperProvider } from '../../core/scraper/types';
import { SourceKey } from './enums';
import { FootballScraper } from './scrapers/football/football.scraper';
import type { ArticleQueue } from './types/scraper.types';
import { COLLECTOR_QUEUE_NAME } from '../../core/queue/constants/collector/collector.constant';
import { TribalScraper } from './scrapers/tribal/tribal.scrapper';
import { GoalScraper } from './scrapers/goal/goal.scrapper';
import { TalkScraper } from './scrapers/talk/talk.scrapper';
import { SkySportScraper } from './scrapers/skysport/skysport.scrapper';
import { TransferScraper } from './scrapers/transfer/transfer.scrapper';
import { MarcaScraper } from './scrapers/marca/marca.scrapper';
import { TeamtalkScraper } from './scrapers/teamtalk/teamtalk.scrapper';

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
    await this.run();

    /*const cronExpression = process.env.COLLECTOR_CRON_SCHEDULE || '0 * * * *';
    cron.schedule(cronExpression, async () => {
      await this.run();
    });*/
  }

  private async run(): Promise<void> {
    const sources = await this.sourceRepository.getLastActive();

    if (sources.length) {
      for (const source of sources) {
        try {
          await this.processSource(source);
        } catch (error) {
          logger.error(
            { err: error, sourceKey: source.key, sourceId: source.id },
            'Failed to process source',
          );
        }
      }
    } else {
      logger.warn('Sources not found');
    }
  }

  private async processSource(source: Source): Promise<void> {
    switch (source.key) {
      case SourceKey.Football: {
        const scraper = new FootballScraper(this.scraperProvider, this.articleQueue);
        await scraper.scrap(source);
        break;
      }
      case SourceKey.Tribal: {
        const scraper = new TribalScraper(this.scraperProvider, this.articleQueue);
        await scraper.scrap(source);
        break;
      }
      case SourceKey.Gaol: {
        const scraper = new GoalScraper(this.scraperProvider, this.articleQueue);
        await scraper.scrap(source);
        break;
      }
      case SourceKey.Talk: {
        const scraper = new TalkScraper(this.scraperProvider, this.articleQueue);
        await scraper.scrap(source);
        break;
      }
      case SourceKey.SkySport: {
        const scraper = new SkySportScraper(this.scraperProvider, this.articleQueue);
        await scraper.scrap(source);
        break;
      }
      case SourceKey.Transfer: {
        const scraper = new TransferScraper(this.scraperProvider, this.articleQueue);
        await scraper.scrap(source);
        break;
      }
      case SourceKey.Marca: {
        const scraper = new MarcaScraper(this.scraperProvider, this.articleQueue);
        await scraper.scrap(source);
        break;
      }
      case SourceKey.Teamtalk: {
        const scraper = new TeamtalkScraper(this.scraperProvider, this.articleQueue);
        await scraper.scrap(source);
        break;
      }
      default:
        logger.warn({ sourceKey: source.key }, 'Unknown source key');
    }
  }
}
