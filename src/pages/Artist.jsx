import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper, { pageItem } from '../components/layout/PageWrapper.jsx';
import TrackRow from '../components/music/TrackRow.jsx';
import { RowSkeleton } from '../components/ui/Skeleton.jsx';
import jamendo from '../lib/jamendoApi.js';
import { usePlayerStore } from '../store/playerStore.js';

export default function ArtistPage() {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const setQueue = usePlayerStore((s) => s.setQueue);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const [a, topList] = await Promise.all([
          jamendo.getArtist(id),
          jamendo.getArtistTopTracks(id, 16),
        ]);
        if (cancelled) return;
        setArtist(a);
        setTopTracks(topList);
      } catch (e) {
        if (!cancelled) {
          setArtist(null);
          setTopTracks([]);
          setErr(e.message || 'Artist could not be loaded.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const heroImg = artist?.images?.[0]?.url;

  return (
    <PageWrapper>
      <motion.div
        variants={pageItem}
        className="relative mb-10 overflow-hidden ring-1 ring-white/10"
        style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)' }}
      >
        <div className="relative min-h-[14rem] md:min-h-[18rem]">
          {heroImg ? (
            <>
              <img
                src={heroImg}
                alt=""
                className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl opacity-40 saturate-150"
              />
              <img
                src={heroImg}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-[center_22%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-void/88 to-void/25" />
              <div className="absolute inset-0 bg-gradient-to-r from-void/70 via-transparent to-void/50" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-deep via-surface to-void" />
          )}
          <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 md:flex-row md:items-end md:px-8 md:py-12">
            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full border border-white/15 bg-elevated/80 shadow-2xl backdrop-blur-sm md:h-36 md:w-36">
              {heroImg ? (
                <img src={heroImg} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center font-display text-3xl text-ink">
                  {artist?.name?.[0] || '—'}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1 pb-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent">Artist</p>
              <h1 className="mt-2 font-display text-4xl font-semibold leading-[0.95] text-ink drop-shadow-md sm:text-5xl md:text-6xl">
                {loading ? '…' : artist?.name || 'Artist'}
              </h1>
            </div>
          </div>
        </div>
      </motion.div>

      {err && (
        <motion.p variants={pageItem} className="mt-8 text-sm text-red-400/90">
          {err}
        </motion.p>
      )}

      <motion.section variants={pageItem} className="mt-10">
        <h2 className="mb-4 font-heading text-lg text-ink">Popular</h2>
        {loading ? (
          <div className="flex flex-col gap-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <RowSkeleton key={i} />
            ))}
          </div>
        ) : topTracks.length ? (
          <div className="flex flex-col gap-0.5">
            {topTracks.map((t, idx) => (
              <TrackRow key={t.id} index={idx} track={t} onPlay={() => setQueue(topTracks, idx)} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-muted">No top tracks available.</p>
        )}
      </motion.section>
    </PageWrapper>
  );
}
