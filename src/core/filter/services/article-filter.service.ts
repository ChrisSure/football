import type { ArticleFilter, FilterableArticle } from '../types';
import { POLITICS_KEYWORDS, WAR_KEYWORDS } from '../constants/filter.constant';

export class ArticleFilterService implements ArticleFilter {
  public check(article: FilterableArticle): boolean {
    const title = article.title.toLowerCase();

    if (this.containsAny(title, POLITICS_KEYWORDS)) {
      return false;
    }

    if (this.containsAny(title, WAR_KEYWORDS)) {
      return false;
    }

    return true;
  }

  private containsAny(title: string, keywords: readonly string[]): boolean {
    return keywords.some((keyword) => title.includes(keyword));
  }
}
