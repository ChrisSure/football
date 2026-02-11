import type { BaseModel, EntityId } from '../basic/db.types';

export interface Article extends BaseModel<EntityId> {
  id: EntityId;
}

export interface ArticleRepository {
  getLastActiveAll(hours: number): Promise<readonly Article[]>;
}
