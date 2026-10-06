import React from 'react';

interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const colMap = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  6: 'grid-cols-6',
  12: 'grid-cols-12',
};

const gapMap = {
  none: 'gap-0',
  xs: 'gap-1.5',
  sm: 'gap-2.5',
  md: 'gap-4',
  lg: 'gap-6',
};

export const Grid: React.FC<GridProps> = ({
  children,
  cols = 2,
  gap = 'sm',
  className = '',
}) => {
  return (
    <div className={`grid ${colMap[cols]} ${gapMap[gap]} ${className}`}>
      {children}
    </div>
  );
};
