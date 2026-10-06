import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { CardProvider, useCard } from './CardContext';
import { ToastProvider } from '@/web/components/ui/Toast';
import { TabBar } from '@/web/components/ui/TabBar';
import { NetworkBanner } from '@/web/components/ui/NetworkBanner';
import { AppShell } from '@/web/components/layout/AppShell';
import { NativeStatusBar } from '@/native/status-bar';
import { setupNativeAppLifecycle } from '@/native/app-lifecycle';
import { useSwipeGesture } from '@/web/lib/useSwipeGesture';
import { splash } from '@/platform';

import { CardHomeScreen } from '@/web/features/card/CardHomeScreen';
import { OnboardingScreen } from '@/web/features/onboarding/OnboardingScreen';
import { CardEditorScreen } from '@/web/features/editor/CardEditorScreen';
import { QRFullscreenScreen } from '@/web/features/qr/QRFullscreenScreen';
import { StyleStudioScreen } from '@/web/features/style-studio/StyleStudioScreen';
import { ShareScreen } from '@/web/features/share/ShareScreen';
import { WalletGuideScreen } from '@/web/features/wallet/WalletGuideScreen';
import { WallpaperScreen } from '@/web/features/wallpaper/WallpaperScreen';
import { SettingsScreen } from '@/web/features/settings/SettingsScreen';
import { StyleguideScreen } from '@/web/features/dev/StyleguideScreen';
import { LayoutLabScreen } from '@/web/features/dev/LayoutLabScreen';
import { ShowcaseScreen } from '@/web/features/showcase/ShowcaseScreen';
import { HelpScreen } from '@/web/features/help/HelpScreen';

// Guard for Home Screen
const HomeRoute: React.FC = () => {
  const { card, isLoading, isInitialized } = useCard();

  if (isLoading || !isInitialized) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--color-accent)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!card) {
    return <Navigate to="/onboarding" replace />;
  }

  return <CardHomeScreen />;
};

// Layout shell managing tab bar visibility, native status bar, and swipe gestures
const MainNavigationShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useCard();

  // Hide native splash screen when app initializes
  useEffect(() => {
    splash.hide();
  }, []);

  // Update native status bar when route or theme changes
  useEffect(() => {
    const isFullscreen = location.pathname === '/qr/fullscreen';
    const effectiveTheme =
      settings.theme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : settings.theme;

    NativeStatusBar.setStyle(effectiveTheme as 'light' | 'dark', isFullscreen);
  }, [location.pathname, settings.theme]);

  // Handle hardware back button on Android
  useEffect(() => {
    return setupNativeAppLifecycle(navigate, location.pathname);
  }, [navigate, location.pathname]);

  // Tab bar visible only on main owner screens
  const isTabBarVisible = ['/', '/studio', '/settings'].includes(location.pathname);

  // Swipe navigation between primary tabs
  useSwipeGesture({
    onSwipeLeft: () => {
      if (location.pathname === '/') {
        navigate('/studio');
      } else if (location.pathname === '/studio') {
        navigate('/settings');
      }
    },
    onSwipeRight: () => {
      if (location.pathname === '/settings') {
        navigate('/studio');
      } else if (location.pathname === '/studio') {
        navigate('/');
      } else if (!isTabBarVisible && location.pathname !== '/onboarding') {
        // Edge swipe-back for subpages
        navigate(-1);
      }
    },
    triggerHaptics: true,
  });

  return (
    <AppShell
      header={<NetworkBanner />}
      bottomBar={isTabBarVisible ? <TabBar /> : undefined}
    >
      <main className="flex-1 w-full max-w-md md:max-w-xl lg:max-w-3xl mx-auto min-h-0 overflow-y-auto app-scroll-view transition-all">
        {children}
      </main>
    </AppShell>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <CardProvider>
        <BrowserRouter>
          <MainNavigationShell>
            <Routes>
              <Route path="/" element={<HomeRoute />} />
              <Route path="/onboarding" element={<OnboardingScreen />} />
              <Route path="/editor" element={<CardEditorScreen />} />
              <Route path="/qr/fullscreen" element={<QRFullscreenScreen />} />
              <Route path="/studio" element={<StyleStudioScreen />} />
              <Route path="/share" element={<ShareScreen />} />
              <Route path="/wallet" element={<WalletGuideScreen />} />
              <Route path="/wallpaper" element={<WallpaperScreen />} />
              <Route path="/settings" element={<SettingsScreen />} />
              <Route path="/showcase" element={<ShowcaseScreen />} />
              <Route path="/index-help" element={<HelpScreen />} />
              <Route path="/dev/styleguide" element={<StyleguideScreen />} />
              <Route path="/dev/layout-lab" element={<LayoutLabScreen />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </MainNavigationShell>
        </BrowserRouter>
      </CardProvider>
    </ToastProvider>
  );
};
