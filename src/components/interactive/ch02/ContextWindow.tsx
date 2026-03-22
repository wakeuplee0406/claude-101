import { useState, useCallback } from 'react';
import { useSceneComplete } from '../../../engine/SceneContext';
import { useLanguage } from '../../../i18n/LanguageContext';

interface FileItem {
  id: string;
  name: string;
  icon: string;
  tokens: number;
  description: string;
}

const MAX_TOKENS = 8000;

export default function ContextWindow() {
  const sceneComplete = useSceneComplete();
  const { t } = useLanguage();
  const [addedFiles, setAddedFiles] = useState<string[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  const [warningFile, setWarningFile] = useState<string | null>(null);
  const [hasCompleted, setHasCompleted] = useState(false);

  const availableFiles: FileItem[] = [
    { id: 'app', name: 'src/app.ts', icon: '📄', tokens: 1200, description: t('应用入口文件', 'App entry file') },
    { id: 'auth', name: 'src/auth.ts', icon: '🔐', tokens: 2400, description: t('认证模块', 'Auth module') },
    { id: 'db', name: 'src/database.ts', icon: '🗄️', tokens: 3200, description: t('数据库连接层', 'Database connection layer') },
    { id: 'config', name: 'src/config.json', icon: '⚙️', tokens: 800, description: t('配置文件', 'Config file') },
    { id: 'readme', name: 'README.md', icon: '📖', tokens: 1600, description: t('项目文档', 'Project documentation') },
    { id: 'test', name: 'tests/auth.test.ts', icon: '🧪', tokens: 2800, description: t('测试文件', 'Test file') },
    { id: 'package', name: 'package.json', icon: '📦', tokens: 600, description: t('依赖配置', 'Dependency config') },
    { id: 'routes', name: 'src/routes.ts', icon: '🛤️', tokens: 1800, description: t('路由定义', 'Route definitions') },
  ];

  const usedTokens = addedFiles.reduce((sum, id) => {
    const file = availableFiles.find((f) => f.id === id);
    return sum + (file?.tokens ?? 0);
  }, 0);

  const handleAdd = useCallback(
    (fileId: string) => {
      if (addedFiles.includes(fileId)) return;

      const file = availableFiles.find((f) => f.id === fileId);
      if (!file) return;

      if (usedTokens + file.tokens > MAX_TOKENS) {
        setShowWarning(true);
        setWarningFile(file.name);
        setTimeout(() => {
          setShowWarning(false);
          setWarningFile(null);
        }, 2000);
        return;
      }

      const next = [...addedFiles, fileId];
      setAddedFiles(next);

      if (next.length >= 3 && !hasCompleted) {
        setHasCompleted(true);
        if (sceneComplete) sceneComplete();
      }
    },
    [addedFiles, usedTokens, hasCompleted, sceneComplete, availableFiles],
  );

  const handleRemove = useCallback(
    (fileId: string) => {
      setAddedFiles((prev) => prev.filter((id) => id !== fileId));
    },
    [],
  );

  const tokenPercent = Math.min(100, (usedTokens / MAX_TOKENS) * 100);
  const remaining = availableFiles.filter((f) => !addedFiles.includes(f.id));

  return (
    <div className="context-window" data-interactive>
      <div className="context-window__layout">
        {/* Left: Available files */}
        <div className="context-window__file-list">
          <div className="context-window__file-list-title">{t('项目文件', 'Project Files')}</div>
          {remaining.map((file) => (
            <button
              key={file.id}
              className="context-window__file-item"
              onClick={() => handleAdd(file.id)}
            >
              <span className="context-window__file-icon">{file.icon}</span>
              <span className="context-window__file-info">
                <span className="context-window__file-name">{file.name}</span>
                <span className="context-window__file-desc">{file.description}</span>
              </span>
              <span className="context-window__file-tokens">{file.tokens} tokens</span>
            </button>
          ))}
          {remaining.length === 0 && (
            <div className="context-window__empty-hint">{t('所有文件已添加', 'All files added')}</div>
          )}
        </div>

        {/* Right: Context viewport */}
        <div className="context-window__viewport">
          <div className="context-window__viewport-title">{t('AI 的视野', 'AI\'s Vision')}</div>
          {addedFiles.length === 0 ? (
            <div className="context-window__darkness">
              <div className="context-window__darkness-icon">👁️‍🗨️</div>
              <div className="context-window__darkness-text">
                {t(
                  <>一片黑暗……<br />AI 什么也看不到</>,
                  <>Total darkness...<br />The AI can't see anything</>
                )}
              </div>
              <div className="context-window__darkness-hint">{t('← 点击左侧文件加入上下文', '← Click files on the left to add to context')}</div>
            </div>
          ) : (
            <div className="context-window__files">
              {addedFiles.map((id) => {
                const file = availableFiles.find((f) => f.id === id)!;
                return (
                  <div key={id} className="context-window__added-file">
                    <span className="context-window__added-icon">{file.icon}</span>
                    <span className="context-window__added-name">{file.name}</span>
                    <span className="context-window__added-tokens">{file.tokens}t</span>
                    <button
                      className="context-window__remove-btn"
                      onClick={() => handleRemove(id)}
                      aria-label={t(`移除 ${file.name}`, `Remove ${file.name}`)}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Token counter */}
      <div className="context-window__counter">
        <div className="context-window__counter-label">
          {t(
            `Token 用量：${usedTokens.toLocaleString()} / ${MAX_TOKENS.toLocaleString()}`,
            `Token usage: ${usedTokens.toLocaleString()} / ${MAX_TOKENS.toLocaleString()}`
          )}
        </div>
        <div className="context-window__counter-bar">
          <div
            className={`context-window__counter-fill ${tokenPercent > 85 ? 'context-window__counter-fill--danger' : ''}`}
            style={{ width: `${tokenPercent}%` }}
          />
        </div>
      </div>

      {/* Warning */}
      {showWarning && (
        <div className="context-window__warning">
          {t(
            `⚠️ 上下文窗口已满！无法添加 ${warningFile}`,
            `⚠️ Context window is full! Cannot add ${warningFile}`
          )}
        </div>
      )}
    </div>
  );
}
