// Urn Crypto System: Pure logic for yearly crypto gambling mechanic
// Deterministic outcomes based on runSeed + age

// Simple seeded RNG (LCG)
function createSeededRng(seedString) {
  let seed = 0;
  for (let i = 0; i < seedString.length; i++) {
    seed = ((seed << 5) - seed) + seedString.charCodeAt(i);
    seed = seed & seed;
  }
  seed = Math.abs(seed);

  return {
    next() {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    },
    pick(arr) {
      return arr[Math.floor(this.next() * arr.length)];
    }
  };
}

// Token name generation
const ADJECTIVES = [
  'Lunar', 'Solar', 'Cosmic', 'Quantum', 'Hyper', 'Meta', 'Cyber', 'Turbo',
  'Ultra', 'Mega', 'Giga', 'Nano', 'Stellar', 'Astral', 'Void', 'Plasma',
  'Neon', 'Crystal', 'Diamond', 'Golden', 'Silver', 'Bronze', 'Emerald', 'Ruby'
];

const NOUNS = [
  'Coin', 'Token', 'Gem', 'Shard', 'Vault', 'Chain', 'Block', 'Node',
  'Bit', 'Byte', 'Hash', 'Key', 'Link', 'Mesh', 'Net', 'Pod', 'Core',
  'Orb', 'Seed', 'Spark', 'Wave', 'Pulse', 'Flow', 'Rift', 'Nexus'
];

const EMOJIS = [
  '🪙', '💎', '🚀', '🌙', '⚡', '🔥', '💰', '🎯', '🎲', '🌟',
  '🔮', '💸', '🌊', '🧊', '🍀', '🐸', '🦄', '🌈', '👑', '🏆'
];

function generateTokenName(seed) {
  const rng = createSeededRng(seed);
  const adj = rng.pick(ADJECTIVES);
  const noun = rng.pick(NOUNS);
  const emoji = rng.pick(EMOJIS);
  
  // Symbol from initials + random letter
  const initials = (adj[0] + noun[0]).toUpperCase();
  const randomLetter = String.fromCharCode(65 + Math.floor(rng.next() * 26));
  const symbol = initials + randomLetter;
  
  return {
    name: `${adj} ${noun}`,
    symbol,
    emoji
  };
}

export function makeUrnCryptoSeason({ runSeed, age, tokenCount = 10, tokenPrice = 100 }) {
  const tokens = [];
  
  for (let i = 0; i < tokenCount; i++) {
    const tokenSeed = `${runSeed}|urn|age${age}|token${i}`;
    const { name, symbol, emoji } = generateTokenName(tokenSeed);
    
    tokens.push({
      id: `age${age}_t${i}`,
      name,
      symbol,
      emoji
    });
  }
  
  return {
    seasonAge: age,
    tokenPrice,
    tokens
  };
}

export function resolveUrnCryptoOutcomes({ runSeed, age, tokens }) {
  if (!Array.isArray(tokens) || tokens.length !== 10) {
    throw new Error('resolveUrnCryptoOutcomes requires exactly 10 tokens');
  }
  
  const rng = createSeededRng(`${runSeed}|urn|age${age}|outcomes`);
  
  // Shuffle token indices
  const indices = tokens.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  
  // First 8 crash, next 1 doubles, last 1 moons
  const crashedIds = indices.slice(0, 8).map(i => tokens[i].id);
  const doubleId = tokens[indices[8]].id;
  const moonId = tokens[indices[9]].id;
  
  const multipliersById = {};
  crashedIds.forEach(id => { multipliersById[id] = 0; });
  multipliersById[doubleId] = 2;
  multipliersById[moonId] = 8;
  
  return {
    crashedIds,
    doubleId,
    moonId,
    multipliersById
  };
}