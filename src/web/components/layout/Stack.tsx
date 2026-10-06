import React from 'react';

interface StackProps {
  children: React.ReactNode;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between';
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
  stretch: 'items-stretch',
};

const justifyMap = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
};

export const Stack: React.FC<StackProps> = ({
  children,
  gap = 'md',
  align = 'stretch',
  justify = 'start',
  className = '',
  as: Component = 'div',
}) => {
  return (
    <Component
      className={`flex flex-col ${gapMap[gap]} ${alignMap[align]} ${justifyMap[justify]} ${className}`}
    >
      {children}
    </Component>
  );
};
