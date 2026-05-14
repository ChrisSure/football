import { Source } from '../../../db/types';

export interface FilteredJobData {
  title: string;
  image: string;
  source: Source;
}

export interface FilteredJobResult {
  processedAt: string;
  rewrittenTitle?: string;
}
