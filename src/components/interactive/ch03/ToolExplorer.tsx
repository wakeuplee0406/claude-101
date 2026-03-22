import { useState } from 'react';
import { useSceneComplete } from '../../../engine/SceneContext';
import { useLanguage } from '../../../i18n/LanguageContext';

interface Tool {
  id: string;
  name: string;
  icon: string;
  description: string;
  purpose: string;
  exampleInput: string;
  exampleOutput: string;
}

export default function ToolExplorer() {
  const sceneComplete = useSceneComplete();
  const { t } = useLanguage();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [exploredTools, setExploredTools] = useState<Set<string>>(new Set());
  const [hasCompleted, setHasCompleted] = useState(false);

  const tools: Tool[] = [
    {
      id: 'read',
      name: 'Read',
      icon: '📖',
      description: t('读取文件内容', 'Read file contents'),
      purpose: t('让 AI 看到文件里写了什么', 'Let the AI see what\'s inside a file'),
      exampleInput: 'Read({ file_path: "src/auth.ts" })',
      exampleOutput: t(
        `export async function login(username, password) {\n  const token = getToken();\n  // TODO: check if token is expired\n  return token;\n}`,
        `export async function login(username, password) {\n  const token = getToken();\n  // TODO: check if token is expired\n  return token;\n}`
      ),
    },
    {
      id: 'write',
      name: 'Write',
      icon: '✏️',
      description: t('写入整个文件', 'Write an entire file'),
      purpose: t('创建新文件或完全重写文件', 'Create a new file or completely rewrite one'),
      exampleInput: 'Write({ file_path: "src/utils.ts",\n  content: "export function add..." })',
      exampleOutput: t('✅ 文件已写入: src/utils.ts (24 行)', '✅ File written: src/utils.ts (24 lines)'),
    },
    {
      id: 'edit',
      name: 'Edit',
      icon: '🔧',
      description: t('精确替换文件中的一部分', 'Precisely replace part of a file'),
      purpose: t('只修改需要改的地方，不动其他代码', 'Only change what needs changing, leave the rest intact'),
      exampleInput: 'Edit({ file_path: "src/auth.ts",\n  old_string: "// TODO: check",\n  new_string: "if (isExpired(token))..." })',
      exampleOutput: t('✅ 已替换 src/auth.ts 中的 1 处匹配', '✅ Replaced 1 match in src/auth.ts'),
    },
    {
      id: 'bash',
      name: 'Bash',
      icon: '💻',
      description: t('执行终端命令', 'Run terminal commands'),
      purpose: t('运行测试、安装依赖、执行脚本', 'Run tests, install dependencies, execute scripts'),
      exampleInput: 'Bash({ command: "npm test" })',
      exampleOutput: 'PASS src/auth.test.ts\n  ✓ login returns token (3ms)\n  ✓ login checks expiry (2ms)\n\nTests: 2 passed',
    },
    {
      id: 'glob',
      name: 'Glob',
      icon: '🔍',
      description: t('按文件名模式搜索', 'Search by file name pattern'),
      purpose: t('快速找到符合模式的文件路径', 'Quickly find file paths matching a pattern'),
      exampleInput: 'Glob({ pattern: "src/**/*.test.ts" })',
      exampleOutput: 'src/auth.test.ts\nsrc/db.test.ts\nsrc/utils.test.ts',
    },
    {
      id: 'grep',
      name: 'Grep',
      icon: '🔎',
      description: t('按内容搜索文件', 'Search files by content'),
      purpose: t('在代码中搜索关键词或正则', 'Search for keywords or regex in code'),
      exampleInput: 'Grep({ pattern: "isExpired",\n  glob: "**/*.ts" })',
      exampleOutput: 'src/auth.ts:42: if (isExpired(token))\nsrc/utils.ts:15: export function isExpired(',
    },
  ];

  const selected = tools.find((t) => t.id === selectedId);

  const handleSelect = (toolId: string) => {
    setSelectedId(toolId);

    const next = new Set(exploredTools);
    next.add(toolId);
    setExploredTools(next);

    if (next.size >= 3 && !hasCompleted) {
      setHasCompleted(true);
      if (sceneComplete) sceneComplete();
    }
  };

  return (
    <div className="tool-explorer" data-interactive>
      <div className="tool-explorer__grid">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className={`tool-explorer__card ${selectedId === tool.id ? 'tool-explorer__card--active' : ''} ${exploredTools.has(tool.id) ? 'tool-explorer__card--visited' : ''}`}
            onClick={() => handleSelect(tool.id)}
          >
            <span className="tool-explorer__card-icon">{tool.icon}</span>
            <span className="tool-explorer__card-name">{tool.name}</span>
            <span className="tool-explorer__card-desc">{tool.description}</span>
          </button>
        ))}
      </div>

      {selected ? (
        <div className="tool-explorer__detail">
          <div className="tool-explorer__detail-header">
            <span className="tool-explorer__detail-icon">{selected.icon}</span>
            <span className="tool-explorer__detail-name">{selected.name}</span>
            <span className="tool-explorer__detail-purpose">{selected.purpose}</span>
          </div>

          <div className="tool-explorer__flow">
            <div className="tool-explorer__flow-step">
              <div className="tool-explorer__flow-label">{t('调用', 'Call')}</div>
              <pre className="tool-explorer__flow-code">{selected.exampleInput}</pre>
            </div>

            <div className="tool-explorer__flow-arrow">→</div>

            <div className="tool-explorer__flow-step">
              <div className="tool-explorer__flow-label">{t('结果', 'Result')}</div>
              <pre className="tool-explorer__flow-code">{selected.exampleOutput}</pre>
            </div>
          </div>
        </div>
      ) : (
        <div className="tool-explorer__placeholder">
          {t('点击上方的工具卡片，了解每个工具的作用', 'Click a tool card above to learn what each tool does')}
        </div>
      )}

      <div className="tool-explorer__progress">
        {t(`已探索 ${exploredTools.size} / ${tools.length} 个工具`, `Explored ${exploredTools.size} / ${tools.length} tools`)}
      </div>
    </div>
  );
}
