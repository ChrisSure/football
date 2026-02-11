import type { CheerioAPI } from 'cheerio';
import type { Source } from '../../../../core/db/types';
import type { ScraperProvider } from '../../../../core/scraper/types';
import type { Article, ArticleQueue, Scraper } from '../../types/scraper.types';

export class FootballScraper implements Scraper {
  private readonly scraperProvider: ScraperProvider;
  private readonly articleQueue: ArticleQueue;

  public constructor(scraperProvider: ScraperProvider, articleQueue: ArticleQueue) {
    this.scraperProvider = scraperProvider;
    this.articleQueue = articleQueue;
  }

  public async scrap(source: Source): Promise<void> {
    const $ = await this.scraperProvider.getPage(source.link);
    const links = this.extractLinks($);

    await Promise.all(
      links.map(async (link) => {
        const article = await this.parseArticle(link, source.title);
        await this.enqueueArticle(article);
      }),
    );
  }

  public async enqueueArticle(article: Article): Promise<void> {
    await this.articleQueue.add('article', article);
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
