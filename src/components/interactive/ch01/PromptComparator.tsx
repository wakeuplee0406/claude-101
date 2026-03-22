import { useState } from 'react';
import { useLanguage } from '../../../i18n/LanguageContext';

interface PromptComparatorProps {
  left: string;
  right: string;
}

export default function PromptComparator({ left, right }: PromptComparatorProps) {
  const { t } = useLanguage();
  const [sliderValue, setSliderValue] = useState(0);

  const leftOpacity = 1 - sliderValue / 100;
  const rightOpacity = sliderValue / 100;

  return (
    <div className="prompt-comparator" data-interactive>
      <div className="prompt-comparator__display">
        <div className="prompt-comparator__side" style={{ opacity: Math.max(0.15, leftOpacity) }}>
          <div className="prompt-comparator__label">{t('模糊 ❌', 'Vague ❌')}</div>
          <div className="prompt-comparator__text">{left}</div>
        </div>
        <div className="prompt-comparator__divider" />
        <div className="prompt-comparator__side" style={{ opacity: Math.max(0.15, rightOpacity) }}>
          <div className="prompt-comparator__label">{t('清晰 ✅', 'Clear ✅')}</div>
          <div className="prompt-comparator__text">{right}</div>
        </div>
      </div>

      <div className="prompt-comparator__meter">
        <div className="prompt-comparator__meter-label">{t('AI 理解程度', 'AI Comprehension')}</div>
        <div className="prompt-comparator__meter-bar">
          <div
            className="prompt-comparator__meter-fill"
            style={{ width: `${sliderValue}%` }}
          />
        </div>
        <div className="prompt-comparator__meter-value">{sliderValue}%</div>
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={sliderValue}
        onChange={(e) => setSliderValue(Number(e.target.value))}
        className="prompt-comparator__slider"
        aria-label={t('在模糊和清晰 prompt 之间切换', 'Toggle between vague and clear prompts')}
      />
    </div>
  );
}
