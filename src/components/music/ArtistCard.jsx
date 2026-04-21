import { motion } from 'framer-motion';

export default function ArtistCard({ image, name, width = 140 }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col items-center gap-3 text-center"
      style={{ width }}
    >
      <div className="relative h-32 w-32 overflow-hidden rounded-full ring-1 ring-white/10 transition-all duration-300 group-hover:ring-accent/60 group-hover:shadow-glow">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-elevated to-surface" />
        )}
      </div>
      <p className="truncate w-full font-heading text-sm font-medium text-ink">{name}</p>
    </motion.div>
  );
}
