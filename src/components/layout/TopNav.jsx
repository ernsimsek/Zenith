import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell } from 'lucide-react';
import { useLibraryStore } from '../../store/libraryStore.js';

export default function TopNav() {
  const profile = useLibraryStore((s) => s.profile);
  const navigate = useNavigate();
  const location = useLocation();
  const [q, setQ] = useState('');

  useEffect(() => {
    if (location.pathname === '/search') {
      const params = new URLSearchParams(location.search);
      setQ(params.get('q') || '');
    } else {
      setQ('');
    }
  }, [location.pathname, location.search]);

  function onSubmit(e) {
    e.preventDefault();
    const trimmed = q.trim();
    if (!trimmed) {
      navigate('/search');
      return;
    }
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  const onSearchPage = location.pathname === '/search';

  return (
    <header className="relative z-20 flex h-16 flex-shrink-0 items-center justify-between gap-6 border-b border-white/5 bg-deep/40 px-6 backdrop-blur-md">
      {onSearchPage ? (
        <div className="max-w-md flex-1 text-sm text-ink-muted">Search is open in the page below.</div>
      ) : (
        <form onSubmit={onSubmit} className="relative max-w-md flex-1" role="search">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint"
            aria-hidden
          />
          <input
            type="search"
            name="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search tracks, artists, albums…"
            autoComplete="off"
            className="zenith-input w-full rounded-full border border-white/5 py-2 pl-11 pr-4 text-sm shadow-inner focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/25"
            aria-label="Search"
          />
        </form>
      )}

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="rounded-full p-2 text-ink-muted transition-colors hover:bg-elevated/60 hover:text-ink"
          title="Notifications"
        >
          <Bell size={16} />
        </button>
        <div className="flex items-center gap-3">
          {profile?.images?.[0]?.url ? (
            <img
              src={profile.images[0].url}
              alt={profile.display_name || ''}
              className="h-9 w-9 rounded-full border border-white/10 object-cover"
            />
          ) : (
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-accent to-pulse font-heading text-sm font-semibold text-void">
              {profile?.display_name?.[0]?.toUpperCase() || 'Z'}
            </div>
          )}
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm text-ink">{profile?.display_name || 'Listener'}</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">Jamendo</p>
          </div>
        </div>
      </div>
    </header>
  );
}
