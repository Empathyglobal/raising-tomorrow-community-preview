import React from 'react';
import { createPortal } from 'react-dom';
import { installModalDismissal } from '@/components/utils/modalDismissal';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useLockBodyScroll } from '../../components/utils/useLockBodyScroll';
import SafeStorybookImage from '@/components/storybook/SafeStorybookImage';
import { getMomentHeaderFilename } from '@/components/storybook/imageMap';
import { isStorybookPopupModeFromDom } from "@/components/lib/uiTheme";

export default function GameModalShell({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'max-w-[420px] sm:max-w-md md:max-w-xl',
  closeOnBackdrop = true,
  headerRight = null,
  resultStrip = null,
  illustration = false,
  illustrationSrc = null,
  illustrationAlt = '',
  illustrationHeight = 140,
  headerImageKey = null, // optional storybook header image key (e.g., 'bedtime')
  className = '',
  bodyClassName = '',
  bodyStyle = null,
  viewportModal = false
}) {
  useLockBodyScroll(open);

  const modalRef = React.useRef(null);
  const sessionRef = React.useRef(null);
  const closeRef = React.useRef(onClose);
  const controllerRef = React.useRef(null);
  const titleId = React.useId();
  closeRef.current = onClose;
  const closable = typeof onClose === 'function';
  React.useEffect(() => {
    if (!viewportModal || !open || !closable || !modalRef.current) return;
    const controller = installModalDismissal({
      session: sessionRef, win: window, doc: document, root: modalRef.current,
      onClose: () => closeRef.current?.()
    });
    controllerRef.current = controller;
    return () => {
      controllerRef.current = null;
      controller.cleanup();
    };
  }, [viewportModal, open, closable]);
  const dismiss = viewportModal
    ? () => controllerRef.current?.close()
    : onClose;
  const isStorybook = isStorybookPopupModeFromDom();

  const content = (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnBackdrop ? dismiss : undefined}
            data-rt-modal-backdrop={viewportModal ? 'gem' : undefined}
            className="fixed inset-0 z-[110000]" style={{ background: 'rgba(0,0,0,0.55)' }}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 w-screen h-[100dvh] flex items-center justify-center p-4 pb-[calc(16px+env(safe-area-inset-bottom))] z-[110001] pointer-events-none">
            <motion.div
              ref={modalRef}
              role={viewportModal ? 'dialog' : undefined}
              aria-modal={viewportModal ? true : undefined}
              aria-labelledby={viewportModal && title ? titleId : undefined}
              tabIndex={viewportModal ? -1 : undefined}
              data-rt-viewport-modal={viewportModal ? 'gem' : undefined}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`rt-modal-surface rt-modal-glass ${isStorybook ? 'rt-popup--storybook rt-paper-elev' : 'bg-gradient-to-br from-slate-50 to-amber-50'} w-[92vw] ${maxWidth} rounded-2xl shadow-2xl border border-amber-200 overflow-hidden flex flex-col max-h-[calc(100dvh-32px)] pointer-events-auto ${isStorybook ? 'SBPanel SBPanel--scroll' : ''} ${className}`}
            >
              {/* Illustration Header (storybook only) */}
              {isStorybook && (illustration || illustrationSrc || headerImageKey) && (
                <div className="SBModalIllustration shrink-0" style={{ height: `${illustrationHeight}px` }}>
                  <SafeStorybookImage
                    src={illustrationSrc || (headerImageKey ? getMomentHeaderFilename(headerImageKey) : null)}
                    alt={illustrationAlt || ''}
                    fallbackVariant="banner"
                    className="SBModalIllustrationImg"
                  />
                </div>
              )}
              {/* Header */}
              {(title || headerRight || onClose) && (
                <div className={`rt-modal-header ${isStorybook ? 'SBPanel' : 'bg-white'} border-b border-slate-200 p-5 flex items-center justify-between shrink-0`}>
                  <div className="min-w-0">
                    {title && <h2 id={titleId} className={`text-lg font-bold text-slate-800 ${isStorybook ? 'SBHeaderTitle' : ''}`}>{title}</h2>}
                    {isStorybook && <div className="h-[2px] w-full mt-1" style={{background: 'linear-gradient(90deg, var(--sb-ink), transparent 85%)', opacity: 0.25}} />}
                    {subtitle && <p className="text-sm text-slate-600 mt-1">{subtitle}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {headerRight}
                    {onClose && (
                      <button
                        onClick={dismiss}
                        className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                        aria-label="Close"
                      >
                        <X className="w-5 h-5 text-slate-600" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Body */}
              <div data-rt-modal-body={viewportModal ? 'gem' : undefined} className={`${viewportModal ? 'min-h-0 ' : ''}overflow-y-auto p-6 text-slate-700 flex-1 ${bodyClassName}`} style={{ WebkitOverflowScrolling: 'touch', ...(bodyStyle || {}) }}>
                {children}
                {resultStrip && (
                  <div className={`${isStorybook ? 'SBPanel SBResultStrip mt-4' : 'mt-4 p-3 rounded-lg border bg-white'}`}>
                    {resultStrip}
                  </div>
                )}
              </div>

              {/* Footer */}
              {footer && (
                <div className={`bg-white border-t border-slate-200 p-4 shrink-0 ${isStorybook ? 'SBPanel' : ''}`}>
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
  return viewportModal && typeof document !== 'undefined'
    ? createPortal(content, document.body)
    : content;
}