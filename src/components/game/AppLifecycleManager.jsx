import { useEffect } from 'react';

/**
 * ISSUE A FIX: Mobile app lifecycle handler
 * Prevents black screens and unresponsive UI after app switching.
 */
export function useAppLifecycleManager() {
  useEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;

    let isHidden = document.hidden;
    let isFocused = document.hasFocus();
    let resumeTimeout = null;

    const handleVisibilityChange = () => {
      const wasHidden = isHidden;
      isHidden = document.hidden;

      if (wasHidden && !isHidden) {
        // App became visible again
        console.log('[Lifecycle] App resumed (visibility)');
        scheduleResume();
      }
    };

    const handleFocus = () => {
      isFocused = true;
      console.log('[Lifecycle] Window focused');
      scheduleResume();
    };

    const handleBlur = () => {
      isFocused = false;
      console.log('[Lifecycle] Window blurred');
    };

    const handlePageShow = (event) => {
      // iOS Safari: page restored from bfcache (back/forward cache)
      if (event.persisted) {
        console.log('[Lifecycle] Page restored from bfcache');
        scheduleResume();
      }
    };

    const scheduleResume = () => {
      // Debounce rapid visibility toggles
      if (resumeTimeout) clearTimeout(resumeTimeout);
      
      resumeTimeout = setTimeout(() => {
        if (!document.hidden && document.hasFocus()) {
          performResume();
        }
      }, 100);
    };

    const performResume = () => {
      console.log('[Lifecycle] Performing resume actions');
      
      // Force a reflow to fix black screen issues
      try {
        const root = document.getElementById('root');
        if (root) {
          root.style.display = 'none';
          // Force reflow
          void root.offsetHeight;
          root.style.display = '';
        }
      } catch (e) {
        console.warn('[Lifecycle] Resume reflow failed:', e);
      }

      // Clear any stuck pointer-events-none overlays
      try {
        const overlays = document.querySelectorAll('[class*="backdrop"], [class*="overlay"]');
        overlays.forEach(el => {
          const computed = window.getComputedStyle(el);
          if (computed.display === 'none' || computed.visibility === 'hidden') {
            el.style.pointerEvents = 'none';
          }
        });
      } catch (e) {
        console.warn('[Lifecycle] Overlay cleanup failed:', e);
      }
    };

    // Listen to lifecycle events
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      if (resumeTimeout) clearTimeout(resumeTimeout);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);
}