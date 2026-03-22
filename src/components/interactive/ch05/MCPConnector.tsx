import { useState } from 'react';
import { useSceneComplete } from '../../../engine/SceneContext';
import { useLanguage } from '../../../i18n/LanguageContext';

type Step = 'config' | 'connecting' | 'tools' | 'call';

const configJson = `{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_TOKEN": "ghp_xxxx..."
      }
    }
  }
}`;

export default function MCPConnector() {
  const sceneComplete = useSceneComplete();
  const { t } = useLanguage();
  const [step, setStep] = useState<Step>('config');
  const [connectingProgress, setConnectingProgress] = useState(0);

  const newTools = [
    { name: 'github_create_issue', desc: t('创建 GitHub Issue', 'Create GitHub Issue') },
    { name: 'github_list_prs', desc: t('列出 Pull Requests', 'List Pull Requests') },
    { name: 'github_get_file', desc: t('读取仓库文件', 'Read repository file') },
    { name: 'github_create_pr', desc: t('创建 Pull Request', 'Create Pull Request') },
  ];

  const toolCallExample = {
    tool: 'github_create_issue',
    input: t(
      '{ "repo": "my-app", "title": "Fix login bug", "body": "Token 过期未检查" }',
      '{ "repo": "my-app", "title": "Fix login bug", "body": "Token expiry not checked" }'
    ),
    output: '✓ Issue #42 created successfully',
  };

  const handleAdvance = () => {
    if (step === 'config') {
      setStep('connecting');
      let progress = 0;
      const timer = setInterval(() => {
        progress += 20;
        setConnectingProgress(progress);
        if (progress >= 100) {
          clearInterval(timer);
          setTimeout(() => setStep('tools'), 300);
        }
      }, 400);
    } else if (step === 'tools') {
      setStep('call');
      if (sceneComplete) {
        sceneComplete();
      }
    }
  };

  return (
    <div className="mcp-connector" data-interactive>
      <div className="mcp-connector__steps">
        {(['config', 'connecting', 'tools', 'call'] as Step[]).map((s, i) => (
          <div
            key={s}
            className={`mcp-connector__step-dot ${
              s === step ? 'mcp-connector__step-dot--active' : ''
            } ${
              ['config', 'connecting', 'tools', 'call'].indexOf(step) > i
                ? 'mcp-connector__step-dot--done'
                : ''
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {step === 'config' && (
        <div className="mcp-connector__panel">
          <div className="mcp-connector__panel-title">
            {t('Step 1: 编写配置文件', 'Step 1: Write the config file')}
          </div>
          <div className="mcp-connector__panel-desc">
            {t(
              <>在项目根目录创建 <code>.mcp.json</code>，声明要连接的 MCP 服务器：</>,
              <>Create <code>.mcp.json</code> in the project root to declare which MCP servers to connect:</>
            )}
          </div>
          <div className="mcp-connector__code">
            <div className="mcp-connector__code-header">
              <span className="mcp-connector__code-filename">.mcp.json</span>
            </div>
            <pre className="mcp-connector__code-body">{configJson}</pre>
          </div>
          <button className="mcp-connector__btn" onClick={handleAdvance}>
            {t('保存配置，开始连接 →', 'Save config and connect →')}
          </button>
        </div>
      )}

      {step === 'connecting' && (
        <div className="mcp-connector__panel">
          <div className="mcp-connector__panel-title">
            {t('Step 2: 连接 MCP 服务器', 'Step 2: Connect to MCP server')}
          </div>
          <div className="mcp-connector__terminal">
            <div className="mcp-connector__terminal-header">
              <span className="mcp-connector__terminal-dot" style={{ background: '#ff5f57' }} />
              <span className="mcp-connector__terminal-dot" style={{ background: '#febc2e' }} />
              <span className="mcp-connector__terminal-dot" style={{ background: '#28c840' }} />
            </div>
            <div className="mcp-connector__terminal-body">
              {connectingProgress >= 20 && <p style={{ color: '#6b7280' }}>$ npx @modelcontextprotocol/server-github</p>}
              {connectingProgress >= 40 && <p style={{ color: '#10b981' }}>Initializing GitHub MCP Server...</p>}
              {connectingProgress >= 60 && <p style={{ color: '#10b981' }}>Authenticating with GitHub API...</p>}
              {connectingProgress >= 80 && <p style={{ color: '#10b981' }}>Registering tools...</p>}
              {connectingProgress >= 100 && <p style={{ color: '#3b82f6', fontWeight: 600 }}>Connected! 4 new tools available.</p>}
            </div>
          </div>
          <div className="mcp-connector__progress">
            <div
              className="mcp-connector__progress-bar"
              style={{ width: `${connectingProgress}%` }}
            />
          </div>
        </div>
      )}

      {step === 'tools' && (
        <div className="mcp-connector__panel">
          <div className="mcp-connector__panel-title">
            {t('Step 3: 新工具已就绪', 'Step 3: New tools ready')}
          </div>
          <div className="mcp-connector__panel-desc">
            {t('你的工具箱多了 4 个新工具：', 'Your toolbox gained 4 new tools:')}
          </div>
          <div className="mcp-connector__tool-list">
            {newTools.map((tool) => (
              <div key={tool.name} className="mcp-connector__tool-item">
                <span className="mcp-connector__tool-name">{tool.name}</span>
                <span className="mcp-connector__tool-desc">{tool.desc}</span>
              </div>
            ))}
          </div>
          <button className="mcp-connector__btn" onClick={handleAdvance}>
            {t('试试调用一个工具 →', 'Try calling a tool →')}
          </button>
        </div>
      )}

      {step === 'call' && (
        <div className="mcp-connector__panel">
          <div className="mcp-connector__panel-title">
            {t('Step 4: 调用 MCP 工具', 'Step 4: Call an MCP tool')}
          </div>
          <div className="mcp-connector__call">
            <div className="mcp-connector__call-section">
              <div className="mcp-connector__call-label">Tool Call</div>
              <div className="mcp-connector__call-name">{toolCallExample.tool}</div>
              <pre className="mcp-connector__call-input">{toolCallExample.input}</pre>
            </div>
            <div className="mcp-connector__call-arrow">↓</div>
            <div className="mcp-connector__call-section mcp-connector__call-section--result">
              <div className="mcp-connector__call-label">Result</div>
              <div className="mcp-connector__call-output">{toolCallExample.output}</div>
            </div>
          </div>
          <div className="mcp-connector__done">
            {t(
              '从配置到调用——就这么简单。MCP 让 AI 无缝连接外部世界。',
              'From config to invocation — it\'s that simple. MCP lets AI seamlessly connect to the outside world.'
            )}
          </div>
        </div>
      )}
    </div>
  );
}
