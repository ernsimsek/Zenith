import { useRef, useState, useCallback } from 'react';
import clsx from 'clsx';

function formatTime(sec) {
  if (!sec || !isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function WaveformScrubber({ progress, duration, onSeek, disabled }) {
  const barRef = useRef(null);
  const [hoverX, setHoverX] = useState(null);
  const pct = duration > 0 ? Math.min(1, progress / duration) : 0;

  const computePos = useCallback((e) => {
    const rect = barRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    return { x, ratio: x / rect.width };
  }, []);

  const handleClick = (e) => {
    if (disabled || !duration) return;
    const { ratio } = computePos(e);
    onSeek?.(ratio * duration);
  };

  const handleMove = (e) => {
    if (disabled) return;
    const { x } = computePos(e);
    setHoverX(x);
  };

  return (
    <div className="flex w-full items-center gap-3 font-mono text-[10px] text-ink-faint">
      <span className="w-8 text-right tabular-nums">{formatTime(progress)}</span>
      <div
        ref={barRef}
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverX(null)}
        onClick={handleClick}
        className={clsx(
          'group relative h-1.5 flex-1 cursor-pointer rounded-full bg-wave-inactive transition-all',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <div
          className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent to-pulse shadow-[0_0_12px_var(--accent-glow)]"
          style={{ width: `${pct * 100}%` }}
        />
        <div
          className="pointer-events-none absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent opacity-0 shadow-glow-sm transition-opacity group-hover:opacity-100"
          style={{ left: `${pct * 100}%` }}
        />
        {hoverX !== null && duration > 0 && !disabled && (
          <div
            className="pointer-events-none absolute -top-7 -translate-x-1/2 rounded bg-elevated px-1.5 py-0.5 text-[10px] text-ink shadow-glow-sm"
            style={{ left: hoverX }}
          >
            {formatTime((hoverX / (barRef.current?.clientWidth || 1)) * duration)}
          </div>
        )}
      </div>
      <span className="w-8 tabular-nums">{formatTime(duration)}</span>
    </div>
  );
}
