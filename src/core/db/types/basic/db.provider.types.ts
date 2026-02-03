import type { PoolOptions } from 'mysql2/promise';

import type { DbQueryParams, DbQueryResult } from './db.types';

export interface DbProvider {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  query(statement: string, params?: DbQueryParams): Promise<DbQueryResult>;
}

export interface MySqlConfig extends PoolOptions {
  host: string;
  user: string;
  password: string;
  database: string;
  port?: number;
}
