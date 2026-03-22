import { useState } from 'react';
import { useSceneComplete } from '../../../engine/SceneContext';
import { useLanguage } from '../../../i18n/LanguageContext';

interface Layer {
  id: string;
  label: string;
  icon: string;
  color: string;
  tokens: number;
  description: string;
  contents: string[];
}

export default function ContextLayers() {
  const sceneComplete = useSceneComplete();
  const { t } = useLanguage();
  const [expandedLayer, setExpandedLayer] = useState<string | null>(null);
  const [clickedLayers, setClickedLayers] = useState<Set<string>>(new Set());
  const [hasCompleted, setHasCompleted] = useState(false);

  const layers: Layer[] = [
    {
      id: 'claude-md',
      label: 'CLAUDE.md',
      icon: '📋',
      color: '#eab308',
      tokens: 1200,
      description: t(
        '你的"出厂说明书"——每次对话开始时自动加载',
        'Your "instruction manual" — automatically loaded at the start of every conversation'
      ),
      contents: [
        t('项目技术栈：Astro + React + TypeScript', 'Tech stack: Astro + React + TypeScript'),
        t('代码风格：使用 ESLint + Prettier', 'Code style: ESLint + Prettier'),
        t('约定：组件放在 src/components/', 'Convention: components go in src/components/'),
        t('命令：npm run dev 启动开发', 'Command: npm run dev to start development'),
      ],
    },
    {
      id: 'conversation',
      label: t('对话历史', 'Conversation History'),
      icon: '💬',
      color: '#3b82f6',
      tokens: 3400,
      description: t(
        '你和用户之间的所有消息往来',
        'All messages exchanged between you and the user'
      ),
      contents: [
        t('user: "帮我看看 auth 模块的问题"', 'user: "Help me look at the auth module issue"'),
        t('assistant: "好的，让我先读取文件..."', 'assistant: "OK, let me read the file first..."'),
        t('user: "token 过期了没有被处理"', 'user: "Token expiry isn\'t being handled"'),
        t('assistant: "我看到了，第 42 行..."', 'assistant: "I see it, line 42..."'),
      ],
    },
    {
      id: 'files',
      label: t('文件内容 & 工具结果', 'File Contents & Tool Results'),
      icon: '📁',
      color: '#10b981',
      tokens: 5800,
      description: t(
        '通过工具读取的文件、命令输出、搜索结果',
        'Files read by tools, command outputs, search results'
      ),
      contents: [
        t('[Read] src/auth.ts → 128 行代码', '[Read] src/auth.ts → 128 lines of code'),
        t('[Bash] npm test → 3 tests passed, 1 failed', '[Bash] npm test → 3 tests passed, 1 failed'),
        t('[Grep] "token" → 在 5 个文件中找到 12 处', '[Grep] "token" → found 12 matches in 5 files'),
        t('[Read] src/config.json → 配置内容', '[Read] src/config.json → config contents'),
      ],
    },
  ];

  const totalTokens = layers.reduce((sum, l) => sum + l.tokens, 0);

  const handleLayerClick = (layerId: string) => {
    setExpandedLayer(expandedLayer === layerId ? null : layerId);

    const next = new Set(clickedLayers);
    next.add(layerId);
    setClickedLayers(next);

    if (next.size >= 3 && !hasCompleted) {
      setHasCompleted(true);
      if (sceneComplete) sceneComplete();
    }
  };

  return (
    <div className="context-layers" data-interactive>
      <div className="context-layers__hint">{t('点击每一层，查看里面有什么', 'Click each layer to see what\'s inside')}</div>

      <div className="context-layers__stack">
        {[...layers].reverse().map((layer, index) => {
          const isExpanded = expandedLayer === layer.id;
          const isClicked = clickedLayers.has(layer.id);

          return (
            <div
              key={layer.id}
              className={`context-layers__layer ${isExpanded ? 'context-layers__layer--expanded' : ''} ${isClicked ? 'context-layers__layer--visited' : ''}`}
              style={{
                borderColor: layer.color,
                zIndex: layers.length - index,
              }}
              onClick={() => handleLayerClick(layer.id)}
            >
              <div className="context-layers__layer-header">
                <span className="context-layers__layer-icon">{layer.icon}</span>
                <span className="context-layers__layer-label" style={{ color: layer.color }}>
                  {layer.label}
                </span>
                <span className="context-layers__layer-tokens">
                  {layer.tokens.toLocaleString()} tokens
                </span>
                <span className="context-layers__layer-arrow">
                  {isExpanded ? '▼' : '▶'}
                </span>
              </div>

              {isExpanded && (
                <div className="context-layers__layer-body">
                  <div className="context-layers__layer-desc">{layer.description}</div>
                  <div className="context-layers__layer-contents">
                    {layer.contents.map((item, i) => (
                      <div key={i} className="context-layers__content-item">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="context-layers__total">
        <span className="context-layers__total-label">{t('总上下文大小', 'Total Context Size')}</span>
        <span className="context-layers__total-value">{totalTokens.toLocaleString()} tokens</span>
      </div>

      <div className="context-layers__bar">
        {layers.map((layer) => (
          <div
            key={layer.id}
            className="context-layers__bar-segment"
            style={{
              width: `${(layer.tokens / totalTokens) * 100}%`,
              backgroundColor: layer.color,
            }}
            title={`${layer.label}: ${layer.tokens} tokens`}
          />
        ))}
      </div>
      <div className="context-layers__bar-labels">
        {layers.map((layer) => (
          <span key={layer.id} className="context-layers__bar-label" style={{ color: layer.color }}>
            {layer.icon} {Math.round((layer.tokens / totalTokens) * 100)}%
          </span>
        ))}
      </div>
    </div>
  );
}
