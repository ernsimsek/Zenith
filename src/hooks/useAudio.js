import { useEffect, useRef } from 'react';
import { usePlayerStore, selectCurrentTrack } from '../store/playerStore.js';
import { useUiStore } from '../store/uiStore.js';
import audio from '../lib/audio.js';

export function useAudioEngine() {
  const currentTrack = usePlayerStore(selectCurrentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const volume = usePlayerStore((s) => s.volume);
  const muted = usePlayerStore((s) => s.muted);
  const setProgress = usePlayerStore((s) => s.setProgress);
  const setDuration = usePlayerStore((s) => s.setDuration);
  const setPlaying = usePlayerStore((s) => s.setPlaying);
  const next = usePlayerStore((s) => s.next);
  const showToast = useUiStore((s) => s.showToast);

  const loadedIdRef = useRef(null);
  const rafRef = useRef(null);

  // Load track when current changes
  useEffect(() => {
    if (!currentTrack) {
      audio.stop();
      loadedIdRef.current = null;
      setProgress(0);
      setDuration(0);
      return;
    }
    if (currentTrack.id === loadedIdRef.current) return;

    if (!currentTrack.previewUrl) {
      showToast({ type: 'warn', message: 'No preview available for this track.' });
      setPlaying(false);
      loadedIdRef.current = currentTrack.id;
      return;
    }

    loadedIdRef.current = currentTrack.id;
    audio.load(currentTrack.previewUrl, {
      volume: muted ? 0 : volume,
      onEnd: () => {
        setProgress(0);
        const prevId = loadedIdRef.current;
        next();
        queueMicrotask(() => {
          const s = usePlayerStore.getState();
          if (!s.isPlaying) return;
          const t = selectCurrentTrack(s);
          if (t?.id === prevId && t?.previewUrl) {
            seekAudio(0);
            audio.play();
          }
        });
      },
    });
  }, [currentTrack, muted, volume, setPlaying, setProgress, setDuration, next, showToast]);

  // Play/pause sync
  useEffect(() => {
    if (!currentTrack || !currentTrack.previewUrl) return;
    if (isPlaying) audio.play();
    else audio.pause();
  }, [isPlaying, currentTrack]);

  // Volume sync
  useEffect(() => {
    audio.setVolume(muted ? 0 : volume);
  }, [volume, muted]);

  // Progress tracking via RAF
  useEffect(() => {
    function tick() {
      const dur = audio.getDuration();
      if (dur && dur !== usePlayerStore.getState().duration) {
        setDuration(dur);
      }
      setProgress(audio.getSeek());
      rafRef.current = requestAnimationFrame(tick);
    }
    if (isPlaying) rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, setProgress, setDuration]);

  // On-load subscribe for duration + loaderror toast
  useEffect(() => {
    const offLoad = audio.on('load', (howl) => {
      setDuration(howl.duration());
    });
    const offErr = audio.on('loaderror', () => {
      showToast({ type: 'error', message: 'Lost the signal. Try another track.' });
      setPlaying(false);
    });
    return () => {
      offLoad?.();
      offErr?.();
    };
  }, [setDuration, setPlaying, showToast]);

  // Programmatic seek responder: listen for explicit seek changes (handled via action directly calling audio.seek)
}

export function seekAudio(seconds) {
  audio.seek(seconds);
}
