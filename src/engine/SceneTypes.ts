import type { ReactElement, ReactNode } from 'react';

export interface SceneProps {
  children: ReactNode;
  interactive?: boolean;
}

export type TransitionDirection = 'fade' | 'slide-left' | 'slide-right';

export interface SceneEngineProps {
  children: ReactNode;
}

export interface SceneNavigationState {
  currentIndex: number;
  totalScenes: number;
  direction: TransitionDirection;
  isInteractive: boolean;
  isCompleted: boolean;
  canAdvance: boolean;
}

export interface SceneNavigationActions {
  goNext: () => void;
  goPrev: () => void;
  goTo: (index: number) => void;
  markCompleted: () => void;
}

export function isSceneElement(child: unknown): child is ReactElement<SceneProps> {
  return (
    child !== null &&
    typeof child === 'object' &&
    'type' in (child as Record<string, unknown>) &&
    typeof (child as ReactElement).type === 'function' &&
    ((child as ReactElement).type as { displayName?: string }).displayName === 'Scene'
  );
}
