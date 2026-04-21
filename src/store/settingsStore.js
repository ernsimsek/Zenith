import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEFAULT_EQ = () => Array(10).fill(0);

export const useSettingsStore = create(
  persist(
    (set) => ({
      theme: 'dark-matter',
      setTheme: (theme) => set({ theme }),

      audioQuality: 'high',
      setAudioQuality: (audioQuality) => set({ audioQuality }),

      crossfadeSeconds: 0,
      setCrossfadeSeconds: (crossfadeSeconds) =>
        set({ crossfadeSeconds: Math.max(0, Math.min(12, Number(crossfadeSeconds) || 0)) }),

      eqBands: DEFAULT_EQ(),
      setEqBand: (index, value) =>
        set((s) => {
          const next = [...s.eqBands];
          const i = Math.max(0, Math.min(9, index));
          next[i] = Math.max(-12, Math.min(12, Number(value) || 0));
          return { eqBands: next };
        }),
      resetEq: () => set({ eqBands: DEFAULT_EQ() }),

      notifyInApp: true,
      notifyEmail: false,
      setNotifyInApp: (notifyInApp) => set({ notifyInApp: Boolean(notifyInApp) }),
      setNotifyEmail: (notifyEmail) => set({ notifyEmail: Boolean(notifyEmail) }),
    }),
    { name: 'zenith-settings-v1' }
  )
);
