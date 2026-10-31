import React, { useEffect } from 'react';
import { Home, Zap, Users, Bug as BugIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useGameState } from "@/components/game/GameStateContext";
import StickyHeader from './StickyHeader';
import CompactStatusBar from './CompactStatusBar';
import { isStorybookUiActive } from "@/components/lib/uiTheme";
import { hapticTap } from "@/components/game/haptics";
import SettingsModal from './SettingsModal';
import SaveLoadModal from './SaveLoadModal';
import PullToRefresh from '@/components/utils/PullToRefresh';

export default function GameShell({ 
  activeTab, 
  onTabChange, 
  children, 
  onAgeUp, 
  ageUpDisabled,
  centerActionLabel = "Age Up",
  centerActionEmoji = "🎂",
  centerActionDisabledReason,
  blocker,
  showBlockerBar,
  onOpenBlocker,
  onOpenSettings,
  onOpenBugs,
  onSwitchCoopPlayer
}) {
  const { gameState, getActionAvailability, patchRemoteMultiplayer, switchLocalCoopTurn } = useGameState();
  const [resumeTick, setResumeTick] = React.useState(0);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [saveLoadOpen, setSaveLoadOpen] = React.useState(false);
  const [tabScrollPositions, setTabScrollPositions] = React.useState({});
  const contentRefs = React.useRef({});

  // Preserve scroll position when tab changes
  React.useEffect(() => {
    const container = contentRefs.current[activeTab];
    if (container && tabScrollPositions[activeTab] !== undefined) {
      container.scrollTop = tabScrollPositions[activeTab];
    }
  }, [activeTab, tabScrollPositions]);

  // Save scroll position when user scrolls
  const handleScroll = (tab, e) => {
    const scrollTop = e.target.scrollTop;
    setTabScrollPositions(prev => ({
      ...prev,
      [tab]: scrollTop
    }));
  };

  // ISSUE A FIX: Handle app visibility/focus lifecycle
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setResumeTick(t => t + 1);
      }
    };
    const handleFocus = () => {
      setResumeTick(t => t + 1);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);
  
  const popupStyle = gameState.settings?.popupStyle ?? 'opaque';
  useEffect(() => {
    try {
      const uiTheme = document.documentElement?.dataset?.uiTheme;
      const isStorybookTheme = uiTheme === 'storybook';

      if (isStorybookTheme || popupStyle === 'storybook') {
        document.documentElement.setAttribute('data-rt-popup-style', 'storybook');
      } else if (popupStyle === 'opaque') {
        document.documentElement.setAttribute('data-rt-popup-style', 'opaque');
      } else {
        document.documentElement.removeAttribute('data-rt-popup-style');
      }
    } catch {}

    return () => {
      try { document.documentElement.removeAttribute('data-rt-popup-style'); } catch {}
    };
  }, [popupStyle]);

  const parentingStyleId = String(gameState.parentingStyle?.id || 'unsure');

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-rt-parenting-style', parentingStyleId);
    } catch {}
    return () => {
      try { document.documentElement.removeAttribute('data-rt-parenting-style'); } catch {}
    };
  }, [parentingStyleId]);
  
  const ageUpAvail = getActionAvailability('ageUp');
  const isStorybook = isStorybookUiActive(gameState);
  
  // Remote multiplayer state
  const mp = gameState.remoteMultiplayer || {};
  const isRemote = mp?.enabled && mp?.sessionId;
  const mySide = mp?.mySide;
  const activeSide = mp?.activeSide;
  const isMyTurn = !isRemote ? true : (mySide && activeSide ? mySide === activeSide : false);

  let buttonLabel = centerActionLabel;
  let buttonEmoji = centerActionEmoji;
  let isDisabled = ageUpDisabled || !ageUpAvail.enabled;
  let disabledReason = centerActionDisabledReason ||
    (!ageUpAvail.enabled
      ? (ageUpAvail.reason || 'Not available right now')
      : (ageUpDisabled && blocker?.reason)
        ? blocker.reason
        : 'Not available right now');

  // Override for remote multiplayer
  if (isRemote) {
    if (!mySide) {
      buttonLabel = "Connecting";
      buttonEmoji = "🌐";
      isDisabled = true;
      disabledReason = "Connecting to session...";
    } else if (!isMyTurn) {
      buttonLabel = "Waiting";
      buttonEmoji = "⏳";
      isDisabled = true;
      disabledReason = "Waiting for the other player to finish their turn.";
    } else if (mySide === 'player') {
      buttonLabel = "End Turn";
      buttonEmoji = "🔄";
      isDisabled = false;
    } else if (mySide === 'partner') {
      buttonLabel = "End Year";
      buttonEmoji = "🎂";
      isDisabled = isDisabled || mp?.pendingCommit;
    }
  }


  return (
    <div
      className={`fixed inset-0 flex flex-col overflow-hidden ${isStorybook ? 'bg-transparent' : 'bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/30'}`}
      style={{ height: '100dvh' }}
    >
      {/* Sticky Header */}
      <div className="flex-shrink-0">
        <StickyHeader 
          onOpenSettings={() => setSettingsOpen(true)} 
          onOpenProfile={() => onTabChange('profile')} 
          onOpenRelationships={() => onTabChange('relationships')}
          onSwitchCoopPlayer={onSwitchCoopPlayer}
        />
      </div>

      {/* Compact Status Bar */}
      <div className="flex-shrink-0">
        <CompactStatusBar />
      </div>
      
      {/* Main Content Area - Scrollable */}
      <div className={`flex-1 min-h-0 overflow-hidden ${isStorybook ? 'SBBookStage' : ''}`}>
        <PullToRefresh 
          onRefresh={async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
          }} 
          enabled={true}
        >
          <motion.div 
            ref={el => { if (el) contentRefs.current[activeTab] = el; }}
            className={`${isStorybook ? 'SBBookFrame' : ''} h-full overflow-y-auto`}
            style={{ WebkitOverflowScrolling: 'touch' }}
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onScroll={(e) => handleScroll(activeTab, e)}
          >
            {children}
          </motion.div>
        </PullToRefresh>
      </div>

      {/* Global Blocker Bar (non-home tabs) */}
      {showBlockerBar && blocker && activeTab !== 'home' && (
        <div className="relative flex-shrink-0 bg-gradient-to-r from-amber-400 to-orange-400 border-t border-amber-500 shadow-lg z-40 px-4 py-3">
          <div className="rt-container flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-amber-900 text-sm leading-tight mb-1">
                {blocker.title}
              </div>
              <div className="text-xs text-amber-800 leading-tight">
                {blocker.reason}
              </div>
            </div>
            <button
              onClick={() => {
                onTabChange('home');
                onOpenBlocker?.();
              }}
              className="px-4 py-2 bg-white hover:bg-amber-50 text-amber-900 text-xs font-bold rounded-lg transition-colors flex-shrink-0 shadow-md"
            >
              {blocker.ctaLabel || "Open"}
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar with Center Age Up Button */}
      <div 
        className={`relative flex-shrink-0 z-40 shadow-2xl ${isStorybook ? 'SBNavBar' : 'bg-white border-t border-slate-200'}`}
        style={{ marginTop: '2rem', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {/* White nav bar */}
        <div className="relative">
          <div className="flex items-center justify-around h-16 px-2">
            {/* Left button: Home */}
            <button
              data-tour="tab-home"
              onClick={() => onTabChange('home')}
              className={`flex flex-col items-center justify-center flex-1 gap-0.5 transition-colors relative ${
                activeTab === 'home'
                  ? (isStorybook ? 'SBNavItem SBNavItem--active' : 'text-amber-600')
                  : (isStorybook ? 'SBNavItem' : 'text-slate-400 hover:text-slate-600')
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] font-medium">Home</span>
            </button>
            
            {/* Left-middle button: Actions */}
            <button
              data-tour="tab-actions"
              onClick={() => onTabChange('actions')}
              className={`flex flex-col items-center justify-center flex-1 gap-0.5 transition-colors relative ${
                activeTab === 'actions'
                  ? (isStorybook ? 'SBNavItem SBNavItem--active' : 'text-amber-600')
                  : (isStorybook ? 'SBNavItem' : 'text-slate-400 hover:text-slate-600')
              }`}
            >
              <Zap className="w-5 h-5" />
              <span className="text-[10px] font-medium">Actions</span>
            </button>
            
            {/* Center spacer for Age Up button */}
            <div className="flex-1" />
            
            {/* Right-middle button: Relationships */}
            <button
              data-tour="tab-relationships"
              onClick={() => onTabChange('relationships')}
              className={`flex flex-col items-center justify-center flex-1 gap-0.5 transition-colors relative ${
                activeTab === 'relationships'
                  ? (isStorybook ? 'SBNavItem SBNavItem--active' : 'text-amber-600')
                  : (isStorybook ? 'SBNavItem' : 'text-slate-400 hover:text-slate-600')
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="text-[10px] font-medium">Relationships</span>
            </button>
            
            {/* Right button: Bugs */}
            <button
              data-tour="tab-bugs"
              onClick={onOpenBugs}
              className={`flex flex-col items-center justify-center flex-1 gap-0.5 transition-colors ${isStorybook ? 'SBNavItem' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <BugIcon className="w-5 h-5" />
              <span className="text-[10px] font-medium">Bugs</span>
            </button>
          </div>

          {/* Center Age Up Button - Floating Above Nav */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-8">
            <div className="relative group">
              <motion.button
                data-tour="age-up"
                onClick={() => {
                  if (!isDisabled) hapticTap(25);
                  
                  if (isRemote && isMyTurn && mySide === 'player') {
                    const ok = switchLocalCoopTurn();
                    if (!ok) {
                      toast.error('Cannot pass turn right now');
                      return;
                    }
                    patchRemoteMultiplayer({
                      pendingCommit: {
                        type: 'pass',
                        expectedVersion: mp.stateVersion,
                        nextActiveSide: 'partner',
                        createdAt: Date.now()
                      }
                    });
                    return;
                  }
                  
                  if (isRemote && isMyTurn && mySide === 'partner') {
                    patchRemoteMultiplayer({
                      pendingCommit: {
                        type: 'endYear',
                        expectedVersion: mp.stateVersion,
                        nextActiveSide: 'player',
                        fromYear: gameState.currentYear,
                        createdAt: Date.now()
                      }
                    });
                  }
                  
                  onAgeUp();
                }}
                disabled={isDisabled}
                whileTap={!isDisabled ? { scale: 0.95 } : {}}
                className={`w-16 h-16 rounded-full shadow-xl flex flex-col items-center justify-center border-4 border-white transition-all ${
                  isDisabled
                    ? 'bg-slate-300 cursor-not-allowed opacity-60'
                    : 'bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 active:scale-95'
                }`}
              >
                <span className="text-2xl">{buttonEmoji}</span>
                <span className="text-[9px] font-bold text-white mt-0.5">{buttonLabel}</span>
              </motion.button>
              
              {isDisabled && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 max-w-[80vw] px-3 py-1.5 bg-slate-900/90 text-white text-xs text-center rounded-full shadow-lg pointer-events-none whitespace-normal leading-snug">
                  {disabledReason}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ISSUE D FIX: Move modals outside Settings to prevent unmounting on close */}
      <SettingsModal 
        open={settingsOpen} 
        onClose={() => setSettingsOpen(false)}
        onOpenSaveLoad={() => setSaveLoadOpen(true)}
      />
      <SaveLoadModal
        open={saveLoadOpen}
        onClose={() => setSaveLoadOpen(false)}
        mode="inGame"
      />
    </div>
  );
}