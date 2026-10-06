import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'info';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({
  toast: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-20 left-0 right-0 z-50 pointer-events-none flex flex-col items-center gap-2 px-4"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto max-w-sm w-full py-2.5 px-4 rounded-xl shadow-[var(--elevation-floating)] bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-hairline)] text-[var(--color-text-primary)] text-sm flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[var(--color-status-success)] shrink-0" />}
            {t.type === 'warning' && <AlertCircle className="w-4 h-4 text-[var(--color-status-warning)] shrink-0" />}
            {t.type === 'info' && <Info className="w-4 h-4 text-[var(--color-accent)] shrink-0" />}
            <span className="flex-1 font-medium">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
