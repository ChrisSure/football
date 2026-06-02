import type { AiProvider } from '../../../core/ai/types';
import { getOpenAiConfigFromEnv } from '../../../core/ai/constants/ai.constant';
import type { ContentQualityService } from '../types';
import {
  CONTENT_QUALITY_SYSTEM_PROMPT,
  QUALITY_CLICKBAIT_PREFIX_PATTERNS,
  QUALITY_VAGUE_SUBJECT_PATTERNS,
} from '../constants/deduplicator.constant';

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

  public async isQualityContent(originalTitle: string, translatedTitle: string): Promise<boolean> {
    if (this.isLowQualityByRules(originalTitle, translatedTitle)) {
      return false;
    }

    const userMessage = JSON.stringify({ originalTitle, translatedTitle });

    const response = await this.aiProvider.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: CONTENT_QUALITY_SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
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

  private isLowQualityByRules(originalTitle: string, translatedTitle: string): boolean {
    const titles: readonly string[] = [originalTitle, translatedTitle];

    return titles.some((title) => this.matchesLowQualityPattern(title));
  }

  private matchesLowQualityPattern(title: string): boolean {
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      return true;
    }

    return (
      this.matchesAny(normalizedTitle, QUALITY_CLICKBAIT_PREFIX_PATTERNS) ||
      this.matchesAny(normalizedTitle, QUALITY_VAGUE_SUBJECT_PATTERNS)
    );
  }

  private matchesAny(value: string, patterns: readonly RegExp[]): boolean {
    return patterns.some((pattern) => pattern.test(value));
  }
}
