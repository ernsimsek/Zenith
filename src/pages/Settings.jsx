import { useMemo } from 'react';
import { motion } from 'framer-motion';
import PageWrapper, { pageItem } from '../components/layout/PageWrapper.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import { useSettingsStore } from '../store/settingsStore.js';
import { useUiStore } from '../store/uiStore.js';
import clsx from 'clsx';

const EQ_LABELS = ['32', '64', '125', '250', '500', '1k', '2k', '4k', '8k', '16k'];

const AUDIO_OPTIONS = [
  { id: 'auto', label: 'Auto' },
  { id: 'high', label: 'High' },
  { id: 'normal', label: 'Normal' },
  { id: 'data-saver', label: 'Data saver' },
];

const THEMES = [
  {
    id: 'dark-matter',
    name: 'Dark Matter',
    desc: 'Default deep space look.',
    swatch: 'linear-gradient(135deg, #020408, #00e5ff33)',
  },
  {
    id: 'solar',
    name: 'Solar',
    desc: 'Light surfaces, same accent energy.',
    swatch: 'linear-gradient(135deg, #e8ecf6, #0090a844)',
  },
  {
    id: 'void',
    name: 'Void',
    desc: 'True black for OLED.',
    swatch: 'linear-gradient(135deg, #000000, #00d4ee44)',
  },
];

