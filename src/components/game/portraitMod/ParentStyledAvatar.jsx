import React from 'react';
import { useGameState } from '@/components/game/GameStateContext';
import PlayerSpriteAvatar from '@/components/game/PlayerSpriteAvatar';
import { resolvePortraitModSheetUrl } from './portraitMod';

export default function ParentStyledAvatar({ size = 48, className = '', fallbackEmoji = '🧑', align = 'bottom' }) {
  const { gameState, mods } = useGameState();
  
  const parentGender = gameState.parentAvatarGender || 'male';
  const parentAge = Number(gameState.parentAgeAtBirth ?? 28) + Number(gameState.currentYear ?? 0);
  const parentIndex = Number.isFinite(Number(gameState.parentAvatarSpriteIndex))
    ? Number(gameState.parentAvatarSpriteIndex)
    : 0;
  
  // Portrait Mod: resolve style sheet if enabled
  let sheetUrlOverride = null;
  let fallbackSheetUrlOverride = null;
  
  if (mods?.portrait?.enabled && parentAge >= 18 && parentAge < 56) {
    const styleKey = gameState.portraitModState?.parentAdultStyleKey;
    if (styleKey && styleKey !== 'adult_base1') {
      const url = resolvePortraitModSheetUrl({
        genderKey: parentGender,
        setKey: styleKey,
        manifest: mods.portrait.manifest
      });
      if (url) {
        sheetUrlOverride = url;
        // Fallback: base adult sheet
        fallbackSheetUrlOverride = null;
      }
    }
  }
  
  return (
    <PlayerSpriteAvatar
      genderKey={parentGender}
      ageNumber={parentAge}
      index={parentIndex}
      size={size}
      className={className}
      fallbackEmoji={fallbackEmoji}
      align={align}
      sheetUrlOverride={sheetUrlOverride}
      fallbackSheetUrlOverride={fallbackSheetUrlOverride}
    />
  );
}