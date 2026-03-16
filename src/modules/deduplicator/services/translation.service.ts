import type { AiProvider } from '../../../core/ai/types';
import { getOpenAiConfigFromEnv } from '../../../core/ai/constants/ai.constant';
import type { TranslationService } from '../types';
import { TRANSLATION_SYSTEM_PROMPT } from '../constants/deduplicator.constant';

interface TranslationResponse {
  translatedTitle: string;
}

export class AiTranslationService implements TranslationService {
  private readonly aiProvider: AiProvider;
  private readonly model: string;

  public constructor(aiProvider: AiProvider) {
    this.aiProvider = aiProvider;
    this.model = getOpenAiConfigFromEnv().model;
  }

  public async translate(title: string): Promise<string> {
    const response = await this.aiProvider.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: TRANSLATION_SYSTEM_PROMPT },
        { role: 'user', content: title },
      ],
      response_format: { type: 'json_object' },
      temperature: 0,
    });

    const content = response.choices[0]?.message?.content?.trim();

    if (!content) {
      return title;
    }

    const parsed: TranslationResponse = JSON.parse(content);

    return parsed.translatedTitle;
  }
}
