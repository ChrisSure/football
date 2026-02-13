import type { BaseModel, EntityId } from '../basic/db.types';
import { ArticleStatus } from '../../enums';

export interface Article extends BaseModel<EntityId> {
  id: EntityId;
  title: string;
  image: string;
  created: Date;
  source: string;
  status: ArticleStatus;
}

export interface ArticleRepository {
  getLastActiveAll(hours: number): Promise<readonly Article[]>;
  create(data: Omit<Article, 'id' | 'created'>): Promise<void>;
}
