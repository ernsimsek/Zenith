import { motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.04,
      when: 'beforeChildren',
    },
  },
};

export default function PageWrapper({ children, className = '' }) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="show"
      className={`relative mx-auto w-full max-w-7xl px-6 py-8 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export const pageItem = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};
