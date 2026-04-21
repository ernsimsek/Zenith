import { create } from 'zustand';
import { persist } from 'zustand/middleware';

function cloneTrack(track) {
  if (!track) return null;
  return {
    ...track,
    album: track.album ? { ...track.album } : null,
    artists: Array.isArray(track.artists) ? track.artists.map((a) => ({ ...a })) : track.artists,
  };
}

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      tracks: [],

      isFavorite(id) {
        return get().tracks.some((t) => t.id === id);
      },

      toggle(track) {
        if (!track?.id) return;
        const list = get().tracks;
        const exists = list.some((t) => t.id === track.id);
        if (exists) {
          set({ tracks: list.filter((t) => t.id !== track.id) });
        } else {
          set({ tracks: [...list, cloneTrack(track)] });
        }
      },
    }),
    { name: 'zenith-favorites-v1' }
  )
);
