import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Settings, RefreshCw } from 'lucide-react';
import { useGameState, formatMoney, hasAnyChild, getDisplayedChildAge } from '@/components/game/GameStateContext';
import { getAvatarEmojiForAge } from '@/components/game/avatars';
import PlayerSpriteAvatar from '@/components/game/PlayerSpriteAvatar';
import { isLocalCoopEnabled, getCoopSideDisplayName, getCoopSideAge, getCoopSideAvatarMeta } from "@/components/game/localCoop";
import ParentStyledAvatar from '@/components/game/portraitMod/ParentStyledAvatar';

export default function StickyHeader({ onOpenSettings, onOpenProfile, onOpenRelationships, onSwitchCoopPlayer }) {
  const { gameState, setActiveKid } = useGameState();
  const {
    currentYear,
    money,
    actionPoints,
    maxFocusTokens,
    diamonds,
    parentAvatar,
    childAvatarGender,
    childAvatarToneIndex,
    activeKidId
  } = gameState;

  // Check if player has any child
  const hasChild = hasAnyChild(gameState);
  
  // Gate multi-kid display by expansion
  const siblingRivalryEnabled = !!gameState.expansions?.siblingRivalry;
  
  // Determine active caregiver (player or partner if coop active)
  const coopEnabled = isLocalCoopEnabled(gameState);
  const activeSide = coopEnabled && gameState.coop?.activeSide === 'partner' ? 'partner' : 'player';
  
  let parentAge, parentDisplayName, genderKey, parentSpriteIndex, parentEmoji;
  
  if (activeSide === 'partner' && coopEnabled) {
    parentAge = getCoopSideAge(gameState, 'partner');
    parentDisplayName = getCoopSideDisplayName(gameState, 'partner');
    const avatarMeta = getCoopSideAvatarMeta(gameState, 'partner');
    genderKey = avatarMeta.genderKey || 'neutral';
    parentSpriteIndex = avatarMeta.spriteIndex;
    parentEmoji = avatarMeta.emoji || '🧑';
  } else {
    parentAge = Number(gameState.parentAgeAtBirth ?? 28) + Number(currentYear ?? 0);
    
    const ROLE_WORDS = new Set(["parent","mom","dad","guardian","grandma","grandpa","mother","father"]);
    
    parentDisplayName = (() => {
      const candidates = [
        gameState?.parent?.name,
        gameState?.parentName,
        gameState?.profile?.name,
        gameState?.playerName
      ].filter(Boolean).map(v => String(v).trim());

      const good = candidates.find(v => !ROLE_WORDS.has(v.toLowerCase()));
      return good || "Player";
    })();
    
    const toneIdx = Number(childAvatarToneIndex ?? 0);
    const roleLower = String(gameState.parent?.role || gameState.parentRole || '').toLowerCase();
    const derivedGender = (roleLower === 'mom' || roleLower === 'mother' || roleLower === 'grandma') ? 'female' : 'male';
    genderKey = gameState.parentAvatarGender || derivedGender;
    const fallbackSpriteIndex = (toneIdx % 4);
    parentSpriteIndex = Number.isFinite(Number(gameState.parentAvatarSpriteIndex))
      ? Number(gameState.parentAvatarSpriteIndex)
      : fallbackSpriteIndex;
    parentEmoji = parentAvatar || '🧑';
  }
  
  const navigate = useNavigate();

  const isStorybook = typeof document !== 'undefined' && document.documentElement?.dataset?.uiTheme === 'storybook';
  const titleTextClass = isStorybook ? 'text-amber-50' : 'text-slate-800';
  const smallTextClass = isStorybook ? 'text-amber-200' : 'text-slate-500';

  // Compact number formatter for mobile
  const formatCompact = (n) => {
    const num = Number(n);
    if (!Number.isFinite(num)) return "0";
    return new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 }).format(num);
  };

  // Tiny stat item
  function HeaderStat({ icon, valueNode, label, valueClass }) {
    return (
      <div className="flex flex-col items-end leading-none">
        <div className={`text-[11px] sm:text-sm font-bold whitespace-nowrap tabular-nums ${valueClass || ''}`}>
          <span className="mr-0.5">{icon}</span>
          {valueNode}
        </div>
        <div className="hidden sm:block text-[9px] text-slate-400 uppercase tracking-wide font-medium">
          {label}
        </div>
      </div>
    );
  }

  // Kids Computation
  let displayKids = [];

  const allKids = Array.isArray(gameState.kids) ? gameState.kids : [];
  const dependentKids = allKids.filter((kid) => {
    const rel = kid?.relation || 'child';
    const isDependent = rel === 'child' || rel === 'grandchild';
    if (!isDependent) return false;
    const age = getDisplayedChildAge(gameState, kid);
    return age < 18;
  });

  if (!hasChild) {
    displayKids = [];
  } else if (allKids.length === 0) {
    // Legacy fallback: only show the single child if they're still a minor
    const age = Number(currentYear ?? 0);
    if (age < 18) {
      displayKids = [
        {
          id: 'single_kid',
          age,
          emoji: getAvatarEmojiForAge(age, childAvatarGender, childAvatarToneIndex),
          name: gameState.childName || 'Child',
        },
      ];
    } else {
      displayKids = [];
    }
  } else if (dependentKids.length > 0) {
    // Display minors only (children/grandchildren). Respect sibling rivalry display limits when enabled.
    const maxDisplay = siblingRivalryEnabled ? (dependentKids.length <= 3 ? dependentKids.length : 2) : 1;

    const activeDependent = dependentKids.find((k) => k.id === activeKidId);
    const list = [];
    if (activeDependent) list.push(activeDependent);

    for (const kid of dependentKids) {
      if (list.length >= maxDisplay) break;
      if (kid.id === activeKidId) continue;
      list.push(kid);
    }

    displayKids = list.map((kid) => {
      const age = getDisplayedChildAge(gameState, kid);
      const slice = kid.childSlice || {};
      const gender = slice.childAvatarGender || slice.childGender || childAvatarGender || 'boy';
      const tone = Number.isFinite(Number(slice.childAvatarToneIndex))
        ? Number(slice.childAvatarToneIndex)
        : Number(childAvatarToneIndex || 0);

      const emoji = slice.childAvatarEmoji || getAvatarEmojiForAge(age, gender, tone);
      const name = slice.childName || kid.name || 'Child';

      const spriteIndex = Number.isFinite(Number(slice.childAvatarSpriteIndex))
        ? Number(slice.childAvatarSpriteIndex)
        : (tone % 4);

      const genderKey = (gender === 'girl') ? 'female' : 'male';

      return {
        id: kid.id,
        age,
        emoji,
        name,
        spriteIndex,
        genderKey
      };
    });
  } else {
    // No minor dependents: do not show any kid avatar in header
    displayKids = [];
  }

  // Determine active kid for highlighting
  const currentActiveId = activeKidId || displayKids[0]?.id;
  
  const isSingleKid = displayKids.length === 1;

  const handleKidClick = () => {
    navigate(createPageUrl('DevelopmentDetails'));
  };

  return (
    <div
      className={`sticky top-0 z-50 px-3 pb-2 ${isStorybook ? 'rt-wood-hdr text-amber-50' : 'bg-white border-b border-slate-200'}`}
      style={isStorybook ? {
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 0.5rem)',
        background: 'linear-gradient(180deg, rgba(90,65,40,0.92), rgba(60,42,28,0.92))',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)',
        borderBottom: '1px solid rgba(255,255,255,0.10)'
      } : { paddingTop: 'calc(env(safe-area-inset-top, 0px) + 0.5rem)' }}
    >
      <div className="flex items-center justify-between">
        
        {/* Left: Family Strip */}
        <div className="flex items-center gap-1.5 flex-1 min-w-0 mr-2 overflow-x-hidden">
          {!hasChild ? (
            // CHILDLESS LAYOUT (Parent only)
            <button 
              onClick={onOpenProfile}
              aria-label="Open Profile"
              className="flex items-center gap-2 group min-w-0"
            >
              <ParentStyledAvatar
                size={48}
                className="rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center transition-colors group-hover:bg-slate-100 shadow-sm"
                fallbackEmoji={parentEmoji}
              />
              <div className="player-info text-center max-[360px]:hidden min-w-0">
                <div className={`font-semibold ${titleTextClass}`}>
                  {parentDisplayName}
                </div>
                <div className={`text-xs font-medium leading-tight ${smallTextClass}`}>
                  Age {parentAge}
                </div>
              </div>
            </button>
          ) : isSingleKid ? (
            // SINGLE KID LAYOUT (Large avatars + Inline text)
            (() => {
              const isAdultNow = Number(currentYear || 0) >= 18;
              if (isAdultNow) {
                // Show only parent header when child is 18+
                return (
                  <button 
                    onClick={onOpenProfile}
                    aria-label="Open Profile"
                    className="flex items-center gap-2 group min-w-0"
                  >
                    <ParentStyledAvatar
                      size={48}
                      className="rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center transition-colors group-hover:bg-slate-100 shadow-sm"
                      fallbackEmoji={parentEmoji}
                    />
                    <div className="player-info text-center max-[360px]:hidden min-w-0">
                      <div className={`font-semibold ${titleTextClass}`}>
                        {parentDisplayName}
                      </div>
                      <div className={`text-xs font-medium leading-tight ${smallTextClass}`}>
                        Age {parentAge}
                      </div>
                    </div>
                  </button>
                );
              }
              return (
                <div className="flex items-center gap-3">
                  {/* Parent Chip */}
                  <button 
                    onClick={onOpenProfile}
                    aria-label="Open Profile"
                    className="flex items-center gap-2 group min-w-0"
                  >
                    <ParentStyledAvatar
                      size={48}
                      className="rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center transition-colors group-hover:bg-slate-100 shadow-sm"
                      fallbackEmoji={parentEmoji}
                      />
                      <div className="player-info text-center max-[360px]:hidden min-w-0">
                     <div className={`font-semibold ${titleTextClass}`}>
                       {parentDisplayName}
                     </div>
                     <div className={`text-xs font-medium leading-tight ${smallTextClass}`}>
                       Age {parentAge}
                     </div>
                    </div>
                  </button>

                  {/* Child Chip */}
                  <button
                    onClick={handleKidClick}
                    aria-label="Open Development Details"
                    className="flex items-center gap-2 group min-w-0 overflow-hidden"
                  >
                    <div 
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all flex-shrink-0 shadow-sm ${
                        currentActiveId === displayKids[0].id
                          ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 ring-2 ring-amber-100 ring-offset-1' 
                          : 'bg-slate-50 border-slate-100'
                      }`}
                    >
                      <PlayerSpriteAvatar
                        ageNumber={displayKids[0].age}
                        index={displayKids[0].spriteIndex}
                        genderKey={displayKids[0].genderKey}
                        size={48}
                        fallbackEmoji={displayKids[0].emoji}
                        className="rounded-2xl bg-slate-50 border border-slate-100 shadow-sm"
                      />
                    </div>
                    <div className="text-left min-w-0">
                      <div className={`text-sm font-bold leading-tight truncate ${titleTextClass}`}>
                        {displayKids[0].name}
                      </div>
                      <div className={`text-xs font-medium leading-tight ${smallTextClass}`}>
                        Age {displayKids[0].age}
                      </div>
                    </div>
                  </button>
                </div>
              );
            })()
          ) : (
            // MULTI KID LAYOUT (Compact tiles)
            <>
              {/* Parent Tile */}
              <button 
                onClick={onOpenProfile}
                aria-label="Open Profile"
                className="flex flex-col items-center gap-0.5 flex-shrink-0"
              >
                <ParentStyledAvatar
                  size={40}
                  className="rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center transition-colors hover:bg-slate-100"
                  fallbackEmoji={parentEmoji}
                />
                <div className="player-info text-center max-[360px]:hidden min-w-0">
                <div className={`font-semibold truncate max-w-[72px] sm:max-w-[140px] ${titleTextClass}`}>
                   {parentDisplayName}
                 </div>
                 <div className={`text-xs font-medium leading-tight ${smallTextClass}`}>
                   Age {parentAge}
                 </div>
                </div>
              </button>

              {/* Separator line */}
              <div className="w-px h-8 bg-slate-100 flex-shrink-0 mx-0.5" />

              {/* Kid Tiles */}
              {displayKids.map((kid) => {
                const isActive = kid.id === currentActiveId;
                return (
                  <button
                    key={kid.id}
                    onClick={() => {
                      if (siblingRivalryEnabled && kid.id !== 'single_kid') {
                        setActiveKid(kid.id);
                      }
                      handleKidClick();
                    }}
                    aria-label="Open Development Details"
                    className="flex flex-col items-center gap-0.5 flex-shrink-0 transition-opacity hover:opacity-80"
                  >
                    <div 
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                        isActive 
                          ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 ring-2 ring-amber-100 ring-offset-1' 
                          : 'bg-slate-50 border-slate-100'
                      }`}
                    >
                      <PlayerSpriteAvatar
                        ageNumber={kid.age}
                        index={kid.spriteIndex}
                        genderKey={kid.genderKey}
                        size={40}
                        fallbackEmoji={kid.emoji}
                        className="rounded-xl"
                      />
                    </div>
                    <div className={`text-[10px] font-medium leading-none ${isActive ? 'text-amber-600' : 'text-slate-400'}`}>
                      Age {kid.age}
                    </div>
                  </button>
                );
              })}

              {/* Extra Kids Tile (if more than 3 kids) */}
              {(() => {
                const totalKids = Array.isArray(gameState.kids) ? gameState.kids.length : displayKids.length;
                const extraCount = Math.max(0, totalKids - displayKids.length);

                if (extraCount > 0) {
                  return (
                    <button
                      onClick={() => {
                        if (typeof onOpenRelationships === 'function') onOpenRelationships();
                      }}
                      aria-label="Open Relationships (All Kids)"
                      className="flex flex-col items-center gap-0.5 flex-shrink-0 transition-opacity hover:opacity-80"
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center border bg-slate-50 border-slate-100 text-slate-700 font-bold">
                        +{extraCount}
                      </div>
                      <div className="text-[10px] font-medium leading-none text-slate-400">
                        Kids
                      </div>
                    </button>
                  );
                }
                return null;
              })()}
            </>
          )}
        </div>

        {/* Right: Resources (Vertical Stack) & Settings */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {hasChild ? (
            <div className="flex flex-col items-end text-right gap-1">
              <HeaderStat icon="⚡" valueNode={<span className="text-amber-600">{actionPoints}/{maxFocusTokens}</span>} label="Focus" />
              <HeaderStat icon="💰" valueNode={<span>${formatCompact(money)}</span>} label="Money" />
              <HeaderStat icon="💎" valueNode={<span>{formatCompact(diamonds)}</span>} label="Diamonds" />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-x-3 gap-y-1 text-right">
              <HeaderStat icon="⚡" valueNode={<span className="text-amber-600">{actionPoints}/{maxFocusTokens}</span>} label="Focus" />
              <HeaderStat icon="😰" valueNode={<span className="text-amber-600">{Math.round(Number(gameState.stress || 0))}</span>} label="Stress" />
              <HeaderStat icon="🫀" valueNode={<span className="text-rose-600">{Math.round(Number(gameState.playerHealth || 0))}</span>} label="Health" />
              <HeaderStat icon="💰" valueNode={<span>${formatCompact(money)}</span>} label="Money" />
              <HeaderStat icon="💎" valueNode={<span>{formatCompact(diamonds)}</span>} label="Diamonds" />
              <HeaderStat icon="🍼" valueNode={<span>{Math.round(Number(gameState.babyPressure || 0))}</span>} label="Baby" />
            </div>
          )}

          {/* PART B FIX: Show Switch Player button when local coop is enabled */}
          {coopEnabled && (
            <button
              onClick={onSwitchCoopPlayer}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full ${isStorybook ? 'hover:bg-white/10' : 'hover:bg-slate-100'} flex items-center justify-center transition-colors flex-shrink-0`}
              aria-label="Switch Player"
              title="Switch Player"
            >
              <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${isStorybook ? 'text-amber-100' : 'text-slate-600'}`} />
            </button>
          )}

          <button
            onClick={onOpenSettings}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full ${isStorybook ? 'hover:bg-white/10' : 'hover:bg-slate-100'} flex items-center justify-center transition-colors flex-shrink-0`}
          >
            <Settings className={`w-4 h-4 sm:w-5 sm:h-5 ${isStorybook ? 'text-amber-100' : 'text-slate-600'}`} />
          </button>
        </div>

      </div>
    </div>
  );
}