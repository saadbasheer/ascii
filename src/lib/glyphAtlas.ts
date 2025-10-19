
export const charsets = {
  minimal: " .:-+*#%@",
  medium: " .`-_':,;=i!lI><~+*v)J?s/\|()1{}[]rcjxynzftLCJUYXZO0QMW&8%B@$",
  full: " `.-':_,^=;><+!rc*/z?sLTv)J7(|Fi{C}fI31tlu[neoZ5Yxjya]2ESwqkP6h9d4VpOGbUAKXHm8RD#$Bg0MNWQ%&@",
};

export function computeGlyphDensities(
  charset: string,
  font: string,
  cellSize: number
): number[] {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    return [];
  }

  canvas.width = cellSize;
  canvas.height = cellSize;

  const densities: number[] = [];

  for (const char of charset) {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, cellSize, cellSize);
    ctx.fillStyle = "black";
    ctx.font = font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(char, cellSize / 2, cellSize / 2);

    const imageData = ctx.getImageData(0, 0, cellSize, cellSize);
    let totalLuminance = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      totalLuminance += luminance;
    }
    densities.push(totalLuminance / (cellSize * cellSize * 255));
  }

  return densities;
}
