import { useMemo } from 'react';

/**
 * Slow-drifting ambient dots — spec “particle field” (lightweight CSS).
 */
export default function ParticleField({ className = '', density = 52 }) {
  const dots = useMemo(
    () =>
      Array.from({ length: density }, (_, i) => ({
        id: i,
        left: ((i * 47) % 100) + (i % 7) * 0.35,
        top: ((i * 31) % 100) + (i % 5) * 0.4,
        delay: (i % 14) * 0.35,
        duration: 9 + (i % 6) * 1.4,
        size: 1.2 + (i % 4) * 0.45,
        opacity: 0.12 + (i % 6) * 0.045,
        hue: i % 2 === 0 ? 'accent' : 'pulse',
      })),
    [density]
  );

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {dots.map((d) => (
        <span
          key={d.id}
          className={
            d.hue === 'accent'
              ? 'absolute rounded-full bg-[var(--accent-primary)]'
              : 'absolute rounded-full bg-[var(--pulse-primary)]'
          }
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            opacity: d.opacity,
            filter: 'blur(0.6px)',
            animation: `zenith-particle-drift ${d.duration}s ease-in-out infinite`,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
