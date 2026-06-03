export const EMBEDDING_MODEL: string = 'text-embedding-3-small';
export const SIMILARITY_THRESHOLD: number = 0.85;
export const CANDIDATE_THRESHOLD: number = 0.55;

export const TRANSLATION_SYSTEM_PROMPT: string =
  'You are a translator. Translate the given football news title to Ukrainian. ' +
  'Keep player names, club names, and football terms recognizable. ' +
  'Respond with JSON: { "translatedTitle": string }';

export const CONTENT_QUALITY_SYSTEM_PROMPT: string =
  'You are a football news content quality classifier. ' +
  'Determine if the given title pair is a real, informative football news article. ' +
  'CRITICAL RULES: ' +
  '1. Return false if the title hides key information like specific player names, manager names, or club names behind vague phrases (e.g., "Liverpool star", "EFL club", "City target", "Ex-manager", "провідний гравець", "зірковий нападник"). ' +
  '2. Return false for overly long narrative titles, clickbait prefixes (WATCH:, REVEALED:, ТЕРМІНОВО:, ДИВІТЬСЯ:), opinion pieces, and non-core football events (e.g. stadium construction business, broadcasting details). ' +
  '3. Return false when the core event depends on unnamed subjects like "a player", "a winger", "a leading player", "гравець", "вінгер", "провідний гравець" without naming who that subject is. ' +
  '4. Return false if the title mentions an action (e.g., "прокоментував"/"commented", "ухвалив рішення"/"decided", "зробив заяву"/"made a statement") but does not reveal its essence or details. ' +
  '5. Return false if the title just lists interview topics or article subjects without concrete facts. ' +
  '6. Return false if the title teases a "plan" ("план"), "squad" ("склад"), or "questions" ("питання") without providing specifics. ' +
  '7. Return false if the title contains quotes or opinions without clearly identifying the author (e.g., "слова колеги"/"colleague\'s words", "товариш по команді"/"teammate"). ' +
  'Return true ONLY if the title conveys a concrete football news event and names the actual subjects involved. ' +
  'Respond with JSON: { "isNews": boolean }';

export const QUALITY_CLICKBAIT_PREFIX_PATTERNS: readonly RegExp[] = [
  /^watch:/i,
  /^revealed:/i,
  /^breaking:/i,
  /^exclusive:/i,
  /^терміново:/i,
  /^дивіться:/i,
  /^розкрито:/i,
  /^ексклюзив:/i,
];

export const QUALITY_VAGUE_SUBJECT_PATTERNS: readonly RegExp[] = [
  /\b(?:a|an|the)\s+(?:top|leading|key|star|former|ex|mystery)\s+(?:player|winger|midfielder|striker|forward|defender|manager|coach|club)\b/i,
  /\b(?:player|winger|midfielder|striker|forward|defender|manager|coach)\s+for\s+\d+(?:[.,]\d+)?\s*(?:m|million|bn|billion|€|eur|\$|usd|£|gbp)\b/i,
  /\b(?:efl|premier league|la liga|serie a|bundesliga)\s+club\b/i,
  /\b(?:liverpool|manchester united|arsenal|chelsea|barcelona|real madrid|psg|manchester city)\s+(?:star|target|player|winger|midfielder|striker|defender)\b/i,
  /(?:^|[\s"«(])(?:провідн(?:ий|ого)|ключов(?:ий|ого)|зірков(?:ий|ого)|колишн(?:ій|ього)|екс)\s+(?:гравець|гравця|вінгер|вінгера|півзахисник|півзахисника|форвард|форварда|нападник|нападника|захисник|захисника|тренер|тренера|наставник|наставника|клуб|клубу|команда|команди)(?=$|[\s,.:;!?»")])/i,
  /(?:^|[\s"«(])(?:гравець|вінгер|півзахисник|форвард|нападник|захисник)\s+за\s+\d+(?:[.,]\d+)?\s*(?:млн|мільйон(?:ів|и)?|€|\$|£|фунт(?:ів)?)(?=$|[\s,.:;!?»")])/i,
  /(?:^|[\s"«(])(?:клуб|команда)\s+(?:efl|апл|ла ліги|серії а|бундесліги)(?=$|[\s,.:;!?»")])/i,
  /(?:^|[\s"«(])(?:манчестер юнайтед|ліверпуль|арсенал|челсі|барселона|реал мадрид|псж|манчестер сіті)\s+(?:зірка|ціль|гравець|вінгер|півзахисник|форвард|нападник|захисник)(?=$|[\s,.:;!?»")])/i,
  /(?:^|[\s"«(])(?:товариш по команді|колега|одноклубник|легенда|герой|teammate|colleague|clubmate|legend|hero)(?=$|[\s,.:;!?»")])/i,
];

export const DEDUPLICATOR_SYSTEM_PROMPT: string =
  'You are a football news deduplication system. ' +
  'Determine if the new article title refers to the same news event or story as any of the existing titles. ' +
  'Two titles are duplicates if they describe the same event, match, transfer, quote, or situation, even if worded differently. ' +
  'Respond with JSON: { "isDuplicate": boolean }';
