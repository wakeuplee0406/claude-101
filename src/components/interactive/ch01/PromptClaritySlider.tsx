import { useState, useEffect, useCallback } from 'react';
import { useSceneComplete } from '../../../engine/SceneContext';
import { useLanguage } from '../../../i18n/LanguageContext';

interface PromptClaritySliderProps {
  onComplete?: () => void;
}

export default function PromptClaritySlider({ onComplete: onCompleteProp }: PromptClaritySliderProps) {
  const sceneComplete = useSceneComplete();
  const onComplete = onCompleteProp ?? sceneComplete;
  const { t } = useLanguage();
  const [value, setValue] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  const prompts = [
    { clarity: 0, text: t('帮我改代码', 'Fix my code'), response: t('改什么代码？我完全不知道你在说什么...', 'Fix what code? I have no idea what you\'re talking about...'), mood: '😵' },
    { clarity: 25, text: t('帮我改 bug', 'Fix a bug for me'), response: t('哪个文件？什么 bug？我需要更多信息...', 'Which file? What bug? I need more information...'), mood: '😕' },
    { clarity: 50, text: t('帮我修复 auth 模块的 bug', 'Fix the bug in the auth module'), response: t('好的，我知道在 auth 模块。让我看看...但具体是什么问题？', 'OK, I know it\'s in the auth module. Let me look... but what exactly is the problem?'), mood: '🤔' },
    { clarity: 75, text: t('修复 src/auth.ts 中 login() 的 token 过期问题', 'Fix the token expiry issue in login() in src/auth.ts'), response: t('明白了！我来看 src/auth.ts 的 login 函数，检查 token 过期逻辑。', 'Got it! I\'ll check the login function in src/auth.ts and inspect the token expiry logic.'), mood: '😊' },
    { clarity: 100, text: t('修复 src/auth.ts 第 42 行，login() 没有检查 token 是否过期就直接使用，应该先调用 isTokenValid()', 'Fix line 42 in src/auth.ts — login() uses the token without checking expiry. It should call isTokenValid() first.'), response: t('完美！我确切知道要做什么：在第 42 行添加 isTokenValid() 检查。马上修复！', 'Perfect! I know exactly what to do: add an isTokenValid() check at line 42. Fixing it now!'), mood: '🤩' },
  ];

  const currentPrompt = prompts.reduce((best, p) =>
    Math.abs(p.clarity - value) < Math.abs(best.clarity - value) ? p : best,
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(Number(e.target.value));
      if (!hasInteracted) {
        setHasInteracted(true);
      }
    },
    [hasInteracted],
  );

  useEffect(() => {
    if (hasInteracted && value >= 75 && onComplete) {
      onComplete();
    }
  }, [hasInteracted, value, onComplete]);

  return (
    <div className="clarity-slider" data-interactive>
      <div className="clarity-slider__prompt">
        <div className="clarity-slider__prompt-label">{t('你给 AI 的指令：', 'Your instruction to the AI:')}</div>
        <div className="clarity-slider__prompt-text">"{currentPrompt.text}"</div>
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={handleChange}
        className="clarity-slider__input"
        aria-label={t('调整 prompt 清晰度', 'Adjust prompt clarity')}
      />

      <div className="clarity-slider__labels">
        <span>{t('模糊', 'Vague')}</span>
        <span>{t('清晰', 'Clear')}</span>
      </div>

      <div className="clarity-slider__response">
        <div className="clarity-slider__mood">{currentPrompt.mood}</div>
        <div className="clarity-slider__response-text">
          {currentPrompt.response}
        </div>
      </div>
    </div>
  );
}
