import { useState } from 'react';
import { useSceneComplete } from '../../../engine/SceneContext';
import { useLanguage } from '../../../i18n/LanguageContext';

interface LoopStep {
  phase: 'think' | 'act' | 'observe';
  title: string;
  enTitle: string;
  content: string;
  enContent: string;
  tool?: string;
}

const loopStepsData: LoopStep[] = [
  {
    phase: 'think',
    title: '思考',
    enTitle: 'Think',
    content: '用户要我重构 calculateTotal 函数并加上测试。首先，我需要读取当前代码。',
    enContent: 'The user wants me to refactor the calculateTotal function and add tests. First, I need to read the current code.',
  },
  {
    phase: 'act',
    title: '行动',
    enTitle: 'Act',
    content: 'Read({ file_path: "src/utils.ts" })',
    enContent: 'Read({ file_path: "src/utils.ts" })',
    tool: 'Read',
  },
  {
    phase: 'observe',
    title: '观察',
    enTitle: 'Observe',
    content: '看到了 calculateTotal 函数——逻辑混乱，有重复代码，没有处理边界情况。',
    enContent: 'Found the calculateTotal function — messy logic, duplicated code, no edge case handling.',
  },
  {
    phase: 'think',
    title: '思考',
    enTitle: 'Think',
    content: '我来重构：提取公共逻辑，添加类型检查，处理空数组的情况。',
    enContent: 'I\'ll refactor: extract shared logic, add type checking, handle empty array cases.',
  },
  {
    phase: 'act',
    title: '行动',
    enTitle: 'Act',
    content: 'Edit({ file_path: "src/utils.ts",\n  old_string: "function calculateTotal...",\n  new_string: "function calculateTotal(items: Item[]): number {\n  if (!items.length) return 0;\n  return items.reduce((sum, item) => sum + item.price * item.qty, 0);\n}" })',
    enContent: 'Edit({ file_path: "src/utils.ts",\n  old_string: "function calculateTotal...",\n  new_string: "function calculateTotal(items: Item[]): number {\n  if (!items.length) return 0;\n  return items.reduce((sum, item) => sum + item.price * item.qty, 0);\n}" })',
    tool: 'Edit',
  },
  {
    phase: 'observe',
    title: '观察',
    enTitle: 'Observe',
    content: '✅ 重构完成。现在需要写测试来验证。',
    enContent: '✅ Refactoring complete. Now I need to write tests to verify.',
  },
  {
    phase: 'think',
    title: '思考',
    enTitle: 'Think',
    content: '为 calculateTotal 写单元测试：正常情况、空数组、单个元素。',
    enContent: 'Write unit tests for calculateTotal: normal case, empty array, single element.',
  },
  {
    phase: 'act',
    title: '行动',
    enTitle: 'Act',
    content: 'Write({ file_path: "src/utils.test.ts",\n  content: "describe(\'calculateTotal\', () => {\n  test(\'空数组返回0\', ...)\n  test(\'正常计算\', ...)\n  test(\'单个元素\', ...)\n})" })',
    enContent: 'Write({ file_path: "src/utils.test.ts",\n  content: "describe(\'calculateTotal\', () => {\n  test(\'empty array returns 0\', ...)\n  test(\'normal calculation\', ...)\n  test(\'single element\', ...)\n})" })',
    tool: 'Write',
  },
  {
    phase: 'observe',
    title: '观察',
    enTitle: 'Observe',
    content: '✅ 测试文件已创建。运行测试看看是否通过。',
    enContent: '✅ Test file created. Let\'s run the tests to see if they pass.',
  },
  {
    phase: 'think',
    title: '思考',
    enTitle: 'Think',
    content: '运行测试套件，确认重构没有破坏任何东西。',
    enContent: 'Run the test suite to confirm the refactoring didn\'t break anything.',
  },
  {
    phase: 'act',
    title: '行动',
    enTitle: 'Act',
    content: 'Bash({ command: "npm test -- --filter utils" })',
    enContent: 'Bash({ command: "npm test -- --filter utils" })',
    tool: 'Bash',
  },
  {
    phase: 'observe',
    title: '观察',
    enTitle: 'Observe',
    content: '✅ 3 个测试全部通过！重构完成，测试覆盖了关键路径。',
    enContent: '✅ All 3 tests passed! Refactoring complete, tests cover the critical paths.',
  },
  {
    phase: 'think',
    title: '思考',
    enTitle: 'Think',
    content: '任务完成：函数已重构，测试已编写且全部通过。可以向用户报告了。',
    enContent: 'Task complete: function refactored, tests written and all passing. Ready to report to the user.',
  },
];

