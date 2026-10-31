import React from 'react';
import resolveStorybookImage from '@/components/storybook/resolveStorybookImage';
import { getUiThemeFromDom } from '@/components/lib/uiTheme';

export default function SafeStorybookImage({ src, alt = '', className = '', fallbackVariant = 'panel', style, imgStyle }) {
  const [failed, setFailed] = React.useState(false);
  const resolvedSrc = resolveStorybookImage(src);
  const prevSrcRef = React.useRef(resolvedSrc || '');

  React.useEffect(() => {
    // Reset failure state if src changes (use resolved value)
    if ((resolvedSrc || '') !== prevSrcRef.current) {
      prevSrcRef.current = resolvedSrc || '';
      setFailed(false);
    }
  }, [resolvedSrc]);

  const isStorybook = getUiThemeFromDom() === 'storybook';
  const showPlaceholder = !resolvedSrc || failed;
  const isBanner = fallbackVariant === 'banner';
  const loading = isBanner ? 'eager' : 'lazy';
  const decorative = isStorybook && isBanner;

  return (
    <div className={`SBImageWrapper ${className}`} style={style}>
      {!showPlaceholder ? (
        <img
          src={resolvedSrc}
          alt={alt}
          loading={loading}
          onError={() => setFailed(true)}
          draggable={decorative ? false : undefined}
          className={`SBImageEl ${decorative ? 'pointer-events-none select-none' : ''}`}
                     style={imgStyle}
                    />
      ) : (
        <div
          className={`SBPanel SBImagePlaceholder ${isBanner ? 'SBImagePlaceholder--banner' : 'SBImagePlaceholder--panel'}`}
          aria-hidden="true"
        />
      )}
    </div>
  );
}