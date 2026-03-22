import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../i18n/LanguageContext';

interface DeepDiveProps {
  title: string;
  children: ReactNode;
}

export default function DeepDive({ title, children }: DeepDiveProps) {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="deep-dive">
      <button
        className="deep-dive__toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <svg
          className={`deep-dive__arrow ${open ? 'deep-dive__arrow--open' : ''}`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 4 10 8 6 12" />
        </svg>
        <span className="deep-dive__label">{t('深入了解', 'Deep Dive')}</span>
        <span className="deep-dive__title">{title}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="deep-dive__content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="deep-dive__inner">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
