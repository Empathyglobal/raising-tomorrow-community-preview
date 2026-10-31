// Child-facing profile labels (temperament + interests)
// Keep these in one place so the header + detail pages always match.

export const TEMPERAMENT_LABELS = {
  balanced: { emoji: '🙂', label: 'Balanced' },
  bold: { emoji: '⚡', label: 'Bold Explorer' },
  sensitive: { emoji: '🌙', label: 'Sensitive & Deep Feeler' },
  routine: { emoji: '🧱', label: 'Routine Lover' },
  social: { emoji: '🫂', label: 'Social Butterfly' },
  observer: { emoji: '👀', label: 'Quiet Observer' }
};

export const INTEREST_LABELS = {
  none: { emoji: '🎲', label: 'Still discovering' },
  space: { emoji: '🚀', label: 'Space' },
  animals: { emoji: '🐾', label: 'Animals' },
  music: { emoji: '🎵', label: 'Music' },
  sports: { emoji: '🏀', label: 'Sports' },
  art: { emoji: '🎨', label: 'Art' },
  building: { emoji: '🧩', label: 'Building & Engineering' },
  helping: { emoji: '💛', label: 'Helping Others' }
};

// Matches PrimaryInterestModal / outcomesEngineV3 interest IDs
export const PRIMARY_INTEREST_LABELS = {
  SPACE: '🚀 Space',
  ANIMALS: '🐾 Animals',
  ART: '🎨 Art',
  BUILDING: '🧩 Building & Engineering',
  PEOPLE: '🫂 People'
};

export function formatTemperament(temperamentId, fallback = '') {
  if (temperamentId && TEMPERAMENT_LABELS[temperamentId]) {
    const t = TEMPERAMENT_LABELS[temperamentId];
    return `${t.emoji} ${t.label}`;
  }
  // Legacy string (e.g., "Easygoing") or empty
  return fallback || '🙂 Temperament';
}

export function formatInterest(interestId, fallback = '') {
  if (interestId && INTEREST_LABELS[interestId]) {
    const i = INTEREST_LABELS[interestId];
    return `${i.emoji} ${i.label}`;
  }
  return fallback || '🎲 Still discovering';
}

export function formatPrimaryInterest(primaryInterestId, fallback = '') {
  if (primaryInterestId && PRIMARY_INTEREST_LABELS[primaryInterestId]) {
    return PRIMARY_INTEREST_LABELS[primaryInterestId];
  }
  return fallback;
}

import { getPassionMeta } from './passionTracks';

export function formatPubertyPassion(passionId, fallback = '') {
  const meta = getPassionMeta(passionId);
  if (meta) {
    return `${meta.emoji} ${meta.label}`;
  }
  return fallback;
}