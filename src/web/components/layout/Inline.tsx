import React from 'react';

interface InlineProps {
  children: React.ReactNode;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
  className?: string;
  as?: React.ElementType;
}

const gapMap = {
  none: 'gap-0',
  xs: 'gap-1.5',
  sm: 'gap-2.5',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

const alignMap = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  baseline: 'items-baseline',
};

const justifyMap = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
};

export const Inline: React.FC<InlineProps> = ({
  children,
  gap = 'sm',
  align = 'center',
  justify = 'start',
  wrap = false,
  className = '',
  as: Component = 'div',
}) => {
  return (
    <Component
      className={`flex flex-row ${wrap ? 'flex-wrap' : 'flex-nowrap'} ${gapMap[gap]} ${alignMap[align]} ${justifyMap[justify]} ${className}`}
    >
      {children}
    </Component>
  );
};
