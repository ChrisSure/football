import type { Article, DbProvider } from '../../types';
import { ArticleRepository } from '../../types';
import { ARTICLES_TABLE, PROJECT_ID } from '../../constants/repository/article.constant';
import { ArticleStatus } from '../../enums';

export class MySqlArticleRepository implements ArticleRepository {
  private readonly db: DbProvider;

  public constructor(db: DbProvider) {
    this.db = db;
  }

  public async getLastActiveAll(hours: number): Promise<readonly Article[]> {
    const query: string = `SELECT * FROM ${ARTICLES_TABLE} WHERE created >= NOW() - INTERVAL ? HOUR AND status = ? AND project_id=${PROJECT_ID}`;
    const result = await this.db.query(query, [hours, ArticleStatus.Published]);

    if (Array.isArray(result)) {
      return result as Article[];
    }

    return [];
  }

  public async create(data: Omit<Article, 'id' | 'created'>): Promise<void> {
    const query: string = `INSERT INTO ${ARTICLES_TABLE} (title, image, source_id, project_id, status) VALUES (?, ?, ?, ?, ?)`;
    await this.db.query(query, [data.title, data.image, data.source_id, PROJECT_ID, data.status]);
  }

  public async updateLastStatuses(hours: number): Promise<void> {
    const query: string = `UPDATE ${ARTICLES_TABLE} SET status = ? WHERE created >= NOW() - INTERVAL ? HOUR AND project_id=${PROJECT_ID}`;
    await this.db.query(query, [ArticleStatus.Published, hours]);
  }

  public async deleteOlderThanDays(days: number): Promise<void> {
    const query: string = `DELETE FROM ${ARTICLES_TABLE} WHERE created < NOW() - INTERVAL ? DAY AND project_id=${PROJECT_ID}`;
    await this.db.query(query, [days]);
  }
}
