import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Parichay ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="fixed inset-0 w-full h-full flex flex-col items-center justify-center p-6 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] select-none">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)] shadow-xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-serif text-[var(--color-text-primary)]">
                Something didn't load right
              </h1>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1 leading-relaxed">
                Parichay kept your offline card data safe. Tap below to refresh the interface.
              </p>
            </div>

            {this.state.error && (
              <pre className="p-3 rounded-xl bg-[var(--color-bg-surface-sunken)] border border-[var(--color-border-hairline)] text-[10px] text-left overflow-x-auto text-[var(--color-text-tertiary)] font-mono max-h-24">
                {this.state.error.message}
              </pre>
            )}

            <div className="space-y-2 pt-2">
              <Button
                variant="primary"
                onClick={this.handleReset}
                icon={<RotateCcw className="w-4 h-4" />}
                className="w-full"
              >
                Reload App
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                }}
                className="w-full"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
