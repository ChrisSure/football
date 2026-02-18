export const EMBEDDING_MODEL: string = 'text-embedding-3-small';
export const SIMILARITY_THRESHOLD: number = 0.85;
export const CANDIDATE_THRESHOLD: number = 0.55;

export const DEDUPLICATOR_SYSTEM_PROMPT: string =
  'You are a football news deduplication system. ' +
  'Determine if the new article title refers to the same news event or story as any of the existing titles. ' +
  'Two titles are duplicates if they describe the same event, match, transfer, quote, or situation, even if worded differently. ' +
  'Respond with JSON: { "isDuplicate": boolean }';
