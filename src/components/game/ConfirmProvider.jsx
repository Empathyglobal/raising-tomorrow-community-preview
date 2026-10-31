import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLockBodyScroll } from '../utils/useLockBodyScroll';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [state, setState] = useState({
    open: false,
    title: '',
    description: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    destructive: false,
    resolve: null
  });

  const confirm = useCallback(
    ({ title, description, confirmText = 'Confirm', cancelText = 'Cancel', destructive = false }) => {
      return new Promise((resolve) => {
        setState({
          open: true,
          title,
          description,
          confirmText,
          cancelText,
          destructive,
          resolve
        });
      });
    },
    []
  );

  const handleConfirm = useCallback(() => {
    if (state.resolve) state.resolve(true);
    setState((prev) => ({ ...prev, open: false }));
  }, [state.resolve]);

  const handleCancel = useCallback(() => {
    if (state.resolve) state.resolve(false);
    setState((prev) => ({ ...prev, open: false }));
  }, [state.resolve]);

  useLockBodyScroll(state.open);

  console.log("[BOOT] ConfirmProvider mounted");

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      {/* Confirm Dialog */}
      <AnimatePresence>
        {state.open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[200000] pointer-events-auto"
              onClick={handleCancel}
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-[200001] flex items-center justify-center p-4 pointer-events-auto"
            >
              <div
                className="rt-modal-glass w-full max-w-md bg-gradient-to-br from-slate-50 to-amber-50 rounded-2xl shadow-2xl border border-amber-200 overflow-hidden pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="bg-white border-b border-slate-200 p-5">
                  {state.destructive && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-red-600">
                        Destructive Action
                      </div>
                    </div>
                  )}
                  <h2 className="text-lg font-semibold text-slate-800">
                    {state.title}
                  </h2>
                </div>

                {/* Body */}
                <div className="p-6">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                    {state.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="bg-white border-t border-slate-200 p-4 flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1 h-11"
                  >
                    {state.cancelText}
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    className={`flex-1 h-11 font-semibold ${
                      state.destructive
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white'
                    }`}
                  >
                    {state.confirmText}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within ConfirmProvider');
  }
  return context.confirm;
}