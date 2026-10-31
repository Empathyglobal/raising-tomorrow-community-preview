import React from 'react';
import { getAvatarSheetForAge, SPECIAL_START_AVATAR_SHEETS } from '@/components/game/avatarImages';
import { useGameState } from '@/components/game/GameStateContext';

// Renders the player's sprite avatar from a 4x4 grid (16 frames) sheet.
// Layout metadata (base units): padding=16, spacing=8, cell=256x256.
export default function PlayerSpriteAvatar({
  genderKey = 'male',
  ageNumber,
  index,
  size = 48,
  className = '',
  fallbackEmoji = '🧑',
  align = 'bottom',
  sheetUrlOverride = null,
  fallbackSheetUrlOverride = null
}) {
  // === Sprite sheet layout (BASE units) ===
  const COLS = 4;
  const ROWS = 4;
  const MAX_INDEX = COLS * ROWS - 1; // 15

  const PAD = 16;
  const GAP = 8;
  const CELL_W = 256;
  const CELL_H = 256;

  const BASE_SHEET_W = PAD * 2 + (COLS * CELL_W) + ((COLS - 1) * GAP);
  const BASE_SHEET_H = PAD * 2 + (ROWS * CELL_H) + ((ROWS - 1) * GAP);

  const { gameState } = useGameState();
  const ss = gameState?.specialStartId;

  // Compute stage for override logic
  const a = Number(ageNumber) || 0;
  const stage =
    (a <= 2) ? 'baby'
    : (a <= 9) ? 'child'
    : (a <= 17) ? 'teen'
    : (a <= 35) ? 'adult'
    : (a <= 55) ? 'middle'
    : (a <= 70) ? 'retire'
    : 'senior';

  // Select base sheet
  const baseUrl = getAvatarSheetForAge?.(ageNumber, genderKey);

  // Build cascading fallback chain
  const explicitOverride = sheetUrlOverride || fallbackSheetUrlOverride || null;

  // Special-start override for female adult/middle/retire/senior only
  const maybeOverride = () => {
    if (explicitOverride) return explicitOverride;
    if (genderKey !== 'female') return null;
    if (!(ss === 'war_zone' || ss === 'refugee_camp')) return null;
    if (!['adult','middle','retire','senior'].includes(stage)) return null;

    const o = SPECIAL_START_AVATAR_SHEETS?.[ss]?.female?.[stage];
    const fb =
      SPECIAL_START_AVATAR_SHEETS?.[ss]?.female?.fallback_hijabnormal ||
      SPECIAL_START_AVATAR_SHEETS?.war_zone?.female?.fallback_hijabnormal ||
      null;

    return o || fb || null;
  };

  const isLockedSpecialStartFemaleAdult =
    (ss === 'war_zone' || ss === 'refugee_camp') &&
    genderKey === 'female' &&
    ['adult','middle','retire','senior'].includes(stage) &&
    !explicitOverride;

  const overrideUrl = maybeOverride();
  const initialSheet = isLockedSpecialStartFemaleAdult ? (overrideUrl || null) : (overrideUrl || baseUrl);
  const [sheetUrl, setSheetUrl] = React.useState(initialSheet);

  // Load sheet intrinsic dimensions
  const [sheetDims, setSheetDims] = React.useState({ w: 1024, h: 1024 });
  React.useEffect(() => {
    if (!sheetUrl) return;
    const img = new Image();
    img.onload = () => {
      setSheetDims({ w: img.naturalWidth || 1024, h: img.naturalHeight || 1024 });
    };
    img.onerror = () => {
      const locked =
        (ss === 'war_zone' || ss === 'refugee_camp') &&
        genderKey === 'female' &&
        ['adult','middle','retire','senior'].includes(stage);

      if (locked) {
        const primary = SPECIAL_START_AVATAR_SHEETS?.[ss]?.female?.[stage] || null;
        const fallbackHijabNormal =
          SPECIAL_START_AVATAR_SHEETS?.[ss]?.female?.fallback_hijabnormal ||
          SPECIAL_START_AVATAR_SHEETS?.war_zone?.female?.fallback_hijabnormal ||
          null;

        const chain = [];
        [primary, fallbackHijabNormal].forEach(u => { if (u && !chain.includes(u)) chain.push(u); });

        const i = chain.indexOf(sheetUrl);
        const nextUrl = (i >= 0 && i < chain.length - 1) ? chain[i + 1] : null;

        if (nextUrl && nextUrl !== sheetUrl) setSheetUrl(nextUrl);
        else setSheetUrl(null); // never fall back to default base female sheets
        return;
      }

      // Fallback chain: try fallbackSheetUrlOverride if sheetUrlOverride failed
      if (sheetUrl === sheetUrlOverride && fallbackSheetUrlOverride && fallbackSheetUrlOverride !== sheetUrl) {
        setSheetUrl(fallbackSheetUrlOverride);
        return;
      }

      if (baseUrl && baseUrl !== sheetUrl) setSheetUrl(baseUrl);
    };
    img.src = sheetUrl;
  }, [sheetUrl, ss, stage, genderKey, baseUrl]);

  // Recompute sheet when inputs change
  React.useEffect(() => {
    const nextOverride = maybeOverride();
    const next = isLockedSpecialStartFemaleAdult ? (nextOverride || null) : (nextOverride || baseUrl);
    setSheetUrl(next);
  }, [ss, stage, genderKey, baseUrl]);

  const sizePx = Math.round(size);
  const idx = Number(index);
  const validIndex = Number.isFinite(idx) && idx >= 0 && idx <= MAX_INDEX;

  if (!sheetUrl || !validIndex) {
    let emoji = fallbackEmoji || "🙂";
    if (isLockedSpecialStartFemaleAdult) emoji = "🧕";
    return (
      <div
        className={`${className}`}
        style={{
          width: sizePx,
          height: sizePx,
          borderRadius: 16,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        aria-label="Player Avatar (emoji fallback)"
      >
        <span style={{ fontSize: Math.max(20, Math.floor(size * 0.6)) }}>{emoji}</span>
      </div>
    );
  }

  const col = idx % COLS;
  const row = Math.floor(idx / COLS);

  // Scale BASE layout coordinates to intrinsic sheet size.
  const sxScale = (sheetDims.w || 1024) / BASE_SHEET_W;
  const syScale = (sheetDims.h || 1024) / BASE_SHEET_H;

  const srcXBase = PAD + col * (CELL_W + GAP);
  const srcYBase = PAD + row * (CELL_H + GAP);

  const srcX = srcXBase * sxScale;
  const srcY = srcYBase * syScale;
  const srcW = CELL_W * sxScale;
  const srcH = CELL_H * syScale;

  // Contain inside square box, bottom-aligned by default, centered horizontally.
  const scale = Math.min(sizePx / srcW, sizePx / srcH);
  const offsetX = (sizePx - srcW * scale) / 2;
  const offsetY = (align === 'center') ? ((sizePx - srcH * scale) / 2) : (sizePx - srcH * scale);

  const backgroundSizePx = `${(sheetDims.w || 1024) * scale}px ${(sheetDims.h || 1024) * scale}px`;
  const posX = (-srcX * scale + offsetX);
  const posY = (-srcY * scale + offsetY);
  const backgroundPositionPx = `${posX}px ${posY}px`;

  return (
    <div
      className={`${className}`}
      style={{
        width: sizePx,
        height: sizePx,
        borderRadius: 16,
        overflow: 'hidden',
      }}
      aria-label="Player Avatar"
      role="img"
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundImage: `url(${sheetUrl})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: backgroundSizePx,
          backgroundPosition: backgroundPositionPx,
        }}
      />
    </div>
  );
}