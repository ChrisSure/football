export interface DeduplicatorService {
  isDuplicate(title: string, existingTitles: readonly string[]): Promise<boolean>;
}
