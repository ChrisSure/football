import type { Source } from '../../../../core/db/types';
import type { ScraperProvider } from '../../../../core/scraper/types';
import type { Scraper } from '../../types/scraper.types';

export class FootballScraper implements Scraper {
  private readonly scraperProvider: ScraperProvider;

  public constructor(scraperProvider: ScraperProvider) {
    this.scraperProvider = scraperProvider;
  }

  public async scrap(source: Source): Promise<void> {
    const $ = await this.scraperProvider.getPage(source.link);
    const main = $('.news-feed.main-news').html();
    console.log(main);
  }
}
