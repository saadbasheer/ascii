import GIF from "gif.js";
import { AsciiConfig } from "../types";

export async function exportLoopingGif(
  canvas: HTMLCanvasElement,
  config: AsciiConfig,
  onProgress: (progress: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const gif = new GIF({
        workers: 4,
        quality: 10,
        width: config.width,
        height: config.height,
        workerScript: "/gif.worker.js",
      });

      // Capture exactly the frames that loop seamlessly (not including the wrap-around frame)
      const frameCount = Math.round(config.duration * config.fps);
      const frameDelay = 1000 / config.fps;
      const frames: ImageData[] = [];

      // Capture frames from canvas
      const gl = canvas.getContext("webgl2", { preserveDrawingBuffer: true });
      if (!gl) {
        reject(new Error("WebGL2 not supported"));
        return;
      }

      // Create a temporary canvas for reading pixels
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = config.width;
      tempCanvas.height = config.height;
      const tempCtx = tempCanvas.getContext("2d");
      
      if (!tempCtx) {
        reject(new Error("Could not get 2D context"));
        return;
      }

      // Capture all frames
      let capturedFrames = 0;
      const captureInterval = setInterval(() => {
        if (capturedFrames >= frameCount) {
          clearInterval(captureInterval);
          
          // Add frames to GIF
          frames.forEach((frame, index) => {
            gif.addFrame(frame, { delay: frameDelay, copy: true });
            onProgress((index / frames.length) * 0.5);
          });

          // Render GIF
          gif.on("finished", (blob: Blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.download = `ascii-animation-${Date.now()}.gif`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
            onProgress(1);
            resolve();
          });

          gif.on("progress", (p: number) => {
            onProgress(0.5 + p * 0.5);
          });

          gif.render();
          return;
        }

        // Draw current frame to temp canvas
        tempCtx.drawImage(canvas, 0, 0);
        const imageData = tempCtx.getImageData(0, 0, config.width, config.height);
        frames.push(imageData);
        capturedFrames++;
        onProgress((capturedFrames / frameCount) * 0.3);
      }, frameDelay);

    } catch (error) {
      reject(error);
    }
  });
}
