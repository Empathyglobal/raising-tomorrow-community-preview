import React from 'react';
import SafeStorybookImage from '@/components/storybook/SafeStorybookImage';
import { getMomentHeaderFilename } from '@/components/storybook/imageMap';
import { isStorybookPopupModeFromDom } from "@/components/lib/uiTheme";

export default function PopupHeaderImage({ headerKey, height = 140 }) {
  const isStorybook = isStorybookPopupModeFromDom();
  if (!isStorybook) return null;
  const filename = headerKey ? getMomentHeaderFilename(headerKey) : null;
  if (!filename) return null;
  return (
    <div className="w-full overflow-hidden rounded-t-xl" style={{ height }}>
      <SafeStorybookImage src={filename} alt={headerKey} className="w-full h-full" fallbackVariant="banner" />
    </div>
  );
}