import type { ReactNode } from 'react';

interface ChatBubbleProps {
  from: 'user' | 'ai';
  children: ReactNode;
}

export default function ChatBubble({ from, children }: ChatBubbleProps) {
  return (
    <div className={`chat-bubble chat-bubble--${from}`}>
      <div className="chat-bubble__avatar">
        {from === 'user' ? '👤' : '🤖'}
      </div>
      <div className="chat-bubble__content">
        {children}
      </div>
    </div>
  );
}
