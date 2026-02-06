import type { SourceRepository } from '../../core/db/types';
import type { CollectorJobData, CollectorJobResult, QueueProvider } from '../../core/queue/types';
import {
  COLLECTOR_QUEUE_NAME,
  COLLECTOR_REPEAT_INTERVAL,
  COLLECTOR_REPEAT_INTERVAL_1_MIN,
} from '../../core/queue/constants/collector/collector.constants';

export class Collector {
  private readonly sourceRepository: SourceRepository;
  private readonly queueProvider: QueueProvider;

  public constructor(sourceRepository: SourceRepository, queueProvider: QueueProvider) {
    this.sourceRepository = sourceRepository;
    this.queueProvider = queueProvider;
  }

  public async start(): Promise<void> {
    //await this.scheduleRepeatableJob();
    //this.registerWorker();
    await this.run();
  }

  private async run(): Promise<void> {
    const sources = await this.sourceRepository.getLastActive();
    console.log(sources);
  }

  private registerWorker(): void {
    this.queueProvider.createWorker<CollectorJobData, CollectorJobResult>(
      COLLECTOR_QUEUE_NAME,
      async () => {
        await this.run();
        return { processedAt: new Date().toISOString() };
      },
    );
  }

  private async scheduleRepeatableJob(): Promise<void> {
    const queue = this.queueProvider.createQueue<CollectorJobData, CollectorJobResult>(
      COLLECTOR_QUEUE_NAME,
    );

    await queue.add(
      'collector-run',
      { triggeredAt: new Date().toISOString() },
      { repeat: { every: COLLECTOR_REPEAT_INTERVAL_1_MIN } },
    );
  }
}
