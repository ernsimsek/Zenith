import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper, { pageItem } from '../components/layout/PageWrapper.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import TrackRow from '../components/music/TrackRow.jsx';
import AlbumCard from '../components/music/AlbumCard.jsx';
import ArtistCard from '../components/music/ArtistCard.jsx';
import PlaylistCard from '../components/music/PlaylistCard.jsx';
import jamendo from '../lib/jamendoApi.js';
import { usePlayerStore } from '../store/playerStore.js';
import { Disc3, Mic2, Library, Compass } from 'lucide-react';

const RECENT_KEY = 'zenith.recentSearches';
const MAX_RECENT = 8;

function readRecent() {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function pushRecent(q) {
  const prev = readRecent().filter((x) => x.toLowerCase() !== q.toLowerCase());
  prev.unshift(q);
  localStorage.setItem(RECENT_KEY, JSON.stringify(prev.slice(0, MAX_RECENT)));
}

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const qParam = (params.get('q') || '').trim();

  const [inputVal, setInputVal] = useState(() => params.get('q') || '');
  const debounceRef = useRef(null);

  useEffect(() => {
    setInputVal(params.get('q') || '');
  }, [params]);

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    []
  );

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [results, setResults] = useState(null);

  const setQueue = usePlayerStore((s) => s.setQueue);

  function scheduleUrlUpdate(raw) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const t = raw.trim();
      if (!t) setParams({}, { replace: true });
      else setParams({ q: raw }, { replace: true });
    }, 400);
  }

  const runSearch = useCallback(async (q) => {
    if (!q) {
      setResults(null);
      setErr(null);
      return;
    }
    setLoading(true);
    setErr(null);
    try {
      const data = await jamendo.searchAll(q, 12);
      setResults({
        tracks: data.tracks,
        artists: data.artists,
        albums: data.albums,
        playlists: data.playlists,
      });
      pushRecent(q);
    } catch (e) {
      setResults(null);
      setErr(e.message || 'Search failed.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      runSearch(qParam);
    }, qParam ? 380 : 0);
    return () => clearTimeout(t);
  }, [qParam, runSearch]);

  const recent = useMemo(() => readRecent(), [qParam, results]);

  return (
    <PageWrapper>
      <motion.div variants={pageItem}>
        <SectionHeading eyebrow="Find anything" title="Search" />
      </motion.div>

      {!qParam && (
        <motion.div variants={pageItem} className="mb-10">
          <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight text-ink md:text-5xl">
            What do you want to hear?
          </h2>
          <p className="mt-3 max-w-xl text-sm text-ink-muted">
            Search the Jamendo catalog, or jump in through a doorway below.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <BrowseCard
              to="/library"
              icon={Library}
              title="Your library"
              subtitle="Saved songs, albums, and playlists"
            />
            <BrowseCard
              to="/discover"
              icon={Compass}
              title="Discover"
              subtitle="Mood hexes and editorial picks"
            />
            <BrowseCard
              to="/search?q=electronic"
              icon={Disc3}
              title="Electronic"
              subtitle="Start with a pulse-forward query"
            />
            <BrowseCard
              to="/search?q=acoustic"
              icon={Mic2}
              title="Acoustic"
              subtitle="Warm strings and room tone"
            />
          </div>
        </motion.div>
      )}

      <motion.div variants={pageItem} className="mb-10 max-w-xl">
        <label className="sr-only" htmlFor="zenith-search">
          Search query
        </label>
        <input
          id="zenith-search"
          type="search"
          value={inputVal}
          placeholder="What do you want to hear?"
          autoComplete="off"
          className="zenith-input w-full rounded-xl border border-white/10 px-4 py-3 text-sm shadow-inner focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/25"
          onChange={(e) => {
            const raw = e.target.value;
            setInputVal(raw);
            scheduleUrlUpdate(raw);
          }}
        />
      </motion.div>

      {!qParam && (
        <motion.section variants={pageItem} className="mb-12">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
            Recent
          </p>
          {recent.length ? (
            <div className="flex flex-wrap gap-2">
              {recent.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setInputVal(r);
                    setParams({ q: r });
                  }}
                  className="rounded-full border border-white/10 bg-elevated/40 px-4 py-1.5 text-sm text-ink-muted transition-colors hover:border-accent/30 hover:text-ink"
                >
                  {r}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-muted">Your recent searches will show up here.</p>
          )}
        </motion.section>
      )}

      {err && (
        <motion.p variants={pageItem} className="mb-6 text-sm text-red-400/90">
          {err}
        </motion.p>
      )}

      {loading && qParam && (
        <motion.p variants={pageItem} className="text-sm text-ink-muted">
          Tuning the signal…
        </motion.p>
      )}

      {results && qParam && !loading && (
        <>
          <motion.section variants={pageItem} className="mb-12">
            <h3 className="mb-4 font-heading text-lg text-ink">Songs</h3>
            {results.tracks.length ? (
              <div className="flex flex-col gap-0.5">
                {results.tracks.map((t, idx) => (
                  <TrackRow
                    key={t.id}
                    index={idx}
                    track={t}
                    onPlay={() => setQueue(results.tracks, idx)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink-muted">No tracks found.</p>
            )}
          </motion.section>

          <motion.section variants={pageItem} className="mb-12">
            <h3 className="mb-4 font-heading text-lg text-ink">Artists</h3>
            {results.artists.length ? (
              <div className="scroll-hide -mx-4 flex gap-6 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6">
                {results.artists.map((a) => (
                  <Link key={a.id} to={`/artist/${a.id}`} className="shrink-0">
                    <ArtistCard image={a.images?.[0]?.url} name={a.name} />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink-muted">No artists found.</p>
            )}
          </motion.section>

          <motion.section variants={pageItem} className="mb-12">
            <h3 className="mb-4 font-heading text-lg text-ink">Albums</h3>
            {results.albums.length ? (
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {results.albums.map((al) => (
                  <Link key={al.id} to={`/album/${al.id}`}>
                    <AlbumCard
                      width="100%"
                      image={al.images?.[0]?.url}
                      title={al.name}
                      subtitle={al.artists?.map((x) => x.name).join(', ')}
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink-muted">No albums found.</p>
            )}
          </motion.section>

          <motion.section variants={pageItem} className="mb-12">
            <h3 className="mb-4 font-heading text-lg text-ink">Playlists</h3>
            {results.playlists.length ? (
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {results.playlists.map((p) => (
                  <Link key={p.id} to={`/playlist/${p.id}`}>
                    <PlaylistCard playlist={p} />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink-muted">No playlists found.</p>
            )}
          </motion.section>
        </>
      )}
    </PageWrapper>
  );
}

function BrowseCard({ to, icon: Icon, title, subtitle }) {
  return (
    <Link
      to={to}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-surface/50 p-5 shadow-inner transition-all duration-300 ease-zenith hover:border-accent/35 hover:bg-elevated/40 hover:shadow-[0_0_28px_color-mix(in_srgb,var(--accent-primary)_18%,transparent)]"
    >
      <div className="mb-4 inline-flex rounded-lg bg-accent/10 p-2 text-accent transition-colors group-hover:bg-accent/15">
        <Icon size={22} strokeWidth={1.75} />
      </div>
      <p className="font-heading text-base font-semibold text-ink">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-ink-muted">{subtitle}</p>
    </Link>
  );
}
