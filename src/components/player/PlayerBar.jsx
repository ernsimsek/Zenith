import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import {
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  Maximize2,
  Minimize2,
  ListMusic,
} from 'lucide-react';
import { usePlayerStore, selectCurrentTrack } from '../../store/playerStore.js';
import { useFavoritesStore } from '../../store/favoritesStore.js';
import { useUiStore } from '../../store/uiStore.js';
import { seekAudio } from '../../hooks/useAudio.js';
import WaveformScrubber from './WaveformScrubber.jsx';
import PlayIcon from './PlayIcon.jsx';
import VolumeControl from './VolumeControl.jsx';
import FrequencyBars from '../visualizers/FrequencyBars.jsx';

export default function PlayerBar() {
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

  const queuePanelOpen = useUiStore((s) => s.queuePanelOpen);
  const toggleQueuePanel = useUiStore((s) => s.toggleQueuePanel);
  const cinematicOpen = useUiStore((s) => s.cinematicOpen);
  const toggleCinematic = useUiStore((s) => s.toggleCinematic);

  const disabled = !track || !track.previewUrl;

  const handleSeek = (t) => {
    seek(t);
    seekAudio(t);
  };

  const handleLike = () => {
    if (track) toggleFavorite(track);
  };

  return (
    <footer className="relative z-30 flex h-22 flex-shrink-0 items-center gap-4 border-t border-white/5 bg-deep/90 px-4 py-3 backdrop-blur-md" style={{ height: 88 }}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      {/* Left: now playing */}
      <div className="flex min-w-0 flex-1 items-center gap-3 md:w-80 md:flex-none">
        {track?.album?.image ? (
          <motion.img
            key={track.album.image}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            src={track.album.image}
            alt={track.album.name}
            className="h-14 w-14 rounded-md object-cover shadow-lg"
          />
        ) : (
          <div className="h-14 w-14 rounded-md bg-gradient-to-br from-elevated to-surface" />
        )}
        <div className="min-w-0 flex-1">
          <MarqueeText text={track?.title || '—'} className="text-sm font-medium text-ink" />
          <p className="truncate text-xs text-ink-muted">{track?.artistName || 'Nothing playing'}</p>
        </div>
        <LikeButton liked={liked} onClick={handleLike} disabled={!track} />
      </div>

      {/* Middle: transport */}
      <div className="flex flex-[2] flex-col items-center gap-2">
        <div className="flex items-center gap-5">
          <button
            onClick={cycleShuffle}
            className={clsx(
              'transition-colors',
              shuffle === 'on' ? 'text-accent' : 'text-ink-muted hover:text-ink'
            )}
            title="Shuffle"
          >
            <Shuffle size={16} />
          </button>
          <button
            onClick={prev}
            disabled={!track}
            className="text-ink-muted transition-colors hover:text-ink disabled:opacity-40"
            title="Previous"
          >
            <SkipBack size={18} />
          </button>
          <motion.button
            onClick={togglePlay}
            disabled={disabled}
            whileTap={{ scale: 0.94 }}
            className={clsx(
              'grid h-11 w-11 place-items-center rounded-full transition-all',
              disabled
                ? 'cursor-not-allowed bg-elevated text-ink-faint'
                : 'bg-accent text-void shadow-glow hover:scale-[1.04] hover:shadow-[0_0_30px_var(--accent-glow)]'
            )}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            <PlayIcon playing={isPlaying} size={18} />
          </motion.button>
          <button
            onClick={next}
            disabled={!track}
            className="text-ink-muted transition-colors hover:text-ink disabled:opacity-40"
            title="Next"
          >
            <SkipForward size={18} />
          </button>
          <button
            onClick={cycleRepeat}
            className={clsx(
              'transition-colors',
              repeat !== 'off' ? 'text-accent' : 'text-ink-muted hover:text-ink'
            )}
            title={`Repeat: ${repeat}`}
          >
            {repeat === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}
          </button>
        </div>
        <WaveformScrubber
          progress={progress}
          duration={duration}
          onSeek={handleSeek}
          disabled={disabled}
        />
      </div>

      {/* Right: extras */}
      <div className="hidden min-w-0 flex-1 items-center justify-end gap-2 md:flex md:w-80 md:flex-none">
        <FrequencyBars active={isPlaying} className="h-8 w-24 opacity-80" />
        <button
          type="button"
          onClick={toggleQueuePanel}
          className={clsx(
            'rounded p-2 transition-colors',
            queuePanelOpen ? 'text-accent' : 'text-ink-muted hover:text-ink'
          )}
          title="Queue"
        >
          <ListMusic size={16} />
        </button>
        <VolumeControl
          volume={volume}
          muted={muted}
          onChange={setVolume}
          onToggleMute={toggleMute}
        />
        <button
          type="button"
          onClick={toggleCinematic}
          disabled={!track}
          className={clsx(
            'rounded p-2 transition-colors disabled:opacity-40',
            cinematicOpen ? 'text-accent' : 'text-ink-muted hover:text-ink'
          )}
          title={cinematicOpen ? 'Exit cinematic mode' : 'Cinematic mode'}
        >
          {cinematicOpen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>
    </footer>
  );
}

function MarqueeText({ text, className = '' }) {
  const wrapperRef = useRef(null);
  const textRef = useRef(null);
  const [overflow, setOverflow] = useState(false);

  useEffect(() => {
    if (!wrapperRef.current || !textRef.current) return;
    setOverflow(textRef.current.scrollWidth > wrapperRef.current.clientWidth + 2);
  }, [text]);

  return (
    <div ref={wrapperRef} className={`scroll-hide overflow-hidden whitespace-nowrap ${className}`}>
      <div
        ref={textRef}
        className={overflow ? 'inline-flex gap-8 animate-marquee' : 'truncate'}
      >
        <span>{text}</span>
        {overflow && <span>{text}</span>}
      </div>
    </div>
  );
}

function LikeButton({ liked, onClick, disabled }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 1.3 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={clsx(
        'relative rounded p-2 transition-colors disabled:opacity-40',
        liked ? 'text-accent' : 'text-ink-muted hover:text-ink'
      )}
      title={liked ? 'Unlike' : 'Like'}
    >
      <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
      <AnimatePresence>
        {liked && (
          <motion.span
            key="burst"
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 2.2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute inset-0 rounded-full bg-accent/20"
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}

