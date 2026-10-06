import React from 'react';
import { DEVELOPER_LINK, DEVELOPER_NAME, DEVELOPER_SIGNATURE } from '@/shared/author';
import { browser } from '@/platform/browser';

interface CraftsmanFooterProps {
  className?: string;
  showVersion?: boolean;
}

export const CraftsmanFooter: React.FC<CraftsmanFooterProps> = ({
  className = '',
  showVersion = false,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    browser.openUrl({ url: DEVELOPER_LINK });
  };

  return (
    <footer className={`text-center py-6 select-none ${className}`}>
      {showVersion && (
        <p className="text-2xs font-mono tracking-wider text-[var(--color-text-tertiary)] uppercase mb-2">
          Parichay · Offline vCard 3.0
        </p>
      )}
      <div className="inline-flex items-center justify-center min-h-[44px]">
        <p className="text-xs text-[var(--color-text-tertiary)] tracking-tight font-sans">
          Designed &amp; developed by{' '}
          <a
            href={DEVELOPER_LINK}
            target="_blank"
            rel="noopener noreferrer author"
            onClick={handleClick}
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors underline decoration-[var(--color-border-hairline)] underline-offset-4 font-medium focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-xs py-1 px-1 inline-block"
          >
            {DEVELOPER_NAME}
          </a>
        </p>
      </div>
    </footer>
  );
};
