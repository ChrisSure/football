import path from 'path';
import type { ImageStyleConfig } from '../types';

export const FONT_PATH = path.resolve(__dirname, '..', 'fonts', 'Montserrat-Bold.ttf');
export const FONT_FAMILY = 'Montserrat';
export const LOGO_PATH = path.resolve(__dirname, '..', 'images', 'logo.png');

export const IMAGE_STYLE: ImageStyleConfig = {
  dimensions: {
    width: 1920,
    height: 1080,
  },
  text: {
    maxFontSize: 72,
    minFontSize: 42,
    sourceFontSize: 27,
    fontFamily: FONT_FAMILY,
    lineHeight: 1.3,
    maxLines: 3,
    padding: 60,
  },
  accentBarWidth: 6,
  accentBarColor: '#00C853',
  gradientOpacity: 0.75,
};
