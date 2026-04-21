import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper, { pageItem } from '../components/layout/PageWrapper.jsx';
import TrackRow from '../components/music/TrackRow.jsx';
import { RowSkeleton } from '../components/ui/Skeleton.jsx';
import jamendo from '../lib/jamendoApi.js';
import { usePlayerStore } from '../store/playerStore.js';

export default function PlaylistPage() {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
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
        const [pl, trList] = await Promise.all([
          jamendo.getPlaylist(id),
          jamendo.getPlaylistTracks(id, 100),
        ]);
        if (cancelled) return;
        setPlaylist(pl);
        setTracks(trList.filter(Boolean));
      } catch (e) {
        if (!cancelled) {
          setPlaylist(null);
          setTracks([]);
          setErr(e.message || 'Playlist could not be loaded.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const cover = playlist?.images?.[0]?.url;
  const owner = playlist?.owner?.display_name;
  const total = playlist?.tracks?.total;

  const mosaicUrls = useMemo(() => {
    const out = [];
    for (const t of tracks) {
      const img = t?.album?.image;
      if (img && !out.includes(img)) out.push(img);
      if (out.length >= 4) break;
    }
    const fill = cover || out[0];
    while (out.length < 4) {
      if (fill) out.push(fill);
      else out.push(null);
    }
    return out.slice(0, 4);
  }, [tracks, cover]);

  return (
    <PageWrapper>
      <motion.div variants={pageItem} className="flex flex-col gap-6 md:flex-row md:items-end">
        <div className="h-48 w-48 shrink-0 overflow-hidden rounded-xl bg-elevated shadow-xl ring-1 ring-white/10 md:h-56 md:w-56">
          {tracks.length >= 2 && mosaicUrls.some(Boolean) ? (
            <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-px bg-void/80">
              {mosaicUrls.map((url, i) => (
                <div key={`${url}-${i}`} className="relative min-h-0 bg-deep">
                  {url ? (
                    <img src={url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-elevated font-display text-lg text-ink-faint">
                      {playlist?.name?.[0] || '—'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : cover ? (
            <img src={cover} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center font-display text-4xl text-ink">
              {playlist?.name?.[0] || '—'}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">Playlist</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
            {loading ? '…' : playlist?.name || 'Playlist'}
          </h1>
          {playlist && (
            <p className="mt-2 text-sm text-ink-muted">
              {owner ? `${owner} · ` : ''}
              {typeof total === 'number' ? `${total} tracks` : ''}
            </p>
          )}
        </div>
      </motion.div>

      {err && (
        <motion.p variants={pageItem} className="mt-8 text-sm text-red-400/90">
          {err}
        </motion.p>
      )}

      <motion.div variants={pageItem} className="mt-10">
        {loading ? (
          <div className="flex flex-col gap-1">
            {Array.from({ length: 12 }).map((_, i) => (
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
            <div className="grid grid-cols-[32px_40px_1fr_1fr_80px_28px] items-center gap-4 border-b border-white/5 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              <span>#</span>
              <span />
              <span>Title</span>
              <span>Album</span>
              <span className="text-right">Time</span>
              <span />
            </div>
            {tracks.map((t, idx) => (
              <TrackRow key={`${t.id}-${idx}`} index={idx} track={t} onPlay={() => setQueue(tracks, idx)} />
            ))}
          </div>
        ) : !err ? (
          <p className="text-sm text-ink-muted">This playlist has no playable tracks.</p>
        ) : null}
      </motion.div>
    </PageWrapper>
  );
}
