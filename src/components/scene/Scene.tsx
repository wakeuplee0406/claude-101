import type { ReactNode } from 'react';
import { SceneContext } from '../../engine/SceneContext';

interface SceneProps {
  children: ReactNode;
  interactive?: boolean;
  onComplete?: () => void;
}

function Scene({ children, onComplete }: SceneProps) {
  return (
    <SceneContext.Provider value={{ onComplete }}>
      <div className="scene">{children}</div>
    </SceneContext.Provider>
  );
}

Scene.displayName = 'Scene';

export default Scene;
