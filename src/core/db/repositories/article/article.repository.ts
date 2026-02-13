import type { Article, DbProvider } from '../../types';
import { ArticleRepository } from '../../types';
import { ARTICLES_TABLE } from '../../constants/repository/article.constant';
import { ArticleStatus } from '../../enums';

export class MySqlArticleRepository implements ArticleRepository {
  private readonly db: DbProvider;

  public constructor(db: DbProvider) {
    this.db = db;
  }

  public async getLastActiveAll(hours: number): Promise<readonly Article[]> {
    const query: string = `SELECT * FROM ${ARTICLES_TABLE} WHERE created >= NOW() - INTERVAL ? HOUR AND status = ?`;
    const result = await this.db.query(query, [hours, ArticleStatus.Published]);

    if (Array.isArray(result)) {
      return result as Article[];
    }

    return [];
  }

  public async create(data: Omit<Article, 'id' | 'created'>): Promise<void> {
    const query: string = `INSERT INTO ${ARTICLES_TABLE} (title, image, source, status) VALUES (?, ?, ?, ?)`;
    await this.db.query(query, [data.title, data.image, data.source, data.status]);
  }
}
