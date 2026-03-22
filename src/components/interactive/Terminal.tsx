import { useState, useEffect, useRef } from 'react';

interface TerminalLine {
  type: 'input' | 'output' | 'info';
  text: string;
  delay?: number;
}

interface Props {
  lines: TerminalLine[];
  title?: string;
  autoPlay?: boolean;
  typingSpeed?: number;
}

export default function Terminal({
  lines,
  title = 'Terminal',
  autoPlay = true,
  typingSpeed = 30,
}: Props) {
  const [visibleLines, setVisibleLines] = useState<{ type: string; text: string }[]>([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autoPlay || currentLineIdx >= lines.length) return;

    const line = lines[currentLineIdx];
    const delay = line.delay ?? 0;

    if (!isTyping) {
      const timeout = setTimeout(() => {
        if (line.type === 'input') {
          setIsTyping(true);
          setCurrentChar(0);
        } else {
          setVisibleLines((prev) => [...prev, { type: line.type, text: line.text }]);
          setCurrentLineIdx((i) => i + 1);
        }
      }, delay);
      return () => clearTimeout(timeout);
    }

    if (isTyping && line.type === 'input') {
      if (currentChar < line.text.length) {
        const timeout = setTimeout(() => {
          setCurrentChar((c) => c + 1);
        }, typingSpeed);
        return () => clearTimeout(timeout);
      } else {
        setVisibleLines((prev) => [...prev, { type: 'input', text: line.text }]);
        setIsTyping(false);
        setCurrentLineIdx((i) => i + 1);
      }
    }
  }, [autoPlay, currentLineIdx, currentChar, isTyping, lines, typingSpeed]);

  useEffect(() => {
    containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
  }, [visibleLines, currentChar]);

  const currentLine = isTyping ? lines[currentLineIdx] : null;

  return (
    <div className="terminal">
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
        </div>
        <span className="terminal-title">{title}</span>
      </div>
      <div className="terminal-body" ref={containerRef}>
        {visibleLines.map((line, i) => (
          <div key={i} className={`terminal-line ${line.type}`}>
            {line.type === 'input' && <span className="prompt">$ </span>}
            {line.text}
          </div>
        ))}
        {currentLine && (
          <div className="terminal-line input">
            <span className="prompt">$ </span>
            {currentLine.text.slice(0, currentChar)}
            <span className="cursor">▊</span>
          </div>
        )}
      </div>
    </div>
  );
}
