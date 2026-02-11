import OpenAI from 'openai';
import { getOpenAiConfigFromEnv } from '../constants/ai.constant';
import type { AiProvider, OpenAiConfig } from '../types';

export class OpenAiProvider implements AiProvider {
  public readonly client: OpenAI;

  public constructor(config: OpenAiConfig) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
    });
  }
}

export const createAiProvider = (): AiProvider => {
  const config: OpenAiConfig = getOpenAiConfigFromEnv();
  return new OpenAiProvider(config);
};
