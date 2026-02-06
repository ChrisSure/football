import type { BaseModel } from '../basic/db.types';

export enum SourceStatus {
  Active = 'Active',
  Stopped = 'Stopped',
  New = 'New',
}

export interface Source extends BaseModel<number> {
  id: number;
  title: string;
  link: string;
  created: Date;
  status: SourceStatus;
}

export interface SourceRepository {
  getLastActive(): Promise<readonly Source[]>;
}
