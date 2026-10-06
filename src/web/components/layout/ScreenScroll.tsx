import React, { forwardRef } from 'react';

interface ScreenScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hasBottomNav?: boolean;
}

export const ScreenScroll = forwardRef<HTMLDivElement, ScreenScrollProps>(
  ({ children, className = '', hasBottomNav = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`app-scroll-view w-full ${
          hasBottomNav ? 'safe-pad-bottom-nav' : 'safe-pad-bottom'
        } ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ScreenScroll.displayName = 'ScreenScroll';
