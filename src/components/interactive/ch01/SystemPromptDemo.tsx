import { useState } from 'react';
import { useSceneComplete } from '../../../engine/SceneContext';
import { useLanguage } from '../../../i18n/LanguageContext';

interface Persona {
  id: string;
  label: string;
  emoji: string;
  systemPrompt: string;
  response: string;
}

export default function SystemPromptDemo() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const sceneComplete = useSceneComplete();
  const { t } = useLanguage();

  const userMessage = t('今天天气怎么样？', 'How\'s the weather today?');

  const personas: Persona[] = [
    {
      id: 'default',
      label: t('默认', 'Default'),
      emoji: '🤖',
      systemPrompt: t('你是一个 AI 助手。', 'You are an AI assistant.'),
      response: t(
        '我无法获取实时天气数据，建议你查看天气应用或网站获取最新信息。',
        'I can\'t access real-time weather data. I\'d suggest checking a weather app or website for the latest information.'
      ),
    },
    {
      id: 'pirate',
      label: t('海盗', 'Pirate'),
      emoji: '🏴‍☠️',
      systemPrompt: t(
        '你是一个说话像海盗的 AI，所有回复都要用海盗风格。',
        'You are an AI that talks like a pirate. All responses must be in pirate style.'
      ),
      response: t(
        '啊哈！老船长看了看天，乌云密布啊！今天怕是要来一场大风暴，水手们赶紧收帆！Arrr！🏴‍☠️',
        'Ahoy! The captain looked up at the sky — dark clouds be gatherin\'! A mighty storm be brewin\' today, sailors — batten down the hatches! Arrr! 🏴‍☠️'
      ),
    },
    {
      id: 'poet',
      label: t('诗人', 'Poet'),
      emoji: '✍️',
      systemPrompt: t(
        '你是一位古典诗人，所有回复都用诗歌形式。',
        'You are a classical poet. All responses must be in verse.'
      ),
      response: t(
        '春风拂面暖意生，\n白云悠悠天际横。\n莫问阴晴圆缺事，\n推窗自有好风景。',
        'The spring breeze blows warm and light,\nWhite clouds drift across the height.\nAsk not of rain or sunny skies,\nOpen your window — beauty lies.'
      ),
    },
    {
      id: 'coder',
      label: t('程序员', 'Coder'),
      emoji: '💻',
      systemPrompt: t(
        '你是一个只用代码和技术类比来回答问题的程序员。',
        'You are a programmer who answers everything using code and technical analogies.'
      ),
      response: t(
        'weather.status === "sunny"\n  ? console.log("出门不带伞")\n  : console.log("带伞.exe")\n// 建议调用 navigator.geolocation API 获取精确数据',
        'weather.status === "sunny"\n  ? console.log("no umbrella needed")\n  : console.log("bring_umbrella.exe")\n// Suggest calling navigator.geolocation API for accurate data'
      ),
    },
  ];

  const selected = personas.find((p) => p.id === selectedId);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    // Complete after trying at least 2 personas
    if (hasInteracted && sceneComplete) {
      sceneComplete();
    }
  };

  return (
    <div className="sp-demo" data-interactive>
      {/* Role selector */}
      <div className="sp-demo__roles">
        {personas.map((p) => (
          <button
            key={p.id}
            className={`sp-demo__role-btn ${selectedId === p.id ? 'sp-demo__role-btn--active' : ''}`}
            onClick={() => handleSelect(p.id)}
          >
            <span className="sp-demo__role-emoji">{p.emoji}</span>
            <span className="sp-demo__role-label">{p.label}</span>
          </button>
        ))}
      </div>

      {/* Visualization */}
      {selected && (
        <div className="sp-demo__result">
          {/* System prompt */}
          <div className="sp-demo__msg sp-demo__msg--system">
            <div className="sp-demo__msg-header">
              <span className="sp-demo__msg-dot" style={{ background: '#eab308' }} />
              <span className="sp-demo__msg-role">system</span>
            </div>
            <div className="sp-demo__msg-content">{selected.systemPrompt}</div>
          </div>

          {/* User message */}
          <div className="sp-demo__msg sp-demo__msg--user">
            <div className="sp-demo__msg-header">
              <span className="sp-demo__msg-dot" style={{ background: '#3b82f6' }} />
              <span className="sp-demo__msg-role">user</span>
            </div>
            <div className="sp-demo__msg-content">{userMessage}</div>
          </div>

          {/* Arrow */}
          <div className="sp-demo__arrow">▼</div>

          {/* AI response */}
          <div className="sp-demo__msg sp-demo__msg--assistant">
            <div className="sp-demo__msg-header">
              <span className="sp-demo__msg-dot" style={{ background: '#7c3aed' }} />
              <span className="sp-demo__msg-role">assistant</span>
              <span className="sp-demo__persona-tag">{selected.emoji} {t(`${selected.label}模式`, `${selected.label} Mode`)}</span>
            </div>
            <div className="sp-demo__msg-content sp-demo__msg-content--response">
              {selected.response}
            </div>
          </div>
        </div>
      )}

      {!selected && (
        <div className="sp-demo__placeholder">
          {t('← 选择一个角色，看看同样的问题会得到什么不同的回答', '← Choose a role to see how the same question gets different answers')}
        </div>
      )}
    </div>
  );
}
