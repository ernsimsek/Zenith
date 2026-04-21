import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export default function PlaylistCard({ playlist, onPlay }) {
  const image = playlist?.images?.[0]?.url;
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col gap-3"
      style={{ width: '100%' }}
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-elevated shadow-lg">
        {image ? (
          <img
            src={image}
            alt={playlist.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-accent/30 via-pulse/30 to-surface">
            <span className="font-display text-2xl text-ink">{playlist?.name?.[0] || 'P'}</span>
          </div>
        )}
        {onPlay && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay();
            }}
            className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-accent text-void opacity-0 shadow-glow transition-all duration-300 ease-zenith group-hover:translate-y-0 group-hover:opacity-100"
          >
            <Play size={16} fill="currentColor" />
          </button>
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate font-heading text-sm font-medium text-ink">{playlist?.name}</p>
        <p className="truncate text-xs text-ink-muted">
          {playlist?.tracks?.total ? `${playlist.tracks.total} tracks` : playlist?.owner?.display_name}
        </p>
      </div>
    </motion.div>
  );
}
