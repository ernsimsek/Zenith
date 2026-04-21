import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import PageWrapper, { pageItem } from '../components/layout/PageWrapper.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import PlaylistCard from '../components/music/PlaylistCard.jsx';
import AlbumCard from '../components/music/AlbumCard.jsx';
import { CardSkeleton } from '../components/ui/Skeleton.jsx';
import jamendo from '../lib/jamendoApi.js';
import { usePlayerStore } from '../store/playerStore.js';

const MOODS = [
  { id: 'focus', label: 'Focus', tag: 'instrumental', from: '#00E5FF44', to: '#7B2FFF55' },
  { id: 'hype', label: 'Hype', tag: 'dance', from: '#7B2FFF66', to: '#00E5FF33' },
  { id: 'chill', label: 'Chill', tag: 'chill', from: '#0099BB55', to: '#020408' },
  { id: 'melancholy', label: 'Melancholy', tag: 'ambient', from: '#1A2840', to: '#7B2FFF44' },
  { id: 'euphoric', label: 'Euphoric', tag: 'electronic', from: '#00E5FF66', to: '#F0F4FF22' },
  { id: 'dark', label: 'Dark', tag: 'metal', from: '#020408', to: '#3A4A5E' },
];

export default function DiscoverPage() {
  const playTrack = usePlayerStore((s) => s.playTrack);

  const [featured, setFeatured] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [featuredErr, setFeaturedErr] = useState(null);

  const [activeMood, setActiveMood] = useState(MOODS[2]);
  const [moodTracks, setMoodTracks] = useState([]);
  const [loadingMood, setLoadingMood] = useState(true);
  const [moodErr, setMoodErr] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingFeatured(true);
      setFeaturedErr(null);
      try {
        const pl = await jamendo.featuredPlaylists(24);
        if (!cancelled) setFeatured(pl);
      } catch (e) {
        if (!cancelled) {
          setFeatured([]);
          setFeaturedErr(e.message || 'Could not load featured playlists.');
        }
      } finally {
        if (!cancelled) setLoadingFeatured(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingMood(true);
      setMoodErr(null);
      setMoodTracks([]);
      try {
        const tr = await jamendo.tracksByTag(activeMood.tag, 24);
        if (!cancelled) setMoodTracks(tr);
      } catch (e) {
        if (!cancelled) {
          setMoodErr(e.message || 'Could not load mood tracks.');
        }
      } finally {
        if (!cancelled) setLoadingMood(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeMood]);

  return (
    <div className="relative">
      <AnimatePresence>
        <motion.div
          key={activeMood.id}
          initial={{ opacity: 0.78 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none fixed inset-0 z-[25]"
          style={{
            background: `radial-gradient(ellipse 90% 55% at 50% 28%, ${activeMood.from}, transparent 62%), linear-gradient(165deg, transparent 20%, ${activeMood.to} 100%)`,
          }}
        />
      </AnimatePresence>

      <PageWrapper className="relative z-[26]">
      <motion.div variants={pageItem}>
        <SectionHeading eyebrow="Tell us your mood" title="Discover" />
        <p className="mt-2 max-w-lg text-sm text-ink-muted">
          Tell us your mood. We&apos;ll handle the rest. Pick a hex to retune the feed — Creative Commons
          catalog via Jamendo tags.
        </p>
      </motion.div>

      <motion.section variants={pageItem} className="my-10">
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-5">
          {MOODS.map((m) => {
            const selected = activeMood.id === m.id;
            return (
              <motion.button
                key={m.id}
                type="button"
                onClick={() => setActiveMood(m)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  background: `linear-gradient(155deg, ${m.from}, ${m.to})`,
                }}
                className={`relative flex h-[7.25rem] w-[8.25rem] flex-col items-center justify-center text-center transition-[box-shadow,border-color] duration-300 ease-zenith sm:h-[7.75rem] sm:w-[8.85rem] ${
                  selected
                    ? 'shadow-[0_0_36px_var(--accent-glow),0_0_4px_rgba(0,229,255,0.35)_inset]'
                    : 'shadow-[0_12px_40px_rgba(0,0,0,0.35)] hover:shadow-[0_0_24px_color-mix(in_srgb,var(--pulse-primary)_25%,transparent)]'
                }`}
              >
                <span className="px-2 font-display text-base font-semibold leading-tight text-ink sm:text-lg">
                  {m.label}
                </span>
                {selected && (
                  <span className="mt-1 font-mono text-[8px] uppercase tracking-[0.2em] text-accent">
                    Active
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      <motion.section variants={pageItem} className="mb-12">
        <SectionHeading eyebrow="Mood feed" title={`${activeMood.label} tracks`} />
        {moodErr && <p className="mb-4 text-sm text-red-400/90">{moodErr}</p>}
        {loadingMood ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <CardSkeleton key={i} width="100%" />
            ))}
          </div>
        ) : moodTracks.length ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {moodTracks.map((t) => (
              <div key={t.id}>
                {t.album?.id ? (
                  <Link to={`/album/${t.album.id}`}>
                    <AlbumCard
                      width="100%"
                      image={t.album?.image}
                      title={t.title}
                      subtitle={t.artistName}
                      onPlay={() => playTrack(t)}
                    />
                  </Link>
                ) : (
                  <AlbumCard
                    width="100%"
                    image={t.album?.image}
                    title={t.title}
                    subtitle={t.artistName}
                    onPlay={() => playTrack(t)}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-muted">No tracks for this tag.</p>
        )}
      </motion.section>

      <motion.section variants={pageItem} className="mb-12">
        <SectionHeading eyebrow="Editorial" title="Featured playlists" />
        {featuredErr && <p className="mb-4 text-sm text-red-400/90">{featuredErr}</p>}
        {loadingFeatured ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <CardSkeleton key={i} width="100%" />
            ))}
          </div>
        ) : featured.length ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {featured.map((p) => (
              <Link key={p.id} to={`/playlist/${p.id}`}>
                <PlaylistCard playlist={p} />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-muted">Featured playlists are unavailable.</p>
        )}
      </motion.section>
    </PageWrapper>
    </div>
  );
}