export default function SettingsPage() {
  const showToast = useUiStore((s) => s.showToast);

  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const audioQuality = useSettingsStore((s) => s.audioQuality);
  const setAudioQuality = useSettingsStore((s) => s.setAudioQuality);
  const crossfadeSeconds = useSettingsStore((s) => s.crossfadeSeconds);
  const setCrossfadeSeconds = useSettingsStore((s) => s.setCrossfadeSeconds);
  const eqBands = useSettingsStore((s) => s.eqBands);
  const setEqBand = useSettingsStore((s) => s.setEqBand);
  const resetEq = useSettingsStore((s) => s.resetEq);
  const notifyInApp = useSettingsStore((s) => s.notifyInApp);
  const notifyEmail = useSettingsStore((s) => s.notifyEmail);
  const setNotifyInApp = useSettingsStore((s) => s.setNotifyInApp);
  const setNotifyEmail = useSettingsStore((s) => s.setNotifyEmail);

  const { eqLine, eqFill } = useMemo(() => {
    const w = 280;
    const h = 72;
    const pad = 8;
    const step = (w - pad * 2) / (eqBands.length - 1);
    const pts = eqBands.map((db, i) => {
      const x = pad + i * step;
      const y = pad + ((12 - db) / 24) * (h - pad * 2);
      return `${x},${y}`;
    });
    const line = pts.join(' ');
    const xLast = pad + (eqBands.length - 1) * step;
    const yBase = h - pad;
    const fill = `${line} ${xLast},${yBase} ${pad},${yBase}`;
    return { eqLine: line, eqFill: fill };
  }, [eqBands]);

  return (
    <PageWrapper>
      <motion.div variants={pageItem}>
        <SectionHeading eyebrow="Control room" title="Settings" />
        <p className="mt-2 max-w-xl text-sm text-ink-muted">
          Preferences are saved in this browser. Audio engine hooks (crossfade, EQ) are stored for
          upcoming playback features.
        </p>
      </motion.div>

      <motion.section variants={pageItem} className="mb-12 mt-10">
        <h3 className="mb-4 font-heading text-lg text-ink">Theme</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTheme(t.id);
                showToast({ type: 'ok', message: `Theme: ${t.name}` });
              }}
              className={clsx(
                'rounded-xl border p-4 text-left transition-all duration-300 ease-zenith',
                theme === t.id
                  ? 'border-accent/60 bg-elevated/80 shadow-glow-sm'
                  : 'border-white/10 bg-surface/40 hover:border-white/20'
              )}
            >
              <div
                className="mb-3 h-14 w-full rounded-lg border border-white/10"
                style={{ background: t.swatch }}
              />
              <p className="font-heading text-sm font-semibold text-ink">{t.name}</p>
              <p className="mt-1 text-xs text-ink-muted">{t.desc}</p>
            </button>
          ))}
        </div>
      </motion.section>

      <motion.section variants={pageItem} className="mb-12">
        <h3 className="mb-4 font-heading text-lg text-ink">Audio quality</h3>
        <div className="flex flex-wrap gap-2">
          {AUDIO_OPTIONS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setAudioQuality(o.id)}
              className={clsx(
                'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                audioQuality === o.id
                  ? 'border-accent bg-accent/15 text-ink'
                  : 'border-white/10 text-ink-muted hover:border-white/20 hover:text-ink'
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-ink-faint">
          Jamendo streams use the format requested by the player. This choice is reserved for future
          bitrate selection.
        </p>
      </motion.section>

      <motion.section variants={pageItem} className="mb-12">
        <h3 className="mb-4 font-heading text-lg text-ink">Crossfade</h3>
        <div className="max-w-md rounded-xl border border-white/10 bg-surface/40 p-5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-ink-muted">Duration</span>
            <span className="font-mono text-sm text-accent">{crossfadeSeconds}s</span>
          </div>
          <input
            type="range"
            min={0}
            max={12}
            step={1}
            value={crossfadeSeconds}
            onChange={(e) => setCrossfadeSeconds(Number(e.target.value))}
            className="zenith-input mt-4 h-2 w-full cursor-pointer appearance-none rounded-full accent-accent"
          />
          <p className="mt-2 text-xs text-ink-faint">0–12 seconds between tracks (not yet applied to playback).</p>
        </div>
      </motion.section>

      <motion.section variants={pageItem} className="mb-12">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <h3 className="font-heading text-lg text-ink">Equalizer</h3>
          <button
            type="button"
            onClick={() => {
              resetEq();
              showToast({ type: 'ok', message: 'EQ reset to flat.' });
            }}
            className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-ink-muted transition-colors hover:border-accent/40 hover:text-ink"
          >
            Reset flat
          </button>
        </div>
        <div className="rounded-xl border border-white/10 bg-surface/40 p-5">
          <svg viewBox="0 0 280 72" className="mb-6 h-20 w-full max-w-md text-accent" aria-hidden>
            <defs>
              <linearGradient id="eqFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <polyline
              fill="none"
              stroke="var(--accent-primary)"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              points={eqLine}
            />
            <polygon fill="url(#eqFill)" stroke="none" points={eqFill} />
          </svg>
          <div className="grid max-w-2xl grid-cols-5 gap-x-3 gap-y-5 sm:grid-cols-10">
            {eqBands.map((db, i) => (
              <div key={i} className="flex min-w-0 flex-col items-stretch gap-2">
                <span className="text-center font-mono text-[9px] text-ink-faint">{EQ_LABELS[i]}</span>
                <input
                  type="range"
                  min={-12}
                  max={12}
                  step={1}
                  value={db}
                  onChange={(e) => setEqBand(i, Number(e.target.value))}
                  className="zenith-input h-2 w-full cursor-pointer appearance-none rounded-full accent-accent"
                  aria-label={`EQ band ${EQ_LABELS[i]} ${db} dB`}
                />
                <span className="text-center font-mono text-[10px] tabular-nums text-accent">
                  {db > 0 ? `+${db}` : db}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-ink-faint">
            Ten-band gain (−12 to +12 dB). Visual only until the audio graph is wired to Howler /
            Web Audio.
          </p>
        </div>
      </motion.section>

      <motion.section variants={pageItem} className="mb-12">
        <h3 className="mb-4 font-heading text-lg text-ink">Notifications</h3>
        <div className="flex max-w-md flex-col gap-4 rounded-xl border border-white/10 bg-surface/40 p-5">
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <span className="text-sm text-ink">In-app tips</span>
            <input
              type="checkbox"
              checked={notifyInApp}
              onChange={(e) => setNotifyInApp(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-surface accent-accent"
            />
          </label>
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <span className="text-sm text-ink">Email (coming soon)</span>
            <input
              type="checkbox"
              checked={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-surface accent-accent"
            />
          </label>
        </div>
      </motion.section>

      <motion.section variants={pageItem} className="mb-12">
        <h3 className="mb-4 font-heading text-lg text-ink">Connected devices</h3>
        <div className="rounded-xl border border-dashed border-white/15 bg-surface/30 px-5 py-10 text-center text-sm text-ink-muted">
          No external devices linked. Playback runs in this browser via Jamendo streams.
        </div>
      </motion.section>
    </PageWrapper>
  );
}
