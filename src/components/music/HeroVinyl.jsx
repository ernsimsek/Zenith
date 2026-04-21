/**
 * Floating “3D” record — CSS perspective + groove texture (spec home hero).
 */
export default function HeroVinyl() {
  return (
    <div className="flex justify-center py-6 [perspective:960px] lg:justify-end lg:py-0">
      <div
        className="relative h-[min(52vw,14rem)] w-[min(52vw,14rem)] animate-[zenith-float_5s_ease-in-out_infinite] sm:h-60 sm:w-60 md:h-64 md:w-64"
        style={{ transformStyle: 'preserve-3d', transform: 'rotateX(14deg) rotateY(-18deg)' }}
      >
        <div
          className="absolute inset-0 rounded-full shadow-[0_24px_60px_rgba(0,0,0,0.55)] ring-1 ring-white/10"
          style={{
            background:
              'repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.045) 0px, rgba(255,255,255,0.045) 1px, transparent 2px, transparent 4px), radial-gradient(circle at 32% 28%, #1f2433, #05060a)',
          }}
        />
        <div className="absolute inset-[18%] rounded-lg bg-gradient-to-br from-deep via-void to-surface ring-1 ring-black/50 shadow-inner" />
        <div className="absolute left-1/2 top-1/2 z-[1] h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-950 ring-2 ring-white/25" />
        <div
          className="pointer-events-none absolute -inset-[10%] rounded-full opacity-40 blur-2xl"
          style={{
            background: 'conic-gradient(from 120deg, var(--accent-primary), transparent, var(--pulse-primary), transparent)',
          }}
        />
      </div>
    </div>
  );
}
