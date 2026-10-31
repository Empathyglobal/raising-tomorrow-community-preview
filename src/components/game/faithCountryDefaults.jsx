// Country-based faith defaults for Quick Start
// Uses weighted probabilities (not claiming real-world accuracy, just design defaults)

export function pickQuickStartFaith({ iso3, rng }) {
  const upper = String(iso3 || '').toUpperCase();
  
  // Indonesia: 80% Islam, 20% None
  if (upper === 'IDN') {
    return rng.nextFloat() < 0.80 ? { tradition: 'Islam' } : null;
  }
  
  // India: 60% Hinduism, 25% Islam, 15% None
  if (upper === 'IND') {
    const roll = rng.nextFloat();
    if (roll < 0.60) return { tradition: 'Hinduism' };
    if (roll < 0.85) return { tradition: 'Islam' };
    return null;
  }
  
  // Middle East (Saudi Arabia, UAE, Egypt, etc.)
  const middleEast = ['SAU', 'ARE', 'EGY', 'JOR', 'LBN', 'SYR', 'IRQ', 'IRN'];
  if (middleEast.includes(upper)) {
    return rng.nextFloat() < 0.90 ? { tradition: 'Islam' } : null;
  }
  
  // USA: 40% Christianity, 60% None
  if (upper === 'USA') {
    return rng.nextFloat() < 0.40 ? { tradition: 'Christianity' } : null;
  }
  
  // Western developed (mostly None)
  const western = ['GBR', 'FRA', 'DEU', 'NLD', 'SWE', 'NOR', 'DNK', 'CAN', 'AUS', 'NZL'];
  if (western.includes(upper)) {
    return rng.nextFloat() < 0.25 ? { tradition: 'Christianity' } : null;
  }
  
  // Default: mostly None
  return rng.nextFloat() < 0.30 ? { tradition: 'Christianity' } : null;
}