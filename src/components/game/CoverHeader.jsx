import React from 'react';
import SafeStorybookImage from '@/components/storybook/SafeStorybookImage';
import { getSectionCoverFilename } from '@/components/storybook/imageMap';
import { getUiThemeFromDom } from '@/components/lib/uiTheme';

export default function CoverHeader({ cover, fallbackTitle = '', heightClass = 'h-[150px] md:h-[180px]' }) {
  const isStorybook = getUiThemeFromDom() === 'storybook';
  const title = cover?.title || fallbackTitle || '';
  const coverKey = cover?.id ? String(cover.id).replace(/-/g, '_') : null;
  const filename = isStorybook && coverKey ? getSectionCoverFilename(coverKey) : null;
  const hasImage = Boolean(filename);

  return (
    <div className="mb-3">
      {hasImage ? (
        <div className={`relative rounded-xl overflow-hidden ${heightClass} ${isStorybook ? 'SBModalIllustration' : ''}`}>
          <div className="SBModalIllustrationFrame absolute inset-0 rounded-[14px] overflow-hidden">
            <SafeStorybookImage
              src={filename}
              alt=""
              className="w-full h-full"
              fallbackVariant="banner"
              imgStyle={{ objectFit: 'cover' }}
            />
          </div>
          <div className="absolute left-3 right-3 bottom-3 pointer-events-none" style={{ zIndex: 2 }}>
            <div className="SBPanel px-3 py-2 rounded-md">
              <div className="SBHeaderTitle text-base" style={{ color: 'var(--sb-ink)' }}>{title}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="SBPanel rounded-xl flex items-center justify-between h-32 sm:h-40 px-4">
          <div>
            <div className="SBHeaderTitle text-base">{title || (cover?.id || 'Section')}</div>
            <div className="text-xs" style={{ color: 'var(--sb-ink-soft, rgba(43,33,24,0.72))' }}>
            </div>
          </div>
          <div className="text-4xl opacity-40">📖</div>
        </div>
      )}
    </div>
  );
}