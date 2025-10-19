"use client";

import { useState, useRef } from "react";
import { AsciiConfig } from "@/lib/types";
import AsciiCanvas, { AsciiCanvasHandle } from "@/components/AsciiCanvas";
import FloatingControls from "@/components/FloatingControls";

const defaultConfig: AsciiConfig = {
  width: typeof window !== 'undefined' ? window.innerWidth : 1920,
  height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  cell: 16,
  fps: 30,
  duration: 3,
  loop: true,

  noiseScale: 0.006,
  noiseStrength: 0.48,
  speed: 0.11,
  zRate: 0.03,
  frequency: 5.3,
  distortAmp: 0.48,

  brightness: 1.66,
  contrast: 0.88,
  tint: [1, 1, 0.3],
  bg: [0.07, 0.028, 0.087],
  hue: 296.2,
  saturation: 1.17,
  gamma: 1.49,
  vignette: 0.97,
  vignetteSoftness: 1.45,
  glyphSharpness: 0.065,

  charsetPreset: "medium",
  bw: false,

  seed1: Math.random(),
  seed2: Math.random(),
};

export default function Home() {
  const [config, setConfig] = useState<AsciiConfig>(defaultConfig);
  const canvasRef = useRef<AsciiCanvasHandle>(null);

  const handleConfigChange = (newConfig: Partial<AsciiConfig>) => {
    setConfig((prevConfig) => ({ ...prevConfig, ...newConfig }));
  };

  return (
    <main className="relative w-full h-full min-h-screen overflow-hidden bg-black">
      <AsciiCanvas ref={canvasRef} config={config} />
      
      <div className="fixed top-4 right-4 z-50">
        <FloatingControls
          config={config}
          onConfigChange={handleConfigChange}
          canvasRef={canvasRef}
        />
      </div>
    </main>
  );
}