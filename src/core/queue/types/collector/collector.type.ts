import { Source } from '../../../db/types';

export interface CollectorJobData {
  title: string;
  image: string;
  source: Source;
}

export interface CollectorJobResult {
  processedAt: string;
}
