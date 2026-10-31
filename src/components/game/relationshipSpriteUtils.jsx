export const FAMILY_SPRITE_ROLES = new Set([
  'partner',
  'my_mom','my_dad',
  'mother','father',
  'sibling','sister','brother',
  'niece','nephew','nibling',
]);

export function shouldUseSpriteForRole(role) {
  const r = String(role || '').toLowerCase();
  // Use sprites for all humans; only exclude pets
  return r !== 'pet';
}

// Simple stable hash (FNV-1a)
function hash32(str) {
  let h = 2166136261;
  const s = String(str || '');
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededInt(seed, mod) {
  const m = Math.max(1, Number(mod) || 1);
  return hash32(seed) % m;
}

export function deriveGenderKeyForRole(role, seed) {
  const r = String(role || '').toLowerCase();
  if (r === 'my_mom' || r === 'mother' || r === 'sister' || r === 'niece') return 'female';
  if (r === 'my_dad' || r === 'father' || r === 'brother' || r === 'nephew') return 'male';
  if (r === 'wife') return 'female';
  if (r === 'husband') return 'male';
  if (r === 'mother_of_child') return 'female';
  if (r === 'father_of_child') return 'male';

  // siblings / partner (if not explicitly stored) can be seeded random:
  return seededInt(seed || 'seed', 2) === 0 ? 'male' : 'female';
}

export function getToneColFromGameState(gameState) {
  const tone = Number(
    gameState?.childAvatarToneIndex ??
    gameState?.selectedToneIndex ??
    0
  );
  const col = ((tone % 4) + 4) % 4; // 0..3
  return col;
}

// Pick a 0..15 index that stays in the same tone column:
// candidates: [col, col+4, col+8, col+12]
export function pickSpriteIndexForPerson({ seed, toneCol, role, avoid = [] }) {
  const candidates = [toneCol, toneCol + 4, toneCol + 8, toneCol + 12];

  // Optional role hint so mom/dad aren’t identical too often
  const r = String(role || '').toLowerCase();
  let pick = null;
  if (r === 'my_mom' || r === 'mother' || r === 'sister' || r === 'niece') pick = 1;
  if (r === 'my_dad' || r === 'father' || r === 'brother' || r === 'nephew') pick = 0;
  if (pick === null) pick = seededInt(seed, 3);

  let idx = candidates[pick];

  // Avoid duplicates when possible
  const avoidSet = new Set((avoid || []).filter(n => Number.isFinite(Number(n))).map(n => Number(n)));
  if (avoidSet.has(idx)) {
    idx = candidates[(pick + 1) % 4];
    if (avoidSet.has(idx)) idx = candidates[(pick + 2) % 4];
    if (avoidSet.has(idx)) idx = candidates[(pick + 3) % 4];
  }

  return idx;
}

export function computePersonAgeNumber(person, gameState) {
  const currentYear = Number(gameState?.currentYear ?? 0);
  const role = String(person?.role || '').toLowerCase();

  // Child tracks the game's current year directly
  if (person?.id === 'child' || role === 'child') {
    return currentYear;
  }

  // Most relationships use baseAge (age at year 0)
  if (Number.isFinite(Number(person?.baseAge))) {
    return Number(person.baseAge) + currentYear;
  }

  // Stored age (at creation)
  if (Number.isFinite(Number(person?.age))) {
    const createdAtAge = Number(person?.createdAtAge ?? 0);
    const yearsSinceMet = Math.max(0, currentYear - createdAtAge);
    return Number(person.age) + yearsSinceMet;
  }

  // Partner fallback: derive from player's parentAgeAtBirth
  if (role === 'partner') {
    const base = Number(gameState?.parentAgeAtBirth ?? gameState?.parentCareer?.ageAtBirth ?? 28);
    return base + currentYear;
  }

  // Fallback: assume adult
  return 30;
}

export function getSpriteMetaForPerson(person, gameState) {
  const role = String(person?.role || '').toLowerCase();
  const runSeed = String(gameState?.runSeed || gameState?.countrySeed || 'seed');

  // Tone column: child's tone for child; hash-distributed for NPCs
  let toneCol;
  if (person?.id === 'child' || role === 'child') {
    const t = Number(gameState?.childAvatarToneIndex ?? 0);
    toneCol = ((t % 4) + 4) % 4;
  } else {
    toneCol = ((hash32(`${runSeed}|tone|${person?.id || person?.name || role}`) % 4) + 4) % 4;
  }

  // Prefer stored values if present (if you add them later)
  const storedIndex =
    Number.isFinite(Number(person?.avatarSpriteIndex)) ? Number(person.avatarSpriteIndex)
    : null;
  const storedGender =
    person?.avatarGenderKey === 'male' || person?.avatarGenderKey === 'female'
      ? person.avatarGenderKey
      : null;

  // Partner prefers top-level stored partner values (if present)
  const avoid = [
    gameState?.parentAvatarSpriteIndex,
    gameState?.partnerAvatarSpriteIndex,
  ];

  const seedKey = `${runSeed}|rel|${person?.id || person?.name || role}|${role}`;

  const genderKey =
    storedGender ||
    (role === 'partner' && (gameState?.partnerAvatarGender === 'male' || gameState?.partnerAvatarGender === 'female')
      ? gameState.partnerAvatarGender
      : deriveGenderKeyForRole(role, seedKey));

  const index =
    (role === 'partner' && Number.isFinite(Number(gameState?.partnerAvatarSpriteIndex)))
      ? Number(gameState.partnerAvatarSpriteIndex)
      : (storedIndex ?? pickSpriteIndexForPerson({ seed: seedKey, toneCol, role, avoid }));

  const ageNumber = computePersonAgeNumber(person, gameState);

  return { genderKey, index, ageNumber };
}

export function getSpriteMetaForDatingProfile(profile, gameState) {
  const runSeed = String(gameState?.runSeed || 'seed');
  // gender mapping
  let genderKey = 'male';
  if (String(profile?.gender || '').toLowerCase() === 'woman') genderKey = 'female';
  else if (String(profile?.gender || '').toLowerCase() === 'man') genderKey = 'male';
  else genderKey = (seededInt(`${runSeed}|dating|gender|${profile?.signature || profile?.id || profile?.name}` , 2) === 0 ? 'male' : 'female');

  const ageNumber = Number(profile?.age) || 25;
  const toneCol = ((hash32(`${runSeed}|dating|tone|${profile?.signature || profile?.id || profile?.name}`) % 4) + 4) % 4;
  const avoid = [gameState?.parentAvatarSpriteIndex, gameState?.partnerAvatarSpriteIndex];
  const index = pickSpriteIndexForPerson({ seed: `${runSeed}|dating|idx|${profile?.signature || profile?.id || profile?.name}` , toneCol, role: 'dating', avoid });

  return { genderKey, index, ageNumber };
}