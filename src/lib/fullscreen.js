/** Cross-browser Fullscreen API helpers (Chrome, Safari, legacy webkit). */

export function getFullscreenElement() {
  return document.fullscreenElement ?? document.webkitFullscreenElement ?? null;
}

export function requestElementFullscreen(el) {
  if (!el) return Promise.reject(new Error('No element'));
  if (typeof el.requestFullscreen === 'function') {
    return el
      .requestFullscreen({ navigationUI: 'hide' })
      .catch(() => (typeof el.requestFullscreen === 'function' ? el.requestFullscreen() : Promise.reject()));
  }
  if (typeof el.webkitRequestFullscreen === 'function') {
    try {
      el.webkitRequestFullscreen();
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }
  return Promise.reject(new Error('Fullscreen not supported'));
}

export function exitDocumentFullscreen() {
  if (typeof document.exitFullscreen === 'function') return document.exitFullscreen().catch(() => {});
  if (typeof document.webkitExitFullscreen === 'function') {
    return Promise.resolve(document.webkitExitFullscreen()).catch(() => {});
  }
  return Promise.resolve();
}
