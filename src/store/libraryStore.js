import { create } from 'zustand';
import jamendo from '../lib/jamendoApi.js';

export const useLibraryStore = create((set, get) => ({
  profile: null,
  recentlyPlayed: [],
  topArtists: [],
  topTracks: [],
  newReleases: [],
  savedTracks: [],
  userPlaylists: [],
  followedArtists: [],
  savedAlbums: [],

  loading: {
    home: false,
    library: false,
    profile: false,
  },
  error: null,
  homeWarnings: [],
  libraryWarnings: [],

  async loadProfile() {
    if (get().profile) return;
    set({
      profile: {
        display_name: 'Listener',
        product: 'jamendo',
        images: [],
      },
    });
  },

  async loadHome() {
    set((s) => ({
      loading: { ...s.loading, home: true },
      error: null,
      homeWarnings: [],
    }));
    try {
      const [tracks, artists, albums] = await Promise.all([
        jamendo.popularTracks(40),
        jamendo.popularArtists(12),
        jamendo.popularAlbums(18),
      ]);
      set({
        recentlyPlayed: tracks.slice(0, 16),
        topArtists: artists,
        topTracks: tracks.slice(0, 12),
        newReleases: albums,
        homeWarnings: tracks.length
          ? []
          : ['Jamendo did not return tracks. Check VITE_JAMENDO_CLIENT_ID in .env.'],
      });
    } catch (err) {
      set({
        error: err.message,
        homeWarnings: [err.message || 'Home feed failed.'],
        recentlyPlayed: [],
        topArtists: [],
        topTracks: [],
        newReleases: [],
      });
    } finally {
      set((s) => ({ loading: { ...s.loading, home: false } }));
    }
  },

  async loadLibrary() {
    set((s) => ({
      loading: { ...s.loading, library: true },
      error: null,
      libraryWarnings: [],
    }));
    try {
      const settled = await Promise.allSettled([
        jamendo.featuredPlaylists(40),
        jamendo.popularTracks(50),
        jamendo.popularAlbums(48),
        jamendo.popularArtists(40),
      ]);

      const warnings = [];
      const playlists =
        settled[0].status === 'fulfilled' ? settled[0].value : [];
      if (settled[0].status === 'rejected') warnings.push('Playlists could not be loaded.');

      const tracks =
        settled[1].status === 'fulfilled' ? settled[1].value : [];
      if (settled[1].status === 'rejected') warnings.push('Trending tracks could not be loaded.');

      const albums =
        settled[2].status === 'fulfilled' ? settled[2].value : [];
      if (settled[2].status === 'rejected') warnings.push('Albums could not be loaded.');

      const artists =
        settled[3].status === 'fulfilled' ? settled[3].value : [];
      if (settled[3].status === 'rejected') warnings.push('Artists could not be loaded.');

      set({
        userPlaylists: playlists,
        savedTracks: tracks,
        savedAlbums: albums,
        followedArtists: artists,
        libraryWarnings: warnings,
      });
    } catch (err) {
      set({
        userPlaylists: [],
        savedTracks: [],
        savedAlbums: [],
        followedArtists: [],
        libraryWarnings: [err.message || 'Library failed to load.'],
      });
    } finally {
      set((s) => ({ loading: { ...s.loading, library: false } }));
    }
  },
}));
