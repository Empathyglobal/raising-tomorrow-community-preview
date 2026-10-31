import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { getWisdomTier as getWisdomTierFromCatalog } from '@/components/game/wisdomLensesCatalog';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from "@/components/game/GameStateContext.jsx";
import { splitScenarioText } from './scenarioTextUtils';
import { getPatternCallback, CALLBACK_PROBABILITY } from './familyPatternsNarrative';
import { PACK_MODAL_TIPS } from './scenarioPackTextPools';
import { isStorybookPopupsActive } from "@/components/lib/uiTheme";

import { safeCall } from '@/components/utils/safeCall';
import TourAnchor from '@/components/tutorial/TourAnchor.jsx';
import { toast } from 'sonner';
import { WISDOM_LENSES } from '@/components/game/wisdomLensesCatalog';
import PopupHeaderImage from '@/components/storybook/PopupHeaderImage';
import SBSticker from '@/components/storybook/SBSticker';
import { inferMomentHeaderKeyFromScenario } from '@/components/storybook/momentHeaderKey';
import { pickAutoChoiceByParentingStyle } from './scenarioAutoChoose';
import PlayerSpriteAvatar from './PlayerSpriteAvatar';
import { getPortraitSheetUrl, getAvatarSheetUrl } from './avatarImages';

// --- Choice emoji fallback ---
// Many scenario choices don't include choice.emoji anymore, so the UI only shows A/B/C/D/E.
// This fallback assigns a relevant emoji deterministically (stable within the year) with variety.

const CHOICE_EMOJI_POOLS = {
  connect: ["💛", "🫂", "🫶", "🌿", "🤝", "🧸", "✨"],
  teach: ["🧠", "📚", "📝", "🧩", "🔍", "🧪", "🛠️"],
  boundary: ["🛑", "🧱", "🚧", "🔒", "⚖️", "📌"],
  avoid: ["🙈", "🫥", "😶‍🌫️", "🛋️", "📺", "🌀", "🤷"],
  harm: ["😡", "💥", "🔥", "🗯️", "👎", "📣", "⚡"],
  default: ["✨"]
};

const CHOICE_EMOJI_HINTS = [
  { re: /phone|screen|tiktok|instagram|snapchat|social/i, emojis: ["📱", "📵", "🛑", "🎮"] },
  { re: /sleep|bed|night|tired/i, emojis: ["🌙", "🛏️", "😴"] },
  { re: /homework|school|teacher|test|quiz|grade/i, emojis: ["🎒", "📚", "📝"] },
  { re: /friend|peer|group|bully/i, emojis: ["🤝", "🫂", "💬"] },
  { re: /money|pay|buy|allowance|deposit/i, emojis: ["💸", "🧾", "🪙"] },
  { re: /food|snack|eat|dinner/i, emojis: ["🍎", "🍪", "🥗"] },
  { re: /angry|yell|shout|slam/i, emojis: ["😡", "📣", "💥"] }
];

function pickChoiceEmoji({ existingEmoji, role, letter, scenarioId, text, seededPick, runSeed }) {
  const clean = String(existingEmoji || "").trim();
  if (clean) return clean;

  const r = role || "default";
  const hay = String(text || "");

  // Topic hint (deterministic)
  for (const hint of CHOICE_EMOJI_HINTS) {
    if (hint.re.test(hay)) {
      const hinted = seededPick(hint.emojis, `choiceEmojiHint|${scenarioId}|${letter}|${r}`, runSeed);
      if (hinted) return hinted;
      break;
    }
  }

  // Role pool fallback (deterministic, varied across scenarios)
  const pool = CHOICE_EMOJI_POOLS[r] || CHOICE_EMOJI_POOLS.default;
  return seededPick(pool, `choiceEmoji|${scenarioId}|${letter}|${r}`, runSeed) || "✨";
}

