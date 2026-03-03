export interface FilterableArticle {
  title: string;
}

export interface ArticleFilter {
  check(article: FilterableArticle): boolean;
}

export interface DeduplicatorService {
  isDuplicate(title: string, existingTitles: readonly string[]): Promise<boolean>;
}

export interface TranslationService {
  translate(title: string): Promise<string>;
}
