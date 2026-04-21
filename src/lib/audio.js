import { Howl, Howler } from 'howler';

class AudioEngine {
  constructor() {
    this.current = null;
    this.analyser = null;
    this.sourceNode = null;
    this.freqData = null;
    this.listeners = {
      play: new Set(),
      pause: new Set(),
      end: new Set(),
      load: new Set(),
      loaderror: new Set(),
    };
  }

  _ensureAnalyser() {
    const ctx = Howler.ctx;
    if (!ctx) return null;

    if (!this.analyser) {
      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 128;
      this.analyser.smoothingTimeConstant = 0.82;
      this.freqData = new Uint8Array(this.analyser.frequencyBinCount);
      try {
        Howler.masterGain.connect(this.analyser);
      } catch {
        // ignore; analyser may already be connected
      }
    }
    return this.analyser;
  }

  getFrequencyData() {
    const analyser = this._ensureAnalyser();
    if (!analyser) return null;
    analyser.getByteFrequencyData(this.freqData);
    return this.freqData;
  }

  load(url, { volume = 0.8, onEnd } = {}) {
    if (this.current) {
      this.current.stop();
      this.current.unload();
      this.current = null;
    }

    if (!url) {
      this._emit('loaderror', new Error('No preview URL'));
      return;
    }

    const howl = new Howl({
      src: [url],
      html5: true,
      format: ['mp3'],
      volume,
      onload: () => {
        this._ensureAnalyser();
        this._emit('load', howl);
      },
      onplay: () => this._emit('play'),
      onpause: () => this._emit('pause'),
      onend: () => {
        this._emit('end');
        onEnd?.();
      },
      onloaderror: (_id, err) => this._emit('loaderror', err),
      onplayerror: (_id, err) => this._emit('loaderror', err),
    });

    this.current = howl;
    return howl;
  }

  play() {
    if (!this.current) return;
    // Browsers require user gesture to start AudioContext
    if (Howler.ctx && Howler.ctx.state === 'suspended') {
      Howler.ctx.resume().catch(() => {});
    }
    this.current.play();
  }

  pause() {
    this.current?.pause();
  }

  stop() {
    this.current?.stop();
  }

  seek(seconds) {
    if (!this.current) return;
    try {
      this.current.seek(seconds);
    } catch {
      // ignore
    }
  }

  getSeek() {
    if (!this.current) return 0;
    const v = this.current.seek();
    return typeof v === 'number' ? v : 0;
  }

  getDuration() {
    return this.current?.duration() || 0;
  }

  setVolume(v) {
    Howler.volume(Math.max(0, Math.min(1, v)));
  }

  mute(muted) {
    Howler.mute(muted);
  }

  on(event, cb) {
    this.listeners[event]?.add(cb);
    return () => this.listeners[event]?.delete(cb);
  }

  _emit(event, arg) {
    this.listeners[event]?.forEach((cb) => {
      try {
        cb(arg);
      } catch {
        // swallow listener errors
      }
    });
  }
}

export const audio = new AudioEngine();
export default audio;
