import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Search, Bell, Menu } from 'lucide-react';
import { useLibraryStore } from '../../store/libraryStore.js';
import { useUiStore } from '../../store/uiStore.js';

export default function TopNav() {
  const profile = useLibraryStore((s) => s.profile);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
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
    <header className="relative z-20 flex h-14 flex-shrink-0 items-center justify-between gap-3 border-b border-white/5 bg-deep/40 px-4 backdrop-blur-md sm:h-16 sm:gap-4 sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-elevated/60 hover:text-ink lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        {onSearchPage ? (
          <p className="min-w-0 truncate text-sm text-ink-muted">Search</p>
        ) : (
          <>
            <form onSubmit={onSubmit} className="relative hidden min-w-0 max-w-md flex-1 md:block" role="search">
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
            <Link
              to="/search"
              className="rounded-full p-2 text-ink-muted transition-colors hover:bg-elevated/60 hover:text-ink md:hidden"
              aria-label="Search"
            >
              <Search size={18} />
            </Link>
          </>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <button
          type="button"
          className="hidden rounded-full p-2 text-ink-muted transition-colors hover:bg-elevated/60 hover:text-ink sm:block"
          title="Notifications"
        >
          <Bell size={16} />
        </button>
        <div className="flex items-center gap-2 sm:gap-3">
          {profile?.images?.[0]?.url ? (
            <img
              src={profile.images[0].url}
              alt={profile.display_name || ''}
              className="h-8 w-8 rounded-full border border-white/10 object-cover sm:h-9 sm:w-9"
            />
          ) : (
            <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-accent to-pulse font-heading text-sm font-semibold text-void sm:h-9 sm:w-9">
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
