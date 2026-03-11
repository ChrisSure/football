import path from 'path';
import type { ImageStyleConfig } from '../types';

export const FONT_PATH = path.resolve(__dirname, '..', 'fonts', 'Montserrat-Bold.ttf');
export const FONT_FAMILY = 'Montserrat';

export const IMAGE_STYLE: ImageStyleConfig = {
  dimensions: {
    width: 1280,
    height: 720,
  },
  text: {
    maxFontSize: 48,
    minFontSize: 28,
    sourceFontSize: 18,
    fontFamily: FONT_FAMILY,
    lineHeight: 1.3,
    maxLines: 3,
    padding: 40,
  },
  accentBarWidth: 4,
  accentBarColor: '#00C853',
  gradientOpacity: 0.75,
};
