import { createContext, useContext } from 'react';

interface SceneContextValue {
  onComplete?: () => void;
}

export const SceneContext = createContext<SceneContextValue>({});

export function useSceneComplete() {
  return useContext(SceneContext).onComplete;
}
