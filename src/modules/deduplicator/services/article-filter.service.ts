import type { ArticleFilter, FilterableArticle } from '../types';
import {
  POLITICS_KEYWORDS,
  WAR_KEYWORDS,
  CLICKBAIT_PATTERNS,
  NON_NEWS_PATTERNS,
  GOSSIP_KEYWORDS,
} from '../constants/filter.constant';

export class ArticleFilterService implements ArticleFilter {
  public check(article: FilterableArticle): boolean {
    const title = article.title.toLowerCase();

    if (this.containsAny(title, POLITICS_KEYWORDS)) {
      return false;
    }

    if (this.containsAny(title, WAR_KEYWORDS)) {
      return false;
    }

    if (this.matchesAny(title, CLICKBAIT_PATTERNS)) {
      return false;
    }

    if (this.matchesAny(title, NON_NEWS_PATTERNS)) {
      return false;
    }

    if (this.containsAny(title, GOSSIP_KEYWORDS)) {
      return false;
    }

    return true;
  }

  private containsAny(title: string, keywords: readonly string[]): boolean {
    return keywords.some((keyword) => title.includes(keyword));
  }

  private matchesAny(title: string, patterns: readonly RegExp[]): boolean {
    return patterns.some((pattern) => pattern.test(title));
  }
}
