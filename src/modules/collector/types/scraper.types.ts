import type { Source } from '../../../core/db/types';

export interface Scraper {
  scrap(source: Source): Promise<void>;
}
