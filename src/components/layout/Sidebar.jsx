import { NavLink, Link } from 'react-router-dom';
import { Home, Library, Compass, Search, Settings, Heart } from 'lucide-react';
import clsx from 'clsx';
import { useLibraryStore } from '../../store/libraryStore.js';

const NAV = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/library', label: 'Library', icon: Library },
  { to: '/favorites', label: 'Favorites', icon: Heart },
  { to: '/discover', label: 'Discover', icon: Compass },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const playlists = useLibraryStore((s) => s.userPlaylists);

  return (
    <aside className="relative flex h-full w-60 flex-col border-r border-white/5 bg-deep/60">
      <div className="px-6 pb-4 pt-6">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-accent to-pulse shadow-glow">
            <span className="font-display text-xl font-bold text-void">Z</span>
          </div>
          <div>
            <p className="font-display text-lg leading-none tracking-wide text-ink">ZENITH</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint">
              v1.0
            </p>
          </div>
        </div>
      </div>

      <nav className="mt-4 flex flex-col gap-1 px-3">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              clsx(
                'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-300 ease-zenith',
                isActive
                  ? 'bg-elevated/60 text-ink'
                  : 'text-ink-muted hover:bg-elevated/30 hover:pl-4 hover:text-ink'
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={clsx(
                    'absolute left-0 top-1/2 h-6 -translate-y-1/2 rounded-r bg-accent transition-all duration-300 ease-zenith',
                    isActive
                      ? 'w-[3px] shadow-[0_0_12px_var(--accent-glow)]'
                      : 'w-0 group-hover:w-[3px]'
                  )}
                  aria-hidden
                />
                <Icon size={18} className={isActive ? 'text-accent' : ''} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-6 px-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint">
          Playlists
        </p>
      </div>
      <div className="scroll-thin mt-2 flex-1 overflow-y-auto px-3 pb-4">
        {playlists?.length ? (
          <ul className="flex flex-col gap-0.5">
            {playlists.slice(0, 40).map((p) => (
              <li key={p.id}>
                <Link
                  to={`/playlist/${p.id}`}
                  className="block w-full truncate rounded px-3 py-1.5 text-left text-sm text-ink-muted transition-colors hover:text-ink"
                  title={p.name}
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-3 text-xs text-ink-faint">Your playlists will appear here.</p>
        )}
      </div>

      <p className="mx-3 mb-4 px-3 font-mono text-[9px] leading-relaxed text-ink-faint">
        Music via{' '}
        <a
          href="https://www.jamendo.com"
          target="_blank"
          rel="noreferrer"
          className="text-accent/80 underline decoration-accent/30 underline-offset-2 hover:text-accent"
        >
          Jamendo
        </a>
        · CC catalog
      </p>
    </aside>
  );
}
