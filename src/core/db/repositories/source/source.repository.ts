import type { DbProvider, Source, SourceRepository } from '../../types';
import { SourceStatus } from '../../types';
import { SOURCES_TABLE } from '../../constants/repository/source.constant';

export class MySqlSourceRepository implements SourceRepository {
  private readonly db: DbProvider;

  public constructor(db: DbProvider) {
    this.db = db;
  }

  public async getLastActive(): Promise<readonly Source[]> {
    const query: string = `SELECT * FROM ${SOURCES_TABLE} WHERE status = ?`;
    const result = await this.db.query(query, [SourceStatus.Active]);

    if (Array.isArray(result)) {
      return result as Source[];
    }

    return [];
  }
}
