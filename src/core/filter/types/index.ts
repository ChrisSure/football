export interface FilterableArticle {
  title: string;
}

export interface ArticleFilter {
  check(article: FilterableArticle): boolean;
}
