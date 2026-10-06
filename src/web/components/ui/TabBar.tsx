import React from 'react';
import { NavLink } from 'react-router-dom';
import { CreditCard, Sparkles, Settings as SettingsIcon } from 'lucide-react';
import { haptics } from '@/platform';

export const TabBar: React.FC = () => {
  const tabs = [
    { to: '/', label: 'Card', icon: CreditCard },
    { to: '/studio', label: 'Studio', icon: Sparkles },
    { to: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  const handleTabClick = () => {
    haptics.impact('light');
  };

  return (
    <nav
      aria-label="Navigation"
      className="fixed bottom-4 left-4 right-4 z-40 max-w-xs mx-auto liquid-glass-dock rounded-full safe-bottom shadow-[0_12px_32px_-6px_rgba(0,0,0,0.18)] border border-white/60 dark:border-white/10 md:bottom-6"
    >
      <div className="flex items-center justify-around h-13 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === '/'}
              onClick={handleTabClick}
              className={({ isActive }) =>
                `flex-1 relative flex flex-col items-center justify-center gap-1 py-1.5 px-3 rounded-full transition-all duration-200 select-none touch-target ${
                  isActive
                    ? 'text-[var(--color-accent)] font-semibold'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] font-normal opacity-70 hover:opacity-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-2 inset-y-1 rounded-full bg-black/5 dark:bg-white/10 -z-10 animate-in fade-in duration-150"
                    />
                  )}
                  <Icon className={`w-4 h-4 transition-transform duration-150 ${isActive ? 'scale-105' : ''}`} />
                  <span className="text-[11px] tracking-tight">{tab.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
