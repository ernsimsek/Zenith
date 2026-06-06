import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper, { pageItem } from '../components/layout/PageWrapper.jsx';
import TrackRow from '../components/music/TrackRow.jsx';
import { RowSkeleton } from '../components/ui/Skeleton.jsx';
import jamendo from '../lib/jamendoApi.js';
import { usePlayerStore } from '../store/playerStore.js';

export default function AlbumPage() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
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
        const [meta, trList] = await Promise.all([jamendo.getAlbum(id), jamendo.getAlbumTracks(id)]);
        if (cancelled) return;
        setAlbum(meta);
        setTracks(trList.filter(Boolean));
      } catch (e) {
        if (!cancelled) {
          setAlbum(null);
          setTracks([]);
          setErr(e.message || 'Album could not be loaded.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const cover = album?.images?.[0]?.url;

  return (
    <PageWrapper>
      <motion.div
        variants={pageItem}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-deep/50 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.35)] ring-1 ring-white/5 sm:p-6 md:p-8"
      >
        {cover ? (
          <>
            <img
              src={cover}
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-3xl saturate-[1.35]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-void/90 via-deep/60 to-void/95" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,color-mix(in_srgb,var(--accent-primary)_18%,transparent),transparent_55%)]" />
          </>
        ) : null}
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end">
          <div className="mx-auto h-40 w-40 shrink-0 overflow-hidden rounded-xl bg-elevated shadow-xl ring-1 ring-white/10 sm:mx-0 sm:h-48 sm:w-48 md:h-56 md:w-56">
            {cover ? (
              <img src={cover} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center font-display text-3xl text-ink">
                {album?.name?.[0] || '—'}
              </div>
            )}
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">Album</p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
              {loading ? '…' : album?.name || 'Album'}
            </h1>
            {album?.artists?.length ? (
              <p className="mt-2 text-sm text-ink-muted">{album.artists.map((a) => a.name).join(', ')}</p>
            ) : null}
          </div>
        </div>
      </motion.div>

      {err && (
        <motion.p variants={pageItem} className="mt-8 text-sm text-red-400/90">
          {err}
        </motion.p>
      )}

      <motion.section variants={pageItem} className="mt-10">
        {loading ? (
          <div className="flex flex-col gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <RowSkeleton key={i} />
            ))}
          </div>
        ) : tracks.length ? (
          <div className="flex flex-col gap-0.5">
            <div className="mb-2">
              <button
                type="button"
                onClick={() => setQueue(tracks, 0)}
                className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-void shadow-glow transition-transform active:scale-[0.97]"
              >
                Play
              </button>
            </div>
            <div className="hidden items-center gap-4 border-b border-white/5 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint sm:grid sm:grid-cols-[32px_40px_1fr_1fr_56px_28px]">
              <span>#</span>
              <span />
              <span>Title</span>
              <span />
              <span className="text-right">Time</span>
              <span />
            </div>
            {tracks.map((t, idx) => (
              <TrackRow key={`${t.id}-${idx}`} index={idx} track={t} onPlay={() => setQueue(tracks, idx)} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-muted">No tracks on this album.</p>
        )}
      </motion.section>
    </PageWrapper>
  );
}
