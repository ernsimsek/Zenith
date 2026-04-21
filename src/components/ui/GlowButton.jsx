import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import clsx from 'clsx';

/** Primary CTA with electric glow — Dark Matter spec. */
export default function GlowButton({ to, children, className = '' }) {
  const glow = (
    <span
      className="pointer-events-none absolute inset-0 rounded-full opacity-70"
      style={{
        boxShadow: '0 0 40px var(--accent-glow), 0 0 80px color-mix(in srgb, var(--accent-primary) 25%, transparent)',
      }}
    />
  );

  const label = <span className="relative z-[1] font-heading text-sm font-semibold tracking-[0.2em]">{children}</span>;

  const shell = clsx(
    'relative inline-flex min-h-[3rem] items-center justify-center overflow-hidden rounded-full border border-accent/30 bg-accent px-10 text-void no-underline',
    'shadow-[0_0_24px_var(--accent-glow)] transition-shadow duration-300 ease-zenith hover:shadow-[0_0_36px_var(--accent-glow)]',
    className
  );

  if (to) {
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="inline-flex">
        <Link to={to} className={shell}>
          {glow}
          {label}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className={shell}>
      {glow}
      {label}
    </motion.button>
  );
}
