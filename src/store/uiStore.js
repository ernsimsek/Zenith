import { create } from 'zustand';

export const useUiStore = create((set) => ({
  sidebarOpen: true,
  detailPanelOpen: false,
  queuePanelOpen: false,
  cinematicOpen: false,
  libraryTab: 'songs', // 'songs' | 'albums' | 'artists' | 'playlists'
  toast: null,

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setDetailPanel: (open) => set({ detailPanelOpen: open }),
  toggleQueuePanel: () => set((s) => ({ queuePanelOpen: !s.queuePanelOpen })),
  setQueuePanelOpen: (queuePanelOpen) => set({ queuePanelOpen }),
  toggleCinematic: () =>
    set((s) => ({
      cinematicOpen: !s.cinematicOpen,
      queuePanelOpen: s.cinematicOpen ? s.queuePanelOpen : false,
    })),
  setCinematicOpen: (cinematicOpen) =>
    set((s) => ({
      cinematicOpen,
      queuePanelOpen: cinematicOpen ? false : s.queuePanelOpen,
    })),
  setLibraryTab: (tab) => set({ libraryTab: tab }),
  showToast: (toast) => {
    set({ toast });
    if (toast) {
      setTimeout(() => set((s) => (s.toast === toast ? { toast: null } : {})), 3000);
    }
  },
}));
