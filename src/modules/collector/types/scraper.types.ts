import type { Queue } from 'bullmq';
import type { Source } from '../../../core/db/types';
import type { CollectorJobData, CollectorJobResult } from '../../../core/queue/types';

export type ArticleQueue = Queue<CollectorJobData, CollectorJobResult, string>;

export interface Scraper {
  scrap(source: Source): Promise<void>;
  enqueueArticle(article: Article): Promise<void>;
}

export interface Article {
  title: string;
  image: string;
  source: string;
}
