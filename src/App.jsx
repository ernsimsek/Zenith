import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './components/layout/Sidebar.jsx';
import TopNav from './components/layout/TopNav.jsx';
import PlayerBar from './components/player/PlayerBar.jsx';
import QueuePanel from './components/layout/QueuePanel.jsx';
import CinematicPlayer from './components/player/CinematicPlayer.jsx';
import Toast from './components/ui/Toast.jsx';
import Home from './pages/Home.jsx';
import LibraryPage from './pages/Library.jsx';
import Discover from './pages/Discover.jsx';
import SearchPage from './pages/Search.jsx';
import PlaylistPage from './pages/Playlist.jsx';
import AlbumPage from './pages/Album.jsx';
import ArtistPage from './pages/Artist.jsx';
import SettingsPage from './pages/Settings.jsx';
import FavoritesPage from './pages/Favorites.jsx';
import Setup from './pages/Setup.jsx';
import { isJamendoConfigured } from './lib/jamendoApi.js';
import { useLibraryStore } from './store/libraryStore.js';
import { useSettingsStore } from './store/settingsStore.js';
import { useAudioEngine } from './hooks/useAudio.js';

function AuthedShell({ children }) {
  const loadProfile = useLibraryStore((s) => s.loadProfile);
  const loadLibrary = useLibraryStore((s) => s.loadLibrary);

  useEffect(() => {
    loadProfile();
    loadLibrary();
  }, [loadProfile, loadLibrary]);

  return (
    <div className="flex h-full flex-col bg-void">
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopNav />
          <main className="scroll-thin min-h-0 flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
      <QueuePanel />
      <CinematicPlayer />
      <PlayerBar />
      <Toast />
    </div>
  );
}

function RequireJamendo({ children }) {
  if (!isJamendoConfigured()) {
    return <Navigate to="/setup" replace />;
  }
  return children;
}

export default function App() {
  useAudioEngine();
  const location = useLocation();
  const theme = useSettingsStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      if (theme === 'solar') meta.setAttribute('content', '#e8ecf6');
      else if (theme === 'void') meta.setAttribute('content', '#000000');
      else meta.setAttribute('content', '#020408');
    }
  }, [theme]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/setup" element={<Setup />} />
        <Route
          path="/"
          element={
            <RequireJamendo>
              <AuthedShell>
                <Home />
              </AuthedShell>
            </RequireJamendo>
          }
        />
        <Route
          path="/library"
          element={
            <RequireJamendo>
              <AuthedShell>
                <LibraryPage />
              </AuthedShell>
            </RequireJamendo>
          }
        />
        <Route
          path="/favorites"
          element={
            <RequireJamendo>
              <AuthedShell>
                <FavoritesPage />
              </AuthedShell>
            </RequireJamendo>
          }
        />
        <Route
          path="/discover"
          element={
            <RequireJamendo>
              <AuthedShell>
                <Discover />
              </AuthedShell>
            </RequireJamendo>
          }
        />
        <Route
          path="/search"
          element={
            <RequireJamendo>
              <AuthedShell>
                <SearchPage />
              </AuthedShell>
            </RequireJamendo>
          }
        />
        <Route
          path="/playlist/:id"
          element={
            <RequireJamendo>
              <AuthedShell>
                <PlaylistPage />
              </AuthedShell>
            </RequireJamendo>
          }
        />
        <Route
          path="/album/:id"
          element={
            <RequireJamendo>
              <AuthedShell>
                <AlbumPage />
              </AuthedShell>
            </RequireJamendo>
          }
        />
        <Route
          path="/artist/:id"
          element={
            <RequireJamendo>
              <AuthedShell>
                <ArtistPage />
              </AuthedShell>
            </RequireJamendo>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireJamendo>
              <AuthedShell>
                <SettingsPage />
              </AuthedShell>
            </RequireJamendo>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
