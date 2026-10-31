import React from 'react';

// Simple, safe icon mapping using emojis to avoid broken imports
const ICONS = {
  balance: '⚖️',
  heart_plus: '❤️‍🩹',
  anchor: '⚓',
};

export default function IconForKey({ iconKey, className = '' }) {
  const glyph = ICONS[iconKey] || '🏅';
  return (
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-slate-100 ${className}`}>
      <span aria-hidden>{glyph}</span>
    </div>
  );
}