import type { BaseModel } from '../basic/db.types';

export enum SourceStatus {
  Active = 'active',
  Stopped = 'stopped',
  New = 'new',
}

export interface Source extends BaseModel<number> {
  id: number;
  title: string;
  key: string;
  url: string;
  created: Date;
  status: SourceStatus;
}

export interface SourceRepository {
  getLastActive(): Promise<readonly Source[]>;
}
