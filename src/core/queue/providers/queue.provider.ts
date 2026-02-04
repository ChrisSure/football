import { Queue, Worker } from 'bullmq';

import { SAMPLE_QUEUE_NAME } from '../constants/queue.constants';
import { getQueueRedisConfigFromEnv } from '../helpers/queue.helpers';
import type {
  QueueOptionsInput,
  QueueProcessor,
  QueueProvider,
  QueueRedisConfig,
  SampleJobData,
  SampleJobResult,
  WorkerOptionsInput,
} from '../types';

export class BullMqProvider implements QueueProvider {
  private readonly connection: QueueRedisConfig;
  private readonly closeHandlers: Set<() => Promise<void>> = new Set();

  public constructor(connection: QueueRedisConfig) {
    this.connection = connection;
  }

  public createQueue<TData, TResult>(
    name: string,
    options: QueueOptionsInput = {},
  ): Queue<TData, TResult, string> {
    const queue: Queue<TData, TResult, string> = new Queue(name, {
      ...options,
      connection: this.connection,
    });

    this.closeHandlers.add(async () => {
      await queue.close();
    });
    return queue;
  }

  public createWorker<TData, TResult>(
    name: string,
    processor: QueueProcessor<TData, TResult>,
    options: WorkerOptionsInput = {},
  ): Worker<TData, TResult, string> {
    const worker: Worker<TData, TResult, string> = new Worker(name, processor, {
      ...options,
      connection: this.connection,
    });

    this.closeHandlers.add(async () => {
      await worker.close();
    });
    return worker;
  }

  public async disconnect(): Promise<void> {
    const closures: Promise<void>[] = [...this.closeHandlers].map(async (close) => {
      await close();
    });

    await Promise.all(closures);
    this.closeHandlers.clear();
  }
}

export const createQueueProvider = (): QueueProvider => {
  const config: QueueRedisConfig = getQueueRedisConfigFromEnv();
  return new BullMqProvider(config);
};

export const createSampleQueue = (
  provider: QueueProvider,
): Queue<SampleJobData, SampleJobResult, string> => {
  return provider.createQueue<SampleJobData, SampleJobResult>(SAMPLE_QUEUE_NAME);
};

export const createSampleWorker = (
  provider: QueueProvider,
): Worker<SampleJobData, SampleJobResult, string> => {
  return provider.createWorker<SampleJobData, SampleJobResult>(SAMPLE_QUEUE_NAME, async (job) => {
    const result: SampleJobResult = {
      message: job.data.message,
      processedAt: new Date().toISOString(),
    };
    return result;
  });
};

export { SAMPLE_QUEUE_NAME };
