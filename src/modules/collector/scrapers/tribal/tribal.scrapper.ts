import type { CheerioAPI } from 'cheerio';
import type { Source } from '../../../../core/db/types';
import type { ScraperProvider } from '../../../../core/scraper/types';
import type { Article, ArticleQueue, Scraper } from '../../types/scraper.types';

export class TribalScraper implements Scraper {
  private readonly scraperProvider: ScraperProvider;
  private readonly articleQueue: ArticleQueue;

  public constructor(scraperProvider: ScraperProvider, articleQueue: ArticleQueue) {
    this.scraperProvider = scraperProvider;
    this.articleQueue = articleQueue;
  }

  public async scrap(source: Source): Promise<void> {
    const $ = await this.scraperProvider.getPage(source.link);
    const links = this.extractLinks($);

    if (links.length) {
      await this.processLinks(links, source);
    }
  }

  private async processLinks(links: string[], source: Source): Promise<void> {
    await Promise.all(
      links.map(async (link) => {
        const article = await this.parseArticle(link, source);
        if (article) {
          await this.enqueueArticle(article);
        }
      }),
    );
  }

  public async enqueueArticle(article: Article): Promise<void> {
    await this.articleQueue.add('article', article);
  }

  private extractLinks($: CheerioAPI): string[] {
    const links: string[] = [];

    $('.container__news > div')
      .first()
      .find('a')
      .each((_index, element) => {
        const href = $(element).attr('href');
        if (href) {
          links.push(href);
        }
      });

    return links;
  }

  private async parseArticle(link: string, source: Source): Promise<Article | null> {
    const page = await this.scraperProvider.getPage(source.link + link);

    const title = page('.container__main h1').html() ?? '';
    const image = page('.container__main img').attr('src') ?? '';

    if (!title || !image) {
      return null;
    }

    return { title, image, source: source.title };
  }
}
