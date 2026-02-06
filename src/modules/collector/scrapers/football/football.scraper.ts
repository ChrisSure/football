import type { Source } from '../../../../core/db/types';
import type { Scraper } from '../../types/scraper.types';

export class FootballScraper implements Scraper {
  public async scrap(source: Source): Promise<void> {
    console.log('Football Scrapper', source);
  }
}
