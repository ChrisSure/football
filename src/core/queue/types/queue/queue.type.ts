import type { Job, Queue, QueueOptions, Worker, WorkerOptions } from 'bullmq';
import type { RedisOptions } from 'ioredis';

export type QueueOptionsInput = Omit<QueueOptions, 'connection'>;
export type WorkerOptionsInput = Omit<WorkerOptions, 'connection'>;

export type QueueProcessor<TData, TResult> = (job: Job<TData, TResult>) => Promise<TResult>;

export interface SampleJobData {
  message: string;
}

export interface SampleJobResult {
  message: string;
  processedAt: string;
}

export interface QueueProvider {
  createQueue<TData, TResult>(
    name: string,
    options?: QueueOptionsInput,
  ): Queue<TData, TResult, string>;
  createWorker<TData, TResult>(
    name: string,
    processor: QueueProcessor<TData, TResult>,
    options?: WorkerOptionsInput,
  ): Worker<TData, TResult, string>;
  disconnect(): Promise<void>;
}

export type QueueRedisConfig = RedisOptions;
