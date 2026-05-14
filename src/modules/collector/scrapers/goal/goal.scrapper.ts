import type { CheerioAPI } from 'cheerio';
import type { Source } from '../../../../core/db/types';
import type { ScraperProvider } from '../../../../core/scraper/types';
import type { Article, ArticleQueue, Scraper } from '../../types/scraper.types';

export class GoalScraper implements Scraper {
  private readonly scraperProvider: ScraperProvider;
  private readonly articleQueue: ArticleQueue;

  public constructor(scraperProvider: ScraperProvider, articleQueue: ArticleQueue) {
    this.scraperProvider = scraperProvider;
    this.articleQueue = articleQueue;
  }

  public async scrap(source: Source): Promise<void> {
    const $ = await this.scraperProvider.getPage(source.url);
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

    $('.component-card-group:first a[data-testid="card-title-url"]').each((_index, element) => {
      const href = $(element).attr('href');
      if (href) {
        links.push(href);
      }
    });

    return links;
  }

  private async parseArticle(link: string, source: Source): Promise<Article | null> {
    const baseUrl = new URL(source.url).origin;
    const page = await this.scraperProvider.getPage(baseUrl + link);

    const title = page('h1[data-testid="article-title"]').html() ?? '';
    const image = page('div[data-testid="media-image"] img').attr('src') ?? '';

    if (!title || !image) {
      return null;
    }

    return { title, image, source: source };
  }
}
