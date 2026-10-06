import React from 'react';

interface ScreenProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const Screen: React.FC<ScreenProps> = ({ children, className = '', id }) => {
  return (
    <section
      id={id}
      className={`w-full h-full flex flex-col min-h-0 overflow-hidden relative ${className}`}
    >
      {children}
    </section>
  );
};
