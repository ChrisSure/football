export interface RewriterService {
  rewriteTitle(title: string): Promise<string>;
}
