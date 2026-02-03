export type EntityId = string | number;

export interface BaseModel<TId extends EntityId = EntityId> {
  id: TId;
}

export interface Repository<TModel extends BaseModel<TId>, TId extends EntityId = EntityId> {
  findById(id: TId): Promise<TModel | null>;
  findAll(): Promise<readonly TModel[]>;
  create(model: Omit<TModel, 'id'>): Promise<TModel>;
  update(id: TId, model: Partial<TModel>): Promise<TModel>;
  delete(id: TId): Promise<void>;
}

export type DbQueryParams = readonly unknown[];
export type DbQueryResult = unknown;
