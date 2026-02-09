import type { CheerioAPI } from 'cheerio';
import type { Source } from '../../../../core/db/types';
import type { ScraperProvider } from '../../../../core/scraper/types';
import type { Article, Scraper } from '../../types/scraper.types';

export class FootballScraper implements Scraper {
  private readonly scraperProvider: ScraperProvider;

  public constructor(scraperProvider: ScraperProvider) {
    this.scraperProvider = scraperProvider;
  }

  public async scrap(source: Source): Promise<Article[]> {
    const $ = await this.scraperProvider.getPage(source.link);
    const links = this.extractLinks($);

    return Promise.all(links.map((link) => this.parseArticle(link, source.title)));
  }

  private extractLinks($: CheerioAPI): string[] {
    const links: string[] = [];

    $('.news-feed.main-news ul li a').each((_index, element) => {
      const href = $(element).attr('href');
      if (href) {
        links.push(href);
      }
    });

    return links;
  }

  private async parseArticle(link: string, sourceName: string): Promise<Article> {
    const page = await this.scraperProvider.getPage(link);
    const title = page('.author-article h1').html() || '';
    const image = page('.author-article .article-photo img').attr('src') || '';

    return { title, image, source: sourceName };
  }
}
