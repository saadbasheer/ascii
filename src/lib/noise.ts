
import { createNoise3D } from "simplex-noise";

const noise3D = createNoise3D();

export function simplex(x: number, y: number, z: number): number {
  return noise3D(x, y, z);
}

export function fbm(
  x: number,
  y: number,
  z: number,
  octaves: number,
  lacunarity: number,
  gain: number
): number {
  let total = 0;
  let frequency = 1.0;
  let amplitude = 1.0;
  let maxValue = 0;

  for (let i = 0; i < octaves; i++) {
    total += simplex(x * frequency, y * frequency, z * frequency) * amplitude;
    maxValue += amplitude;
    amplitude *= gain;
    frequency *= lacunarity;
  }

  return total / maxValue;
}
