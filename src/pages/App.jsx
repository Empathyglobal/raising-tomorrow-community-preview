import React, { useEffect } from "react";
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/sonner"
import { motion } from "framer-motion";
import { audioManager } from "@/components/game/AudioManager";
import ErrorBoundary from "@/components/lib/ErrorBoundary";
import { Button } from "@/components/ui/button";

const LEGAL_ACK_KEY = "rt_legal_ack_v1";

const LEGAL_MODAL_TEXT = {
  title: "Legal & Safety",
  sections: [
    {
      h: "Fiction & Simulation",
      p: "Raising Tomorrow is a work of fiction and simulation for entertainment."
    },
    {
      h: "User Content Responsibility",
      p: "Do not enter private information (addresses, phone numbers, IDs, real sensitive data about real people)."
    },
    {
      h: "Not Professional Advice",
      p: "This game provides no medical, mental health, legal, or financial advice."
    }
  ]
};

function App() {
  const [showLegalOnBoot, setShowLegalOnBoot] = React.useState(false);
  const [fatalError, setFatalError] = React.useState(null);

  // Last crash indicator (debug helper)
  const [showLastCrash, setShowLastCrash] = React.useState(false);
  const lastCrash = React.useMemo(() => {
    try {
      const raw = localStorage.getItem('rt_lastFatal');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  React.useEffect(() => {
    try {
      const ack = localStorage.getItem(LEGAL_ACK_KEY) === "1";
      if (!ack) setShowLegalOnBoot(true);
    } catch {}
  }, []);

  // Global error handler to prevent gray screen crashes
  React.useEffect(() => {
    const handleError = (event) => {
      console.error('[GlobalError]', event.error || event);
      const errorData = {
        message: event.error?.message || event.message || 'Unknown error',
        stack: event.error?.stack || null,
        ts: Date.now()
      };
      
      // Persist to localStorage for debugging
      try {
        localStorage.setItem('rt_lastFatal', JSON.stringify(errorData));
      } catch {}
      
      setFatalError(errorData);
      event.preventDefault();
    };

    const handleRejection = (event) => {
      console.error('[UnhandledRejection]', event.reason);
      const errorData = {
        message: String(event.reason?.message || event.reason || 'Unhandled rejection'),
        stack: event.reason?.stack || null,
        ts: Date.now()
      };
      
      // Persist to localStorage for debugging
      try {
        localStorage.setItem('rt_lastFatal', JSON.stringify(errorData));
      } catch {}
      
      setFatalError(errorData);
      event.preventDefault();
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  const handleBootLegalAck = () => {
    try { localStorage.setItem(LEGAL_ACK_KEY, "1"); } catch {}
    setShowLegalOnBoot(false);
  };

  useEffect(() => {
    const unlockAudio = () => {
      audioManager.audioUnlockOnce();
    };

    window.addEventListener("pointerdown", unlockAudio, { once: true, passive: true });
    window.addEventListener("touchstart", unlockAudio, { once: true, passive: true });
    window.addEventListener("keydown", unlockAudio, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, []);

  // Fatal error overlay
  if (fatalError) {
    return (
      <div className="fixed inset-0 bg-slate-900 z-[200] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
          <h3 className="text-xl font-bold text-rose-600 mb-3">⚠️ Crash Captured</h3>
          <p className="text-sm text-slate-700 mb-4">
            Something went wrong, but we caught it before Base44 went gray.
          </p>
          <div className="bg-slate-100 rounded-lg p-3 mb-4 text-xs font-mono text-slate-800 max-h-32 overflow-y-auto">
            {fatalError.message}
          </div>
          <div className="flex gap-2 mb-3">
            <Button
              onClick={() => window.location.reload()}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
            >
              Reload App
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                try {
                  navigator.clipboard.writeText(
                    `Error: ${fatalError.message}\n\nStack:\n${fatalError.stack || 'N/A'}`
                  );
                  alert('Error copied to clipboard');
                } catch {}
              }}
            >
              Copy
            </Button>
          </div>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm('Clear all saves and reload? This cannot be undone.')) {
                try {
                  localStorage.clear();
                  window.location.reload();
                } catch {}
              }
            }}
            className="w-full"
          >
            Clear Save & Reload
          </Button>
        </div>
      </div>
    );
  }

  // Hooks moved to top

  return (
    <ErrorBoundary>
      <Pages />
      <Toaster position="top-center" expand={false} richColors closeButton />

      {/* Last crash debug button */}
      {lastCrash && !showLastCrash && (
        <button
          onClick={() => setShowLastCrash(true)}
          className="fixed bottom-20 right-4 z-[100] w-10 h-10 rounded-full bg-rose-500 text-white shadow-lg hover:bg-rose-600 transition-colors flex items-center justify-center text-lg"
        >
          🐞
        </button>
      )}

      {/* Last crash details modal */}
      {showLastCrash && lastCrash && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[150]" onClick={() => setShowLastCrash(false)} />
          <div className="fixed inset-0 z-[151] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
              <h3 className="text-lg font-bold text-rose-600 mb-3">🐞 Last Crash</h3>
              <div className="bg-slate-100 rounded-lg p-3 mb-4 text-xs font-mono text-slate-800 max-h-48 overflow-y-auto">
                {lastCrash.message}
                {lastCrash.stack && (
                  <div className="mt-2 pt-2 border-t border-slate-300 text-[10px] text-slate-600">
                    {lastCrash.stack}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    try {
                      localStorage.removeItem('rt_lastFatal');
                      setShowLastCrash(false);
                    } catch {}
                  }}
                  className="flex-1"
                >
                  Clear
                </Button>
                <Button
                  onClick={() => {
                    try {
                      navigator.clipboard.writeText(
                        `Error: ${lastCrash.message}\n\nStack:\n${lastCrash.stack || 'N/A'}`
                      );
                      alert('Crash details copied');
                    } catch {}
                  }}
                  className="flex-1"
                >
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* First-run Legal Acknowledgment */}
      {showLegalOnBoot && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[150]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[151] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">{LEGAL_MODAL_TEXT.title}</h3>
              
              <div className="space-y-3 mb-6">
                {LEGAL_MODAL_TEXT.sections.map((sec, idx) => (
                  <div key={idx}>
                    <h4 className="font-semibold text-slate-800 text-sm mb-1">{sec.h}</h4>
                    <p className="text-sm text-slate-700">{sec.p}</p>
                  </div>
                ))}
              </div>

              <div className="text-xs text-slate-600 mb-6 p-3 bg-slate-50 rounded-lg">
                Please review the full Legal & Safety terms in Settings after starting.
              </div>

              <button
                onClick={handleBootLegalAck}
                className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
              >
                I Understand & Continue
              </button>
            </div>
          </motion.div>
        </>
      )}
    </ErrorBoundary>
  )
}

export default App