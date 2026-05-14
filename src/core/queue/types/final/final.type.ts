import { Source } from '../../../db/types';

export interface FinalJobData {
  title: string;
  image: string;
  source: Source;
}

export interface FinalJobResult {
  processedAt: string;
}
