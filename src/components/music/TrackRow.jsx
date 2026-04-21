import clsx from 'clsx';
import { Heart, Play } from 'lucide-react';
import { usePlayerStore, selectCurrentTrack } from '../../store/playerStore.js';
import { useFavoritesStore } from '../../store/favoritesStore.js';

function formatDuration(sec) {
  if (!sec || !isFinite(sec)) return '—';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function TrackRow({ index, track, onPlay, variant = 'stacked' }) {
  const currentTrack = usePlayerStore(selectCurrentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const liked = useFavoritesStore((s) => s.tracks.some((t) => t.id === track.id));
  const toggleFavorite = useFavoritesStore((s) => s.toggle);

  const isCurrent = currentTrack?.id === track.id;
  const isActive = isCurrent && isPlaying;
  const hasPreview = Boolean(track.previewUrl);
  const split = variant === 'split';

  return (
    <div
      onDoubleClick={() => hasPreview && onPlay?.()}
      className={clsx(
        'group relative grid items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors sm:gap-4',
        split
          ? 'grid-cols-[28px_36px_minmax(0,1.15fr)_minmax(0,0.9fr)_minmax(0,1.05fr)_52px_28px] sm:grid-cols-[32px_40px_minmax(0,1.15fr)_minmax(0,0.95fr)_minmax(0,1.05fr)_56px_28px]'
          : 'grid-cols-[32px_40px_1fr_1fr_80px_28px]',
        isCurrent ? 'bg-elevated/40' : 'hover:bg-elevated/30',
        !hasPreview && 'opacity-60'
      )}
      title={hasPreview ? 'Double-click to play' : 'No preview available for this track'}
    >
      <span
        className={clsx(
          'absolute inset-y-2 left-0 w-[3px] rounded-r bg-accent transition-all duration-300 ease-zenith',
          isCurrent ? 'opacity-100 shadow-[0_0_12px_var(--accent-glow)]' : 'opacity-0 group-hover:opacity-40'
        )}
        aria-hidden
      />

      <div className="relative flex items-center justify-center font-mono text-xs text-ink-faint">
        {isActive ? (
          <PlayingBars />
        ) : (
          <>
            <span className="group-hover:hidden">{index + 1}</span>
            <button
              onClick={onPlay}
              disabled={!hasPreview}
              className="hidden text-accent group-hover:inline-flex disabled:cursor-not-allowed disabled:text-ink-faint"
              title={hasPreview ? 'Play' : 'No preview'}
            >
              <Play size={14} fill="currentColor" />
            </button>
          </>
        )}
      </div>

      {track.album?.image ? (
        <img
          src={track.album.image}
          alt=""
          className="h-10 w-10 rounded object-cover"
        />
      ) : (
        <div className="h-10 w-10 rounded bg-elevated" />
      )}

      {split ? (
        <>
          <div className="min-w-0">
            <p className={clsx('truncate font-medium', isCurrent ? 'text-accent' : 'text-ink')}>
              {track.title}
            </p>
          </div>
          <p className="min-w-0 truncate text-xs text-ink-muted">{track.artistName}</p>
          <p className="min-w-0 truncate text-xs text-ink-muted">{track.album?.name || '—'}</p>
        </>
      ) : (
        <>
          <div className="min-w-0">
            <p className={clsx('truncate font-medium', isCurrent ? 'text-accent' : 'text-ink')}>
              {track.title}
            </p>
            <p className="truncate text-xs text-ink-muted">{track.artistName}</p>
          </div>
          <p className="truncate text-xs text-ink-muted">{track.album?.name || ''}</p>
        </>
      )}

      <p className="text-right font-mono text-xs text-ink-muted tabular-nums">
        {formatDuration(track.duration)}
      </p>

      <button
        onClick={() => toggleFavorite(track)}
        className={clsx(
          'rounded p-1 transition-colors',
          liked ? 'text-accent' : 'text-ink-faint opacity-0 group-hover:opacity-100 hover:text-ink'
        )}
        title={liked ? 'Unlike' : 'Like'}
      >
        <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
}

function PlayingBars() {
  return (
    <div className="flex h-4 items-end gap-[2px]">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="block w-[3px] origin-bottom bg-accent animate-bar-bounce"
          style={{ height: '100%', animationDelay: `${i * 120}ms` }}
        />
      ))}
    </div>
  );
}
