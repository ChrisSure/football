import type { Source } from '../../../../core/db/types';
import type { Scrapper } from '../types/scrapper.types';

export class FootballScrapper implements Scrapper {
  public async scrap(source: Source): Promise<void> {
    console.log('Football Scrapper', source);
  }
}
