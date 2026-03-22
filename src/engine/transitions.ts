import type { TransitionDirection } from './SceneTypes';

export function getTransitionVariants(direction: TransitionDirection) {
  switch (direction) {
    case 'slide-left':
      return {
        initial: { x: 80, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: -80, opacity: 0 },
      };
    case 'slide-right':
      return {
        initial: { x: -80, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: 80, opacity: 0 },
      };
    case 'fade':
    default:
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };
  }
}

export const transitionConfig = {
  duration: 0.3,
  ease: [0.25, 0.1, 0.25, 1] as const,
};
