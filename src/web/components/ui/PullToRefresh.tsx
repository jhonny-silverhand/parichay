import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
  disabled?: boolean;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  disabled = false,
}) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startYRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const threshold = 64;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || isRefreshing) return;
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      startYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startYRef.current === null || isRefreshing) return;
    const currentY = e.touches[0].clientY;
    const distance = currentY - startYRef.current;

    if (distance > 0 && containerRef.current && containerRef.current.scrollTop <= 0) {
      const damped = Math.min(threshold * 1.5, distance * 0.45);
      setPullDistance(damped);
    }
  };

  const handleTouchEnd = async () => {
    if (startYRef.current === null) return;
    startYRef.current = null;

    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(threshold);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-full flex flex-col min-h-0 overflow-y-auto -webkit-overflow-scrolling-touch overscroll-contain"
    >
      {/* Pull Indicator */}
      <div
        className="w-full flex items-center justify-center transition-all overflow-hidden shrink-0"
        style={{
          height: `${pullDistance}px`,
          opacity: Math.min(1, pullDistance / threshold),
        }}
      >
        <div className="flex items-center gap-2 text-2xs font-semibold text-[var(--color-text-secondary)] py-2">
          <RefreshCw
            className={`w-3.5 h-3.5 text-[var(--color-accent)] ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            style={{
              transform: isRefreshing ? undefined : `rotate(${pullDistance * 4}deg)`,
            }}
          />
          <span>{isRefreshing ? 'Refreshing...' : pullDistance >= threshold ? 'Release to refresh' : 'Pull down'}</span>
        </div>
      </div>
      {children}
    </div>
  );
};
