import { lifecycle } from '@/platform';
import type { NavigateFunction } from 'react-router-dom';

let lastBackPressTime = 0;

export function setupNativeAppLifecycle(navigate: NavigateFunction, currentPathname: string) {
  return lifecycle.onBackButton(() => {
    // 1. Check if any modal sheet or dialog is open
    const openSheetCloseBtn = document.querySelector<HTMLButtonElement>('[data-sheet-close="true"]');
    if (openSheetCloseBtn) {
      openSheetCloseBtn.click();
      return;
    }

    // 2. If on subroute, navigate back in stack
    if (currentPathname !== '/' && currentPathname !== '/onboarding') {
      navigate(-1);
      return;
    }

    // 3. On root screen, confirm exit on double-tap back within 2 seconds
    const now = Date.now();
    if (now - lastBackPressTime < 2000) {
      lifecycle.exitApp();
    } else {
      lastBackPressTime = now;
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('parichay-toast', {
            detail: { message: 'Press back again to exit', type: 'info' },
          })
        );
      }
    }
  });
}
