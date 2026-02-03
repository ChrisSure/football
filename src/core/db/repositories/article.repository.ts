import type { Article, DbProvider } from '../types';
import { ArticleRepository } from '../types/repository/article.types';
import { ARTICLES_TABLE } from '../constants/repository/article.constant';

export class MySqlArticleRepository implements ArticleRepository {
  private readonly db: DbProvider;

  public constructor(db: DbProvider) {
    this.db = db;
  }

  public async getAll(): Promise<readonly Article[]> {
    const query: string = `SELECT * FROM ${ARTICLES_TABLE}`;
    const result = await this.db.query(query);

    if (Array.isArray(result)) {
      return result as Article[];
    }

    return [];
  }
}
