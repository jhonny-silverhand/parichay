import React from 'react';

interface FillContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
  center?: boolean;
}

const maxMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full',
};

/**
 * Fit-to-container primitive supporting responsive widths and container queries.
 * On phones it occupies 100% width; on tablets/desktop it centers cleanly.
 */
export const FillContainer: React.FC<FillContainerProps> = ({
  children,
  maxWidth = 'md',
  className = '',
  center = true,
}) => {
  return (
    <div
      className={`w-full ${maxMap[maxWidth]} ${
        center ? 'mx-auto' : ''
      } px-4 sm:px-6 @container ${className}`}
    >
      {children}
    </div>
  );
};
