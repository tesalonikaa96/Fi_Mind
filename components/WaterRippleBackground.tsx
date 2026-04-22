"use client";
import { useEffect, useRef, useCallback } from "react";

const RESOLUTION = 3;
const DAMPING = 0.982;
const AUTO_RIPPLE_INTERVAL = 1800;

export default function WaterRippleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buf1Ref = useRef<Float32Array | null>(null);
  const buf2Ref = useRef<Float32Array | null>(null);
  const wRef = useRef(0);
  const hRef = useRef(0);
  const animRef = useRef<number>(0);
  const imageDataRef = useRef<ImageData | null>(null);

  const addRipple = useCallback((cx: number, cy: number, radius: number, strength: number) => {
    const buf = buf1Ref.current;
    const w = wRef.current;
    const h = hRef.current;
    if (!buf) return;
    const gx = Math.floor(cx / RESOLUTION);
    const gy = Math.floor(cy / RESOLUTION);
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= radius) {
          const nx = gx + dx;
          const ny = gy + dy;
          if (nx > 0 && nx < w - 1 && ny > 0 && ny < h - 1) {
            buf[ny * w + nx] += strength * Math.cos((dist / radius) * (Math.PI / 2));
          }
        }
      }
    }
  }, []);

  const handlePointer = useCallback((e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e instanceof TouchEvent) {
      for (let i = 0; i < e.touches.length; i++) {
        const t = e.touches[i];
        addRipple((t.clientX - rect.left) * scaleX, (t.clientY - rect.top) * scaleY, 18, 280);
      }
    } else {
      addRipple((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY, 14, 250);
    }
  }, [addRipple]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const w = Math.floor(canvas.width / RESOLUTION);
      const h = Math.floor(canvas.height / RESOLUTION);
      wRef.current = w;
      hRef.current = h;
      buf1Ref.current = new Float32Array(w * h);
      buf2Ref.current = new Float32Array(w * h);
      imageDataRef.current = ctx.createImageData(canvas.width, canvas.height);
      // Initialize image data to base water color
      const data = imageDataRef.current.data;
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 8;
        data[i + 1] = 55;
        data[i + 2] = 100;
        data[i + 3] = 255;
      }
    };

    resize();
    window.addEventListener("resize", resize);

    // Auto ripples
    const autoRippleIds: ReturnType<typeof setInterval>[] = [];
    const spawnPoints = [
      { rx: 0.2, ry: 0.3 }, { rx: 0.7, ry: 0.6 },
      { rx: 0.5, ry: 0.2 }, { rx: 0.85, ry: 0.8 },
      { rx: 0.15, ry: 0.75 }, { rx: 0.6, ry: 0.45 },
    ];
    spawnPoints.forEach((sp, i) => {
      const id = setInterval(() => {
        const cx = sp.rx * window.innerWidth + (Math.random() - 0.5) * 120;
        const cy = sp.ry * window.innerHeight + (Math.random() - 0.5) * 80;
        addRipple(cx, cy, 10 + Math.random() * 8, 120 + Math.random() * 80);
      }, AUTO_RIPPLE_INTERVAL + i * 620);
      autoRippleIds.push(id);
    });

    // Initial ripples
    setTimeout(() => addRipple(window.innerWidth * 0.25, window.innerHeight * 0.4, 16, 220), 300);
    setTimeout(() => addRipple(window.innerWidth * 0.72, window.innerHeight * 0.55, 14, 180), 900);

    const render = () => {
      const buf1 = buf1Ref.current;
      const buf2 = buf2Ref.current;
      const imgData = imageDataRef.current;
      if (!buf1 || !buf2 || !imgData) return;

      const w = wRef.current;
      const h = hRef.current;

      // Wave propagation
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const idx = y * w + x;
          let val =
            (buf1[(y - 1) * w + x] +
              buf1[(y + 1) * w + x] +
              buf1[y * w + (x - 1)] +
              buf1[y * w + (x + 1)]) /
              2 -
            buf2[idx];
          val *= DAMPING;
          buf2[idx] = val;
        }
      }

      // Swap buffers
      const tmp = buf1Ref.current;
      buf1Ref.current = buf2Ref.current;
      buf2Ref.current = tmp;

      // Render pixels
      const data = imgData.data;
      const currentBuf = buf1Ref.current!;

      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const idx = y * w + x;

          // Normal map from height differences
          const dx = currentBuf[y * w + (x + 1)] - currentBuf[y * w + (x - 1)];
          const dy = currentBuf[(y + 1) * w + x] - currentBuf[(y - 1) * w + x];

          // Light vector dot product (simulate sun from upper-left)
          const light = Math.max(-1, Math.min(1, (dx * 0.6 + dy * 0.4) * 0.018));
          const refraction = Math.max(0, Math.min(1, currentBuf[idx] * 0.004 + 0.5));
          const specular = Math.max(0, dx * 0.03 - dy * 0.01);

          // Base water color layering
          // Deep base: dark teal-navy
          const baseR = 8;
          const baseG = 55;
          const baseB = 100;

          // Surface shimmer: sky reflection (sky-blue / cyan)
          const shimR = 140;
          const shimG = 210;
          const shimB = 255;

          // Blend
          const blend = Math.max(0, Math.min(1, refraction + light * 0.5));
          let r = baseR + (shimR - baseR) * blend * 0.6;
          let g = baseG + (shimG - baseG) * blend * 0.55;
          let b = baseB + (shimB - baseB) * blend * 0.7;

          // Specular highlight (white glint)
          const spec = Math.max(0, Math.min(1, specular * 3));
          r += (255 - r) * spec * 0.7;
          g += (255 - g) * spec * 0.7;
          b += (255 - b) * spec * 0.7;

          // Shadow for trough
          const shadow = Math.max(0, Math.min(0.5, -light * 0.8));
          r *= 1 - shadow * 0.5;
          g *= 1 - shadow * 0.4;
          b *= 1 - shadow * 0.3;

          r = Math.max(0, Math.min(255, r));
          g = Math.max(0, Math.min(255, g));
          b = Math.max(0, Math.min(255, b));

          for (let py = 0; py < RESOLUTION; py++) {
            for (let px = 0; px < RESOLUTION; px++) {
              const pidx = ((y * RESOLUTION + py) * canvas.width + (x * RESOLUTION + px)) * 4;
              data[pidx] = r;
              data[pidx + 1] = g;
              data[pidx + 2] = b;
              data[pidx + 3] = 255;
            }
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    canvas.addEventListener("mousemove", handlePointer);
    canvas.addEventListener("click", handlePointer);
    canvas.addEventListener("touchstart", handlePointer, { passive: true });
    canvas.addEventListener("touchmove", handlePointer, { passive: true });

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handlePointer);
      canvas.removeEventListener("click", handlePointer);
      canvas.removeEventListener("touchstart", handlePointer);
      canvas.removeEventListener("touchmove", handlePointer);
      autoRippleIds.forEach(clearInterval);
    };
  }, [addRipple, handlePointer]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-auto absolute inset-0 z-0 touch-none"
      style={{ cursor: "crosshair" }}
    />
  );
}