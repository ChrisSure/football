import type { SourceRepository } from '../../core/db/types';

export class Collector {
  private readonly sourceRepository: SourceRepository;

  public constructor(sourceRepository: SourceRepository) {
    this.sourceRepository = sourceRepository;
  }

  public async start(): Promise<void> {
    const sources = await this.sourceRepository.getLastActive();
    console.log(sources);
  }
}
