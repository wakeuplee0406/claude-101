import { useState, useEffect } from 'react';
import { useSceneComplete } from '../../../engine/SceneContext';
import { useLanguage } from '../../../i18n/LanguageContext';

interface Question {
  id: string;
  question: string;
  options: { label: string; value: string }[];
}

interface GeneratedConfig {
  filename: string;
  content: string;
}

function generateConfigs(answers: Record<string, string>, lang: string): GeneratedConfig[] {
  const configs: GeneratedConfig[] = [];
  const isEn = lang === 'en';

  // CLAUDE.md
  const langMap: Record<string, string> = {
    typescript: 'TypeScript',
    python: 'Python',
    rust: 'Rust',
    go: 'Go',
  };
  const lintToolMap: Record<string, string> = {
    typescript: 'ESLint + Prettier',
    python: 'ruff',
    rust: 'clippy',
    go: 'golangci-lint',
  };
  const testCmdMap: Record<string, string> = {
    typescript: 'npm test',
    python: 'pytest',
    rust: 'cargo test',
    go: 'go test ./...',
  };
  const buildCmdMap: Record<string, string> = {
    typescript: 'npm run build',
    python: 'python -m build',
    rust: 'cargo build',
    go: 'go build ./...',
  };

  const langKey = answers.language || 'typescript';

  let claudeMd = isEn ? `# Project Standards\n\n` : `# 项目规范\n\n`;
  claudeMd += isEn ? `- Language: ${langMap[langKey]}\n` : `- 语言: ${langMap[langKey]}\n`;
  claudeMd += isEn ? `- Use strict mode\n` : `- 使用 strict 模式\n`;
  if (answers.lint === 'yes') {
    claudeMd += isEn
      ? `- Code must pass ${lintToolMap[langKey]} checks\n`
      : `- 代码必须通过 ${lintToolMap[langKey]} 检查\n`;
  }
  if (answers.testing === 'yes') {
    claudeMd += isEn
      ? `- All tests must pass before committing (${testCmdMap[langKey]})\n`
      : `- 提交前必须通过所有测试 (${testCmdMap[langKey]})\n`;
  }
  claudeMd += isEn ? `\n## Build Command\n\n` : `\n## 构建命令\n\n`;
  claudeMd += `\`\`\`bash\n${buildCmdMap[langKey]}\n\`\`\``;

  configs.push({ filename: 'CLAUDE.md', content: claudeMd });

  // settings.json
  const allowRules: string[] = [];
  const denyRules: string[] = ['Bash(rm -rf *)'];

  if (answers.bash === 'npm') {
    allowRules.push('Bash(npm *)');
    allowRules.push('Bash(npx *)');
  } else if (answers.bash === 'docker') {
    allowRules.push('Bash(npm *)');
    allowRules.push('Bash(npx *)');
    allowRules.push('Bash(docker *)');
  }

  if (answers.testing === 'yes') {
    allowRules.push(`Bash(${testCmdMap[langKey]})`);
  }

  const settings = {
    permissions: {
      allow: allowRules,
      deny: denyRules,
    },
  };

  configs.push({
    filename: '.claude/settings.json',
    content: JSON.stringify(settings, null, 2),
  });

  // hooks
  if (answers.lint === 'yes' || answers.testing === 'yes') {
    const lintCmdMap: Record<string, string> = {
      typescript: 'npx eslint --fix $FILE',
      python: 'ruff check --fix $FILE',
      rust: 'cargo clippy --fix',
      go: 'golangci-lint run',
    };

    const hooks: Record<string, unknown[]> = {};
    if (answers.lint === 'yes') {
      hooks.afterEdit = [
        {
          command: lintCmdMap[langKey],
          description: isEn ? 'Auto-lint after edit' : '编辑后自动 lint',
        },
      ];
    }
    if (answers.testing === 'yes') {
      hooks.beforeCommit = [
        {
          command: testCmdMap[langKey],
          description: isEn ? 'Run tests before commit' : '提交前运行测试',
        },
      ];
    }

    configs.push({
      filename: '.claude/hooks.json',
      content: JSON.stringify(hooks, null, 2),
    });
  }

  return configs;
}

