import type { ReactNode } from 'react';

interface NarrationProps {
  children: ReactNode;
}

export default function Narration({ children }: NarrationProps) {
  return (
    <div className="narration">
      {children}
    </div>
  );
}
