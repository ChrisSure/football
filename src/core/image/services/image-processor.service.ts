import sharp from 'sharp';
import { createCanvas, GlobalFonts, loadImage, type SKRSContext2D } from '@napi-rs/canvas';
import { FONT_PATH, FONT_FAMILY, IMAGE_STYLE, LOGO_PATH } from '../constants/image.constant';
import type { ImageOverlayOptions, ImageStyleConfig } from '../types';
import { Source } from '../../db/types';

GlobalFonts.registerFromPath(FONT_PATH, FONT_FAMILY);

export class ImageProcessorService {
  private readonly style: ImageStyleConfig;

  public constructor(style: ImageStyleConfig = IMAGE_STYLE) {
    this.style = style;
  }

  public async process(options: ImageOverlayOptions): Promise<Buffer> {
    const { width, height } = this.style.dimensions;

    const baseImage = await this.fetchAndResize(options.imageUrl, width, height);
    const overlay = await this.createOverlay(width, height, options.title, options.source);

    return sharp(baseImage)
      .composite([{ input: overlay, top: 0, left: 0 }])
      .jpeg({ quality: 95, chromaSubsampling: '4:4:4', mozjpeg: true })
      .toBuffer();
  }

  private async fetchAndResize(url: string, width: number, height: number): Promise<Buffer> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();

    return sharp(Buffer.from(arrayBuffer))
      .resize(width, height, {
        fit: 'cover',
        position: 'centre',
        kernel: sharp.kernel.lanczos3,
      })
      .toBuffer();
  }

  private async createOverlay(
    width: number,
    height: number,
    title: string,
    source: Source,
  ): Promise<Buffer> {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    this.drawGradient(ctx, width, height);
    const titleBounds = this.drawTitle(ctx, width, height, title);
    this.drawAccentBar(ctx, titleBounds, height);
    this.drawSource(ctx, height, source);
    await this.drawLogo(ctx, width);

    return Buffer.from(canvas.toBuffer('image/png'));
  }

  private drawGradient(ctx: SKRSContext2D, width: number, height: number): void {
    const gradientStart = height * 0.45;
    const gradient = ctx.createLinearGradient(0, gradientStart, 0, height);

    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(0.4, `rgba(0, 0, 0, ${this.style.gradientOpacity * 0.5})`);
    gradient.addColorStop(1, `rgba(0, 0, 0, ${this.style.gradientOpacity})`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, gradientStart, width, height - gradientStart);
  }

  private drawAccentBar(
    ctx: SKRSContext2D,
    titleBounds: { startY: number; height: number },
    canvasHeight: number,
  ): void {
    const { padding } = this.style.text;
    const barX = padding - this.style.accentBarWidth - 16;
    const barHeight = canvasHeight - padding - titleBounds.startY;

    ctx.fillStyle = this.style.accentBarColor;
    ctx.fillRect(barX, titleBounds.startY, this.style.accentBarWidth, barHeight);
  }

  private drawTitle(
    ctx: SKRSContext2D,
    width: number,
    height: number,
    title: string,
  ): { startY: number; height: number } {
    const { padding, fontFamily, maxLines, lineHeight } = this.style.text;
    const maxTextWidth = width - padding * 2;
    const fontSize = this.calculateFontSize(ctx, title, maxTextWidth, fontFamily);

    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = '#FFFFFF';
    ctx.textBaseline = 'top';

    const lines = this.wrapText(ctx, title, maxTextWidth, maxLines);
    const totalTextHeight = lines.length * fontSize * lineHeight;
    const sourceOffset = this.style.text.sourceFontSize + 16;
    const startY = height - padding - totalTextHeight - sourceOffset;

    for (let i = 0; i < lines.length; i++) {
      const y = startY + i * fontSize * lineHeight;
      this.drawTextWithShadow(ctx, lines[i], padding, y);
    }

    return { startY, height: totalTextHeight };
  }

  private drawSource(ctx: SKRSContext2D, height: number, source: Source): void {
    const { padding, sourceFontSize, fontFamily } = this.style.text;

    ctx.font = `${sourceFontSize}px ${fontFamily}`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.textBaseline = 'bottom';

    const text = `Джерело: ${source.title}`;
    this.drawTextWithShadow(ctx, text, padding, height - padding);
  }

  private drawTextWithShadow(ctx: SKRSContext2D, text: string, x: number, y: number): void {
    const currentFillStyle = ctx.fillStyle;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillText(text, x + 2, y + 2);

    ctx.fillStyle = currentFillStyle;
    ctx.fillText(text, x, y);
  }

  private calculateFontSize(
    ctx: SKRSContext2D,
    text: string,
    maxWidth: number,
    fontFamily: string,
  ): number {
    const { maxFontSize, minFontSize, maxLines } = this.style.text;

    for (let size = maxFontSize; size >= minFontSize; size -= 2) {
      ctx.font = `bold ${size}px ${fontFamily}`;
      const lines = this.wrapText(ctx, text, maxWidth, maxLines + 1);

      if (lines.length <= maxLines) {
        return size;
      }
    }

    return minFontSize;
  }

  private wrapText(ctx: SKRSContext2D, text: string, maxWidth: number, maxLines: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);

      const result = this.processWord(
        word,
        testLine,
        currentLine,
        metrics.width,
        maxWidth,
        lines,
        maxLines,
      );

      if (result.shouldReturn) {
        return this.truncateLastLine(lines);
      }

      currentLine = result.currentLine;
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  private processWord(
    word: string,
    testLine: string,
    currentLine: string,
    testWidth: number,
    maxWidth: number,
    lines: string[],
    maxLines: number,
  ): { currentLine: string; shouldReturn: boolean } {
    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);

      if (lines.length >= maxLines) {
        return { currentLine: word, shouldReturn: true };
      }

      return { currentLine: word, shouldReturn: false };
    }

    return { currentLine: testLine, shouldReturn: false };
  }

  private truncateLastLine(lines: string[]): string[] {
    const lastLine = lines[lines.length - 1];
    lines[lines.length - 1] = `${lastLine}...`;
    return lines;
  }

  private async drawLogo(ctx: SKRSContext2D, canvasWidth: number): Promise<void> {
    const logo = await loadImage(LOGO_PATH);
    const logoMaxHeight = 80;
    const logoMaxWidth = 200;
    const padding = 24;

    let logoWidth = logo.width;
    let logoHeight = logo.height;

    if (logoHeight > logoMaxHeight) {
      const scale = logoMaxHeight / logoHeight;
      logoHeight = logoMaxHeight;
      logoWidth = logoWidth * scale;
    }

    if (logoWidth > logoMaxWidth) {
      const scale = logoMaxWidth / logoWidth;
      logoWidth = logoMaxWidth;
      logoHeight = logoHeight * scale;
    }

    const x = canvasWidth - logoWidth - padding;
    const y = padding;

    ctx.drawImage(logo, x, y, logoWidth, logoHeight);
  }
}
