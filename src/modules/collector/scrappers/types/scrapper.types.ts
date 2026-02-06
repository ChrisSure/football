import type { Source } from '../../../../core/db/types';

export interface Scrapper {
  scrap(source: Source): Promise<void>;
}
