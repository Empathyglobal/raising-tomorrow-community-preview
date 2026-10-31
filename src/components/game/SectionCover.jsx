import React from 'react';

export default function SectionCover({ image, title, description }) {
  return (
    <div className="mb-3">
      {image && (
        <div className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: '3/1' }}>
          <img src={image} alt={title || 'Section'} loading="lazy" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/35 to-transparent" />
          <div className="absolute left-0 top-0 bottom-0 p-3 flex items-end">
            <div className="SBPanel" style={{ background: 'rgba(246,235,209,0.9)' }}>
              {title && <div className="SBHeaderTitle text-base">{title}</div>}
              {description && <div className="text-xs" style={{ color: 'var(--sb-ink-soft)' }}>{description}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}