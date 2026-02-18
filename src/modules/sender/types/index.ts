import type { FinalJobData } from '../../../core/queue/types';

export interface SenderService {
  send(data: FinalJobData): Promise<void>;
}
