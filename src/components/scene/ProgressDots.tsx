import { useLanguage } from '../../i18n/LanguageContext';

interface ProgressDotsProps {
  current: number;
  total: number;
  visitedMax: number;
  onDotClick: (index: number) => void;
}

export default function ProgressDots({ current, total, visitedMax, onDotClick }: ProgressDotsProps) {
  const { t } = useLanguage();

  return (
    <div className="progress-dots" role="tablist" aria-label={t(`场景 ${current + 1} / ${total}`, `Scene ${current + 1} / ${total}`)}>
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          className={`progress-dot ${i === current ? 'progress-dot--active' : ''} ${i <= visitedMax ? 'progress-dot--visited' : ''}`}
          onClick={() => onDotClick(i)}
          disabled={i > visitedMax}
          role="tab"
          aria-selected={i === current}
          aria-label={t(`场景 ${i + 1}`, `Scene ${i + 1}`)}
        />
      ))}
    </div>
  );
}
