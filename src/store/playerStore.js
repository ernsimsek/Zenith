import { create } from 'zustand';

const SHUFFLE_STATES = ['off', 'on'];
const REPEAT_STATES = ['off', 'all', 'one'];

function shuffleIndices(length, currentIndex) {
  const indices = Array.from({ length }, (_, i) => i).filter((i) => i !== currentIndex);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return [currentIndex, ...indices];
}

export const usePlayerStore = create((set, get) => ({
  queue: [],
  queueOrder: [],
  currentIndex: -1,
  isPlaying: false,
  progress: 0,
  duration: 0,
  volume: 0.8,
  muted: false,
  shuffle: 'off',
  repeat: 'off',

  get currentTrack() {
    const { queue, queueOrder, currentIndex } = get();
    if (currentIndex < 0) return null;
    const idx = queueOrder[currentIndex] ?? currentIndex;
    return queue[idx] || null;
  },

  setQueue(tracks, startIndex = 0) {
    const order = Array.from({ length: tracks.length }, (_, i) => i);
    set({
      queue: tracks,
      queueOrder: get().shuffle === 'on' ? shuffleIndices(tracks.length, startIndex) : order,
      currentIndex: tracks.length ? Math.max(0, Math.min(startIndex, tracks.length - 1)) : -1,
      progress: 0,
      isPlaying: tracks.length > 0,
    });
  },

  playTrack(track) {
    get().setQueue([track], 0);
  },

  togglePlay() {
    set((s) => ({ isPlaying: !s.isPlaying }));
  },

  setPlaying(isPlaying) {
    set({ isPlaying });
  },

  setProgress(progress) {
    set({ progress });
  },

  setDuration(duration) {
    set({ duration });
  },

  seek(progress) {
    set({ progress });
  },

  next() {
    const { queueOrder, currentIndex, repeat } = get();
    if (!queueOrder.length) return;
    if (repeat === 'one') {
      set({ progress: 0, isPlaying: true });
      return;
    }
    const nextIndex = currentIndex + 1;
    if (nextIndex >= queueOrder.length) {
      if (repeat === 'all') {
        set({ currentIndex: 0, progress: 0, isPlaying: true });
      } else {
        set({ isPlaying: false, progress: 0 });
      }
      return;
    }
    set({ currentIndex: nextIndex, progress: 0, isPlaying: true });
  },

  prev() {
    const { currentIndex, progress } = get();
    if (progress > 3) {
      set({ progress: 0 });
      return;
    }
    const prevIndex = Math.max(0, currentIndex - 1);
    set({ currentIndex: prevIndex, progress: 0, isPlaying: true });
  },

  setVolume(volume) {
    set({ volume: Math.max(0, Math.min(1, volume)), muted: false });
  },

  toggleMute() {
    set((s) => ({ muted: !s.muted }));
  },

  cycleShuffle() {
    const { shuffle, queue, currentIndex, queueOrder } = get();
    const nextShuffle = SHUFFLE_STATES[(SHUFFLE_STATES.indexOf(shuffle) + 1) % SHUFFLE_STATES.length];
    const activeOriginalIdx = queueOrder[currentIndex] ?? currentIndex;
    const newOrder =
      nextShuffle === 'on'
        ? shuffleIndices(queue.length, activeOriginalIdx)
        : Array.from({ length: queue.length }, (_, i) => i);
    const newIndex = newOrder.indexOf(activeOriginalIdx);
    set({ shuffle: nextShuffle, queueOrder: newOrder, currentIndex: newIndex >= 0 ? newIndex : 0 });
  },

  cycleRepeat() {
    const { repeat } = get();
    const next = REPEAT_STATES[(REPEAT_STATES.indexOf(repeat) + 1) % REPEAT_STATES.length];
    set({ repeat: next });
  },

  /** `displayIndex` = position in the shuffled/ordered queue (same index space as `currentIndex`). */
  jumpToQueueIndex(displayIndex) {
    const { queueOrder } = get();
    if (displayIndex < 0 || displayIndex >= queueOrder.length) return;
    set({ currentIndex: displayIndex, progress: 0, isPlaying: true });
  },
}));

export function selectCurrentTrack(state) {
  if (state.currentIndex < 0) return null;
  const idx = state.queueOrder[state.currentIndex] ?? state.currentIndex;
  return state.queue[idx] || null;
}
