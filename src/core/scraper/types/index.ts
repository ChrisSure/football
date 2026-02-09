import type { CheerioAPI } from 'cheerio';

export interface ScraperProvider {
  getPage(url: string): Promise<CheerioAPI>;
}
