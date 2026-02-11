import type { OpenAiConfig } from '../types';

const DEFAULT_MODEL: string = 'gpt-4o-mini';
const DEFAULT_EMPTY: string = '';

export const getOpenAiConfigFromEnv = (): OpenAiConfig => {
  return {
    apiKey: process.env.OPENAI_API_KEY ?? DEFAULT_EMPTY,
    model: process.env.OPENAI_MODEL ?? DEFAULT_MODEL,
  };
};
