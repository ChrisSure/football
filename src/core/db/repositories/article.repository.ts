import type { Article, DbProvider } from '../types';
import { ArticleRepository } from '../types/repository/article.types';
import { ARTICLES_TABLE } from '../constants/repository/article.constant';

export class MySqlArticleRepository implements ArticleRepository {
  private readonly db: DbProvider;

  public constructor(db: DbProvider) {
    this.db = db;
  }

  public async getLastAll(hours: number): Promise<readonly Article[]> {
    const query: string = `SELECT * FROM ${ARTICLES_TABLE} WHERE created >= NOW() - INTERVAL ? HOUR`;
    const result = await this.db.query(query, [hours]);

    if (Array.isArray(result)) {
      return result as Article[];
    }

    return [];
  }
}
