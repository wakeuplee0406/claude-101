import { useState, useEffect } from 'react';
import type { Lang } from './LanguageContext';

export default function LanguageToggle() {
  const [lang, setLang] = useState<Lang>('zh');

  useEffect(() => {
    const stored = localStorage.getItem('claude101-lang');
    if (stored === 'en' || stored === 'zh') setLang(stored);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      setLang((e as CustomEvent<Lang>).detail);
    };
    window.addEventListener('claude101-lang-change', handler);
    return () => window.removeEventListener('claude101-lang-change', handler);
  }, []);

  const toggle = () => {
    const newLang: Lang = lang === 'zh' ? 'en' : 'zh';
    setLang(newLang);
    localStorage.setItem('claude101-lang', newLang);
    window.dispatchEvent(new CustomEvent('claude101-lang-change', { detail: newLang }));
  };

  return (
    <button
      className="lang-toggle"
      onClick={toggle}
      aria-label={lang === 'zh' ? 'Switch to English' : '切换到中文'}
    >
      <span className={`lang-toggle__option ${lang === 'zh' ? 'lang-toggle__option--active' : ''}`}>ZH</span>
      <span className="lang-toggle__sep">/</span>
      <span className={`lang-toggle__option ${lang === 'en' ? 'lang-toggle__option--active' : ''}`}>EN</span>
    </button>
  );
}
