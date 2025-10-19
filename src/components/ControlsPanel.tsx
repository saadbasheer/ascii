"use client";

import { useState } from "react";
import { AsciiConfig } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AsciiCanvasHandle } from "./AsciiCanvas";
import { exportReactComponent } from "@/lib/exporters/exportReactComponent";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ControlsPanelProps {
  config: AsciiConfig;
  onConfigChange: (newConfig: Partial<AsciiConfig>) => void;
  canvasRef: React.RefObject<AsciiCanvasHandle | null>;
  onOpenPreview: (componentCode: string) => void;
}

const defaultConfig: AsciiConfig = {
  width: 800,
  height: 450,
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
  seed1: 1.8,
  seed2: 0.28,
};

// Background color presets (dark theme)
const BG_PRESETS = [
  { name: "Deep Purple", rgb: [0.07, 0.028, 0.087] },
  { name: "Pure Black", rgb: [0, 0, 0] },
  { name: "Dark Navy", rgb: [0.02, 0.02, 0.06] },
  { name: "Dark Forest", rgb: [0.02, 0.05, 0.02] },
  { name: "Dark Maroon", rgb: [0.06, 0.01, 0.02] },
  { name: "Midnight Blue", rgb: [0.01, 0.02, 0.08] },
  { name: "Dark Teal", rgb: [0.01, 0.05, 0.05] },
  { name: "Charcoal", rgb: [0.04, 0.04, 0.04] },
];

