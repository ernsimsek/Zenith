import { useEffect, useRef } from 'react';
import useVisualizer from '../../hooks/useVisualizer.js';

const BAR_COUNT = 32;

export default function FrequencyBars({ active = true, className = '' }) {
  const canvasRef = useRef(null);
  const dprRef = useRef(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      dprRef.current = dpr;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  useVisualizer((data) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    const barWidth = width / BAR_COUNT;
    const gap = barWidth * 0.28;
    const step = Math.floor(data.length / BAR_COUNT);

    for (let i = 0; i < BAR_COUNT; i++) {
      // Weight lower bins less (they dominate) for nicer visual
      const raw = data[i * step] ?? 0;
      const intensity = Math.pow(raw / 255, 1.3);
      const barHeight = Math.max(2, intensity * height);

      const x = i * barWidth + gap / 2;
      const y = height - barHeight;

      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, '#00E5FF');
      gradient.addColorStop(0.6, '#00E5FF');
      gradient.addColorStop(1, '#7B2FFF');
      ctx.fillStyle = gradient;
      ctx.shadowColor = 'rgba(0,229,255,0.35)';
      ctx.shadowBlur = 8;
      ctx.fillRect(x, y, barWidth - gap, barHeight);
    }
  }, active);

  return (
    <canvas
      ref={canvasRef}
      className={`block h-full w-full ${className}`}
      aria-hidden
    />
  );
}
