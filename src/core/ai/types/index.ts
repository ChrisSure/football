import type OpenAI from 'openai';

export interface AiProvider {
  readonly client: OpenAI;
}

export interface OpenAiConfig {
  apiKey: string;
  model: string;
}
