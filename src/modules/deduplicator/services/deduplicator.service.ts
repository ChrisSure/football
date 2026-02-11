import type { AiProvider } from '../../../core/ai/types';
import type { DeduplicatorService } from '../types';
import { EMBEDDING_MODEL, SIMILARITY_THRESHOLD } from '../constants/deduplicator.constant';

export class AiDeduplicatorService implements DeduplicatorService {
  private readonly aiProvider: AiProvider;

  public constructor(aiProvider: AiProvider) {
    this.aiProvider = aiProvider;
  }

  public async isDuplicate(title: string, existingTitles: readonly string[]): Promise<boolean> {
    if (existingTitles.length === 0) {
      return false;
    }

    const allTitles: string[] = [title, ...existingTitles];
    const embeddings = await this.getEmbeddings(allTitles);
    const newTitleEmbedding = embeddings[0];

    for (let i = 1; i < embeddings.length; i++) {
      const similarity = this.cosineSimilarity(newTitleEmbedding, embeddings[i]);

      if (similarity >= SIMILARITY_THRESHOLD) {
        return true;
      }
    }

    return false;
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
