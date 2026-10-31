import { useEffect } from 'react';

/**
 * ISSUE B FIX: Global scroll restoration safety net
 * Ensures body scroll is NEVER stuck in overflow:hidden
 */
export function useGlobalScrollRestoration() {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Watchdog: restore scroll every 2 seconds if stuck
    const watchdog = setInterval(() => {
      const modalCount = document.querySelectorAll('[role="dialog"][data-state="open"]').length;
      const backdropCount = document.querySelectorAll('[class*="backdrop"][style*="opacity"]').length;
      
      // If no modals are visible, ensure scroll is enabled
      if (modalCount === 0 && backdropCount === 0) {
        if (document.body.style.overflow === 'hidden') {
          console.warn('[ScrollWatchdog] Force-restoring scroll (no modals visible)');
          document.body.style.overflow = '';
        }
        if (document.documentElement.style.overflow === 'hidden') {
          document.documentElement.style.overflow = '';
        }
      }
    }, 2000);

    // Emergency restore on unload
    const handleBeforeUnload = () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(watchdog);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Final cleanup
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);
}