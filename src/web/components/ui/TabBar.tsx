import React from 'react';
import { NavLink } from 'react-router-dom';
import { CreditCard, Sparkles, Settings as SettingsIcon, Shield, Radio, Cpu } from 'lucide-react';
import { haptics } from '@/platform';

export const TabBar: React.FC = () => {
  const tabs = [
    { to: '/', label: 'SOVEREIGN', station: '01', icon: CreditCard },
    { to: '/studio', label: 'ALCHEMY', station: '02', icon: Sparkles },
    { to: '/settings', label: 'VAULT', station: '03', icon: SettingsIcon },
  ];

  const handleTabClick = () => {
    haptics.impact('light');
  };

  return (
    <nav
      aria-label="Archipelago Navigation Bridge"
      className="fixed bottom-3 left-4 right-4 z-40 max-w-sm mx-auto liquid-glass-dock rounded-[28px] safe-bottom shadow-[0_20px_48px_-8px_rgba(0,0,0,0.35)] border border-white/70 dark:border-white/15 md:bottom-6 md:min-w-[370px] md:px-2 md:py-1"
    >
      <div className="flex items-center justify-around h-14 md:h-13 px-2 gap-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === '/'}
              onClick={handleTabClick}
              className={({ isActive }) =>
                `flex-1 relative flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-2xl transition-all duration-200 select-none touch-target ${
                  isActive
                    ? 'text-[var(--color-accent)] font-semibold shadow-xs'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] font-medium opacity-75 hover:opacity-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active Bioluminescent Archipelago Indicator Pill */}
                  {isActive && (
                    <div
                      aria-hidden="true"
                      className="absolute inset-1 rounded-2xl bg-white/75 dark:bg-white/14 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.9),0_4px_12px_rgba(0,0,0,0.08)] border border-white/70 dark:border-white/20 -z-10 animate-in fade-in zoom-in-95 duration-200"
                    />
                  )}
                  <div className="relative">
                    <Icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'scale-110 text-[var(--color-accent)]' : 'text-current'}`} />
                    {isActive && (
                      <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-ping" />
                    )}
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-wider">{tab.label}</span>
                  <span className="text-[7px] font-mono opacity-50 uppercase tracking-widest">{tab.station}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
