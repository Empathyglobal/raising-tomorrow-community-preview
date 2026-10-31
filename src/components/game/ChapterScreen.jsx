import React from 'react';
import SafeStorybookImage from '@/components/storybook/SafeStorybookImage';

export default function ChapterScreen({ open, image, title, subtitle, onContinue }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[2100] flex items-center justify-center p-4 pb-[calc(16px+env(safe-area-inset-bottom))]"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.55)' }}
        onClick={onContinue}
      />

      <div className="relative w-[92vw] max-w-[520px] max-h-[calc(100dvh-32px)] overflow-hidden rt-popup--storybook rt-modal-surface rt-no-torn flex flex-col">
        {/* Art area (fills remaining height; prevents landscape overflow) */}
        <div className="relative w-full flex-1 min-h-0 overflow-hidden">
          {image ? (
            <SafeStorybookImage
              src={image}
              alt={title || 'Chapter'}
              className="absolute inset-0 w-full h-full"
              fallbackVariant="banner"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,#F6EBD1,#F2E1BC)]">
              <div className="SBPanel text-center p-4">
                <div className="text-5xl mb-2">📖</div>
                <div className="SBHeaderTitle">{title || 'New Chapter'}</div>
                {subtitle && (
                  <div className="text-sm" style={{ color: 'var(--sb-ink-soft)' }}>
                    {subtitle}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-black/10" />

          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div className="SBPanel">
              {title && <div className="SBHeaderTitle text-lg">{title}</div>}
              {subtitle && (
                <div className="text-sm" style={{ color: 'var(--sb-ink-soft)' }}>
                  {subtitle}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[rgba(43,33,24,0.22)]">
          <button className="SBButton SBButton--primary w-full" onClick={onContinue}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}