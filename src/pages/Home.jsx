import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper, { pageItem } from '../components/layout/PageWrapper.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import AlbumCard from '../components/music/AlbumCard.jsx';
import ArtistCard from '../components/music/ArtistCard.jsx';
import WaveformBg from '../components/visualizers/WaveformBg.jsx';
import ParticleField from '../components/visualizers/ParticleField.jsx';
import GlowButton from '../components/ui/GlowButton.jsx';
import HeroVinyl from '../components/music/HeroVinyl.jsx';
import { CardSkeleton } from '../components/ui/Skeleton.jsx';
import { useLibraryStore } from '../store/libraryStore.js';
import { usePlayerStore } from '../store/playerStore.js';
import { useUiStore } from '../store/uiStore.js';
import jamendo from '../lib/jamendoApi.js';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 5) return 'Deep in the night';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Home() {
  const loadHome = useLibraryStore((s) => s.loadHome);
  const loading = useLibraryStore((s) => s.loading.home);
  const profile = useLibraryStore((s) => s.profile);
  const recentlyPlayed = useLibraryStore((s) => s.recentlyPlayed);
  const topArtists = useLibraryStore((s) => s.topArtists);
  const topTracks = useLibraryStore((s) => s.topTracks);
  const newReleases = useLibraryStore((s) => s.newReleases);
  const homeWarnings = useLibraryStore((s) => s.homeWarnings);

  const setQueue = usePlayerStore((s) => s.setQueue);
  const playTrack = usePlayerStore((s) => s.playTrack);
  const showToast = useUiStore((s) => s.showToast);

  useEffect(() => {
    loadHome();
  }, [loadHome]);

  const displayName = profile?.display_name?.split(' ')[0] || 'Listener';

  return (
    <div className="relative">
      <div className="relative min-h-[min(88vh,44rem)] overflow-hidden">
        <WaveformBg />
        <ParticleField className="z-[1]" />
        <PageWrapper className="relative z-10 !py-0">
          <div className="grid min-h-[min(88vh,44rem)] items-center gap-10 py-14 lg:grid-cols-[1fr_min(36%,20rem)] lg:gap-6 lg:py-10">
            <motion.div variants={pageItem} className="flex max-w-2xl flex-col justify-center">
              <p className="font-mono text-xs uppercase tracking-[0.4em] text-accent">
                {greeting()}, {displayName}
              </p>
              <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.05] text-ink sm:text-6xl md:text-7xl">
                Your music.{' '}
                <span className="text-gradient-accent">Elevated.</span>
              </h1>
              <p className="mt-4 max-w-md text-ink-muted">
                A sonic environment. Built for depth, tuned to your pulse.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <GlowButton to="/discover">Enter Zenith</GlowButton>
                <Link
                  to="/library"
                  className="text-sm font-medium text-ink-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
                >
                  Open library
                </Link>
              </div>
            </motion.div>
            <motion.div variants={pageItem} className="hidden lg:block">
              <HeroVinyl />
            </motion.div>
          </div>
        </PageWrapper>
      </div>

      <PageWrapper className="!pt-2">
        {homeWarnings.length > 0 && (
          <motion.div
            variants={pageItem}
            className="mb-6 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/95"
            role="status"
          >
            {homeWarnings.join(' ')}
          </motion.div>
        )}
        <motion.section variants={pageItem} className="mb-12">
          <SectionHeading eyebrow="Jamendo" title="Trending now" />
          <HScroll>
            {loading && !recentlyPlayed.length
              ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
              : recentlyPlayed.length
                ? recentlyPlayed.map((t, idx) => (
                    <AlbumCard
                      key={`${t.id}-${idx}`}
                      image={t.album?.image}
                      title={t.title}
                      subtitle={t.artistName}
                      onPlay={() =>
                        setQueue(recentlyPlayed.slice(idx).concat(recentlyPlayed.slice(0, idx)), 0)
                      }
                    />
                  ))
                : (
                    <EmptyState message="Nothing in the feed yet. Try again in a moment." />
                  )}
          </HScroll>
        </motion.section>

        <motion.section variants={pageItem} className="mb-12">
          <SectionHeading eyebrow="Your frequency" title="Top artists" />
          <HScroll gap={24}>
            {loading && !topArtists.length
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-3" style={{ width: 140 }}>
                    <div className="shimmer h-32 w-32 rounded-full" />
                    <div className="shimmer h-3 w-24 rounded" />
                  </div>
                ))
              : topArtists.length
                ? topArtists.map((a) => (
                    <Link key={a.id} to={`/artist/${a.id}`} className="shrink-0">
                      <ArtistCard image={a.images?.[0]?.url} name={a.name} />
                    </Link>
                  ))
                : <EmptyState message="Artists could not be loaded." />}
          </HScroll>
        </motion.section>

        <motion.section variants={pageItem} className="mb-12">
          <SectionHeading eyebrow="On repeat" title="Your top tracks" />
          <HScroll>
            {loading && !topTracks.length
              ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
              : topTracks.length
                ? topTracks.map((t, idx) => (
                    <AlbumCard
                      key={`${t.id}-${idx}`}
                      image={t.album?.image}
                      title={t.title}
                      subtitle={t.artistName}
                      onPlay={() => setQueue(topTracks, idx)}
                    />
                  ))
                : (
                    <EmptyState message="Tracks could not be loaded." />
                  )}
          </HScroll>
        </motion.section>

        <motion.section variants={pageItem} className="mb-12">
          <SectionHeading eyebrow="Fresh signal" title="Popular albums" />
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {loading && !newReleases.length
              ? Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} width="100%" />)
              : newReleases.length
                ? newReleases.map((album) => (
                    <Link key={album.id} to={`/album/${album.id}`}>
                      <AlbumCard
                        width="100%"
                        image={album.images?.[0]?.url}
                        title={album.name}
                        subtitle={album.artists?.map((a) => a.name).join(', ')}
                        onPlay={async () => {
                          try {
                            const list = await jamendo.getAlbumTracks(album.id);
                            const first = list[0];
                            if (first) playTrack(first);
                            else showToast({ type: 'warn', message: 'No playable track on this album.' });
                          } catch {
                            showToast({ type: 'error', message: 'Lost the signal. Try again.' });
                          }
                        }}
                      />
                    </Link>
                  ))
                : (
                    <div className="col-span-full">
                      <EmptyState message="Albums could not be loaded." />
                    </div>
                  )}
          </div>
        </motion.section>
      </PageWrapper>
    </div>
  );
}

function HScroll({ children, gap = 20 }) {
  return (
    <div
      className="scroll-hide -mx-6 flex overflow-x-auto px-6 pb-2"
      style={{ gap, scrollSnapType: 'x proximity' }}
    >
      {children}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex h-40 flex-1 items-center justify-center rounded-xl border border-dashed border-white/10 px-6 text-center text-sm text-ink-muted">
      {message}
    </div>
  );
}
