import React from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import { GameStateProvider } from '@/components/game/GameStateContext';
import { TutorialProvider } from '@/components/tutorial/TutorialContext';
import { ConfirmProvider } from '@/components/game/ConfirmProvider';
import TutorialOverlay from '@/components/tutorial/TutorialOverlay';
import RemoteMultiplayerSync from '@/components/multiplayer/RemoteMultiplayerSync';
import MilestonesAssignModal from '@/components/game/MilestonesAssignModal';
import MilestonesResultModal from '@/components/game/MilestonesResultModal';
import SchoolConfidenceAnxietyV2Modal from '@/components/game/SchoolConfidenceAnxietyV2Modal';
import ChapterScreenManager from '@/components/game/ChapterScreenManager.jsx';
import PostRunRewardsFlow from '@/components/game/PostRunRewardsFlow.jsx';

import { isBrowser } from '@/components/lib/isBrowser';
import { safeSetDomTheme } from '@/components/lib/uiTheme';
import { useAppLifecycleManager } from '@/components/game/AppLifecycleManager';
import { useGlobalScrollRestoration } from '@/components/game/GlobalScrollRestoration';


export default function Layout({ children }) {
  // Enforce opaque surfaces for popups (no glassmorphism)
  const opaqueStyles = `
    html[data-rt-popup-style="opaque"]:not([data-ui-theme="storybook"]) .rt-modal-glass,
    html[data-rt-popup-style="opaque"]:not([data-ui-theme="storybook"]) .rt-modal-surface,
    html[data-rt-popup-style="opaque"]:not([data-ui-theme="storybook"]) .rt-modal-sheet {
      background-color: hsl(var(--background)) !important;
      background-image: none !important;
      border-color: hsl(var(--border)) !important;
      opacity: 1 !important;
    }
    
    html[data-rt-popup-style="opaque"]:not([data-ui-theme="storybook"]) .bg-white\\/95,
    html[data-rt-popup-style="opaque"]:not([data-ui-theme="storybook"]) .bg-white\\/90,
    html[data-rt-popup-style="opaque"]:not([data-ui-theme="storybook"]) .bg-white\\/80,
    html[data-rt-popup-style="opaque"]:not([data-ui-theme="storybook"]) .bg-white\\/60 {
      background-color: hsl(var(--card)) !important;
      backdrop-filter: none !important;
    }
  `;
  // ISSUE A FIX: Mobile app lifecycle (prevents black screen on resume)
  useAppLifecycleManager();
  
  // ISSUE B FIX: Global scroll restoration (prevents stuck scroll)
  useGlobalScrollRestoration();

  React.useEffect(() => {
    if (!isBrowser) return;
    try {
      window.__rt_lastError = null;
      const onError = (e) => {
        window.__rt_lastError = {
          type: 'error',
          message: e?.message || 'Unknown error',
          source: e?.filename || null,
          lineno: e?.lineno || null,
          colno: e?.colno || null,
          stack: e?.error?.stack || null,
          ts: Date.now(),
        };
      };
      const onRej = (e) => {
        const reason = e?.reason;
        window.__rt_lastError = {
          type: 'unhandledrejection',
          message: String(reason?.message || reason || 'Unhandled rejection'),
          stack: reason?.stack || null,
          ts: Date.now(),
        };
      };
      window.addEventListener('error', onError);
      window.addEventListener('unhandledrejection', onRej);
      return () => {
        window.removeEventListener('error', onError);
        window.removeEventListener('unhandledrejection', onRej);
      };
    } catch {}
  }, []);

  React.useEffect(() => {
    if (!isBrowser) return;
    try {
      const saved = localStorage.getItem('rt_ui_theme');
      const theme = saved === 'storybook' ? 'storybook' : 'classic';
      safeSetDomTheme(theme);
      if (!saved) {
        try { localStorage.setItem('rt_ui_theme', theme); } catch {}
      }
    } catch {}
  }, []);

  return (
    <ErrorBoundary>
      <style>{opaqueStyles}</style>
      <GameStateProvider>
        <RemoteMultiplayerSync />
        <TutorialProvider>
          <ConfirmProvider>
            {children}
            <MilestonesAssignModal />
            <MilestonesResultModal />
            <SchoolConfidenceAnxietyV2Modal />
            <ChapterScreenManager />
            <PostRunRewardsFlow />
            <TutorialOverlay />

          </ConfirmProvider>
        </TutorialProvider>
      </GameStateProvider>
    </ErrorBoundary>
  );
}