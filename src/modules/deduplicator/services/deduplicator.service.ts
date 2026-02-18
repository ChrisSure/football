import type { AiProvider } from '../../../core/ai/types';
import { getOpenAiConfigFromEnv } from '../../../core/ai/constants/ai.constant';
import type { DeduplicatorService } from '../types';
import {
  EMBEDDING_MODEL,
  SIMILARITY_THRESHOLD,
  CANDIDATE_THRESHOLD,
  DEDUPLICATOR_SYSTEM_PROMPT,
} from '../constants/deduplicator.constant';

interface LlmVerificationResponse {
  isDuplicate: boolean;
}

export class AiDeduplicatorService implements DeduplicatorService {
  private readonly aiProvider: AiProvider;
  private readonly model: string;

  public constructor(aiProvider: AiProvider) {
    this.aiProvider = aiProvider;
    this.model = getOpenAiConfigFromEnv().model;
  }

  public async isDuplicate(title: string, existingTitles: readonly string[]): Promise<boolean> {
    if (existingTitles.length === 0) {
      return false;
    }

    const allTitles: string[] = [title, ...existingTitles];
    const embeddings = await this.getEmbeddings(allTitles);
    const newTitleEmbedding = embeddings[0];

    const candidates: string[] = [];

    for (let i = 1; i < embeddings.length; i++) {
      const similarity = this.cosineSimilarity(newTitleEmbedding, embeddings[i]);

      if (similarity >= SIMILARITY_THRESHOLD) {
        return true;
      }

      if (similarity >= CANDIDATE_THRESHOLD) {
        candidates.push(existingTitles[i - 1]);
      }
    }

    if (candidates.length === 0) {
      return false;
    }

    return this.verifyWithLlm(title, candidates);
  }

  private async verifyWithLlm(title: string, candidateTitles: readonly string[]): Promise<boolean> {
    const numberedTitles = candidateTitles.map((t, i) => `${i + 1}. ${t}`).join('\n');

    const userMessage = `New title: ${title}\n\nExisting titles:\n${numberedTitles}`;

    const response = await this.aiProvider.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: DEDUPLICATOR_SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      response_format: { type: 'json_object' },
      temperature: 0,
    });

    const content = response.choices[0]?.message?.content?.trim();

    if (!content) {
      return false;
    }

    const parsed: LlmVerificationResponse = JSON.parse(content);

    return parsed.isDuplicate;
  }

  private async getEmbeddings(texts: readonly string[]): Promise<readonly number[][]> {
    const response = await this.aiProvider.client.embeddings.create({
      model: EMBEDDING_MODEL,
      input: [...texts],
    });

    return response.data.map((item) => item.embedding);
  }

  private cosineSimilarity(a: readonly number[], b: readonly number[]): number {
    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}
