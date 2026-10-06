import { useEffect, useRef } from 'react';
import { haptics } from '@/platform';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  minDelta?: number;
  triggerHaptics?: boolean;
}

export function useSwipeGesture(handlers: SwipeHandlers, elementRef?: React.RefObject<HTMLElement | null>) {
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  useEffect(() => {
    const target = elementRef?.current || (typeof window !== 'undefined' ? window : null);
    if (!target) return;

    const minDelta = handlers.minDelta ?? 50;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      const duration = Date.now() - touchStartRef.current.time;

      touchStartRef.current = null;

      // Reject gestures that took longer than 600ms (not a swipe)
      if (duration > 600) return;

      if (absX > absY && absX > minDelta) {
        // Horizontal swipe
        if (deltaX < 0 && handlers.onSwipeLeft) {
          if (handlers.triggerHaptics !== false) {
            haptics.impact('light');
          }
          handlers.onSwipeLeft();
        } else if (deltaX > 0 && handlers.onSwipeRight) {
          if (handlers.triggerHaptics !== false) {
            haptics.impact('light');
          }
          handlers.onSwipeRight();
        }
      } else if (absY > absX && absY > minDelta) {
        // Vertical swipe
        if (deltaY > 0 && handlers.onSwipeDown) {
          if (handlers.triggerHaptics !== false) {
            haptics.impact('light');
          }
          handlers.onSwipeDown();
        } else if (deltaY < 0 && handlers.onSwipeUp) {
          if (handlers.triggerHaptics !== false) {
            haptics.impact('light');
          }
          handlers.onSwipeUp();
        }
      }
    };

    target.addEventListener('touchstart', handleTouchStart as EventListener, { passive: true });
    target.addEventListener('touchend', handleTouchEnd as EventListener, { passive: true });

    return () => {
      target.removeEventListener('touchstart', handleTouchStart as EventListener);
      target.removeEventListener('touchend', handleTouchEnd as EventListener);
    };
  }, [handlers, elementRef]);
}
