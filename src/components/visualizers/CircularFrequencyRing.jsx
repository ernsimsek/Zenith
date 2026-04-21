import { useEffect, useRef } from 'react';
import useVisualizer from '../../hooks/useVisualizer.js';

const BAR_COUNT = 56;

export default function CircularFrequencyRing({ active = true, className = '' }) {
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

    const cx = width / 2;
    const cy = height / 2;
    const minSide = Math.min(width, height);
    const innerR = minSide * 0.38;
    const maxBar = minSide * 0.11;
    const step = Math.max(1, Math.floor(data.length / BAR_COUNT));

    ctx.lineCap = 'round';
    ctx.shadowColor = 'rgba(0,229,255,0.4)';
    ctx.shadowBlur = 8 * (dprRef.current || 1);

    for (let i = 0; i < BAR_COUNT; i++) {
      const angle = (i / BAR_COUNT) * Math.PI * 2 - Math.PI / 2;
      const raw = data[i * step] ?? 0;
      const intensity = Math.pow(raw / 255, 1.25);
      const barLen = Math.max(1, intensity * maxBar);

      const x0 = cx + Math.cos(angle) * innerR;
      const y0 = cy + Math.sin(angle) * innerR;
      const x1 = cx + Math.cos(angle) * (innerR + barLen);
      const y1 = cy + Math.sin(angle) * (innerR + barLen);

      const grad = ctx.createLinearGradient(x0, y0, x1, y1);
      grad.addColorStop(0, 'rgba(0,229,255,0.35)');
      grad.addColorStop(0.55, '#00E5FF');
      grad.addColorStop(1, '#7B2FFF');

      ctx.strokeStyle = grad;
      ctx.lineWidth = Math.max(2, minSide * 0.006);
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    }

    ctx.shadowBlur = 0;
  }, active);

  return <canvas ref={canvasRef} className={`pointer-events-none block h-full w-full ${className}`} aria-hidden />;
}
