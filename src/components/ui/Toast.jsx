import { AnimatePresence, motion } from 'framer-motion';
import { useUiStore } from '../../store/uiStore.js';

export default function Toast() {
  const toast = useUiStore((s) => s.toast);

  return (
    <div className="pointer-events-none fixed bottom-28 left-1/2 z-50 -translate-x-1/2">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.message}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className={`glass rounded-full px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] shadow-glow ${
              toast.type === 'error' ? 'text-pulse' : 'text-accent'
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
