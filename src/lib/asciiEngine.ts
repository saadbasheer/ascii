
import { AsciiConfig } from "./types";
import { fbm } from "./noise";
import { computeGlyphDensities, charsets } from "./glyphAtlas";

export class AsciiEngine {
  private config: AsciiConfig;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private glyphDensities: number[];
  private charset: string;
  private animationFrameId: number | null = null;
  private startTime: number | null = null;

  constructor(config: AsciiConfig, canvas: HTMLCanvasElement) {
    this.config = config;
    this.canvas = canvas;
    const context = this.canvas.getContext("2d");
    if (!context) {
      throw new Error("Could not get 2D context");
    }
    this.ctx = context;

    this.charset = this.getCharset();
    this.glyphDensities = computeGlyphDensities(
      this.charset,
      `"monospace"`,
      this.config.cell
    );
  }

  private getCharset(): string {
    if (this.config.charsetPreset === "custom") {
      return this.config.customCharset || charsets.medium;
    }
    return charsets[this.config.charsetPreset];
  }

  private renderFrame(time: number) {
    const { width, height, cell, speed, zRate, noiseScale, noiseStrength, brightness, contrast, bg } = this.config;
    const cols = Math.floor(width / cell);
    const rows = Math.floor(height / cell);

    this.ctx.fillStyle = `rgb(${bg[0] * 255}, ${bg[1] * 255}, ${bg[2] * 255})`;
    this.ctx.fillRect(0, 0, width, height);

    const t = time * speed;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const u = x / (cols - 1);
        const v = y / (rows - 1);

        const noiseValue = fbm(u * noiseScale, v * noiseScale, t * zRate, 4, 2, 0.5);
        let intensity = (noiseValue + 1) / 2; // map from [-1, 1] to [0, 1]

        intensity = (intensity - 0.5) * contrast + 0.5 + brightness;
        intensity = Math.max(0, Math.min(1, intensity));

        const glyphIndex = Math.floor(intensity * (this.charset.length - 1));
        const glyph = this.charset[glyphIndex];

        this.ctx.fillStyle = `white`; // for now
        this.ctx.font = `${cell}px monospace`;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(glyph, x * cell + cell / 2, y * cell + cell / 2);
      }
    }
  }

  private animate = (timestamp: number) => {
    if (!this.startTime) {
      this.startTime = timestamp;
    }
    const elapsedTime = (timestamp - this.startTime) / 1000;
    this.renderFrame(elapsedTime);
    this.animationFrameId = requestAnimationFrame(this.animate);

    if (this.config.duration > 0 && elapsedTime >= this.config.duration) {
      if (this.config.loop) {
        this.startTime = timestamp;
      } else {
        this.stop();
      }
    }
  }

  public start() {
    if (this.animationFrameId) {
      return;
    }
    this.animationFrameId = requestAnimationFrame(this.animate);
  }

  public stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
      this.startTime = null;
    }
  }

  public updateConfig(newConfig: Partial<AsciiConfig>) {
    const oldCharsetPreset = this.config.charsetPreset;
    const oldCustomCharset = this.config.customCharset;
    const oldCell = this.config.cell;

    this.config = { ...this.config, ...newConfig };

    if (
      newConfig.charsetPreset !== oldCharsetPreset ||
      newConfig.customCharset !== oldCustomCharset ||
      newConfig.cell !== oldCell
    ) {
      this.charset = this.getCharset();
      this.glyphDensities = computeGlyphDensities(
        this.charset,
        `"monospace"`,
        this.config.cell
      );
    }
  }
}
