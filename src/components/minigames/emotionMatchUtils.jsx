// Utility helpers for Emotion Match mini‑game
// - simple seeded RNG for deterministic testing
// - array shuffler

export function createSeededRng(seed = Date.now()) {
  let s = (typeof seed === 'number' ? seed : String(seed).split('').reduce((a,c)=>a+c.charCodeAt(0), 0)) >>> 0;
  return {
    next: () => {
      // LCG
      s = (1664525 * s + 1013904223) >>> 0;
      return s;
    },
    nextFloat: () => ((s = (1664525 * s + 1013904223) >>> 0) / 0xffffffff)
  };
}

export function shuffleArray(arr, rng) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor((rng ? rng.nextFloat() : Math.random()) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const EMOTION_EMOJI_MAP = {
  Joy: '😀',
  Sadness: '😢',
  Anger: '😠',
  Fear: '😨',
  Anxiety: '😰',
  Calm: '😌',
  Shame: '😳',
  Guilt: '😔',
  Pride: '😎',
  Loneliness: '🥺',
  Jealousy: '😒',
  Excitement: '🤩',
  Frustration: '😤',
  Overwhelmed: '😵‍💫',
  Hopeful: '🌟',
  Disgust: '🤢',
  Surprise: '😲'
};

export const EMOTION_POOL = [
  'Joy','Sadness','Anger','Fear','Anxiety','Calm','Shame','Guilt','Pride','Loneliness','Jealousy','Excitement','Frustration','Overwhelmed','Hopeful','Disgust','Surprise'
];