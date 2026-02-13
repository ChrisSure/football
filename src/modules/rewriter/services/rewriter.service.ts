import type { AiProvider } from '../../../core/ai/types';
import { getOpenAiConfigFromEnv } from '../../../core/ai/constants/ai.constant';
import { REWRITER_SYSTEM_PROMPT } from '../constants/rewriter.constant';
import type { RewriterService } from '../types';

export class AiRewriterService implements RewriterService {
  private readonly aiProvider: AiProvider;
  private readonly model: string;

  public constructor(aiProvider: AiProvider) {
    this.aiProvider = aiProvider;
    this.model = getOpenAiConfigFromEnv().model;
  }

  public async rewriteTitle(title: string): Promise<string> {
    const response = await this.aiProvider.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: REWRITER_SYSTEM_PROMPT },
        { role: 'user', content: title },
      ],
      temperature: 0.7,
    });

    const rewritten = response.choices[0]?.message?.content?.trim();

    if (!rewritten) {
      throw new Error(`[Rewriter] AI returned empty response for title: "${title}"`);
    }

    return rewritten;
  }
}
