import { useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Home, Library, Compass, Search, Settings, Heart, X } from 'lucide-react';
import clsx from 'clsx';
import { useLibraryStore } from '../../store/libraryStore.js';
import { useUiStore } from '../../store/uiStore.js';

const NAV = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/library', label: 'Library', icon: Library },
  { to: '/favorites', label: 'Favorites', icon: Heart },
  { to: '/discover', label: 'Discover', icon: Compass },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/settings', label: 'Settings', icon: Settings },
];

function SidebarContent({ onNavigate }) {
  const playlists = useLibraryStore((s) => s.userPlaylists);

  return (
    <>
      <div className="flex items-center justify-between px-5 pb-4 pt-6 lg:px-6">
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
        <button
          type="button"
          onClick={onNavigate}
          className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-elevated/60 hover:text-ink lg:hidden"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="mt-2 flex flex-col gap-1 px-3">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              clsx(
                'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-300 ease-zenith lg:py-2',
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
                  onClick={onNavigate}
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
    </>
  );
}

export default function Sidebar() {
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUiStore((s) => s.setSidebarOpen);
  const location = useLocation();

  const close = () => setSidebarOpen(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname, setSidebarOpen]);

  useEffect(() => {
    if (!sidebarOpen) return undefined;
    document.body.classList.add('overflow-hidden');
    return () => document.body.classList.remove('overflow-hidden');
  }, [sidebarOpen]);

  return (
    <>
      <aside className="relative hidden h-full w-60 shrink-0 flex-col border-r border-white/5 bg-deep/60 lg:flex">
        <SidebarContent onNavigate={() => {}} />
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[90] bg-void/70 backdrop-blur-sm lg:hidden"
              onClick={close}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed bottom-0 left-0 top-0 z-[95] flex w-[min(85vw,18rem)] flex-col border-r border-white/10 bg-deep/95 shadow-2xl backdrop-blur-xl lg:hidden"
            >
              <SidebarContent onNavigate={close} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
