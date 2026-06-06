import { motion } from 'framer-motion';
import PageWrapper, { pageItem } from '../components/layout/PageWrapper.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import TrackRow from '../components/music/TrackRow.jsx';
import { useFavoritesStore } from '../store/favoritesStore.js';
import { usePlayerStore } from '../store/playerStore.js';

export default function FavoritesPage() {
  const tracks = useFavoritesStore((s) => s.tracks);
  const setQueue = usePlayerStore((s) => s.setQueue);

  return (
    <PageWrapper>
      <motion.div variants={pageItem}>
        <SectionHeading eyebrow="Liked tracks" title="Favorites" />
        <p className="mt-2 max-w-xl text-sm text-ink-muted">
          Hearts you tap across Zenith show up here. Stored on this device only.
        </p>
      </motion.div>

      <motion.div variants={pageItem} className="mt-10">
        {!tracks.length ? (
          <p className="rounded-xl border border-white/5 bg-deep/40 px-6 py-12 text-center text-sm text-ink-muted">
            No favorites yet. Tap the heart on a track or in the player to save it.
          </p>
        ) : (
          <div className="flex flex-col gap-0.5">
            <div className="hidden items-center gap-4 border-b border-white/5 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint sm:grid sm:grid-cols-[32px_40px_1fr_1fr_56px_28px]">
              <span>#</span>
              <span />
              <span>Title</span>
              <span>Album</span>
              <span className="text-right">Time</span>
              <span />
            </div>
            {tracks.map((t, idx) => (
              <TrackRow key={t.id} index={idx} track={t} onPlay={() => setQueue(tracks, idx)} />
            ))}
          </div>
        )}
      </motion.div>
    </PageWrapper>
  );
}
