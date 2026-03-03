import type { AiProvider } from '../../../core/ai/types';
import { getOpenAiConfigFromEnv } from '../../../core/ai/constants/ai.constant';
import type { ContentQualityService } from '../types';
import { CONTENT_QUALITY_SYSTEM_PROMPT } from '../constants/deduplicator.constant';

interface ContentQualityResponse {
  isNews: boolean;
}

export class AiContentQualityService implements ContentQualityService {
  private readonly aiProvider: AiProvider;
  private readonly model: string;

  public constructor(aiProvider: AiProvider) {
    this.aiProvider = aiProvider;
    this.model = getOpenAiConfigFromEnv().model;
  }

  public async isQualityContent(title: string): Promise<boolean> {
    const response = await this.aiProvider.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: CONTENT_QUALITY_SYSTEM_PROMPT },
        { role: 'user', content: title },
      ],
      response_format: { type: 'json_object' },
      temperature: 0,
    });

    const content = response.choices[0]?.message?.content?.trim();

    if (!content) {
      return true;
    }

    const parsed: ContentQualityResponse = JSON.parse(content);

    return parsed.isNews;
  }
}
