import * as cheerio from 'cheerio';
import type { CheerioAPI } from 'cheerio';
import type { ScraperProvider } from '../types';

export class CheerioScraperProvider implements ScraperProvider {
  public async getPage(url: string): Promise<CheerioAPI> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    return cheerio.load(html);
  }
}

export const createScraperProvider = (): ScraperProvider => {
  return new CheerioScraperProvider();
};
