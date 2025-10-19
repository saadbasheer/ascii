
export type AsciiConfig = {
  width: number;
  height: number;
  cell: number;
  fps: number;
  duration: number;
  loop: boolean;

  noiseScale: number;
  noiseStrength: number;
  speed: number;
  zRate: number;
  frequency: number;
  distortAmp: number;

  brightness: number;
  contrast: number;
  tint: [number, number, number];
  bg: [number, number, number];
  hue: number;
  saturation: number;
  gamma: number;
  vignette: number;
  vignetteSoftness: number;
  glyphSharpness: number;

  charsetPreset: 'minimal' | 'medium' | 'full' | 'custom';
  customCharset?: string;
  bw: boolean;

  seed1: number;
  seed2: number;
};
