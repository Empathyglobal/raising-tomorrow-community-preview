// Urn Crypto Market System: Deterministic price movements with fun headlines
// Pure logic module - no React dependencies

/**
 * Simple seeded random number generator
 */
export function seededRng(seedString) {
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    const char = seedString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return function() {
    hash = (hash * 9301 + 49297) % 233280;
    return hash / 233280;
  };
}

/**
 * Initialize 10 deterministic tokens for the entire run
 */
export function initUrnCryptoTokens({ runSeed }) {
  const rng = seededRng(`${runSeed}|tokens|init`);
  
  const tokenNames = [
    'Luna Coin', 'Nova Exchange', 'Zenith Protocol', 'Cipher Ledger', 
    'Nexus Chain', 'Quantum Flux', 'Prism Finance', 'Void Token',
    'Echo Asset', 'Flux Verse'
  ];
  
  const symbols = [
    'LUNA', 'NOVA', 'ZENT', 'CIPH',
    'NEXS', 'QNTM', 'PRSM', 'VOID',
    'ECHO', 'FLUX'
  ];
  
  const emojis = [
    '🌙', '⭐', '🏔️', '🔐',
    '🔗', '⚛️', '🔮', '🕳️',
    '🔊', '🌊'
  ];
  
  const riskProfiles = ['bluechip', 'bluechip', 'alt', 'alt', 'alt', 'alt', 'meme', 'meme', 'meme', 'meme'];
  
  const tokens = [];
  for (let i = 0; i < 10; i++) {
    tokens.push({
      id: `token_${i}`,
      name: tokenNames[i],
      symbol: symbols[i],
      emoji: emojis[i],
      riskProfile: riskProfiles[i]
    });
  }
  
  return tokens;
}

/**
 * Initialize starting prices for tokens (deterministic per run)
 */
export function initUrnCryptoPrices({ tokens, runSeed }) {
  const pricesById = {};
  const rng = seededRng(`${runSeed}|prices|init`);
  
  tokens.forEach((token, idx) => {
    const basePrice = 50 + rng() * 350; // $50-$400 base range
    const adjusted = Math.round(basePrice);
    pricesById[token.id] = Math.max(1, adjusted);
  });
  
  return pricesById;
}

/**
 * Compute yearly price movements with fun headlines
 */
export function computeUrnCryptoYearMove({ runSeed, age, tokens, pricesById }) {
  const rng = seededRng(`${runSeed}|market|age:${age}`);
  
  // Market mood (20% winter, 10% bull, 70% chop)
  const moodRoll = rng();
  let marketMood, marketMultiplier;
  
  if (moodRoll < 0.20) {
    marketMood = 'winter';
    marketMultiplier = 0.25 + rng() * 0.40; // 0.25–0.65
  } else if (moodRoll < 0.30) {
    marketMood = 'bull';
    marketMultiplier = 1.35 + rng() * 0.90; // 1.35–2.25
  } else {
    marketMood = 'chop';
    marketMultiplier = 0.85 + rng() * 0.35; // 0.85–1.20
  }
  
  // Per-token idiosyncratic moves + rug/moon
  const newPricesById = {};
  const changes = [];
  
  tokens.forEach((token) => {
    const oldPrice = Number(pricesById[token.id] || 100);
    let tokenMult = 0;
    
    if (token.riskProfile === 'bluechip') {
      tokenMult = 0.9 + rng() * 0.2; // 0.9–1.1
    } else if (token.riskProfile === 'alt') {
      tokenMult = 0.75 + rng() * 0.60; // 0.75–1.35
    } else if (token.riskProfile === 'meme') {
      tokenMult = 0.5 + rng() * 1.3; // 0.5–1.8
      
      // Rug (8%) or moon (4%) chance
      const extreme = rng();
      if (extreme < 0.08) {
        tokenMult = 0.05 + rng() * 0.20; // Rug: 0.05–0.25
      } else if (extreme < 0.12) {
        tokenMult = 2.0 + rng() * 4.0; // Moon: 2–6x
      }
    }
    
    const newPrice = Math.max(1, Math.round(oldPrice * marketMultiplier * tokenMult));
    newPricesById[token.id] = Math.min(999999, newPrice);
    
    // Track change for headline
    if (newPrice !== oldPrice) {
      const pct = Math.round(((newPrice - oldPrice) / oldPrice) * 100);
      changes.push({
        id: token.id,
        name: token.name,
        emoji: token.emoji,
        oldPrice,
        newPrice,
        pct
      });
    }
  });
  
  // Sort by biggest movers (for headline selection)
  const sorted = [...changes].sort((a, b) => Math.abs(b.pct) - Math.abs(a.pct));
  const topMovers = sorted.slice(0, 3);
  
  // Fun headlines (deterministic)
  const headlines = [
    "An influencer live-streamed a sandwich. Markets reacted.",
    "Someone said 'HODL' confidently. Nobody knows why.",
    "A DAO voted to buy a llama. Liquidity evaporated.",
    "Gas fees achieved sentience and demanded rent.",
    "The whales woke up. It was not pretty.",
    "Someone hacked a smart fridge. Apparently that was possible.",
    "News: blockchain may not solve everything. Shocking.",
    "A meme became a religion. Prices followed.",
    "The exchange server was powered by vibes. Vibes weakened.",
    "Elon tweeted. Then deleted it. Market never recovered."
  ];
  
  const headlineIdx = Math.floor(rng() * headlines.length);
  const headline = headlines[headlineIdx];
  
  return {
    headline,
    marketMood,
    newPricesById,
    changes: topMovers
  };
}