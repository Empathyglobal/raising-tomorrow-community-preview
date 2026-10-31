import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { safeCall } from '@/components/utils/safeCall';
import { createOutcomeTestPayload } from '@/components/game/outcomeTestHarness';
import { X, Info, RotateCcw, Bug, Music, FlaskConical, HardDrive, Package, Undo2, ShoppingCart, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PlayerSpriteAvatar from '@/components/game/PlayerSpriteAvatar';
import { useGameState, getDisplayedChildAge } from '@/components/game/GameStateContext';
import { audioManager } from './AudioManager';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import MusicVolumeSlider from './settings/MusicVolumeSlider';
import SfxVolumeSlider from './settings/SfxVolumeSlider';
import DiagnosticsModal from './DiagnosticsModal';
import SaveLoadModal from './SaveLoadModal';
import SecondChanceModal from './SecondChanceModal';
import { SCENARIO_PACKS } from './scenarioPacks';
import { toast } from 'sonner';
import { seedScenarioHooks, resetCoparentingScenarioHooks } from './seedScenarioHooks';
import { CHAOS_MODE_LEVELS, getChaosLevelFromExpansions, withChaosLevel } from "@/components/game/chaosModeLevels";

const LEGAL_ACK_KEY = "rt_legal_ack_v1";

const PRIVACY_POLICY_URL = "#demo-disabled";
const TERMS_URL = "#demo-disabled";

const LEGAL_TEXT = {
  title: "Legal & Safety",
  updated: "Updated: 2026-01-21",
  sections: [
    {
      h: "Fiction & Simulation",
      p: "Raising Tomorrow is a work of fiction and simulation for entertainment. Characters, events, outcomes, and dialogue are generated and/or simulated and are not intended to describe real people or real-life situations."
    },
    {
      h: "Names & Resemblance",
      p: "Any names you see may be randomly generated or entered by the player. Any resemblance to actual persons, living or dead, is coincidental. If the game references public figures or real-world entities, it does so in a fictional and/or satirical manner and is not endorsed by, affiliated with, or approved by them."
    },
    {
      h: "User-Entered Content",
      p: "You are responsible for any names or text you enter. Do not enter private personal information (addresses, phone numbers, emails, government IDs) or sensitive data about real people. If you choose to enter a real person's name, you do so at your own discretion."
    },
    {
      h: "Not Professional Advice",
      p: "This game does not provide medical, mental health, legal, or financial advice. If you need help in real life, consult qualified professionals."
    },
    {
      h: "Contact",
      p: "This private preview has no support inbox. Review feedback stays local unless you choose to share it."
    }
  ]
};

export default function SettingsModal({ 
  open, 
  onClose = () => {},
  onOpenSaveLoad = () => {} // ISSUE D FIX: pass callback to open SaveLoadModal externally
}) {
  const navigate = useNavigate();
  const {
    gameState,
    resetGame,
    updateState,
    addChild,
    removeChild,
    setActiveKid,
    setSiblingRivalryEnabled,
    loadScenarioForAge,
    addLog
  } = useGameState();
  const [showRestartConfirm, setShowRestartConfirm] = React.useState(false);
  const [diagnosticsOpen, setDiagnosticsOpen] = React.useState(false);
  const [secondChanceOpen, setSecondChanceOpen] = React.useState(false);
  const [addingChild, setAddingChild] = React.useState(false);
  const [newChildData, setNewChildData] = React.useState({
    name: '',
    gender: 'boy',
    toneIndex: 2,
    temperament: 'balanced'
  });
  const [seeding, setSeeding] = React.useState(false);
  const [resettingCoparent, setResettingCoparent] = React.useState(false);
  const [childrenOpen, setChildrenOpen] = React.useState(false);
  const [legalOpen, setLegalOpen] = React.useState(false);
  const [legalAcked, setLegalAcked] = React.useState(() => {
    try { return localStorage.getItem(LEGAL_ACK_KEY) === "1"; } catch { return false; }
  });
  const [audioDebugOpen, setAudioDebugOpen] = React.useState(false);

  const safeVol = (v, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : fallback;
  };

  const secondChanceRemaining = Number.isFinite(Number(gameState.rewind?.remaining))
    ? Math.max(0, Math.floor(Number(gameState.rewind.remaining)))
    : 0;

  const handleMusicToggle = (enabled) => {
    updateState({ audioMusicEnabled: enabled });
    audioManager.setMusicEnabled(enabled);
    localStorage.setItem('rt_music_enabled', enabled);
  };

  const handleSfxToggle = (enabled) => {
    updateState({ audioSfxEnabled: enabled });
    audioManager.setSfxEnabled(enabled);
    localStorage.setItem('rt_sfx_enabled', enabled);
  };

  const handleMusicVolumeChange = (value) => {
    const volume = value[0];
    updateState({ audioMusicVolume: volume });
    audioManager.setMusicVolume(volume);
    localStorage.setItem('rt_music_volume', volume);
  };

  const handleSfxVolumeChange = (value) => {
    const volume = value[0];
    updateState({ audioSfxVolume: volume });
    audioManager.setSfxVolume(volume);
    localStorage.setItem('rt_sfx_volume', volume);
  };

  const MUSIC_THEMES = React.useMemo(() => {
    const fromMgr = audioManager.getAvailableMusicThemes?.();
    return Array.isArray(fromMgr) && fromMgr.length ? fromMgr : [
      { id:'0_5', label:'Tiny Steps Lullaby (0–5)', description:'6/8 lullaby • major pentatonic • music-box warmth' },
      { id:'6_12', label:'After-School Breeze (6–12)', description:'4/4 easy groove • light plucks • ultra-soft shaker' },
      { id:'13_18', label:'Evening Porch Talk (13–18)', description:'4/4 reflective • warm e‑piano • hopeful' },
      { id:'0_5_blanket', label:'Blanket Fort Glow (0–5 alt)', description:'3/4 waltz lullaby • pentatonic • warm rocking' },
      { id:'6_12_sketch', label:'Quiet Sketchbook (6–12 alt)', description:'12/8 rolling feel • gentle plucks • calm focus' },
      { id:'13_18_window', label:'Open Window Night (13–18 alt)', description:'5/4 reflective • arpeggiated e‑piano • airy night' },
      { id:'0_5_fast', label:'Tiny Steps Lullaby (0–5) — FAST', description:'6/8 lullaby • pentatonic • higher BPM' },
      { id:'6_12_fast', label:'After-School Breeze (6–12) — FAST', description:'4/4 gentle groove • higher BPM' },
      { id:'13_18_fast', label:'Evening Porch Talk (13–18) — FAST', description:'4/4 reflective • higher BPM' },
      { id:'0_5_blanket_fast', label:'Blanket Fort Glow (0–5 alt) — FAST', description:'3/4 waltz lullaby • higher BPM' },
      { id:'6_12_sketch_fast', label:'Quiet Sketchbook (6–12 alt) — FAST', description:'12/8 rolling feel • higher BPM' },
      { id:'13_18_window_fast', label:'Open Window Night (13–18 alt) — FAST', description:'5/4 reflective • higher BPM' }
    ];
  }, []);

  const autoThemeKeyForAge = (age) => {
    const a = Number.isFinite(Number(age)) ? Number(age) : 0;
    if (a <= 5) return '0_5';
    if (a <= 12) return '6_12';
    return '13_18';
  };

  const effectiveThemeKey =
    (gameState.audioMusicThemeOverride && gameState.audioMusicThemeOverride !== 'auto')
      ? gameState.audioMusicThemeOverride
      : autoThemeKeyForAge(gameState.currentYear);

  const effectiveThemeLabel =
    (MUSIC_THEMES.find(t => t.id === effectiveThemeKey)?.label) || effectiveThemeKey;

  const handleMusicThemeOverrideChange = (value) => {
    const v = value === 'auto' ? 'auto' : value;
    updateState({ audioMusicThemeOverride: v });
    audioManager.setMusicThemeOverride(v === 'auto' ? null : v);
    try { localStorage.setItem('rt_music_theme_override', v); } catch {}
  };

  const SFX_CATALOG = React.useMemo(() => ([
    {
      id: 'click',
      title: 'Click',
      note: 'UI button taps / simple selections.',
      sources: ['ActionBar.jsx', 'Popups.jsx', 'Game.jsx', 'SettingsModal.jsx']
    },
    {
      id: 'success',
      title: 'Success',
      note: 'Positive outcomes / rewards / good choices.',
      sources: ['ActionResultSheet.jsx', 'PrisonVisitModal.jsx', 'ActionsTab.jsx', 'PetFarewellScenarioModal.jsx', 'Popups.jsx', 'Game.jsx']
    },
    {
      id: 'bad',
      title: 'Bad',
      note: 'Harmful/negative outcomes.',
      sources: ['PetFarewellScenarioModal.jsx', 'Popups.jsx', 'Game.jsx']
    },
    {
      id: 'ageup',
      title: 'Age Up',
      note: 'Advancing to the next year / major transitions.',
      sources: ['Game.jsx']
    }
  ]), []);

  // ISSUE B FIX: Block body scroll when modal is open + ensure restoration
  React.useEffect(() => {
    if (open) {
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
    } else {
      const scrollY = -parseInt(document.body.style.top || '0', 10);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      window.scrollTo(0, scrollY);
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [open]);



  const handleRestart = () => {
    const ok = resetGame();
    if (!ok) return;
    navigate(createPageUrl('Start'));
    safeCall(onClose);
  };

  const handleAbout = () => {
    navigate(createPageUrl('About'));
    safeCall(onClose);
  };


  // QA: Test endings (does not touch save data)
  const handleTestEndings = () => {
    const payload = createOutcomeTestPayload(Date.now());
    safeCall(onClose);
    navigate(createPageUrl('Outcome') + '?test=1', {
      state: { testOutcomePayload: payload }
    });
  };


  const handleLegalAck = () => {
    try { localStorage.setItem(LEGAL_ACK_KEY, "1"); } catch {}
    setLegalAcked(true);
    setLegalOpen(false);
  };

  const handleToggleDebug = () => {
    updateState({ debugUI: !gameState.debugUI });
  };

  const ptaEnabled = !!gameState.expansions?.ptaIlluminati;
  const handleTogglePtaIlluminati = (enabled) => {
    updateState({
      expansions: {
        ...(gameState.expansions || {}),
        ptaIlluminati: enabled
      }
    });
  };

  const landlordLegacyEnabled = !!gameState.expansions?.empireEstatesLandlordLegacy;
  const handleToggleLandlordLegacy = (enabled) => {
    updateState({
      expansions: {
        ...(gameState.expansions || {}),
        empireEstatesLandlordLegacy: enabled
      }
    });
  };

  const chaosLevel = getChaosLevelFromExpansions(gameState.expansions);
  const chaosEnabled = chaosLevel > 0;
  
  const handleToggleChaos = (enabled) => {
    const newLevel = enabled ? 2 : 0;
    updateState({
      expansions: withChaosLevel(gameState.expansions, newLevel),
      ...(enabled ? {} : { chaosPopupPending: null })
    });
  };

  const handleChaosLevelChange = (value) => {
    const newLevel = value[0];
    updateState({
      expansions: withChaosLevel(gameState.expansions, newLevel)
    });
  };

  const siblingRivalryEnabled = !!gameState.expansions?.siblingRivalry;
  const kids = Array.isArray(gameState.kids) ? gameState.kids : [];
  const activeKidId = gameState.activeKidId;

  const handleToggleSiblingRivalry = (enabled) => {
    setSiblingRivalryEnabled(enabled);
  };

  const handleAddChild = () => {
    if (!siblingRivalryEnabled) return;
    const name = newChildData.name.trim() || '';
    
    addChild({ ...newChildData, name });
    setNewChildData({ name: '', gender: 'boy', toneIndex: 2, temperament: 'balanced' });
    setAddingChild(false);
  };

  // Scenario packs state
  const ownedPackIds = gameState.ownedScenarioPackIds || [];
  const enabledPackIds = gameState.enabledScenarioPackIds || [];
  const activePackId = gameState.activeScenarioPackId || "mixed";

  const handleTogglePackEnabled = (packId, enabled) => {
    const nextEnabled = enabled 
      ? [...enabledPackIds, packId]
      : enabledPackIds.filter(id => id !== packId);
    
    updateState({ enabledScenarioPackIds: nextEnabled });
  };

  const handleUnlockPack = (packId) => {
    const nextOwned = [...ownedPackIds, packId];
    const nextEnabled = [...enabledPackIds, packId];
    updateState({ 
      ownedScenarioPackIds: nextOwned,
      enabledScenarioPackIds: nextEnabled
    });
    toast.success(`Unlocked ${getPackById(packId)?.name || 'pack'}`);
  };



  const handleEnableAllOptional = () => {
    const optionalIds = SCENARIO_PACKS.filter(p => !p.alwaysOn && !p.hidden).map(p => p.id);
    const nextEnabled = [...new Set([...enabledPackIds, ...optionalIds])];
    updateState({ enabledScenarioPackIds: nextEnabled });
    toast.success('Enabled all optional packs');
  };

  const handleDisableAllOptional = () => {
    const nextEnabled = enabledPackIds.filter(id => {
      const pack = SCENARIO_PACKS.find(p => p.id === id);
      return pack?.alwaysOn;
    });
    updateState({ 
      enabledScenarioPackIds: nextEnabled,
      activeScenarioPackId: "mixed"
    });
    toast.success('Disabled all optional packs');
  };

  const handleSimulateLockedState = () => {
    updateState({
      ownedScenarioPackIds: ["warm101_v1"],
      enabledScenarioPackIds: ["warm101_v1"],
      activeScenarioPackId: "warm101_v1"
    });
    toast.success('Simulated locked state');
  };

  const handleUnlockAllPacks = () => {
    const allPackIds = SCENARIO_PACKS.map(p => p.id);
    updateState({
      ownedScenarioPackIds: allPackIds,
      enabledScenarioPackIds: allPackIds,
      activeScenarioPackId: "mixed"
    });
    toast.success('Unlocked all packs');
  };

  const getPackById = (id) => SCENARIO_PACKS.find(p => p.id === id);

  const handleSeedScenarios = async () => {
    setSeeding(true);
    try {
      const result = await seedScenarioHooks();
      toast.success(`Seeded scenarios: ${result.created} created, ${result.skipped} skipped`);
    } catch (error) {
      toast.error('Seed failed: ' + error.message);
    } finally {
      setSeeding(false);
    }
  };

  const handleResetCoparentingHooks = async () => {
    setResettingCoparent(true);
    try {
      const result = await resetCoparentingScenarioHooks();
      toast.success(`Co‑Parenting hooks reset: deleted ${result.deleted ?? 'old'}, created ${result.created}`);
    } catch (e) {
      toast.error('Co‑Parenting reset failed: ' + (e?.message || 'Unknown error'));
    } finally {
      setResettingCoparent(false);
    }
  };

  // Debug helper: force a scenario popup for the current age (useful to verify no "answer 1" bypass bugs)
  const handleForceScenarioNow = async () => {
    try {
      // Close settings to avoid modal stacking
      safeCall(onClose);

      // Reset scenario gate for this age, then reload scenario content
      updateState({
        scenarioPending: true,
        scenarioCompletedThisAge: false,
        currentScenarioHookId: null
      });

      await loadScenarioForAge(gameState.currentYear);
      toast.success(`Forced scenario for age ${gameState.currentYear}`);
    } catch (e) {
      console.error('Force scenario failed:', e);
      toast.error('Force scenario failed: ' + (e?.message || 'Unknown error'));
    }
  };

  const forceDeathDebug = () => {
    const ok = window.confirm(
      'dont click this\n\n' +
      'This instantly kills the current player for testing.\n\n' +
      'It will open the Death screen in "Custody Transfer" mode.\n\n' +
      'Proceed?'
    );

    if (!ok) return;

    const now = Date.now();
    const childAge = Number(gameState.currentYear ?? 0);
    const parentAgeAtBirth = Number.isFinite(Number(gameState.parentAgeAtBirth)) ? Number(gameState.parentAgeAtBirth) : 28;
    const genderKey = gameState.parentRole === 'mom' ? 'female' : gameState.parentRole === 'dad' ? 'male' : 'male';
    const spriteIndex = Number.isFinite(Number(gameState.parentAvatarSpriteIndex)) ? Number(gameState.parentAvatarSpriteIndex) : 0;

    updateState(prev => ({
      ...prev,
      deathEvent: {
        emoji: '☠️',
        title: 'Test Death (Debug)',
        body:
          'You pressed the button.\n\n' +
          'A piano falls from the sky like it had a personal vendetta.\n\n' +
          'On the bright side: QA is very proud of you.',
        ts: now
      },
      deathContext: {
        mode: 'succession',
        childAge,
        deceased: {
          name: prev.parentName || 'Guardian',
          role: prev.parentRole || 'player',
          parentAgeAtBirth,
          avatarGender: genderKey,
          avatarSpriteIndex: spriteIndex
        }
      }
    }));

    try { addLog?.('☠️ DEBUG: Forced player death'); } catch {}

    // Close settings and navigate to Death screen
    safeCall(onClose);
    navigate(createPageUrl('Death'));
  };

  // On mount/open, hydrate theme + popupStyle from localStorage if missing
  React.useEffect(() => {
    if (!open) return;
    try {
      const theme = localStorage.getItem('rt_ui_theme');
      if (theme === 'storybook' || theme === 'classic') {
        if (!gameState.settings || gameState.settings.uiTheme !== theme) {
          updateState({ settings: { ...(gameState.settings || {}), uiTheme: theme } });
        }
        try { document.documentElement.dataset.uiTheme = theme; if (import.meta?.env?.DEV && theme === 'storybook') { console.info('[storybook] theme active'); } } catch {}
      }
    } catch {}
    try {
      const raw = localStorage.getItem('rt_popup_style');
      const userSet = localStorage.getItem('rt_popup_style_user_set') === '1';

      const v = (raw === 'opaque' || raw === 'default' || raw === 'storybook') ? raw : null;

      // New default is opaque; migrate legacy 'default' if user never explicitly set it
      const pref =
        (!v) ? 'opaque' :
        (!userSet && v === 'default') ? 'opaque' :
        v;

      // Persist migration/default so it sticks
      try { localStorage.setItem('rt_popup_style', pref); } catch {}

      // Push into state if needed
      if (!gameState.settings || gameState.settings.popupStyle !== pref) {
        updateState({ settings: { ...(gameState.settings || {}), popupStyle: pref } });
      }

      // Apply immediately (prevents UI mismatch while Settings is open)
      try {
        if (pref === 'opaque') document.documentElement.setAttribute('data-rt-popup-style', 'opaque');
        else if (pref === 'storybook') document.documentElement.setAttribute('data-rt-popup-style', 'storybook');
        else document.documentElement.removeAttribute('data-rt-popup-style');
      } catch {}
    } catch {}
  }, [open]);

  // Remove locked behavior - all settings are now changeable during any run
  const isLockedSpecialStart = false;
  const [deleteAccountConfirm, setDeleteAccountConfirm] = React.useState(false);
  const [deletingAccount, setDeletingAccount] = React.useState(false);

  const handleDeleteAccount = async () => {
    toast.info("No online account exists in this local preview. Use your browser site-data controls to remove local saves.");
    setDeleteAccountConfirm(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop - ISSUE B FIX: pointer-events-none when transitioning */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100] pointer-events-auto"
            onClick={() => safeCall(onClose)}
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl my-8 max-h-[85vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
                <h3 className={`text-xl font-bold text-slate-800 ${typeof document !== 'undefined' && document.documentElement?.dataset?.uiTheme === 'storybook' ? 'SBHeaderTitle' : ''}`}>Settings</h3>
                <button
                  onClick={() => safeCall(onClose)}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-4 overflow-y-auto flex-1 max-h-[70vh]">
                <div className="space-y-2">
                  
                  {/* UI Preferences */}
                  <div className={`p-4 rounded-xl border-2 border-slate-200 bg-white space-y-3 ${typeof document !== 'undefined' && document.documentElement?.dataset?.uiTheme === 'storybook' ? 'SBPanel' : ''}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🎨</span>
                      <h4 className={`font-semibold text-slate-800 text-sm ${typeof document !== 'undefined' && document.documentElement?.dataset?.uiTheme === 'storybook' ? 'SBHeaderTitle' : ''}`}>Appearance</h4>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">Show scenario result sheet</span>
                      <Switch
                        checked={gameState.settings?.showScenarioResultSheet ?? true}
                        onCheckedChange={(checked) => updateState({
                          settings: { ...gameState.settings, showScenarioResultSheet: checked }
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">Show coach notes</span>
                      <Switch
                        checked={gameState.settings?.showCoachNotes ?? false}
                        onCheckedChange={(checked) => updateState({
                          settings: { ...gameState.settings, showCoachNotes: checked }
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">Show exact stat changes (debug)</span>
                      <Switch
                        checked={gameState.uiPrefs?.showExactDeltas ?? false}
                        onCheckedChange={(checked) => updateState({
                          uiPrefs: { ...(gameState.uiPrefs || {}), showExactDeltas: checked }
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">Show chapter beats</span>
                      <Switch
                        checked={gameState.settings?.showChapterBeats ?? true}
                        onCheckedChange={(checked) => updateState({
                          settings: { ...gameState.settings, showChapterBeats: checked }
                        })}
                      />
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm text-slate-700">Auto-choose yearly moments (by parenting style)</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          When enabled, yearly A–E moments resolve automatically and still appear in your log.
                        </div>
                      </div>
                      <Switch
                        checked={gameState.settings?.autoChooseYearlyMomentsByStyle ?? false}
                        onCheckedChange={(checked) => updateState({
                          settings: { ...gameState.settings, autoChooseYearlyMomentsByStyle: checked }
                        })}
                      />
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm text-slate-700">Show end‑of‑year recap popup</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Shows a small yearly summary (including finances).
                        </div>
                      </div>
                      <Switch
                        checked={gameState.settings?.showYearRecapPopup ?? true}
                        onCheckedChange={(checked) => updateState({
                          settings: { ...gameState.settings, showYearRecapPopup: checked }
                        })}
                      />
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm text-slate-700">🗓️ Yearly Check‑ins</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Extra birthday check-in popups from packs/special starts. Special Starts default this OFF (except Polygamist Father).
                        </div>
                      </div>
                      <Switch
                        checked={gameState.settings?.yearlyCheckinsEnabled ?? true}
                        onCheckedChange={(checked) => updateState({
                          settings: { ...gameState.settings, yearlyCheckinsEnabled: checked }
                        })}
                      />
                    </div>

                    {/* Appearance Theme */}
                    <div className="flex items-center justify-between gap-3">
                      <label className="text-sm text-slate-700">Theme</label>
                      <select
                        value={gameState.settings?.uiTheme || 'classic'}
                        onChange={(e) => {
                          const theme = e.target.value === 'storybook' ? 'storybook' : 'classic';
                          updateState({ settings: { ...(gameState.settings || {}), uiTheme: theme } });
                          try { localStorage.setItem('rt_ui_theme', theme); } catch {}
                          try { document.documentElement.dataset.uiTheme = theme; if (import.meta?.env?.DEV && theme === 'storybook') { console.info('[storybook] theme active'); } } catch {}
                        }}
                        className="px-2 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
                      >
                        <option value="classic">Classic</option>
                        <option value="storybook">Storybook</option>
                      </select>
                    </div>

                    {/* Popup Style */}
                    <div className="flex items-center justify-between gap-3">
                      <label className="text-sm text-slate-700">Popup Style</label>
                      <select
                        value={gameState.settings?.popupStyle || 'opaque'}
                        onChange={(e) => {
                          const v0 = e.target.value;
                          const v = (v0 === 'opaque' || v0 === 'default' || v0 === 'storybook') ? v0 : 'opaque';

                          updateState({ settings: { ...(gameState.settings || {}), popupStyle: v } });

                          // Persist + mark explicitly user-set so migration won't override them later
                          try {
                            localStorage.setItem('rt_popup_style', v);
                            localStorage.setItem('rt_popup_style_user_set', '1');
                          } catch {}

                          // Apply immediately (no waiting for effects)
                          try {
                            if (v === 'opaque') document.documentElement.setAttribute('data-rt-popup-style', 'opaque');
                            else if (v === 'storybook') document.documentElement.setAttribute('data-rt-popup-style', 'storybook');
                            else document.documentElement.removeAttribute('data-rt-popup-style');
                          } catch {}
                        }}
                        className="px-2 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
                      >
                        <option value="opaque">Opaque (no transparency) — Recommended</option>
                        <option value="default">Default (glass / translucent)</option>
                        <option value="storybook">Storybook Paper</option>
                      </select>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Control how "talky" the game feels. Chapter beats and coach notes can be disabled for a faster pace.
                    </p>
                  </div>

                  {/* Audio Settings */}
                  <div className={`p-4 rounded-xl border-2 border-slate-200 bg-slate-50 space-y-3 ${typeof document !== 'undefined' && document.documentElement?.dataset?.uiTheme === 'storybook' ? 'SBPanel' : ''}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Music className="w-5 h-5 text-slate-600" />
                        <h4 className={`font-semibold text-slate-800 text-sm ${typeof document !== 'undefined' && document.documentElement?.dataset?.uiTheme === 'storybook' ? 'SBHeaderTitle' : ''}`}>Audio</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAudioDebugOpen(v => !v)}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-700 underline underline-offset-2"
                      >
                        Choose your music {audioDebugOpen ? '▴' : '▾'}
                      </button>
                    </div>

                    {audioDebugOpen && (
                      <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-3">
                        <div className="flex items-center gap-2">
                          <Bug className="w-4 h-4 text-slate-500" />
                          <div className="text-xs font-semibold text-slate-700">Audio Debug</div>
                        </div>

                        {/* Music chooser */}
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">Music theme</label>
                          <select
                            value={gameState.audioMusicThemeOverride || 'auto'}
                            onChange={(e) => handleMusicThemeOverrideChange(e.target.value)}
                            className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
                          >
                            <option value="auto">Auto (by age)</option>
                            {MUSIC_THEMES.map(t => (
                              <option key={t.id} value={t.id}>{t.label}</option>
                            ))}
                          </select>
                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            Now playing: <span className="font-semibold text-slate-700">{effectiveThemeLabel}</span>
                            {' '}
                            {(gameState.audioMusicThemeOverride && gameState.audioMusicThemeOverride !== 'auto')
                              ? '(override)'
                              : `(auto for age ${Number(gameState.currentYear ?? 0)})`}
                          </p>
                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            Tip: Use the existing "Test" button next to Music to restart playback after switching themes.
                          </p>
                        </div>

                        {/* SFX catalog */}
                        <div className="space-y-2">
                          <div className="text-xs font-semibold text-slate-600">Sound effects catalog</div>
                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            Click "Play" to audition each effect. (Enable Sound Effects to hear them.)
                          </p>

                          <div className="space-y-2">
                            {SFX_CATALOG.map(sfx => (
                              <div
                                key={sfx.id}
                                className="flex items-start justify-between gap-3 p-2 rounded-lg bg-slate-50 border border-slate-200"
                              >
                                <div className="min-w-0">
                                  <div className="text-xs font-semibold text-slate-800">
                                    {sfx.title} <span className="text-[10px] font-normal text-slate-500">({sfx.id})</span>
                                  </div>
                                  <div className="text-[11px] text-slate-600">{sfx.note}</div>
                                  <div className="text-[10px] text-slate-500 mt-1">
                                    Used in: {sfx.sources.join(', ')}
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => audioManager.playSfx(sfx.id)}
                                  className="shrink-0 px-2 py-1 bg-slate-200 hover:bg-slate-300 rounded text-xs font-medium transition-colors"
                                >
                                  Play
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Music Toggle */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">🎵 Music</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (audioManager.isUnlocked()) {
                              if (gameState.audioMusicEnabled) {
                                audioManager.stopMusic();
                                setTimeout(() => audioManager.startMusic(), 100);
                              } else {
                                audioManager.startMusic();
                              }
                            }
                          }}
                          className="px-2 py-1 bg-slate-200 hover:bg-slate-300 rounded text-xs font-medium transition-colors"
                        >
                          Test
                        </button>
                        <Switch
                          checked={gameState.audioMusicEnabled}
                          onCheckedChange={handleMusicToggle}
                        />
                      </div>
                    </div>

                    {/* ISSUE C FIX: Always render to avoid conditional hooks */}
                    {gameState.audioMusicEnabled && (
                      <MusicVolumeSlider 
                        value={gameState.audioMusicVolume}
                        onChange={handleMusicVolumeChange}
                      />
                    )}

                    {/* SFX Toggle */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">🔊 Sound Effects</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => audioManager.playSfx('click')}
                          className="px-2 py-1 bg-slate-200 hover:bg-slate-300 rounded text-xs font-medium transition-colors"
                        >
                          Test
                        </button>
                        <Switch
                          checked={gameState.audioSfxEnabled}
                          onCheckedChange={handleSfxToggle}
                        />
                      </div>
                    </div>

                    {/* ISSUE C FIX: Always render to avoid conditional hooks */}
                    {gameState.audioSfxEnabled && (
                      <SfxVolumeSlider 
                        value={gameState.audioSfxVolume}
                        onChange={handleSfxVolumeChange}
                      />
                    )}
                  </div>

                  {/* Scenario Packs */}
                  <div className={`p-4 rounded-xl border-2 border-slate-200 bg-white space-y-3 ${typeof document !== 'undefined' && document.documentElement?.dataset?.uiTheme === 'storybook' ? 'SBPanel' : ''}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <ShoppingCart className="w-5 h-5 text-green-600" />
                      <h4 className={`font-semibold text-slate-800 text-sm ${typeof document !== 'undefined' && document.documentElement?.dataset?.uiTheme === 'storybook' ? 'SBHeaderTitle' : ''}`}>Scenario Packs</h4>
                    </div>

                    {/* Focus Selector */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Focus Pack</label>
                      <select
                        value={activePackId}
                        onChange={(e) => updateState({ activeScenarioPackId: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      >
                        <option value="mixed">Mixed (All Enabled)</option>
                        {SCENARIO_PACKS.filter(p => 
                          p.id !== "legacy" && 
                          !p.hidden &&
                          ownedPackIds.includes(p.id) && 
                          enabledPackIds.includes(p.id)
                        ).map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                      <p className="text-[11px] text-slate-500">
                        Mixed pulls from all enabled packs. Focused pack prefers that pack's scenarios.
                      </p>
                    </div>

                    {/* Curiosity Pack Toggle */}
                    <div className="border-t border-slate-200 pt-3 space-y-2">
                      <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Optional Pack</div>
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-800 text-sm">🧠 Curiosity Pack</div>
                          <div className="text-xs text-slate-600">Kids ask funny questions at ages 1–5. Answering shapes intelligence and confidence.</div>
                        </div>
                        <Switch
                          checked={gameState.packs?.curiosityPackEnabled ?? true}
                          onCheckedChange={(checked) => {
                            updateState({
                              packs: { ...(gameState.packs || {}), curiosityPackEnabled: checked },
                              curiosity: checked ? (gameState.curiosity || {}) : { ...(gameState.curiosity || {}), pending: false }
                            });
                          }}
                        />
                      </div>

                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-800 text-sm">🧸 Auto-handle curiosity questions</div>
                          <div className="text-xs text-slate-600">Kid questions will be skipped with a playful guess. No stat penalties.</div>
                        </div>
                        <Switch
                          checked={gameState.settings?.curiosityAutoGuess ?? false}
                          onCheckedChange={(checked) => updateState({
                            settings: { ...gameState.settings, curiosityAutoGuess: checked }
                          })}
                        />
                      </div>
                      </div>

                      {/* Milestones Pack Toggle */}
                      <div className="border-t border-slate-200 pt-3 space-y-2">
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-800 text-sm">🎯 Milestones Pack</div>
                          <div className="text-xs text-slate-600">Funny milestone quests at ages 0,3,6,11,14 for kid and adult. Easy to turn off.</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateState(prev => ({ milestones: { ...(prev.milestones||{}), ui: { ...(prev.milestones?.ui||{}), infoOpen: true } } }))}
                            className="text-xs text-blue-600 hover:text-blue-700 underline"
                          >
                            What is this?
                          </button>
                          <Switch
                            checked={gameState.packs?.milestonesEnabled ?? true}
                            onCheckedChange={(checked) => updateState(prev => ({
                              packs: { ...(prev.packs||{}), milestonesEnabled: checked },
                              milestones: {
                                ...(prev.milestones||{}),
                                ui: {
                                  ...(prev.milestones?.ui||{}),
                                  infoOpen: checked ? (prev.milestones?.ui?.infoOpen || false) : false,
                                  dashboardDismissed: checked ? false : true
                                }
                              }
                            }))}
                          />
                        </div>
                      </div>
                      </div>

                      {/* Individual Packs */}
                    <div className="border-t border-slate-200 pt-3 space-y-2">
                      <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Individual Packs</div>
                      {SCENARIO_PACKS.filter(p => p.id !== "warm101_v1" && p.id !== "legacy" && !p.hidden).map(pack => {
                        const isOwned = ownedPackIds.includes(pack.id);
                        const isEnabled = enabledPackIds.includes(pack.id);
                        return (
                          <div key={pack.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex-1">
                                <div className="font-semibold text-slate-800 text-sm">{pack.name}</div>
                                <div className="text-xs text-slate-600">{pack.description}</div>
                                <div className="text-xs text-slate-500 mt-1">Ages: {pack.recommendedAges}</div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-medium ${isOwned ? 'text-green-600' : 'text-slate-400'}`}>
                                  {isOwned ? '✓ Included' : '🔒 Locked'}
                                </span>
                                {isOwned && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-slate-600">Enabled</span>
                                    <Switch
                                      checked={isEnabled}
                                      onCheckedChange={(checked) => handleTogglePackEnabled(pack.id, checked)}
                                      className="scale-75"
                                    />
                                  </div>
                                )}
                              </div>
                              {!isOwned && gameState.debugUI && (
                                <button
                                  onClick={() => handleUnlockPack(pack.id)}
                                  className="px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded hover:bg-green-600 transition-colors"
                                >
                                  Unlock
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Quick Actions */}
                    <div className="border-t border-slate-200 pt-3 space-y-2">
                      <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Quick Actions</div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleEnableAllOptional}
                          className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium transition-colors"
                        >
                          Enable All Optional
                        </button>
                        <button
                          onClick={handleDisableAllOptional}
                          className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium transition-colors"
                        >
                          Disable All Optional
                        </button>
                      </div>
                    </div>

                    {/* Debug Controls */}
                    {gameState.debugUI && (
                      <div className="border-t border-slate-200 pt-3 space-y-2">
                        <div className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Debug Only</div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleSimulateLockedState}
                            className="flex-1 px-3 py-2 bg-amber-100 hover:bg-amber-200 rounded-lg text-xs font-medium transition-colors"
                          >
                            Simulate Locked State
                          </button>
                          <button
                            onClick={handleUnlockAllPacks}
                            className="flex-1 px-3 py-2 bg-amber-100 hover:bg-amber-200 rounded-lg text-xs font-medium transition-colors"
                          >
                            Unlock All Packs
                          </button>
                        </div>
                        <button
                          onClick={handleSeedScenarios}
                          disabled={seeding}
                          className="w-full px-3 py-2 bg-amber-100 hover:bg-amber-200 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {seeding ? 'Seeding...' : 'Seed Pack Scenarios (Debug)'}
                        </button>

                        <button
                          onClick={handleResetCoparentingHooks}
                          disabled={resettingCoparent}
                          className="w-full px-3 py-2 bg-amber-100 hover:bg-amber-200 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {resettingCoparent ? 'Resetting…' : 'RESET Co‑Parenting Scenarios (Delete Old + Load New)'}
                        </button>

                        <button
                          onClick={handleForceScenarioNow}
                          className="w-full px-3 py-2 bg-amber-100 hover:bg-amber-200 rounded-lg text-xs font-medium transition-colors"
                        >
                          Force This Year's Scenario Popup
                        </button>

                        <div className="text-[11px] text-amber-800 leading-relaxed">
                          Expected auto popups: <span className="font-semibold">1 Scenario</span> per age. Extra auto popups can occur at age 6
                          (interests), during pet loss, and sometimes via reflective moments.
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Expansions */}
                  <div className={`p-4 rounded-xl border-2 border-slate-200 bg-white space-y-3 ${typeof document !== 'undefined' && document.documentElement?.dataset?.uiTheme === 'storybook' ? 'SBPanel' : ''}`}>
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-amber-600" />
                      <h4 className={`font-semibold text-slate-800 text-sm ${typeof document !== 'undefined' && document.documentElement?.dataset?.uiTheme === 'storybook' ? 'SBHeaderTitle' : ''}`}>Expansions</h4>
                    </div>

                    {/* PTA */}
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-800">🕶️ The PTA Illuminati Pack</div>
                          <div className="text-xs text-slate-600">Join the PTA… it's run like a secret society. Climb ranks for school support + networking, at the cost of stress and focus.</div>
                        </div>
                        <Switch checked={ptaEnabled} onCheckedChange={handleTogglePtaIlluminati} />
                      </div>
                    </div>

                    {/* Landlord Legacy */}
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-800">🏠 Empire Estates: Landlord Legacy</div>
                          <div className="text-xs text-slate-600">Adds managers, insurance, tenant archetypes, ethics, and richer landlord events.</div>
                        </div>
                        <Switch checked={landlordLegacyEnabled} onCheckedChange={handleToggleLandlordLegacy} />
                      </div>
                    </div>

                    {/* Chaos Mode */}
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-800">🌪️ Chaos Mode</div>
                          <div className="text-xs text-slate-600">Bonus outlandish popups. Pick how wild you want it.</div>
                          <div className="text-[10px] text-slate-500 mt-1">Level 2 matches the current Chaos system.</div>
                        </div>
                        <Switch checked={chaosEnabled} onCheckedChange={handleToggleChaos} />
                      </div>
                      
                      {chaosEnabled && (
                        <div className="space-y-2 pl-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-700">
                              {CHAOS_MODE_LEVELS.find(l => l.level === chaosLevel)?.label || 'Level 2'}
                            </span>
                          </div>
                          <Slider
                            value={[chaosLevel]}
                            onValueChange={handleChaosLevelChange}
                            min={1}
                            max={3}
                            step={1}
                            className="w-full"
                          />
                          <div className="text-[11px] text-slate-600 leading-relaxed">
                            {CHAOS_MODE_LEVELS.find(l => l.level === chaosLevel)?.details || ''}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Juvenile Justice */}
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-800">⚖️ Juvenile Justice</div>
                          <div className="text-xs text-slate-600">Adds a choice-driven Juvenile Justice storyline. Ignore early warning signs and the system can escalate: diversion → hall → probation. Includes new Learn programs and redemption arcs. (Opt‑in: repeated ‘do nothing’ choices.)</div>
                        </div>
                        <Switch 
                          checked={gameState.enabledScenarioPackIds?.includes('pack_juvenile_justice_v1')} 
                          onCheckedChange={(enabled) => {
                            const current = gameState.enabledScenarioPackIds || [];
                            const next = enabled 
                              ? [...current, 'pack_juvenile_justice_v1']
                              : current.filter(id => id !== 'pack_juvenile_justice_v1');
                            updateState({ enabledScenarioPackIds: next });
                            if (!enabled) {
                              updateState(prev => ({ juvenileJustice: { ...prev.juvenileJustice, disableRequested: true } }));
                            } else {
                              updateState(prev => ({ juvenileJustice: { ...prev.juvenileJustice, disableRequested: false } }));
                            }
                          }} 
                        />
                      </div>
                    </div>

                    {/* Sibling Rivalry + Children Management */}
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-800">👶 Sibling Rivalry</div>
                          <div className="text-xs text-slate-600">
                            {siblingRivalryEnabled 
                              ? 'Multiple children with sibling interactions enabled.' 
                              : 'Enable to allow multiple children (unlimited).'}
                          </div>
                        </div>
                        <Switch 
                          checked={siblingRivalryEnabled} 
                          onCheckedChange={handleToggleSiblingRivalry}
                        />
                      </div>

                      {siblingRivalryEnabled && (
                        <div className="mt-2">
                          <button
                            onClick={() => setChildrenOpen(v => !v)}
                            className="w-full px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium transition-colors"
                          >
                            {childrenOpen ? 'Hide Children' : 'Manage Children'}
                          </button>
                          {childrenOpen && (
                            <div className="mt-2 space-y-2">
                              <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Children: {kids.length}</div>
                              {kids.map((kid, idx) => {
                                const kidName = kid.childSlice?.childName || `Kid ${idx + 1}`;
                                const kidEmoji = kid.childSlice?.childAvatarEmoji || '👶';
                                const isActive = kid.id === activeKidId;
                                const isPrimary = kid.id === kids[0]?.id;
                                const kidToneIndex = Number.isFinite(kid.childSlice?.childAvatarToneIndex) ? Number(kid.childSlice.childAvatarToneIndex) : Number(gameState.childAvatarToneIndex || 0);
                                const kidSpriteIndex = Number.isFinite(Number(kid.childSlice?.childAvatarSpriteIndex)) ? Number(kid.childSlice.childAvatarSpriteIndex) : (Number.isFinite(Number(gameState.childAvatarSpriteIndex)) ? Number(gameState.childAvatarSpriteIndex) : (kidToneIndex % 4));
                                const kidGenderKey = ((kid.childSlice?.childAvatarGender || kid.childSlice?.childGender || gameState.childAvatarGender) === 'girl') ? 'female' : 'male';
                                const kidAge = getDisplayedChildAge(gameState, kid);
                                return (
                                  <div key={kid.id} className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200">
                                    <PlayerSpriteAvatar
                                      genderKey={kidGenderKey}
                                      ageNumber={kidAge}
                                      index={kidSpriteIndex}
                                      size={36}
                                      fallbackEmoji={kidEmoji}
                                      className="rounded-xl bg-slate-50 border border-slate-200"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-slate-800 text-sm truncate">{kidName}</div>
                                      <div className="text-xs text-slate-500">
                                        {isPrimary && '🌟 Primary'}
                                        {isActive && ' • Active'}
                                      </div>
                                    </div>
                                    {!isActive && (
                                      <button
                                        onClick={() => setActiveKid(kid.id)}
                                        className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded hover:bg-blue-600 transition-colors"
                                      >
                                        Focus
                                      </button>
                                    )}
                                    {!isPrimary && (
                                      <button
                                        onClick={() => {
                                          if (window.confirm(`Remove ${kidName}? This cannot be undone.`)) {
                                            removeChild(kid.id);
                                          }
                                        }}
                                        className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded hover:bg-red-200 transition-colors"
                                      >
                                        Remove
                                      </button>
                                    )}
                                  </div>
                                );
                              })}

                              <div className="border-t border-slate-200 pt-3 space-y-2">
                                {!addingChild ? (
                                  <button
                                    onClick={() => setAddingChild(true)}
                                    className="w-full px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors"
                                  >
                                    + Add Child
                                  </button>
                                ) : (
                                  <div className="space-y-2">
                                    <input
                                      type="text"
                                      placeholder="Child name..."
                                      value={newChildData.name}
                                      onChange={(e) => setNewChildData({ ...newChildData, name: e.target.value })}
                                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                      maxLength={20}
                                    />
                                    <select
                                      value={newChildData.temperament}
                                      onChange={(e) => setNewChildData({ ...newChildData, temperament: e.target.value })}
                                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                    >
                                      <option value="balanced">🙂 Balanced</option>
                                      <option value="bold">⚡ Bold Explorer</option>
                                      <option value="sensitive">🌙 Sensitive</option>
                                      <option value="routine">🧱 Routine Lover</option>
                                      <option value="social">🫂 Social Butterfly</option>
                                      <option value="observer">👀 Quiet Observer</option>
                                    </select>
                                    <div className="flex gap-2">
                                      <select
                                        value={newChildData.gender}
                                        onChange={(e) => setNewChildData({ ...newChildData, gender: e.target.value })}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                      >
                                        <option value="boy">Boy</option>
                                        <option value="girl">Girl</option>
                                      </select>
                                      <select
                                        value={newChildData.toneIndex}
                                        onChange={(e) => setNewChildData({ ...newChildData, toneIndex: parseInt(e.target.value) })}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                      >
                                        <option value="0">Lightest</option>
                                        <option value="1">Light</option>
                                        <option value="2">Medium</option>
                                        <option value="3">Dark</option>
                                        <option value="4">Darkest</option>
                                      </select>
                                    </div>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => setAddingChild(false)}
                                        className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        onClick={handleAddChild}
                                        className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        Add
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 leading-relaxed">
                                No limit on children. Add as many as you want.
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>







                  {/* Save & Load - ISSUE D FIX: use external callback */}
                  <button
                    onClick={() => {
                      safeCall(onClose);
                      safeCall(onOpenSaveLoad);
                    }}
                    className="w-full text-left p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                        <HardDrive className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">Save &amp; Load</div>
                        <div className="text-sm text-slate-600">Switch families or save a copy anytime</div>
                      </div>
                    </div>
                  </button>

                  {/* Second Chance (year rewind) */}
                  <button
                    onClick={() => {
                      safeCall(onClose);
                      setSecondChanceOpen(true);
                    }}
                    className="w-full text-left p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/50 transition-all active:scale-[0.98]"
                  >
                    <div className="flex items-start gap-3">
                      <Undo2 className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-800 mb-0.5">Second Chance</div>
                        <div className="text-xs text-slate-600">Rewind 1–4 years ({secondChanceRemaining} left)</div>
                      </div>
                    </div>
                  </button>

                  {/* Legal & Safety */}
                  <button
                    onClick={() => setLegalOpen(true)}
                    className="w-full text-left p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-green-400 hover:bg-green-50/50 transition-all active:scale-[0.98]"
                  >
                    <div className="flex items-start gap-3">
                      <Shield className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-800 mb-0.5">Legal & Safety</div>
                        <div className="text-xs text-slate-600">{legalAcked ? 'Acknowledged ✅' : 'Read & acknowledge'}</div>
                      </div>
                    </div>
                  </button>

                  {/* About */}
                  <button
                    onClick={handleAbout}
                    className="w-full text-left p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/50 transition-all active:scale-[0.98]"
                  >
                    <div className="flex items-start gap-3">
                      <Info className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-800 mb-0.5">About</div>
                        <div className="text-xs text-slate-600">Learn about this game</div>
                      </div>
                    </div>
                  </button>

                  {/* Restart */}
                  {!showRestartConfirm ? (
                    <button
                      onClick={() => setShowRestartConfirm(true)}
                      className="w-full text-left p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-red-400 hover:bg-red-50/50 transition-all active:scale-[0.98]"
                    >
                      <div className="flex items-start gap-3">
                        <RotateCcw className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-800 mb-0.5">Restart Life</div>
                          <div className="text-xs text-slate-600">Start a new game</div>
                        </div>
                      </div>
                    </button>
                  ) : (
                    <div className="p-4 rounded-xl border-2 border-red-400 bg-red-50">
                      <div className="text-sm text-red-800 font-medium mb-3">
                        Are you sure? All progress will be lost.
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowRestartConfirm(false)}
                          className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleRestart}
                          className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
                        >
                          Restart
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Toggle Debug UI */}
                  <button
                    onClick={handleToggleDebug}
                    className="w-full text-left p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-purple-400 hover:bg-purple-50/50 transition-all active:scale-[0.98]"
                  >
                    <div className="flex items-start gap-3">
                      <Bug className="w-6 h-6 text-purple-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-800 mb-0.5">
                          Debug UI {gameState.debugUI ? '(On)' : '(Off)'}
                        </div>
                        <div className="text-xs text-slate-600">Toggle debug information</div>
                      </div>
                    </div>
                  </button>

                  {/* Diagnostics */}
                  <button
                    onClick={() => {
                      safeCall(onClose);
                      setDiagnosticsOpen(true);
                    }}
                    className="w-full text-left p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/50 transition-all active:scale-[0.98]"
                  >
                    <div className="flex items-start gap-3">
                      <FlaskConical className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-800 mb-0.5">Diagnostics</div>
                        <div className="text-xs text-slate-600">View action availability & blockers</div>
                      </div>
                    </div>
                  </button>

                  {/* QA: Test endings */}
                  <button
                    onClick={handleTestEndings}
                    className="w-full text-left p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 transition-all active:scale-[0.98]"
                  >
                    <div className="flex items-start gap-3">
                      <FlaskConical className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-800 mb-0.5">Test endings</div>
                        <div className="text-xs text-slate-600">Open the Outcome screen with a generated test payload (doesn't touch save data)</div>
                      </div>
                    </div>
                  </button>


                  {/* Debug: Force Death */}
                  <button
                    onClick={forceDeathDebug}
                    className="w-full mt-4 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-left hover:bg-rose-100 active:scale-[0.99] transition-all"
                  >
                    <div className="text-sm font-semibold text-rose-800">dont click this</div>
                    <div className="text-[11px] text-rose-700 mt-1">
                      Debug only: instantly kills the player and opens the Death screen.
                    </div>
                  </button>

                  {/* Delete Account */}
                  {!deleteAccountConfirm ? (
                    <button
                      disabled
                      className="w-full text-left p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-red-400 hover:bg-red-50/50 transition-all active:scale-[0.98]"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5">🗑️</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-800 mb-0.5">Online accounts unavailable</div>
                          <div className="text-xs text-slate-600">Saves remain in this browser. Clear site data to remove them.</div>
                        </div>
                      </div>
                    </button>
                  ) : (
                    <div className="p-4 rounded-xl border-2 border-red-400 bg-red-50">
                      <div className="text-sm text-red-800 font-medium mb-3">
                        There is no online account to delete in this local preview.
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setDeleteAccountConfirm(false)}
                          disabled={deletingAccount}
                          className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleDeleteAccount}
                          disabled={deletingAccount}
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingAccount ? 'Deleting...' : 'Delete Account'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <DiagnosticsModal
             open={diagnosticsOpen}
             onClose={() => setDiagnosticsOpen(false)}
           />

           <SecondChanceModal
             open={secondChanceOpen}
             onClose={() => setSecondChanceOpen(false)}
           />

          {/* Legal & Safety Modal */}
          {legalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[110]"
              onClick={() => setLegalOpen(false)}
            />
          )}
          {legalOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-[111] flex items-center justify-center p-4 overflow-y-auto"
            >
              <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl my-8 max-h-[85vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
                  <h3 className="text-xl font-bold text-slate-800">{LEGAL_TEXT.title}</h3>
                  <button
                    onClick={() => setLegalOpen(false)}
                    className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <div className="px-6 py-4 overflow-y-auto flex-1 max-h-[70vh]">
                  <div className="text-xs text-slate-500 mb-4">{LEGAL_TEXT.updated}</div>
                  <div className="space-y-4">
                    {LEGAL_TEXT.sections.map((sec, idx) => (
                      <div key={idx}>
                        <h4 className="font-semibold text-slate-800 text-sm mb-1">{sec.h}</h4>
                        <p className="text-sm text-slate-700 leading-relaxed">{sec.p}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5">
                    <div className="text-xs font-semibold text-slate-600 mb-2">Links</div>
                    <div className="flex flex-col gap-2">
                      <a
                        href={PRIVACY_POLICY_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-medium text-slate-800 text-center"
                      >
                        Privacy Policy
                      </a>
                      <a
                        href={TERMS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-medium text-slate-800 text-center"
                      >
                        Terms of Use
                      </a>
                    </div>
                    <div className="mt-2 text-[11px] text-slate-500">
                      Replace the placeholder URLs with your official policy pages before store submission.
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-200 flex-shrink-0 flex gap-2">
                  <button
                    onClick={() => setLegalOpen(false)}
                    className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleLegalAck}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    I Understand
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          </>
          )}
          </AnimatePresence>
          );
          }