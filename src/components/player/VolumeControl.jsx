import { useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function VolumeControl({ volume, muted, onChange, onToggleMute, barClassName = 'w-24' }) {
  const barRef = useRef(null);
  const active = muted ? 0 : volume;

  const handlePos = (e) => {
    const rect = barRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    onChange(x / rect.width);
  };

  return (
    <div className="inline-flex shrink-0 items-center gap-2">
      <button
        type="button"
        onClick={onToggleMute}
        className="rounded p-2 text-ink-muted transition-colors hover:text-ink"
        title={muted ? 'Unmute' : 'Mute'}
      >
        {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
      <div
        ref={barRef}
        onClick={handlePos}
        onMouseDown={(e) => {
          handlePos(e);
          const move = (ev) => handlePos(ev);
          const up = () => {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', up);
          };
          window.addEventListener('mousemove', move);
          window.addEventListener('mouseup', up);
        }}
        onWheel={(e) => {
          onChange(Math.max(0, Math.min(1, active - Math.sign(e.deltaY) * 0.05)));
        }}
        className={`group relative h-1 cursor-pointer rounded-full bg-wave-inactive ${barClassName}`}
      >
        <div
          className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-accent"
          style={{ width: `${active * 100}%` }}
        />
        <div
          className="pointer-events-none absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent opacity-0 shadow-glow-sm transition-opacity group-hover:opacity-100"
          style={{ left: `${active * 100}%` }}
        />
      </div>
    </div>
  );
}