export default function ControlsPanel({
  config,
  onConfigChange,
  canvasRef,
  onOpenPreview,
}: ControlsPanelProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showBgFinetuning, setShowBgFinetuning] = useState(false);

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

  const handleResetAll = () => {
    onConfigChange(defaultConfig);
  };

  const exportPNG = () => {
    const frame = canvasRef.current?.captureFrame();
    if (!frame) return;

    const link = document.createElement("a");
    link.download = `ascii-frame-${Date.now()}.png`;
    link.href = frame;
    link.click();
  };

  const exportGIF = async () => {
    setIsExporting(true);
    setProgress(0);

    try {
      const { exportLoopingGif } = await import(
        "@/lib/exporters/exportLoopingGif"
      );
      const canvas = document.querySelector("canvas");
      if (!canvas) {
        alert("Canvas not found");
        return;
      }

      await exportLoopingGif(canvas, config, (p) => setProgress(p));
    } catch (error) {
      console.error("GIF export failed:", error);
      alert("GIF export failed. Check console for details.");
    } finally {
      setIsExporting(false);
      setProgress(0);
    }
  };

  const exportComponent = () => {
    const componentCode = exportReactComponent(config);
    onOpenPreview(componentCode);
  };

  // Helper to render a slider control
  const renderSlider = (
    id: string,
    label: string,
    value: number,
    min: number,
    max: number,
    step: number,
    onChange: (val: number) => void,
    format: (val: number) => string = (v) => v.toFixed(2)
  ) => (
    <div className="space-y-1">
      <div className="flex justify-between">
        <Label htmlFor={id} className="text-xs text-white/60">
          {label}
        </Label>
        <span className="text-xs text-white/40 font-mono">{format(value)}</span>
      </div>
      <Slider
        id={id}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([val]) => onChange(val)}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-sm font-medium text-white/60 uppercase tracking-wider">
        Controls
      </h2>

      {/* Action Buttons */}
      <div>
        <h3 className="text-xs font-medium mb-3 text-white/40 uppercase tracking-wide">
          Actions
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleRandomizeAll}
            className="h-8 text-xs"
            variant="outline"
            disabled={isExporting}
          >
            Randomize
          </Button>
          <Button
            onClick={handleResetAll}
            className="h-8 text-xs"
            variant="outline"
            disabled={isExporting}
          >
            Reset
          </Button>
          <Button
            onClick={exportPNG}
            className="h-8 text-xs"
            variant="outline"
            disabled={isExporting}
          >
            PNG Frame
          </Button>
          <Button
            onClick={exportGIF}
            className="h-8 text-xs"
            variant="outline"
            disabled={isExporting}
          >
            {isExporting ? `${Math.round(progress * 100)}%` : "GIF"}
          </Button>
          <Button
            onClick={exportComponent}
            className="col-span-2 h-8 text-xs"
            variant="outline"
            disabled={isExporting}
          >
            React Component
          </Button>
        </div>
      </div>

      <Separator className="bg-white/5" />

      {/* Motion Section */}
      <div>
        <h3 className="text-xs font-medium mb-3 text-white/40 uppercase tracking-wide">
          Motion
        </h3>
        <div className="space-y-2">
          {renderSlider("speed", "Speed", config.speed, 0, 0.5, 0.01, (val) =>
            onConfigChange({ speed: val })
          )}
          {renderSlider(
            "noiseStrength",
            "Noise Strength",
            config.noiseStrength,
            0,
            1,
            0.01,
            (val) => onConfigChange({ noiseStrength: val })
          )}
          {renderSlider(
            "distortAmp",
            "Distortion",
            config.distortAmp,
            0,
            1,
            0.01,
            (val) => onConfigChange({ distortAmp: val })
          )}
          {renderSlider(
            "frequency",
            "Frequency",
            config.frequency,
            0,
            10,
            0.1,
            (val) => onConfigChange({ frequency: val })
          )}
          {renderSlider(
            "noiseScale",
            "Noise Scale",
            config.noiseScale,
            0.001,
            0.02,
            0.001,
            (val) => onConfigChange({ noiseScale: val }),
            (val) => val.toFixed(4)
          )}
          {renderSlider(
            "zRate",
            "Z Rate",
            config.zRate,
            0,
            0.1,
            0.001,
            (val) => onConfigChange({ zRate: val }),
            (val) => val.toFixed(3)
          )}
        </div>
      </div>

      <Separator className="bg-white/5" />

      {/* Appearance Section */}
      <div>
        <h3 className="text-xs font-medium mb-3 text-white/40 uppercase tracking-wide">
          Appearance
        </h3>
        <div className="space-y-2">
          {renderSlider(
            "brightness",
            "Brightness",
            config.brightness,
            0,
            3,
            0.01,
            (val) => onConfigChange({ brightness: val })
          )}
          {renderSlider(
            "contrast",
            "Contrast",
            config.contrast,
            0,
            2,
            0.01,
            (val) => onConfigChange({ contrast: val })
          )}
          {renderSlider(
            "hue",
            "Hue",
            config.hue,
            0,
            360,
            0.1,
            (val) => onConfigChange({ hue: val }),
            (val) => `${val.toFixed(1)}°`
          )}
          {renderSlider(
            "saturation",
            "Saturation",
            config.saturation,
            0,
            2,
            0.01,
            (val) => onConfigChange({ saturation: val })
          )}
          {renderSlider("gamma", "Gamma", config.gamma, 0.5, 2, 0.01, (val) =>
            onConfigChange({ gamma: val })
          )}
          {renderSlider(
            "vignette",
            "Vignette",
            config.vignette,
            0,
            1,
            0.01,
            (val) => onConfigChange({ vignette: val })
          )}
          {renderSlider(
            "vignetteSoftness",
            "Vignette Softness",
            config.vignetteSoftness,
            0.1,
            2,
            0.01,
            (val) => onConfigChange({ vignetteSoftness: val })
          )}
        </div>
      </div>

      <Separator className="bg-white/5" />

      {/* ASCII Glyphs Section */}
      <div>
        <h3 className="text-xs font-medium mb-3 text-white/40 uppercase tracking-wide">
          ASCII Glyphs
        </h3>
        <div className="space-y-2">
          {renderSlider(
            "cell",
            "Cell Size",
            config.cell,
            8,
            32,
            1,
            (val) => onConfigChange({ cell: val }),
            (val) => `${val}px`
          )}
          {renderSlider(
            "glyphSharpness",
            "Sharpness",
            config.glyphSharpness,
            0.01,
            0.2,
            0.001,
            (val) => onConfigChange({ glyphSharpness: val }),
            (val) => val.toFixed(3)
          )}
          <div className="space-y-1">
            <Label htmlFor="charset" className="text-xs text-white/60">
              Character Set
            </Label>
            <Select
              value={config.charsetPreset}
              onValueChange={(value) =>
                onConfigChange({
                  charsetPreset: value as AsciiConfig["charsetPreset"],
                })
              }
            >
              <SelectTrigger id="charset">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="full">Full</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="bw" className="text-xs text-white/60">
              Black & White
            </Label>
            <Switch
              id="bw"
              checked={config.bw}
              onCheckedChange={(checked) => onConfigChange({ bw: checked })}
            />
          </div>
        </div>
      </div>

      <Separator className="bg-white/5" />

      {/* Background Color Section */}
      <div>
        <h3 className="text-xs font-medium mb-3 text-white/40 uppercase tracking-wide">
          Background Color
        </h3>
        <div className="space-y-3">
          {/* Color Swatches */}
          <div className="grid grid-cols-4 gap-2">
            {BG_PRESETS.map((preset) => {
              const isActive =
                config.bg[0] === preset.rgb[0] &&
                config.bg[1] === preset.rgb[1] &&
                config.bg[2] === preset.rgb[2];
              return (
                <button
                  key={preset.name}
                  onClick={() =>
                    onConfigChange({
                      bg: preset.rgb as [number, number, number],
                    })
                  }
                  className={`h-10 rounded-md border-2 transition-all ${
                    isActive
                      ? "border-white/60 ring-2 ring-white/20"
                      : "border-white/10 hover:border-white/30"
                  }`}
                  style={{
                    backgroundColor: `rgb(${preset.rgb[0] * 255}, ${
                      preset.rgb[1] * 255
                    }, ${preset.rgb[2] * 255})`,
                  }}
                  title={preset.name}
                />
              );
            })}
          </div>

          {/* Fine-tuning toggle */}
          <Button
            onClick={() => setShowBgFinetuning(!showBgFinetuning)}
            variant="ghost"
            className="w-full h-7 text-xs"
          >
            {showBgFinetuning ? "Hide" : "Show"} Fine-tuning
            {showBgFinetuning ? (
              <ChevronUp className="ml-1 h-3 w-3" />
            ) : (
              <ChevronDown className="ml-1 h-3 w-3" />
            )}
          </Button>

          {/* Fine-tuning sliders */}
          {showBgFinetuning && (
            <div className="space-y-2 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs text-white/40 font-mono">R</span>
                  <span className="text-xs text-white/40 font-mono">
                    {config.bg[0].toFixed(3)}
                  </span>
                </div>
                <Slider
                  min={0}
                  max={0.5}
                  step={0.001}
                  value={[config.bg[0]]}
                  onValueChange={([value]) =>
                    onConfigChange({
                      bg: [value, config.bg[1], config.bg[2]],
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs text-white/40 font-mono">G</span>
                  <span className="text-xs text-white/40 font-mono">
                    {config.bg[1].toFixed(3)}
                  </span>
                </div>
                <Slider
                  min={0}
                  max={0.5}
                  step={0.001}
                  value={[config.bg[1]]}
                  onValueChange={([value]) =>
                    onConfigChange({
                      bg: [config.bg[0], value, config.bg[2]],
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs text-white/40 font-mono">B</span>
                  <span className="text-xs text-white/40 font-mono">
                    {config.bg[2].toFixed(3)}
                  </span>
                </div>
                <Slider
                  min={0}
                  max={0.5}
                  step={0.001}
                  value={[config.bg[2]]}
                  onValueChange={([value]) =>
                    onConfigChange({
                      bg: [config.bg[0], config.bg[1], value],
                    })
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <Separator className="bg-white/5" />

      {/* Foreground Tint Section */}
      <div>
        <h3 className="text-xs font-medium mb-3 text-white/40 uppercase tracking-wide">
          Foreground Tint
        </h3>
        <div className="space-y-2">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-xs text-white/40 font-mono">R</span>
              <span className="text-xs text-white/40 font-mono">
                {config.tint[0].toFixed(2)}
              </span>
            </div>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={[config.tint[0]]}
              onValueChange={([value]) =>
                onConfigChange({
                  tint: [value, config.tint[1], config.tint[2]],
                })
              }
            />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-xs text-white/40 font-mono">G</span>
              <span className="text-xs text-white/40 font-mono">
                {config.tint[1].toFixed(2)}
              </span>
            </div>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={[config.tint[1]]}
              onValueChange={([value]) =>
                onConfigChange({
                  tint: [config.tint[0], value, config.tint[2]],
                })
              }
            />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-xs text-white/40 font-mono">B</span>
              <span className="text-xs text-white/40 font-mono">
                {config.tint[2].toFixed(2)}
              </span>
            </div>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={[config.tint[2]]}
              onValueChange={([value]) =>
                onConfigChange({
                  tint: [config.tint[0], config.tint[1], value],
                })
              }
            />
          </div>
        </div>
      </div>

      <Separator className="bg-white/5" />

      {/* Advanced Section (Collapsed by default) */}
      <div>
        <Button
          onClick={() => setShowAdvanced(!showAdvanced)}
          variant="ghost"
          className="w-full h-8 text-xs justify-between px-0"
        >
          <span className="uppercase tracking-wide font-medium">Advanced</span>
          {showAdvanced ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>

        {showAdvanced && (
          <div className="space-y-2 mt-3">
            {/* Seeds */}
            <div className="space-y-2">
              <Label className="text-xs text-white/60">Seeds</Label>
              {renderSlider(
                "seed1",
                "Seed 1",
                config.seed1,
                0,
                6.28,
                0.001,
                (val) => onConfigChange({ seed1: val }),
                (val) => val.toFixed(3)
              )}
              {renderSlider(
                "seed2",
                "Seed 2",
                config.seed2,
                0,
                6.28,
                0.001,
                (val) => onConfigChange({ seed2: val }),
                (val) => val.toFixed(3)
              )}
            </div>

            <Separator className="bg-white/5 my-3" />

            {/* Export Settings */}
            <div className="space-y-2">
              <Label className="text-xs text-white/60">Export Settings</Label>
              {renderSlider(
                "fps",
                "FPS",
                config.fps,
                15,
                60,
                1,
                (val) => onConfigChange({ fps: val }),
                (val) => val.toString()
              )}
              {renderSlider(
                "duration",
                "Duration",
                config.duration,
                1,
                10,
                0.5,
                (val) => onConfigChange({ duration: val }),
                (val) => `${val}s`
              )}
              <div className="flex items-center justify-between">
                <Label htmlFor="loop" className="text-xs text-white/60">
                  Loop Animation
                </Label>
                <Switch
                  id="loop"
                  checked={config.loop}
                  onCheckedChange={(checked) =>
                    onConfigChange({ loop: checked })
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
