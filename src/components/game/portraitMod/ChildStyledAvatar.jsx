import React from 'react';
import { useGameState } from '@/components/game/GameStateContext';
import PlayerSpriteAvatar from '@/components/game/PlayerSpriteAvatar';
import { resolvePortraitModSheetUrl } from './portraitMod';

export default function ChildStyledAvatar({ size = 48, className = '', fallbackEmoji = '👶', align = 'bottom' }) {
  const { gameState, mods } = useGameState();
  
  const childGender = gameState.childAvatarGender === 'girl' ? 'female' : 'male';
  const childAge = Number(gameState.currentYear ?? 0);
  const childIndex = Number.isFinite(Number(gameState.childAvatarSpriteIndex))
    ? Number(gameState.childAvatarSpriteIndex)
    : 0;
  
  // Portrait Mod: teen style support (ages 13-17 only)
  let sheetUrlOverride = null;
  let fallbackSheetUrlOverride = null;
  
  if (mods?.portrait?.enabled && childAge >= 13 && childAge <= 17) {
    const styleKey = gameState.portraitModState?.childTeenStyleKey;
    if (styleKey && styleKey !== 'teen_base') {
      const url = resolvePortraitModSheetUrl({
        genderKey: childGender,
        setKey: styleKey,
        manifest: mods.portrait.manifest
      });
      if (url) {
        sheetUrlOverride = url;
        fallbackSheetUrlOverride = null;
      }
    }
  }
  
  return (
    <PlayerSpriteAvatar
      genderKey={childGender}
      ageNumber={childAge}
      index={childIndex}
      size={size}
      className={className}
      fallbackEmoji={fallbackEmoji}
      align={align}
      sheetUrlOverride={sheetUrlOverride}
      fallbackSheetUrlOverride={fallbackSheetUrlOverride}
    />
  );
}