"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Copy, Download, Check } from "lucide-react";
import { AsciiConfig } from "@/lib/types";
import AsciiCanvas, { AsciiCanvasHandle } from "./AsciiCanvas";

interface ExportPreviewPanelProps {
  config: AsciiConfig;
  componentCode: string;
  onClose: () => void;
  bgColor?: string;
}

export default function ExportPreviewPanel({
  config,
  componentCode,
  onClose,
  bgColor = "rgba(18, 7, 22, 0.6)",
}: ExportPreviewPanelProps) {
  const [copied, setCopied] = useState(false);
  const [previewSize, setPreviewSize] = useState({ width: 800, height: 600 });
  const previewCanvasRef = useRef<AsciiCanvasHandle>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate preview size to fill container
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const width = container.clientWidth;
      const height = container.clientHeight;

      setPreviewSize({ width: Math.floor(width), height: Math.floor(height) });
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    // Small delay to ensure layout is settled
    const timeout = setTimeout(updateSize, 100);

    return () => {
      window.removeEventListener("resize", updateSize);
      clearTimeout(timeout);
    };
  }, []);

  // Create preview config with container size
  const previewConfig: AsciiConfig = {
    ...config,
    width: previewSize.width,
    height: previewSize.height,
  };

  useEffect(() => {
    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(componentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([componentCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `AsciiAnimation.jsx`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 lg:p-8">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="relative z-10 w-full h-full lg:w-[90vw] lg:h-auto lg:max-w-6xl lg:max-h-[85vh] lg:rounded-xl border-0 lg:border border-white/20 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden"
        style={{
          background: `linear-gradient(135deg, 
            ${bgColor.replace("0.6)", "0.95)")} 0%, 
            ${bgColor.replace("0.6)", "0.9)")} 50%, 
            ${bgColor.replace("0.6)", "0.95)")} 100%)`,
          boxShadow: `
            0 8px 32px ${bgColor.replace("0.6)", "0.4)")},
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -1px 0 rgba(0, 0, 0, 0.2)
          `,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-white/20">
          <div>
            <h2 className="text-base md:text-lg font-semibold text-white">
              React Component Export
            </h2>
            <p className="text-xs text-white/50 mt-0.5 hidden md:block">
              Copy or download this component to use in your React app
            </p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="h-9 w-9 md:h-8 md:w-8 text-white/60 hover:text-white hover:bg-white/10 touch-manipulation"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row">
          {/* Preview */}
          <div className="lg:w-1/2 p-4 lg:p-6 flex flex-col border-b lg:border-b-0 lg:border-r border-white/10 shrink-0 lg:min-h-0">
            <h3 className="text-xs md:text-sm font-medium text-white/60 mb-3 uppercase tracking-wide">
              Live Preview
            </h3>
            <div
              ref={containerRef}
              className="w-full h-[250px] lg:flex-1 rounded-lg overflow-hidden border border-white/20 bg-black relative"
            >
              <AsciiCanvas
                ref={previewCanvasRef}
                config={previewConfig}
                className="w-full h-full"
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
          </div>

          {/* Code */}
          <div className="lg:w-1/2 p-4 lg:p-6 flex flex-col lg:min-h-0 space-y-4">
            <div className="flex flex-col flex-1 lg:min-h-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs md:text-sm font-medium text-white/60 uppercase tracking-wide">
                  Component Code
                </h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopy}
                    className="h-9 md:h-7 text-xs touch-manipulation"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 md:mr-1" />
                        <span className="hidden sm:inline">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 md:mr-1" />
                        <span className="hidden sm:inline">Copy</span>
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDownload}
                    className="h-9 md:h-7 text-xs touch-manipulation"
                  >
                    <Download className="h-3 w-3 md:mr-1" />
                    <span className="hidden sm:inline">Download</span>
                  </Button>
                </div>
              </div>

              <div className="h-[350px] lg:flex-1 lg:min-h-0 rounded-lg border border-white/20 bg-black/60 overflow-hidden">
                <pre className="h-full overflow-auto p-3 md:p-4 text-[11px] md:text-xs text-white/80 font-mono leading-relaxed">
                  <code>{componentCode}</code>
                </pre>
              </div>
            </div>

            {/* Usage Instructions */}
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 shrink-0">
              <h4 className="text-xs font-semibold text-white/80 mb-2">
                Usage Instructions
              </h4>
              <ul className="text-[11px] md:text-xs text-white/60 space-y-1">
                <li>• Takes fullscreen by default</li>
                <li>• Perfect for backgrounds & hero sections</li>
                <li>• Works in both .jsx and .tsx projects</li>
                <li className="hidden md:block">
                  • Pass className/style props to customize
                </li>
                <li className="hidden md:block">
                  • Requires React 18+ and WebGL2 support
                </li>
              </ul>
              <div className="mt-2 p-2 rounded bg-black/40 border border-white/5 hidden md:block">
                <code className="text-[10px] text-white/70">
                  {"// Fullscreen (default)"}
                  <br />
                  {"<AsciiAnimation />"}
                  <br />
                  <br />
                  {"// Custom size"}
                  <br />
                  {
                    '<AsciiAnimation className="absolute inset-x-0 top-0 h-96" />'
                  }
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