export default function AgenticLoopViz() {
  const sceneComplete = useSceneComplete();
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  const phaseConfig = {
    think: { icon: '🧠', label: t('思考 Think', 'Think'), color: '#a78bfa' },
    act: { icon: '⚡', label: t('行动 Act', 'Act'), color: '#60a5fa' },
    observe: { icon: '👁️', label: t('观察 Observe', 'Observe'), color: '#34d399' },
  };

  const current = loopStepsData[currentStep];
  const config = phaseConfig[current.phase];
  const isLast = currentStep === loopStepsData.length - 1;

  // Count which iteration of the loop we're in (each iteration = think+act+observe)
  const loopIteration = Math.floor(currentStep / 3) + 1;
  const totalIterations = Math.ceil(loopStepsData.length / 3);

  const handleNext = () => {
    if (!isLast) {
      setCurrentStep((s) => s + 1);
    }
    if (currentStep >= loopStepsData.length - 2 && !hasCompleted) {
      setHasCompleted(true);
      if (sceneComplete) sceneComplete();
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
  };

  return (
    <div className="agentic-loop" data-interactive>
      {/* Loop diagram */}
      <div className="agentic-loop__diagram">
        {(['think', 'act', 'observe'] as const).map((phase) => {
          const pc = phaseConfig[phase];
          const isActive = current.phase === phase;
          return (
            <div
              key={phase}
              className={`agentic-loop__node ${isActive ? 'agentic-loop__node--active' : ''}`}
              style={{ borderColor: isActive ? pc.color : undefined }}
            >
              <span className="agentic-loop__node-icon">{pc.icon}</span>
              <span
                className="agentic-loop__node-label"
                style={{ color: isActive ? pc.color : undefined }}
              >
                {pc.label}
              </span>
            </div>
          );
        })}
        <div className="agentic-loop__arrows">
          <span className="agentic-loop__arrow">→</span>
          <span className="agentic-loop__arrow">→</span>
          <span className="agentic-loop__arrow agentic-loop__arrow--loop">↩</span>
        </div>
      </div>

      {/* Iteration counter */}
      <div className="agentic-loop__iteration">
        {t(
          `循环第 ${loopIteration} / ${totalIterations} 轮`,
          `Loop ${loopIteration} / ${totalIterations}`
        )}
      </div>

      {/* Current step detail */}
      <div
        className="agentic-loop__step"
        style={{ borderColor: config.color }}
      >
        <div className="agentic-loop__step-header">
          <span className="agentic-loop__step-icon">{config.icon}</span>
          <span className="agentic-loop__step-phase" style={{ color: config.color }}>
            {config.label}
          </span>
          {current.tool && (
            <span className="agentic-loop__step-tool">
              🔧 {current.tool}
            </span>
          )}
        </div>
        <pre className="agentic-loop__step-content">{t(current.content, current.enContent)}</pre>
      </div>

      {/* Timeline */}
      <div className="agentic-loop__timeline">
        {loopStepsData.map((step, i) => {
          const sc = phaseConfig[step.phase];
          return (
            <div
              key={i}
              className={`agentic-loop__timeline-dot ${i === currentStep ? 'agentic-loop__timeline-dot--current' : ''} ${i < currentStep ? 'agentic-loop__timeline-dot--done' : ''}`}
              style={{
                backgroundColor: i <= currentStep ? sc.color : undefined,
              }}
              title={`${sc.label}: ${t(step.title, step.enTitle)}`}
            />
          );
        })}
      </div>

      {/* Action */}
      <div className="agentic-loop__actions">
        {!isLast ? (
          <button className="agentic-loop__next-btn" onClick={handleNext}>
            {t('下一步 →', 'Next →')}
          </button>
        ) : (
          <div className="agentic-loop__complete">
            <div className="agentic-loop__complete-text">
              {t(
                `✅ 任务完成！经过 ${totalIterations} 轮循环，AI 完成了重构并通过了测试。`,
                `✅ Task complete! After ${totalIterations} loop iterations, the AI finished refactoring and passed all tests.`
              )}
            </div>
            <button className="agentic-loop__reset-btn" onClick={handleReset}>
              {t('↺ 重新观看', '↺ Replay')}
            </button>
          </div>
        )}
      </div>

      {/* Step counter */}
      <div className="agentic-loop__counter">
        {t(
          `步骤 ${currentStep + 1} / ${loopStepsData.length}`,
          `Step ${currentStep + 1} / ${loopStepsData.length}`
        )}
      </div>
    </div>
  );
}
