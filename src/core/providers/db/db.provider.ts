import mysql, { type Pool } from 'mysql2/promise';

import { getMySqlConfigFromEnv } from '../../constants/db/db.constants';
import type { DbQueryParams, DbQueryResult, DbProvider, MySqlConfig } from '../../types';

export class MySqlProvider implements DbProvider {
  private readonly config: MySqlConfig;
  private pool: Pool | null = null;

  public constructor(config: MySqlConfig) {
    this.config = config;
  }

  public async connect(): Promise<void> {
    if (this.pool) {
      return;
    }

    this.pool = mysql.createPool(this.config);

    const connection = await this.pool.getConnection();
    connection.release();
  }

  public async disconnect(): Promise<void> {
    if (!this.pool) {
      return;
    }

    await this.pool.end();
    this.pool = null;
  }

  public async query(statement: string, params: DbQueryParams = []): Promise<DbQueryResult> {
    if (!this.pool) {
      throw new Error('Database provider is not connected.');
    }

    const [rows] = await this.pool.execute(statement, params);
    return rows;
  }
}

export const createDbProvider = (): DbProvider => {
  const config: MySqlConfig = getMySqlConfigFromEnv();
  return new MySqlProvider(config);
};
