import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import { X } from 'lucide-react';
import { useUiStore } from '../../store/uiStore.js';
import { usePlayerStore, selectCurrentTrack } from '../../store/playerStore.js';

export default function QueuePanel() {
  const open = useUiStore((s) => s.queuePanelOpen);
  const setQueuePanelOpen = useUiStore((s) => s.setQueuePanelOpen);

  const queue = usePlayerStore((s) => s.queue);
  const queueOrder = usePlayerStore((s) => s.queueOrder);
  const currentIndex = usePlayerStore((s) => s.currentIndex);
  const jumpToQueueIndex = usePlayerStore((s) => s.jumpToQueueIndex);
  const currentTrack = usePlayerStore(selectCurrentTrack);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setQueuePanelOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setQueuePanelOpen]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close queue"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-void/70 backdrop-blur-sm"
            onClick={() => setQueuePanelOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="queue-panel-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-0 right-0 top-16 z-[120] flex w-full max-w-md flex-col border-l border-white/10 bg-deep/95 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
              <div>
                <p id="queue-panel-title" className="font-heading text-lg font-semibold text-ink">
                  Queue
                </p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                  {queueOrder.length ? `${queueOrder.length} tracks` : 'Empty'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setQueuePanelOpen(false)}
                className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-elevated/60 hover:text-ink"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="scroll-thin flex-1 overflow-y-auto px-2 py-3">
              {!queueOrder.length ? (
                <p className="px-3 py-12 text-center text-sm text-ink-muted">
                  Nothing in the queue. Play an album or playlist to fill it.
                </p>
              ) : (
                <ul className="flex flex-col gap-0.5">
                  {queueOrder.map((trackIdx, displayIdx) => {
                    const track = queue[trackIdx];
                    if (!track) return null;
                    const active = displayIdx === currentIndex;
                    return (
                      <li key={`${track.id}-${displayIdx}`}>
                        <button
                          type="button"
                          onClick={() => {
                            jumpToQueueIndex(displayIdx);
                          }}
                          className={clsx(
                            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                            active ? 'bg-elevated/70 text-ink' : 'text-ink-muted hover:bg-elevated/40 hover:text-ink'
                          )}
                        >
                          <span className="w-6 shrink-0 font-mono text-xs text-ink-faint">{displayIdx + 1}</span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-ink">{track.title}</p>
                            <p className="truncate text-xs text-ink-muted">{track.artistName}</p>
                          </div>
                          {active && currentTrack?.id === track.id && (
                            <span className="shrink-0 font-mono text-[9px] uppercase tracking-wider text-accent">
                              Now
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
