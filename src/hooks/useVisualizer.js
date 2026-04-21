import { useEffect, useRef } from 'react';
import audio from '../lib/audio.js';

/**
 * Runs a callback every animation frame with the current byte-frequency data.
 * The callback receives the Uint8Array in-place; do not keep references to it.
 */
export function useVisualizer(callback, active = true) {
  const cbRef = useRef(callback);
  cbRef.current = callback;

  useEffect(() => {
    if (!active) return undefined;
    let rafId = 0;
    const loop = () => {
      const data = audio.getFrequencyData();
      if (data) cbRef.current?.(data);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [active]);
}

export default useVisualizer;
