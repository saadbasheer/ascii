"use client";

import { useState, useRef } from "react";
import { AsciiConfig } from "@/lib/types";
import AsciiCanvas, { AsciiCanvasHandle } from "@/components/AsciiCanvas";
import FloatingControls from "@/components/FloatingControls";
import ExportPreviewPanel from "@/components/ExportPreviewPanel";

const defaultConfig: AsciiConfig = {
  width: typeof window !== "undefined" ? window.innerWidth : 1920,
  height: typeof window !== "undefined" ? window.innerHeight : 1080,
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
  const [previewData, setPreviewData] = useState<{
    componentCode: string;
  } | null>(null);
  const canvasRef = useRef<AsciiCanvasHandle>(null);

  const handleConfigChange = (newConfig: Partial<AsciiConfig>) => {
    setConfig((prevConfig) => ({ ...prevConfig, ...newConfig }));
  };

  const handleOpenPreview = (componentCode: string) => {
    setPreviewData({ componentCode });
  };

  const handleClosePreview = () => {
    setPreviewData(null);
  };

  return (
    <main className="relative w-full h-full min-h-screen overflow-hidden bg-black">
      <AsciiCanvas ref={canvasRef} config={config} />

      <div className="fixed top-4 left-1/2 -translate-x-1/2 md:left-auto md:right-4 md:translate-x-0 z-50 w-[calc(100vw-2rem)] md:w-auto">
        <FloatingControls
          config={config}
          onConfigChange={handleConfigChange}
          canvasRef={canvasRef}
          onOpenPreview={handleOpenPreview}
        />
      </div>

      {previewData && (
        <ExportPreviewPanel
          config={config}
          componentCode={previewData.componentCode}
          onClose={handleClosePreview}
          bgColor={`rgba(${config.bg[0] * 255}, ${config.bg[1] * 255}, ${config.bg[2] * 255}, 0.6)`}
        />
      )}
    </main>
  );
}
