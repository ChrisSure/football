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
  'Return false for: clickbait (hides key information like player/club names behind vague phrases), ' +
  'opinion pieces, rhetorical questions, personal life gossip unrelated to football, ' +
  'promotional content, match schedules, or entertainment content. ' +
  'Return true only if the title conveys a concrete football news event (transfer, match result, injury, signing, etc.) ' +
  'and the reader can understand the key information from the title alone. ' +
  'Respond with JSON: { "isNews": boolean }';

export const DEDUPLICATOR_SYSTEM_PROMPT: string =
  'You are a football news deduplication system. ' +
  'Determine if the new article title refers to the same news event or story as any of the existing titles. ' +
  'Two titles are duplicates if they describe the same event, match, transfer, quote, or situation, even if worded differently. ' +
  'Respond with JSON: { "isDuplicate": boolean }';
