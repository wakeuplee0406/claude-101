import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export type Lang = 'zh' | 'en';

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: <T>(zh: T, en: T) => T;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'zh',
  setLang: () => {},
  t: <T,>(zh: T, _en: T): T => zh,
});

function getInitialLang(): Lang {
  if (typeof window === 'undefined') return 'zh';
  const stored = localStorage.getItem('claude101-lang');
  if (stored === 'en' || stored === 'zh') return stored;
  return 'zh';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem('claude101-lang', newLang);
    window.dispatchEvent(new CustomEvent('claude101-lang-change', { detail: newLang }));
  }, []);

  // Listen for language changes from other islands (e.g. the toggle in the Astro layout)
  useEffect(() => {
    const handler = (e: Event) => {
      const lang = (e as CustomEvent<Lang>).detail;
      setLangState(lang);
    };
    window.addEventListener('claude101-lang-change', handler);
    return () => window.removeEventListener('claude101-lang-change', handler);
  }, []);

  // Also sync if localStorage changes from another tab
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === 'claude101-lang' && (e.newValue === 'zh' || e.newValue === 'en')) {
        setLangState(e.newValue);
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const t = useCallback(<T,>(zh: T, en: T): T => (lang === 'zh' ? zh : en), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
