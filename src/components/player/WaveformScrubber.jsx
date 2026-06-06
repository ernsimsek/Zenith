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

  const computePos = useCallback((clientX) => {
    const rect = barRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    return { x, ratio: x / rect.width };
  }, []);

  const handleSeekAt = useCallback(
    (clientX) => {
      if (disabled || !duration) return;
      const { ratio } = computePos(clientX);
      onSeek?.(ratio * duration);
    },
    [computePos, disabled, duration, onSeek]
  );

  const handleClick = (e) => {
    handleSeekAt(e.clientX);
  };

  const handleMove = (e) => {
    if (disabled) return;
    const { x } = computePos(e.clientX);
    setHoverX(x);
  };

  const handleTouch = (e) => {
    if (disabled || !e.touches[0]) return;
    const { x } = computePos(e.touches[0].clientX);
    setHoverX(x);
    handleSeekAt(e.touches[0].clientX);
  };

  return (
    <div className="flex w-full items-center gap-2 font-mono text-[10px] text-ink-faint sm:gap-3">
      <span className="w-7 shrink-0 text-right tabular-nums sm:w-8">{formatTime(progress)}</span>
      <div
        ref={barRef}
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverX(null)}
        onClick={handleClick}
        onTouchStart={handleTouch}
        onTouchMove={handleTouch}
        className={clsx(
          'group relative h-2 flex-1 cursor-pointer rounded-full bg-wave-inactive transition-all sm:h-1.5',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <div
          className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent to-pulse shadow-[0_0_12px_var(--accent-glow)]"
          style={{ width: `${pct * 100}%` }}
        />
        <div
          className="pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent opacity-100 shadow-glow-sm transition-opacity sm:h-3 sm:opacity-0 sm:group-hover:opacity-100"
          style={{ left: `${pct * 100}%` }}
        />
        {hoverX !== null && duration > 0 && !disabled && (
          <div
            className="pointer-events-none absolute -top-7 hidden -translate-x-1/2 rounded bg-elevated px-1.5 py-0.5 text-[10px] text-ink shadow-glow-sm sm:block"
            style={{ left: hoverX }}
          >
            {formatTime((hoverX / (barRef.current?.clientWidth || 1)) * duration)}
          </div>
        )}
      </div>
      <span className="w-7 shrink-0 tabular-nums sm:w-8">{formatTime(duration)}</span>
    </div>
  );
}
