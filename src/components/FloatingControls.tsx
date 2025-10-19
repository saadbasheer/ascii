"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Settings } from "lucide-react";
import { AsciiConfig } from "@/lib/types";
import { AsciiCanvasHandle } from "./AsciiCanvas";
import ControlsPanel from "./ControlsPanel";
import ExportPreviewPanel from "./ExportPreviewPanel";

interface FloatingControlsProps {
  config: AsciiConfig;
  onConfigChange: (newConfig: Partial<AsciiConfig>) => void;
  canvasRef: React.RefObject<AsciiCanvasHandle | null>;
}

export default function FloatingControls({
  config,
  onConfigChange,
  canvasRef,
}: FloatingControlsProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [previewData, setPreviewData] = useState<{
    componentCode: string;
  } | null>(null);

  const handleOpenPreview = (componentCode: string) => {
    setPreviewData({ componentCode });
  };

  const handleClosePreview = () => {
    setPreviewData(null);
  };

  // Create reactive background color from config
  const bgColor = `rgba(${config.bg[0] * 255}, ${config.bg[1] * 255}, ${
    config.bg[2] * 255
  }, 0.6)`;

  return (
    <>
      <div className="flex items-start gap-2">
        {isExpanded && (
          <div
            className="w-96 max-h-[calc(100vh-2rem)] rounded-lg border border-white/10 backdrop-blur-md shadow-2xl flex flex-col transition-colors duration-300"
            style={{
              backgroundColor: bgColor,
              boxShadow: `0 0 40px ${bgColor}, 0 20px 25px -5px rgba(0, 0, 0, 0.3)`,
            }}
          >
            <div className="flex-1 overflow-y-auto p-6 hide-scrollbar">
              <ControlsPanel
                config={config}
                onConfigChange={onConfigChange}
                canvasRef={canvasRef}
                onOpenPreview={handleOpenPreview}
              />
            </div>
          </div>
        )}

        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-10 w-10 rounded-lg border border-white/10 backdrop-blur-xl hover:bg-white/20 transition-all text-white"
          style={{
            backgroundColor: bgColor,
          }}
        >
          {isExpanded ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <Settings className="h-4 w-4" />
          )}
        </Button>
      </div>

      {previewData && (
        <ExportPreviewPanel
          config={config}
          componentCode={previewData.componentCode}
          onClose={handleClosePreview}
        />
      )}
    </>
  );
}
