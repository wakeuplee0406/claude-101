import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  title: string;
  children: ReactNode;
}

export default function DeepDive({ title, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="deep-dive">
      <button
        className="deep-dive-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <svg
          className={`deep-dive-arrow ${open ? 'open' : ''}`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 4 10 8 6 12" />
        </svg>
        <span className="deep-dive-label">深入了解</span>
        <span className="deep-dive-title">{title}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="deep-dive-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="deep-dive-inner">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
