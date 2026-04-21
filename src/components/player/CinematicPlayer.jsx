import { useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import { SkipBack, SkipForward, Shuffle, Repeat, Repeat1, Heart, ListMusic, Minimize2 } from 'lucide-react';
import { usePlayerStore, selectCurrentTrack } from '../../store/playerStore.js';
import { useFavoritesStore } from '../../store/favoritesStore.js';
import { useUiStore } from '../../store/uiStore.js';
import { seekAudio } from '../../hooks/useAudio.js';
import WaveformScrubber from './WaveformScrubber.jsx';
import PlayIcon from './PlayIcon.jsx';
import CircularFrequencyRing from '../visualizers/CircularFrequencyRing.jsx';
import VolumeControl from './VolumeControl.jsx';
import { getFullscreenElement, requestElementFullscreen, exitDocumentFullscreen } from '../../lib/fullscreen.js';

export default function CinematicPlayer() {
  const open = useUiStore((s) => s.cinematicOpen);
  const setCinematicOpen = useUiStore((s) => s.setCinematicOpen);
  const queuePanelOpen = useUiStore((s) => s.queuePanelOpen);
  const toggleQueuePanel = useUiStore((s) => s.toggleQueuePanel);

  const track = usePlayerStore(selectCurrentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const progress = usePlayerStore((s) => s.progress);
  const duration = usePlayerStore((s) => s.duration);
  const volume = usePlayerStore((s) => s.volume);
  const muted = usePlayerStore((s) => s.muted);
  const shuffle = usePlayerStore((s) => s.shuffle);
  const repeat = usePlayerStore((s) => s.repeat);
  const liked = useFavoritesStore((s) =>
    track ? s.tracks.some((t) => t.id === track.id) : false
  );

  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const next = usePlayerStore((s) => s.next);
  const prev = usePlayerStore((s) => s.prev);
  const cycleShuffle = usePlayerStore((s) => s.cycleShuffle);
  const cycleRepeat = usePlayerStore((s) => s.cycleRepeat);
  const setVolume = usePlayerStore((s) => s.setVolume);
  const toggleMute = usePlayerStore((s) => s.toggleMute);
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const seek = usePlayerStore((s) => s.seek);

  const disabled = !track || !track.previewUrl;
  const art = track?.album?.image;

  const rootRef = useRef(null);
  /** Avoid closing cinematic on unrelated `fullscreenchange` when element FS was never entered. */
  const hadElementFullscreenRef = useRef(false);

  useLayoutEffect(() => {
    if (!open) {
      hadElementFullscreenRef.current = false;
      return undefined;
    }
    const el = rootRef.current;
    if (!el) return undefined;
    void requestElementFullscreen(el).catch(() => {});
    return () => {
      const fs = getFullscreenElement();
      if (fs === el) void exitDocumentFullscreen();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    hadElementFullscreenRef.current = false;
    const onFs = () => {
      const fs = getFullscreenElement();
      if (fs && rootRef.current && fs === rootRef.current) {
        hadElementFullscreenRef.current = true;
        return;
      }
      if (
        fs == null &&
        hadElementFullscreenRef.current &&
        useUiStore.getState().cinematicOpen
      ) {
        hadElementFullscreenRef.current = false;
        setCinematicOpen(false);
      }
    };
    document.addEventListener('fullscreenchange', onFs);
    document.addEventListener('webkitfullscreenchange', onFs);
    return () => {
      document.removeEventListener('fullscreenchange', onFs);
      document.removeEventListener('webkitfullscreenchange', onFs);
    };
  }, [open, setCinematicOpen]);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add('overflow-hidden');
    return () => document.body.classList.remove('overflow-hidden');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (useUiStore.getState().queuePanelOpen) {
        useUiStore.getState().setQueuePanelOpen(false);
        return;
      }
      void exitDocumentFullscreen();
      setCinematicOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setCinematicOpen]);

  const handleSeek = (t) => {
    seek(t);
    seekAudio(t);
  };

  const node = (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={rootRef}
          key="cinematic"
          role="dialog"
          aria-modal="true"
          aria-label="Cinematic player"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col bg-void text-ink"
        >
          {/* Ambient background */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {art ? (
              <>
                <img
                  src={art}
                  alt=""
                  className="absolute inset-0 h-full w-full scale-110 object-cover opacity-45 blur-3xl saturate-150"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-void/40 via-void/80 to-void" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--bg-void)_78%)]" />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-deep to-void" />
            )}
          </div>

          {/* Top bar */}
          <header className="relative z-10 flex items-center justify-between px-4 py-4 md:px-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-ink-faint">Now playing</p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={toggleQueuePanel}
                className={clsx(
                  'rounded-lg p-2.5 transition-colors',
                  queuePanelOpen ? 'text-accent' : 'text-ink-muted hover:bg-white/5 hover:text-ink'
                )}
                title="Queue"
              >
                <ListMusic size={20} />
              </button>
              <button
                type="button"
                onClick={() => {
                  void exitDocumentFullscreen();
                  setCinematicOpen(false);
                }}
                className="rounded-lg p-2.5 text-ink-muted transition-colors hover:bg-white/5 hover:text-ink"
                title="Exit cinematic mode"
              >
                <Minimize2 size={20} />
              </button>
            </div>
          </header>

          {/* Main */}
          <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center gap-8 px-6 pb-10 pt-4">
            {!track ? (
              <p className="text-center text-ink-muted">Start playback to enter the sonic environment.</p>
            ) : (
              <>
                <div className="relative aspect-square w-[min(88vw,22rem)] shrink-0 md:w-[min(72vw,24rem)]">
                  <CircularFrequencyRing active={isPlaying} className="absolute inset-0 z-0 opacity-95" />
                  <motion.div
                    className="absolute inset-[11%] z-[1] flex items-center justify-center"
                    animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                    transition={
                      isPlaying
                        ? { duration: 28, repeat: Infinity, ease: 'linear' }
                        : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
                    }
                  >
                    <div className="relative aspect-square w-full">
                      <div
                        className="absolute inset-0 rounded-full shadow-2xl ring-1 ring-white/10"
                        style={{
                          background:
                            'repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 2px, transparent 4px), radial-gradient(circle at 30% 25%, #1a1f2e, #050508)',
                        }}
                      />
                      <div className="absolute inset-[21%] z-[1] overflow-hidden rounded-lg shadow-xl ring-1 ring-black/40">
                        {art ? (
                          <motion.img
                            key={art}
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            src={art}
                            alt={track.album?.name || track.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-elevated to-surface" />
                        )}
                      </div>
                      <div className="absolute left-1/2 top-1/2 z-[2] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-900 ring-2 ring-white/20" />
                    </div>
                  </motion.div>
                </div>

                <div className="w-full max-w-lg text-center">
                  <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                    {track.title}
                  </h1>
                  <p className="mt-2 text-base text-ink-muted md:text-lg">{track.artistName}</p>
                  {track.album?.id && (
                    <Link
                      to={`/album/${track.album.id}`}
                      onClick={() => {
                        void exitDocumentFullscreen();
                        setCinematicOpen(false);
                      }}
                      className="mt-3 inline-block font-mono text-[10px] uppercase tracking-[0.25em] text-accent/90 hover:text-accent"
                    >
                      View album
                    </Link>
                  )}
                </div>

                <div className="flex w-full max-w-2xl flex-col items-stretch gap-6">
                  <WaveformScrubber
                    progress={progress}
                    duration={duration}
                    onSeek={handleSeek}
                    disabled={disabled}
                  />
                  {/* 1fr | play | 1fr → play center = scrubber center; wings mirror with same gap */}
                  <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-y-5">
                    <div className="flex min-h-[3.5rem] items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={cycleShuffle}
                        className={clsx(
                          'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors',
                          shuffle === 'on' ? 'text-accent' : 'text-ink-muted hover:text-ink'
                        )}
                        title="Shuffle"
                      >
                        <Shuffle size={20} />
                      </button>
                      <button
                        type="button"
                        onClick={prev}
                        disabled={!track}
                        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-colors hover:text-ink disabled:opacity-40"
                        title="Previous"
                      >
                        <SkipBack size={20} />
                      </button>
                    </div>
                    <div className="flex shrink-0 justify-center px-1">
                      <motion.button
                        type="button"
                        onClick={togglePlay}
                        disabled={disabled}
                        whileTap={{ scale: 0.94 }}
                        className={clsx(
                          'inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition-all',
                          disabled
                            ? 'cursor-not-allowed bg-elevated text-ink-faint'
                            : 'bg-accent text-void shadow-glow hover:scale-[1.04]'
                        )}
                        title={isPlaying ? 'Pause' : 'Play'}
                      >
                        <PlayIcon playing={isPlaying} size={22} />
                      </motion.button>
                    </div>
                    <div className="flex min-h-[3.5rem] items-center justify-start gap-3">
                      <button
                        type="button"
                        onClick={next}
                        disabled={!track}
                        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-colors hover:text-ink disabled:opacity-40"
                        title="Next"
                      >
                        <SkipForward size={20} />
                      </button>
                      <button
                        type="button"
                        onClick={cycleRepeat}
                        className={clsx(
                          'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors',
                          repeat !== 'off' ? 'text-accent' : 'text-ink-muted hover:text-ink'
                        )}
                        title={`Repeat: ${repeat}`}
                      >
                        {repeat === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => track && toggleFavorite(track)}
                        disabled={!track}
                        className={clsx(
                          'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors disabled:opacity-40',
                          liked ? 'text-accent' : 'text-ink-muted hover:text-ink'
                        )}
                        title={liked ? 'Unlike' : 'Like'}
                      >
                        <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                    <div className="col-start-2 row-start-2 justify-self-center">
                      <VolumeControl
                        volume={volume}
                        muted={muted}
                        onChange={setVolume}
                        onToggleMute={toggleMute}
                        barClassName="w-40 md:w-48"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(node, document.body);
}
