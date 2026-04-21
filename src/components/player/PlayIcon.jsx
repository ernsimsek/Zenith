import { motion } from 'framer-motion';

export default function PlayIcon({ playing, size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <motion.path
        initial={false}
        animate={{
          d: playing
            ? 'M7 5 H10 V19 H7 Z M14 5 H17 V19 H14 Z'
            : 'M7 5 L7 19 L11 17 L11 17 L19 12 L11 7 L11 7 Z',
        }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}