function ChoiceButton({ choice, onSelect, disabled }) {
  const { getActiveChoice, getStressGauge, gameState, seededPick, getStudyPoints, getWisdomTier, isLensEquipped } = useGameState();
  
  // Move getActiveChoice call AFTER hook
  const active = getActiveChoice(choice);
  if (!active) return null;

  const scenarioId = gameState.currentScenario?.id || gameState.currentScenarioHookId || `age_${gameState.currentYear}`;
  const role = active?.role || choice?.role || "default";
  const letter = active?.letter || choice?.letter || "?";
  const emojiTextSource = `${active?.text || ""} ${active?.consequence || ""}`;

  const displayEmoji = pickChoiceEmoji({
    existingEmoji: active?.emoji,
    role,
    letter,
    scenarioId,
    text: emojiTextSource,
    seededPick,
    runSeed: gameState.runSeed
  });
  const stressGauge = getStressGauge();
  const currentStudyPoints =
    (typeof getStudyPoints === "function")
      ? getStudyPoints()
      : Number(gameState.studyPoints || 0);
  const currentAge = gameState.currentYear;

  // Determine Required Study Points
  let requiredStudy = 0;
  if (choice.role === "connect") {
    // Connect choices no longer require Study - baseline parenting skill
    requiredStudy = 0;
  } else if (choice.role === "teach") {
    if (currentAge >= 6 && currentAge <= 9) requiredStudy = 1;
    else if (currentAge >= 10 && currentAge <= 12) requiredStudy = 2;
    else if (currentAge >= 13 && currentAge <= 15) requiredStudy = 4;
    else if (currentAge >= 16) requiredStudy = 6;
  }

  // Per-choice Focus Cost
  const focusCost = Number(
    active?.focusCost ?? choice?.focusCost ?? (
      (!gameState.currentScenario?.meta?.noFocusCostForA && String(letter).toUpperCase() === 'A')
        ? 1 : 0
    )
  );
  const focus = Number(gameState.actionPoints ?? 0);

  // Determine Locks
  let locked = false;
  let lockReason = "";

  const stress = Number(stressGauge?.value ?? gameState.stress ?? 0);
  const wisdomXp = gameState?.wisdom?.xp || {};
  const equippedLenses = gameState?.wisdom?.equipped || [];

  const mindfulnessTierRaw = (typeof getWisdomTier === 'function')
    ? getWisdomTier('mindfulness')
    : getWisdomTierFromCatalog('mindfulness', wisdomXp);

  const mindfulnessActive = equippedLenses.includes('mindfulness');
  const mindfulnessTier = mindfulnessActive ? Number(mindfulnessTierRaw || 0) : 0;

  // Base thresholds with mindfulness softening
  const connectStressCap = 40 + (mindfulnessTier * 5);
  const teachStressCap   = 65 + (mindfulnessTier * 5);

  if (choice.role === "connect" && stress > connectStressCap) {
    locked = true;
    lockReason = `🔒 Too stressed (Gauge ${Math.round(stress)} > ${Math.round(connectStressCap)})`;
  } else if (choice.role === "teach" && stress > teachStressCap) {
    locked = true;
    lockReason = `🔒 Too stressed (Gauge ${Math.round(stress)} > ${Math.round(teachStressCap)})`;
  } else if (choice.role === "boundary" && stress >= 100) {
    locked = true;
    lockReason = `🔒 Overwhelmed (Gauge ${Math.round(stress)} >= 100)`;
  }

  // 2. Study Lock
  if (currentStudyPoints < requiredStudy) {
    const studyReason = `🔒 Need ${requiredStudy} Study (You have ${currentStudyPoints})`;
    lockReason = locked ? `${lockReason} • ${studyReason}` : studyReason;
    locked = true;
  }

  // 3. Focus Lock (per-choice)
  if (focusCost > 0 && focus < focusCost) {
    const focusReason = `🔒 Need ${focusCost} Focus`;
    lockReason = locked ? `${lockReason} • ${focusReason}` : focusReason;
    locked = true;
  }

  const actuallyDisabled = disabled || locked;

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!locked) safeCall(onSelect, choice);
      }}
      disabled={actuallyDisabled}
      className={`w-full bg-white border border-slate-200 rounded-xl p-4 transition-all text-left active:scale-[0.98] ${
        actuallyDisabled 
          ? "opacity-60 cursor-not-allowed hover:border-slate-200 hover:bg-white bg-slate-50" 
          : "hover:border-amber-400 hover:bg-amber-50/50"
      }`}
      style={{ pointerEvents: 'auto' }}
    >
      <div className="flex items-start gap-3 w-full min-w-0">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 relative">
          <span className="text-xl leading-none">{displayEmoji}</span>
          <span className="absolute -top-1 -right-1 text-[10px] font-bold bg-slate-800 text-white rounded-full w-5 h-5 flex items-center justify-center">
            {active.letter}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-slate-700 text-sm leading-relaxed whitespace-normal break-words flex-1">
              {active.text}
            </p>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {active?.meta?.earlyStyled && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {active?.meta?.onStyle ? 'On-style' : 'Off-style'}
                </span>
              )}
              {focusCost > 0 && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  Costs {focusCost} Focus
                </span>
              )}
            </div>
          </div>
          {locked && (
            <p className="text-xs text-red-500 font-medium mt-1">
              {lockReason}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

export default function ScenarioModal({ open, scenario, onClose = () => {}, onChoose = () => {}, disabled }) {
  const { gameState, getScenarioFlavorLine, getScenarioOpenerLine, seededPick, getStressGauge, getStudyPoints, getWisdomTier, isLensEquipped, spendClarity, applyStress: applyStressFromModal, loadScenarioForAge: loadScenarioForAgeFromModal, updateState, addLog } = useGameState();
  const { debugUI, currentMajorHookId, scenarioPending, scenarioCompletedThisAge, familyPatterns, runSeed, childName } = gameState;

  const autoEnabled = Boolean(gameState.settings?.autoChooseYearlyMomentsByStyle);
  const autoChoice = pickAutoChoiceByParentingStyle({ gameState, scenario });

// Wisdom UI helpers
const equipped = gameState.wisdom?.equipped || [];
const clarity = Number(gameState.wisdom?.clarity || 0);
const rerollsThisAge = Number(gameState.wisdom?.rerollsThisAge || 0);
const currentYear = Number(gameState.currentYear || 0);
  const stressGauge = getStressGauge();
  const studyPoints =
    (typeof getStudyPoints === "function")
      ? getStudyPoints()
      : Number(gameState.studyPoints || 0);
  const scrollRef = useRef(null);
  const flavorLine = React.useMemo(() => getScenarioFlavorLine(), [open, getScenarioFlavorLine]);
  
  // Pack badge and tip
  const packInfo = React.useMemo(() => {
    const choicePack = scenario?.meta?.choicePack;
    if (!choicePack) return null;
    
    const packMap = {
      screen_time: { emoji: "📱", name: "Screen Time & Boundaries" },
      siblings: { emoji: "🤝", name: "Sibling Dynamics" },
      school_anxiety: { emoji: "🎒", name: "School Confidence & Anxiety" },
      teen_autonomy: { emoji: "🚪", name: "Teen Autonomy" },
      coparent_together: { emoji: "🤝", name: "Co‑Parenting (Together)" },
      coparent_separated: { emoji: "📱", name: "Co‑Parenting (Two Homes)" },
      modern_parenting: { emoji: "📲", name: "Modern Parenting" },
      modern_parenting_early: { emoji: "🍼", name: "Modern Parenting (0–5)" }
    };
    
    const pack = packMap[choicePack];
    if (!pack) return null;
    
    // Get pack tip
    const tips = PACK_MODAL_TIPS[choicePack] || [];
    if (tips.length === 0) return { ...pack, tip: null };
    
    const tipSeed = `${runSeed}_${scenario.id}_tip`;
    let tip = seededPick(tips, tipSeed, runSeed);
    
    // Replace tokens
    tip = tip.replace(/\{childName\}/g, childName || "your child");
    
    return { ...pack, tip };
  }, [scenario, runSeed, childName, seededPick]);
  
  // Pattern callback logic
  const patternCallback = React.useMemo(() => {
    if (!familyPatterns?.selectedIds || familyPatterns.selectedIds.length === 0) return null;
    if (!scenario?.category) return null;
    
    // Check if this scenario category might relate to family patterns
    const stressCategories = ['conflict', 'loss', 'change', 'stress', 'relationship', 'identity'];
    if (!stressCategories.includes(scenario.category)) return null;
    
    // Probability check (15-25%)
    const seed = `${runSeed}_${scenario.id}_callback`;
    const rng = mulberry32(hashString(seed));
    if (rng() > CALLBACK_PROBABILITY) return null;
    
    // Pick a random active pattern
    const patternId = familyPatterns.selectedIds[Math.floor(rng() * familyPatterns.selectedIds.length)];
    return getPatternCallback(patternId, seed);
  }, [scenario, familyPatterns, runSeed, open]);
  
  // Get opener line (low frequency, seeded, category-aware)
  const openerLine = React.useMemo(
    () => getScenarioOpenerLine(scenario),
    [scenario, getScenarioOpenerLine]
  );
  
  // Split scenario text from prompt
  const { body, prompt } = React.useMemo(
    () => splitScenarioText(scenario?.scenarioText),
    [scenario?.scenarioText]
  );
  
  // Avoid duplicate opener when it's the same as the first body line
  const normalize = (s) => String(s || '').trim().replace(/\s+/g, ' ').toLowerCase();
  const firstLine = React.useMemo(() => {
    const lines = String(body || '').split('\n').map(l => l.trim()).filter(Boolean);
    return lines[0] || '';
  }, [body]);
  const showOpenerLine = React.useMemo(() => Boolean(openerLine) && normalize(openerLine) !== normalize(firstLine), [openerLine, firstLine]);
  
  // Vary modal title
  const titleVariants = [
    "A Moment Arrives",
    "A Choice Shows Up",
    "A Parenting Moment",
    "A Small Turning Point",
    "A Moment Hits"
  ];
  const modalTitle = seededPick(titleVariants, `scenarioTitle|${scenario?.id}`, gameState.runSeed);
  
  // Seeded RNG helpers for callback
  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  function mulberry32(seed) {
    return function() {
      seed |= 0;
      seed = seed + 0x6D2B79F5 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  
  // Vary prompt heading
  const fallbackPrompts = [
    "Your move.",
    "How do you respond?",
    "What happens next?",
    "Choose your response.",
    "How do you handle it?",
    "What do you say?"
  ];
  const promptHeading = prompt || seededPick(fallbackPrompts, `scenarioPrompt|${scenario?.id}`, gameState.runSeed);
  
  // Guard: Only allow opening if scenario is pending and not completed
  const canOpen = open && scenarioPending && !scenarioCompletedThisAge;

  useEffect(() => {
    if (canOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [canOpen]);

  // Block ESC key
  useEffect(() => {
    if (!canOpen) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [canOpen]);

  const isStorybook = isStorybookPopupsActive(gameState);

  // Defensive: never render without valid scenario payload (AFTER all hooks)
  if (!scenario) return null;

  if (isStorybook && canOpen) {
    const letterColor = (letter) => {
      const l = String(letter||'').toUpperCase();
      if (l==='A') return 'rt-paper-choice--red';
      if (l==='B') return 'rt-paper-choice--blue';
      if (l==='C') return 'rt-paper-choice--orange';
      if (l==='D') return 'rt-paper-choice--navy';
      return 'rt-paper-choice--blue';
    };
    // Simple lock model (mirrors core thresholds)
    const stress = Math.round(stressGauge?.value ?? 0);
    const age = Number(gameState.currentYear||0);
    const needStudy = (choice) => {
      let req=0;
      if (choice.role==='connect') {
        // Connect choices no longer require Study
        req = 0;
      } else if (choice.role==='teach') {
        if (age>=6&&age<=9) req=1; 
        else if (age<=12) req=2; 
        else if (age<=15) req=4; 
        else req=6;
      }
      return req;
    };
    const study = studyPoints;

    const headerKey = inferMomentHeaderKeyFromScenario(
      scenario,
      `${modalTitle} ${openerLine} ${body} ${(scenario.choices || []).map(c => c.text).join(' ')}`
    );

    return (
      <motion.div
        className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.18 }}
      >
        <motion.div
          className="absolute inset-0 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.18 }}
        />

        <motion.div
          className="relative w-full max-w-2xl rt-popup--storybook overflow-visible"
          initial={{ opacity: 0, y: 14, scale: 0.985, rotate: -0.6 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        >
          <div className="rt-paper-note rt-torn-bottom rt-paper-elev rt-tilt-note relative z-10 mb-[-10px] overflow-hidden">
            <PopupHeaderImage headerKey={headerKey} height={150} />
            <div className="px-4 pt-3 pb-2">
              <h2 className="rt-note-title">{modalTitle}</h2>

              <div className="SBStickerRow mt-2">
                <SBSticker
                  emoji="😮‍💨"
                  label="Stress"
                  value={stress}
                  tone={stress > 65 ? "red" : (stress > 40 ? "gold" : "mint")}
                  size="sm"
                />
                <SBSticker emoji="📚" label="Study" value={study} tone="blue" size="sm" />
                <SBSticker emoji="🔮" label="Clarity" value={clarity} tone="purple" size="sm" />
              </div>

              {showOpenerLine && <p className="mt-3 rt-note-body">{openerLine}</p>}
              
              {/* Portrait */}
              {(() => {
                const portraitKey = scenario?.meta?.portraitKey;
                const childGenderKey = gameState.childAvatarGender === 'girl' ? 'female' : 'male';
                const childSpriteIndex = Number(gameState.childAvatarSpriteIndex || 0);
                const styles = gameState.childAvatarStyleByStage || {};
                const age = Number(gameState.currentYear || 0);
                
                let sheetUrl;
                if (portraitKey) {
                  sheetUrl = getPortraitSheetUrl(portraitKey, childGenderKey);
                } else {
                  const stage = age >= 18 ? 'adult' : age >= 13 ? 'teen' : null;
                  const styleId = stage ? (styles[stage] || (stage === 'teen' ? 'base' : 'base1')) : null;
                  sheetUrl = styleId ? getAvatarSheetUrl({ age, genderKey: childGenderKey, styleId }) : null;
                }

                return sheetUrl && (
                  <div className="flex flex-col items-center mt-3 mb-2">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-white border-2 border-amber-200 shadow-md">
                      <PlayerSpriteAvatar
                        genderKey={childGenderKey}
                        ageNumber={age}
                        index={childSpriteIndex}
                        size={80}
                        sheetUrlOverride={sheetUrl}
                      />
                    </div>
                    
                    {/* Portrait Caption (mod-only) */}
                    {scenario?.meta?.portraitCaption && (
                      <p className="mt-2 text-xs italic text-amber-700 text-center max-w-xs">
                        {scenario.meta.portraitCaption}
                      </p>
                    )}
                    
                    {/* Portrait Callout (mod-only, future popup placeholder) */}
                    {scenario?.meta?.portraitCallout && (
                      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg max-w-xs">
                        {scenario.meta.portraitCallout.title && (
                          <div className="font-semibold text-amber-900 text-xs mb-1">
                            {scenario.meta.portraitCallout.title}
                          </div>
                        )}
                        {scenario.meta.portraitCallout.body && (
                          <p className="text-xs text-amber-800">
                            {scenario.meta.portraitCallout.body}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}

              <p className="mt-2 rt-note-body">{body}</p>
            </div>
          </div>

          <div className="rt-paper-panel rt-torn-all rt-paper-elev rt-tilt-panel relative z-0 pt-8">
            <div className="rt-prompt-heading mb-3">{promptHeading || "What will you do?"}</div>
            <div>
              {scenario.choices?.map((c, idx) => {
                const req = needStudy(c);
                let locked = false;
                if (c.role === "connect" && stress > 40) locked = true;
                if (c.role === "teach" && stress > 65) locked = true;
                if (c.role === "boundary" && stress >= 100) locked = true;
                if (study < req) locked = true;

                const lc = letterColor(c.letter);

                return (
                  <button
                    key={idx}
                    disabled={locked || disabled}
                    onClick={() => { if (!locked) safeCall(onChoose, c); }}
                    className={`rt-paper-choice ${lc}`}
                    style={{ opacity: locked ? 0.7 : 1 }}
                  >
                    <div className="rt-choice-title">Option {c.letter}</div>
                    <div className="rt-choice-sub">{c.text}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      {canOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 9999, pointerEvents: 'auto' }}
          className="fixed inset-0 flex items-center justify-center p-4"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Prevent closing by clicking backdrop
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="rt-modal-glass bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[calc(100dvh-32px)] flex flex-col overflow-hidden border-2 border-slate-300"
            onClick={(e) => e.stopPropagation()}
            style={{ pointerEvents: 'auto' }}
          >
            {/* Header */}
            <div className="rt-modal-header flex items-center justify-between p-4 border-b border-slate-200 bg-white flex-shrink-0">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 min-w-0 flex-wrap">
                  <h2 className="text-lg font-bold text-slate-800 min-w-0 break-words leading-tight">{modalTitle}</h2>
                  {packInfo && (
                    <div className="shrink-0 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200">
                      <span className="text-sm">{packInfo.emoji}</span>
                      <span className="text-xs font-semibold text-amber-900">{packInfo.name}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                  <span className={stressGauge?.value > 40 ? "text-amber-600" : ""}>
                    Stress Gauge: {Math.round(stressGauge?.value ?? 0)}
                  </span>
                  <span>•</span>
                  <span>Study: {studyPoints}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-xs font-medium text-slate-500">
                   <span>Wisdom:</span>
                   <div className="flex items-center gap-1.5">
                       <span className="font-bold text-slate-700">{equipped[0] ? WISDOM_LENSES.find(l=>l.id===equipped[0])?.emoji : '—'}</span>
                       <span className="font-bold text-slate-700">{equipped[1] ? WISDOM_LENSES.find(l=>l.id===equipped[1])?.emoji : '—'}</span>
                   </div>
                   <span>•</span>
                   <span>Clarity: {clarity}</span>
                  </div>
                {debugUI && currentMajorHookId && (
                  <p className="text-xs text-slate-400 mt-0.5">Event: {currentMajorHookId}</p>
                )}
              </div>
              {debugUI && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (onClose) safeCall(onClose);
                    else { try { toast.info('Choose an option to continue.'); } catch {} }
                  }}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              )}
            </div>

            {/* Content */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 pb-24">
              {/* Wisdom Tools */}
              <div className="flex gap-2">
                {isLensEquipped('mindfulness') && (typeof getWisdomTier === 'function' ? getWisdomTier('mindfulness') : 0) >= 1 && clarity > 0 && (
                  <Button size="sm" variant="outline" onClick={() => { spendClarity(1, "Mindful Pause"); applyStressFromModal(-6, "Mindful Pause"); toast.success("You pause. Your nervous system unclenches a little."); }}>
                    🧘 Pause (Clarity -1)
                  </Button>
                )}
                {isLensEquipped('impermanence') && (typeof getWisdomTier === 'function' ? getWisdomTier('impermanence') : 0) >= 1 && clarity > 0 && scenario?.id.startsWith("year_hook_") && (
                  <Button size="sm" variant="outline" onClick={() => {
                    const tier = typeof getWisdomTier === 'function' ? getWisdomTier('impermanence') : 0;
                    const maxRerolls = tier >= 2 ? 2 : 1;
                    if (rerollsThisAge >= maxRerolls) {
                      toast.error("Reroll limit reached for this age.");
                      return;
                    }
                    if (spendClarity(1, "Impermanence: reroll")) {
                      updateState(prev => ({ wisdom: { ...prev.wisdom, rerollsThisAge: (prev.wisdom.rerollsThisAge || 0) + 1 }}));
                      loadScenarioForAgeFromModal(currentYear, { rerollNonce: (rerollsThisAge || 0) + 1 });
                      toast.success("You let the moment pass without forcing it.");
                    }
                  }}>
                    🌊 Reroll (Clarity -1)
                  </Button>
                )}
              </div>

              {/* Pack Tip */}
              {packInfo?.tip && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-200">
                  <div className="flex items-start gap-2">
                    <span className="text-base flex-shrink-0">💡</span>
                    <div>
                      <div className="font-semibold text-amber-900 text-xs mb-1">Pack Tip</div>
                      <p className="text-xs text-amber-800 leading-relaxed">{packInfo.tip}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Confidence Spike Badge */}
              {scenario.isConfidenceSpike && (
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-3 border border-amber-300">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">⚡</span>
                    <span className="font-bold text-amber-900 text-sm">Confidence Spike</span>
                  </div>
                  <p className="text-xs text-amber-800">
                    This moment showed up because their confidence is running high.
                  </p>
                </div>
              )}

              {/* Confidence Dip Badge */}
              {scenario.isConfidenceDip && (
                <div className="bg-gradient-to-r from-blue-100 to-slate-100 rounded-xl p-3 border border-blue-300">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">🌧️</span>
                    <span className="font-bold text-blue-900 text-sm">Confidence Dip</span>
                  </div>
                  <p className="text-xs text-blue-800">
                    This moment showed up because their confidence is running low.
                  </p>
                </div>
              )}

              {/* Black Belt Bullying Badge */}
              {scenario.isBlackBeltBullying && (
                <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-3 border border-orange-300">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">🥋</span>
                    <span className="font-bold text-orange-900 text-sm">Principal's Office: Self-Defense</span>
                  </div>
                  <p className="text-xs text-orange-800">
                    Your child's Black Belt training just became visible at school.
                  </p>
                </div>
              )}

              {/* Scenario Text */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                {showOpenerLine && (
                  <p className="text-sm text-slate-600 italic mb-2">
                    {openerLine}
                  </p>
                )}

                {/* Portrait (Classic UI) */}
                {(() => {
                  const portraitKey = scenario?.meta?.portraitKey;
                  const childGenderKey = gameState.childAvatarGender === 'girl' ? 'female' : 'male';
                  const childSpriteIndex = Number(gameState.childAvatarSpriteIndex || 0);
                  const styles = gameState.childAvatarStyleByStage || {};
                  const age = Number(gameState.currentYear || 0);
                  
                  let sheetUrl;
                  if (portraitKey) {
                    sheetUrl = getPortraitSheetUrl(portraitKey, childGenderKey);
                  } else {
                    const stage = age >= 18 ? 'adult' : age >= 13 ? 'teen' : null;
                    const styleId = stage ? (styles[stage] || (stage === 'teen' ? 'base' : 'base1')) : null;
                    sheetUrl = styleId ? getAvatarSheetUrl({ age, genderKey: childGenderKey, styleId }) : null;
                  }

                  return sheetUrl && (
                    <div className="flex flex-col items-center mb-3">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-white border-2 border-amber-200 shadow-md">
                        <PlayerSpriteAvatar
                          genderKey={childGenderKey}
                          ageNumber={age}
                          index={childSpriteIndex}
                          size={80}
                          sheetUrlOverride={sheetUrl}
                        />
                      </div>
                      
                      {/* Portrait Caption (mod-only) */}
                      {scenario?.meta?.portraitCaption && (
                        <p className="mt-2 text-xs italic text-amber-700 text-center max-w-xs">
                          {scenario.meta.portraitCaption}
                        </p>
                      )}
                      
                      {/* Portrait Callout (mod-only, future popup placeholder) */}
                      {scenario?.meta?.portraitCallout && (
                        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg max-w-xs">
                          {scenario.meta.portraitCallout.title && (
                            <div className="font-semibold text-amber-900 text-xs mb-1">
                              {scenario.meta.portraitCallout.title}
                            </div>
                          )}
                          {scenario.meta.portraitCallout.body && (
                            <p className="text-xs text-amber-800">
                              {scenario.meta.portraitCallout.body}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}

                <p className="text-slate-900 font-medium leading-relaxed whitespace-pre-wrap">
                  {body}
                </p>

                {flavorLine && (
                  <p className="text-sm text-slate-500 italic mt-2">
                    {flavorLine}
                  </p>
                )}

                {patternCallback && (
                  <p className="text-sm text-slate-600 italic mt-3 pl-3 border-l-2 border-amber-400/40">
                    {patternCallback}
                  </p>
                )}
                </div>

              {/* Prompt heading */}
              <TourAnchor id="scenario-choices">
              <div className="pt-2" data-tour="scenario-choices">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  {promptHeading}
                </h3>
                <div className="space-y-2.5">
                  {scenario.choices?.map((choice, index) => (
                    <ChoiceButton
                      key={index}
                      choice={choice}
                      onSelect={onChoose}
                      disabled={disabled}
                    />
                  ))}
                </div>
              </div>
              </TourAnchor>

              {/* Auto-choose panel */}
              <div className="mt-6 pt-4 border-t border-slate-200">
                {autoEnabled ? (
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base flex-shrink-0">🤖</span>
                      <div className="text-xs font-semibold text-slate-700">Auto‑choose is ON</div>
                    </div>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      Each year, we'll pick the best option for your parenting style and log it.
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        updateState(prev => ({
                          settings: { ...(prev.settings || {}), autoChooseYearlyMomentsByStyle: false }
                        }));
                        toast.success('Auto-choose disabled. Scenarios will pop up normally.');
                      }}
                      className="text-xs"
                    >
                      Turn off
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        if (!autoChoice) return;
                        
                        updateState(prev => ({
                          settings: { ...(prev.settings || {}), autoChooseYearlyMomentsByStyle: true }
                        }));
                        
                        addLog(`🤖 Auto-chose Option ${autoChoice.choice?.letter}. ${autoChoice.explanation}`);
                        
                        safeCall(onChoose, { ...autoChoice.choice, __autoChosen: true });
                      }}
                      disabled={!autoChoice || disabled}
                      className="w-full text-left p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/50 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:bg-white"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl flex-shrink-0">🤖</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-800 mb-1">
                            {autoChoice 
                              ? `Auto‑choose (will pick Option ${autoChoice.choice?.letter})` 
                              : 'Auto‑choose unavailable'}
                          </div>
                          <div className="text-xs text-slate-600 leading-relaxed">
                            {autoChoice 
                              ? autoChoice.explanation 
                              : 'No eligible auto-choice available right now.'}
                          </div>
                          <div className="text-xs text-slate-500 mt-1.5">
                            You can still choose manually any time.
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}