"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Settings, Shuffle } from "lucide-react";
import { AsciiConfig } from "@/lib/types";
import { AsciiCanvasHandle } from "./AsciiCanvas";
import ControlsPanel from "./ControlsPanel";

interface FloatingControlsProps {
  config: AsciiConfig;
  onConfigChange: (newConfig: Partial<AsciiConfig>) => void;
  canvasRef: React.RefObject<AsciiCanvasHandle | null>;
  onOpenPreview: (componentCode: string) => void;
}

export default function FloatingControls({
  config,
  onConfigChange,
  canvasRef,
  onOpenPreview,
}: FloatingControlsProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Create reactive background color from config
  const bgColor = `rgba(${config.bg[0] * 255}, ${config.bg[1] * 255}, ${
    config.bg[2] * 255
  }, 0.6)`;

  const handleRandomizeAll = () => {
    onConfigChange({
      noiseScale: Math.random() * 0.019 + 0.001,
      noiseStrength: Math.random(),
      speed: Math.random() * 0.5,
      zRate: Math.random() * 0.1,
      frequency: Math.random() * 10,
      distortAmp: Math.random(),
      brightness: Math.random() * 2.5 + 0.5,
      contrast: Math.random() * 1.5 + 0.5,
      cell: Math.floor(Math.random() * 24) + 8,
      hue: Math.random() * 360,
      saturation: Math.random() * 2,
      gamma: Math.random() * 1.5 + 0.5,
      vignette: Math.random(),
      vignetteSoftness: Math.random() * 1.9 + 0.1,
      glyphSharpness: Math.random() * 0.19 + 0.01,
      seed1: Math.random() * 6.28,
      seed2: Math.random() * 6.28,
      tint: [Math.random(), Math.random(), Math.random()],
      bg: [Math.random() * 0.2, Math.random() * 0.2, Math.random() * 0.2],
    });
  };

  return (
    <>
      {isExpanded ? (
        <div className="flex flex-col md:flex-row items-center md:items-start gap-2">
          <div
            className="w-96 max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-2rem)] rounded-lg   backdrop-blur-lg shadow-2xl flex flex-col transition-colors duration-300"
            style={{
              backgroundColor: bgColor,
              boxShadow: `0 0 40px ${bgColor}, 0 20px 25px -5px rgba(0, 0, 0, 0.3)`,
            }}
          >
            <div className="flex-1 overflow-y-auto hide-scrollbar">
              <ControlsPanel
                config={config}
                onConfigChange={onConfigChange}
                canvasRef={canvasRef}
                onOpenPreview={onOpenPreview}
                bgColor={bgColor}
                onClose={() => setIsExpanded(false)}
              />
            </div>
          </div>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsExpanded(false)}
            className="h-10 w-10 md:h-10 md:w-10 rounded-lg border border-white/10 backdrop-blur-xl hover:bg-white/20 transition-all text-white touch-manipulation"
            style={{
              backgroundColor: bgColor,
            }}
          >
            <ChevronRight className="h-4 w-4 md:block hidden" />
            <Settings className="h-4 w-4 md:hidden" />
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={handleRandomizeAll}
            className="h-10 px-4 rounded-lg border border-white/10 backdrop-blur-xl hover:bg-white/20 transition-all text-white touch-manipulation text-xs md:hidden"
            style={{
              backgroundColor: bgColor,
            }}
          >
            <Shuffle className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsExpanded(true)}
            className="h-10 w-10 rounded-lg border border-white/10 backdrop-blur-xl hover:bg-white/20 transition-all text-white touch-manipulation"
            style={{
              backgroundColor: bgColor,
            }}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
}
