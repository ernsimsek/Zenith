import WaveformBg from '../components/visualizers/WaveformBg.jsx';
import { isJamendoConfigured } from '../lib/jamendoApi.js';

export default function Setup() {
  return (
    <div className="relative grid h-full place-items-center overflow-hidden bg-void px-6">
      <WaveformBg />
      <div className="relative z-10 max-w-lg text-center">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-accent">ZENITH · Jamendo</p>
        <h1 className="mt-6 font-display text-4xl leading-tight text-ink sm:text-5xl">
          Add your <span className="text-gradient-accent">Jamendo</span> client id
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-ink-muted">
          Create a free app at{' '}
          <a
            href="https://devportal.jamendo.com/"
            target="_blank"
            rel="noreferrer"
            className="text-accent underline decoration-accent/40 underline-offset-2"
          >
            devportal.jamendo.com
          </a>
          , then set <code className="rounded bg-elevated px-1.5 py-0.5 font-mono text-accent">VITE_JAMENDO_CLIENT_ID</code> in
          the project <code className="rounded bg-elevated px-1.5 py-0.5 font-mono text-xs">.env</code> file and restart{' '}
          <code className="rounded bg-elevated px-1.5 py-0.5 font-mono text-xs">npm run dev</code>.
        </p>
        {!isJamendoConfigured() && (
          <p className="mt-4 font-mono text-xs text-ink-faint">
            Current value is missing or empty after restart.
          </p>
        )}
      </div>
    </div>
  );
}
