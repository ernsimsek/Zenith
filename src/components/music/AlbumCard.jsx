import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export default function AlbumCard({
  image,
  title,
  subtitle,
  onPlay,
  width = 180,
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col gap-3"
      style={{ width }}
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-elevated shadow-lg ring-1 ring-white/5 transition-shadow duration-300 ease-zenith group-hover:shadow-[0_0_28px_color-mix(in_srgb,var(--accent-primary)_22%,transparent)]">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 ease-zenith group-hover:scale-[1.06]"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-elevated to-surface" />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-void via-void/90 to-transparent px-3 pb-3 pt-10 transition-transform duration-300 ease-zenith group-hover:translate-y-0">
          <p className="truncate font-heading text-sm font-semibold text-ink drop-shadow-md">{title}</p>
          {subtitle && (
            <p className="mt-0.5 truncate text-xs text-ink-muted drop-shadow">{subtitle}</p>
          )}
        </div>
        {onPlay && (
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onPlay();
            }}
            initial={{ opacity: 0, y: 8 }}
            whileHover={{ scale: 1.06 }}
            animate={{ opacity: 0, y: 8 }}
            whileInView={{}}
            className="absolute bottom-3 right-3 z-[2] grid h-10 w-10 place-items-center rounded-full bg-accent text-void opacity-0 shadow-glow transition-all duration-300 ease-zenith group-hover:translate-y-0 group-hover:opacity-100"
            title="Play"
          >
            <Play size={16} fill="currentColor" />
          </motion.button>
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate font-heading text-sm font-medium text-ink">{title}</p>
        {subtitle && <p className="truncate text-xs text-ink-muted">{subtitle}</p>}
      </div>
    </motion.div>
  );
}
