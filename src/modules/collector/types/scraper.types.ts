import type { Source } from '../../../core/db/types';

export interface Scraper {
  scrap(source: Source): Promise<Article[]>;
}

export interface Article {
  title: string;
  image: string;
  source: string;
}
