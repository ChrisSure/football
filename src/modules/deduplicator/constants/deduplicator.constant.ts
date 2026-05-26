export const EMBEDDING_MODEL: string = 'text-embedding-3-small';
export const SIMILARITY_THRESHOLD: number = 0.85;
export const CANDIDATE_THRESHOLD: number = 0.55;

export const TRANSLATION_SYSTEM_PROMPT: string =
  'You are a translator. Translate the given football news title to Ukrainian. ' +
  'Keep player names, club names, and football terms recognizable. ' +
  'Respond with JSON: { "translatedTitle": string }';

export const CONTENT_QUALITY_SYSTEM_PROMPT: string =
  'You are a football news content quality classifier. ' +
  'Determine if the given title is a real, informative football news article. ' +
  'CRITICAL RULES: ' +
  '1. Return false if the title hides key information like specific player names, manager names, or club names behind vague phrases (e.g., "Liverpool star", "EFL club", "City target", "Ex-manager") to force a click. ' +
  '2. Return false for overly long narrative titles, clickbait prefixes (WATCH:, REVEALED:), opinion pieces, and non-core football events (e.g. stadium construction business, broadcasting details). ' +
  'Return true ONLY if the title conveys a concrete football news event and names the actual subjects involved. ' +
  'Respond with JSON: { "isNews": boolean }';

export const DEDUPLICATOR_SYSTEM_PROMPT: string =
  'You are a football news deduplication system. ' +
  'Determine if the new article title refers to the same news event or story as any of the existing titles. ' +
  'Two titles are duplicates if they describe the same event, match, transfer, quote, or situation, even if worded differently. ' +
  'Respond with JSON: { "isDuplicate": boolean }';