export default function ConfigBuilder() {
  const sceneComplete = useSceneComplete();
  const { lang, t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [activeFile, setActiveFile] = useState(0);

  const questions: Question[] = [
    {
      id: 'language',
      question: t('你的项目用什么语言？', 'What language does your project use?'),
      options: [
        { label: 'TypeScript', value: 'typescript' },
        { label: 'Python', value: 'python' },
        { label: 'Rust', value: 'rust' },
        { label: 'Go', value: 'go' },
      ],
    },
    {
      id: 'lint',
      question: t('需要自动 lint 吗？', 'Do you need auto-linting?'),
      options: [
        { label: t('是的，每次编辑后自动 lint', 'Yes, auto-lint after every edit'), value: 'yes' },
        { label: t('不需要', 'No'), value: 'no' },
      ],
    },
    {
      id: 'bash',
      question: t('允许哪些 Bash 命令？', 'Which Bash commands should be allowed?'),
      options: [
        { label: t('只允许 npm/yarn 命令', 'Only npm/yarn commands'), value: 'npm' },
        { label: t('允许 npm + docker', 'Allow npm + docker'), value: 'docker' },
        { label: t('允许所有（谨慎！）', 'Allow all (caution!)'), value: 'all' },
      ],
    },
    {
      id: 'testing',
      question: t('提交前需要自动运行测试吗？', 'Auto-run tests before committing?'),
      options: [
        { label: t('是的，必须通过', 'Yes, must pass'), value: 'yes' },
        { label: t('不需要', 'No'), value: 'no' },
      ],
    },
  ];

  useEffect(() => {
    if (showResults && sceneComplete) {
      sceneComplete();
    }
  }, [showResults, sceneComplete]);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));

    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep((s) => s + 1), 300);
    } else {
      setTimeout(() => setShowResults(true), 300);
    }
  };

  const generatedConfigs = generateConfigs(answers, lang);

  if (showResults) {
    return (
      <div className="config-builder" data-interactive>
        <div className="config-builder__result-title">
          {t('你的配置文件已生成', 'Your config files have been generated')}
        </div>

        <div className="config-builder__tabs">
          {generatedConfigs.map((config, i) => (
            <button
              key={config.filename}
              className={`config-builder__tab ${i === activeFile ? 'config-builder__tab--active' : ''}`}
              onClick={() => setActiveFile(i)}
            >
              {config.filename}
            </button>
          ))}
        </div>

        <div className="config-builder__file">
          <div className="config-builder__file-header">
            {generatedConfigs[activeFile].filename}
          </div>
          <pre className="config-builder__file-content">
            {generatedConfigs[activeFile].content}
          </pre>
        </div>

        <div className="config-builder__summary">
          <p>{t(
            '这些配置文件共同定义了 Claude Code 在你的项目中的行为。',
            'These config files together define how Claude Code behaves in your project.'
          )}</p>
          <p>{t(
            '将它们放入项目根目录，即可生效。',
            'Place them in your project root directory to take effect.'
          )}</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];

  return (
    <div className="config-builder" data-interactive>
      <div className="config-builder__steps">
        {questions.map((q, i) => (
          <div
            key={q.id}
            className={`config-builder__step ${i === currentStep ? 'config-builder__step--current' : ''} ${i < currentStep ? 'config-builder__step--done' : ''}`}
          >
            <span className="config-builder__step-dot">
              {i < currentStep ? '✓' : i + 1}
            </span>
          </div>
        ))}
      </div>

      <div className="config-builder__question">
        {currentQuestion.question}
      </div>

      <div className="config-builder__options">
        {currentQuestion.options.map((option) => {
          const isSelected = answers[currentQuestion.id] === option.value;
          return (
            <button
              key={option.value}
              className={`config-builder__option ${isSelected ? 'config-builder__option--selected' : ''}`}
              onClick={() => handleAnswer(currentQuestion.id, option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {currentStep > 0 && (
        <div className="config-builder__choices">
          <div className="config-builder__choices-title">{t('已选择', 'Selected')}:</div>
          {questions.slice(0, currentStep).map((q) => (
            <div key={q.id} className="config-builder__choice">
              <span className="config-builder__choice-q">{q.question}</span>
              <span className="config-builder__choice-a">
                {q.options.find((o) => o.value === answers[q.id])?.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
