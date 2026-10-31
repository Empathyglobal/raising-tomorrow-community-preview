// Shared number formatting utilities
// Safe helpers to avoid crashes from calling toFixed on null/undefined/NaN

let warnedKeys = new Set();

export function toNumber(value, fallback = NaN) {
  if (Number.isFinite(value)) return value;
  const s = typeof value === 'string' ? value.trim() : null;
  if (s && s.length) {
    const n = parseFloat(s);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

export function safeFixed(value, digits = 2, fallbackText = '0.00') {
  const n = toNumber(value, NaN);
  if (Number.isFinite(n)) {
    try { return n.toFixed(digits); } catch { /* noop */ }
  }
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
    const k = `safeFixed:${digits}`;
    if (!warnedKeys.has(k)) {
      warnedKeys.add(k);
      // Minimal once-per-session warning to help catch issues in dev
      console.warn('[numberFormat] safeFixed fallback used for non-number value');
    }
  }
  return fallbackText;
}

export function safeFixedSigned(value, digits = 2, fallbackText = '0.00') {
  const str = safeFixed(value, digits, fallbackText);
  const n = toNumber(str, NaN);
  if (Number.isFinite(n)) return (n > 0 ? '+' : '') + str;
  return str; // already fallbackText
}

export function safePercent(value, digits = 1, fallbackText = '—') {
  const n = toNumber(value, NaN);
  if (!Number.isFinite(n)) return fallbackText;
  return `${n.toFixed(digits)}%`;
}

export function safeMoney(value, fallbackText = '$0') {
  const n = toNumber(value, NaN);
  if (!Number.isFinite(n)) return fallbackText;
  try {
    // Round to nearest dollar using normal rounding
    const sign = n < 0 ? '-' : '';
    const rounded = Math.round(Math.abs(n));
    return `${sign}$${rounded.toLocaleString()}`;
  } catch {
    const sign = n < 0 ? '-' : '';
    return `${sign}$${Math.round(Math.abs(n))}`;
  }
}

/**
 * Quantize to tenths using "round away from zero" (small penalties don't disappear).
 * Examples: 0.333 -> 0.4, -0.15 -> -0.2, 0.05 -> 0.1
 */
export function quantizeToTenth(value) {
  const n = toNumber(value, 0);
  if (!Number.isFinite(n)) return 0;
  const sign = n < 0 ? -1 : 1;
  return sign * Math.ceil(Math.abs(n) * 10) / 10;
}

/**
 * Format to tenths with exactly 1 decimal place.
 * Always shows X.Y format (never X.YY or raw integers).
 */
export function formatToTenth(value) {
  const q = quantizeToTenth(value);
  if (!Number.isFinite(q)) return '0.0';
  const str = q.toFixed(1);
  // Normalize "-0.0" to "0.0"
  return str === '-0.0' ? '0.0' : str;
}

/**
 * Format to tenths with sign prefix (+/-)
 */
export function formatToTenthSigned(value) {
  const q = quantizeToTenth(value);
  if (!Number.isFinite(q)) return '0.0';
  const str = q.toFixed(1);
  if (str === '-0.0' || str === '0.0') return '0.0';
  return q > 0 ? `+${str}` : str;
}