import { Source } from '../../db/types';

export interface ImageOverlayOptions {
  title: string;
  source: Source;
  imageUrl: string;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageTextConfig {
  maxFontSize: number;
  minFontSize: number;
  sourceFontSize: number;
  fontFamily: string;
  lineHeight: number;
  maxLines: number;
  padding: number;
}

export interface ImageStyleConfig {
  dimensions: ImageDimensions;
  text: ImageTextConfig;
  accentBarWidth: number;
  accentBarColor: string;
  gradientOpacity: number;
}
