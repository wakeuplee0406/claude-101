import { useState, useCallback, useEffect } from 'react';
import type { TransitionDirection } from './SceneTypes';

interface UseSceneNavigationOptions {
  totalScenes: number;
  isInteractive: boolean;
  isCompleted: boolean;
}

export function useSceneNavigation({
  totalScenes,
  isInteractive,
  isCompleted,
}: UseSceneNavigationOptions) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<TransitionDirection>('fade');
  const [visitedMax, setVisitedMax] = useState(0);

  const canAdvance = !isInteractive || isCompleted;

  const goNext = useCallback(() => {
    if (!canAdvance) return;
    setCurrentIndex((prev) => {
      if (prev >= totalScenes - 1) return prev;
      setDirection('slide-left');
      const next = prev + 1;
      setVisitedMax((vm) => Math.max(vm, next));
      return next;
    });
  }, [canAdvance, totalScenes]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev <= 0) return prev;
      setDirection('slide-right');
      return prev - 1;
    });
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= totalScenes) return;
      if (index > visitedMax) return; // can't skip ahead past unvisited
      setDirection(index > currentIndex ? 'slide-left' : 'slide-right');
      setCurrentIndex(index);
    },
    [totalScenes, visitedMax, currentIndex],
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  return {
    currentIndex,
    direction,
    canAdvance,
    visitedMax,
    goNext,
    goPrev,
    goTo,
  };
}
