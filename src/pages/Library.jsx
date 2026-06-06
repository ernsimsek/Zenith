import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import PageWrapper, { pageItem } from '../components/layout/PageWrapper.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import TrackRow from '../components/music/TrackRow.jsx';
import AlbumCard from '../components/music/AlbumCard.jsx';
import ArtistCard from '../components/music/ArtistCard.jsx';
import PlaylistCard from '../components/music/PlaylistCard.jsx';
import { RowSkeleton, CardSkeleton } from '../components/ui/Skeleton.jsx';
import { useLibraryStore } from '../store/libraryStore.js';
import { useUiStore } from '../store/uiStore.js';
import { usePlayerStore } from '../store/playerStore.js';

const TABS = [
  { id: 'songs', label: 'Songs' },
  { id: 'albums', label: 'Albums' },
  { id: 'artists', label: 'Artists' },
  { id: 'playlists', label: 'Playlists' },
];

export default function LibraryPage() {
  const activeTab = useUiStore((s) => s.libraryTab);
  const setLibraryTab = useUiStore((s) => s.setLibraryTab);

  const loading = useLibraryStore((s) => s.loading.library);
  const loadLibrary = useLibraryStore((s) => s.loadLibrary);
  const savedTracks = useLibraryStore((s) => s.savedTracks);
  const savedAlbums = useLibraryStore((s) => s.savedAlbums);
  const followedArtists = useLibraryStore((s) => s.followedArtists);
  const userPlaylists = useLibraryStore((s) => s.userPlaylists);
  const libraryWarnings = useLibraryStore((s) => s.libraryWarnings);

  const setQueue = usePlayerStore((s) => s.setQueue);

  useEffect(() => {
    loadLibrary();
  }, [loadLibrary]);

  return (
    <PageWrapper>
      {libraryWarnings.length > 0 && (
        <motion.div
          variants={pageItem}
          className="mb-6 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/95"
          role="status"
        >
          {libraryWarnings.join(' ')}
        </motion.div>
      )}
      <motion.div variants={pageItem}>
        <SectionHeading eyebrow="Your collection" title="Library" />
      </motion.div>

      <motion.div
        variants={pageItem}
        className="scroll-hide -mx-4 mb-8 flex items-center gap-1 overflow-x-auto border-b border-white/5 px-4 sm:-mx-0 sm:gap-2 sm:px-0"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setLibraryTab(tab.id)}
            className={clsx(
              'relative shrink-0 px-3 py-3 font-heading text-sm font-medium transition-colors sm:px-4',
              activeTab === tab.id ? 'text-ink' : 'text-ink-muted hover:text-ink'
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.span
                layoutId="tab-underline"
                className="absolute inset-x-3 -bottom-px h-[2px] rounded-full bg-accent shadow-[0_0_12px_var(--accent-glow)]"
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
          </button>
        ))}
      </motion.div>

      <motion.div variants={pageItem}>
        {activeTab === 'songs' && (
          <SongsTab
            loading={loading}
            tracks={savedTracks}
            onPlay={(idx) => setQueue(savedTracks, idx)}
          />
        )}
        {activeTab === 'albums' && <AlbumsTab loading={loading} albums={savedAlbums} />}
        {activeTab === 'artists' && <ArtistsTab loading={loading} artists={followedArtists} />}
        {activeTab === 'playlists' && <PlaylistsTab loading={loading} playlists={userPlaylists} />}
      </motion.div>
    </PageWrapper>
  );
}

function SongsTab({ loading, tracks, onPlay }) {
  if (loading && !tracks.length) {
    return (
      <div className="flex flex-col gap-1">
        {Array.from({ length: 10 }).map((_, i) => <RowSkeleton key={i} />)}
      </div>
    );
  }
  if (!tracks.length) {
    return (
      <EmptyState message="Nothing here yet. The void awaits your sound." />
    );
  }
  return (
    <div className="flex flex-col gap-0.5">
      <div className="hidden items-center gap-4 border-b border-white/5 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint sm:grid sm:grid-cols-[28px_36px_minmax(0,1.15fr)_minmax(0,0.9fr)_52px_28px] md:grid-cols-[32px_40px_minmax(0,1.15fr)_minmax(0,0.95fr)_minmax(0,1.05fr)_56px_28px]">
        <span>#</span>
        <span />
        <span>Title</span>
        <span>Artist</span>
        <span>Album</span>
        <span className="text-right">Time</span>
        <span />
      </div>
      {tracks.map((t, idx) => (
        <TrackRow
          key={`${t.id}-${idx}`}
          variant="split"
          index={idx}
          track={t}
          onPlay={() => onPlay(idx)}
        />
      ))}
    </div>
  );
}

function AlbumsTab({ loading, albums }) {
  if (loading && !albums.length) {
    return (
      <div className="columns-2 gap-x-5 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="mb-5 break-inside-avoid">
            <CardSkeleton width="100%" />
          </div>
        ))}
      </div>
    );
  }
  if (!albums.length) return <EmptyState message="No saved albums yet." />;
  return (
    <div className="columns-2 gap-x-5 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6">
      {albums.map((a) => (
        <div key={a.id} className="mb-5 break-inside-avoid">
          <Link to={`/album/${a.id}`}>
            <AlbumCard
              width="100%"
              image={a.images?.[0]?.url}
              title={a.name}
              subtitle={a.artists?.map((x) => x.name).join(', ')}
            />
          </Link>
        </div>
      ))}
    </div>
  );
}

function ArtistsTab({ loading, artists }) {
  if (loading && !artists.length) {
    return (
      <div className="flex flex-wrap gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-3" style={{ width: 140 }}>
            <div className="shimmer h-32 w-32 rounded-full" />
            <div className="shimmer h-3 w-24 rounded" />
          </div>
        ))}
      </div>
    );
  }
  if (!artists.length) return <EmptyState message="You aren't following any artists yet." />;
  return (
    <div className="flex flex-wrap gap-6">
      {artists.map((a) => (
        <Link key={a.id} to={`/artist/${a.id}`} className="shrink-0">
          <ArtistCard image={a.images?.[0]?.url} name={a.name} />
        </Link>
      ))}
    </div>
  );
}

function PlaylistsTab({ loading, playlists }) {
  if (loading && !playlists.length) {
    return (
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} width="100%" />)}
      </div>
    );
  }
  if (!playlists.length) return <EmptyState message="No playlists yet." />;
  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {playlists.map((p) => (
        <Link key={p.id} to={`/playlist/${p.id}`}>
          <PlaylistCard playlist={p} />
        </Link>
      ))}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="grid place-items-center rounded-xl border border-dashed border-white/10 py-20 text-center text-sm text-ink-muted">
      {message}
    </div>
  );
}
