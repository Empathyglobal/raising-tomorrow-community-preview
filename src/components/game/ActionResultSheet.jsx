import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useGameState, formatMoney, formatDeltas } from './GameStateContext';
import { getAffordableUnlocks } from './shopCatalog';
import { audioManager } from './AudioManager';
import GameModalShell from './GameModalShell';
import TourAnchor from '@/components/tutorial/TourAnchor.jsx';
import { isStorybookPopupsActive } from "@/components/lib/uiTheme";
import { AnimatePresence, motion } from 'framer-motion';
import PopupHeaderImage from '@/components/storybook/PopupHeaderImage';
import SBSticker from '@/components/storybook/SBSticker';
import { inferMomentHeaderKey } from '@/components/storybook/momentHeaderKey';

export default function ActionResultSheet({ open, onClose, result }) {
  const [canDismiss, setCanDismiss] = useState(false);
  const [showCoachNote, setShowCoachNote] = useState(false);
  const [showBackfireNote, setShowBackfireNote] = useState(false);
  const { gameState } = useGameState();
  const isStorybook = isStorybookPopupsActive(gameState);

  // Reset state when opening
  useEffect(() => {
    if (open) {
      setCanDismiss(false);
      setShowCoachNote(false);
      setShowBackfireNote(false);
      const timer = setTimeout(() => setCanDismiss(true), 600);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Play sound on open
  useEffect(() => {
    if (open && result?.moneyDelta > 0) {
      audioManager.playSfx('success');
    }
  }, [open, result]);

  if (!result) return null;

  const { 
    title, 
    body, 
    deltas, 
    moneyDelta, 
    focusDelta, 
    loveDelta, 
    stressDelta,
    healthDelta = 0,
    tags, 
    meta 
  } = result;

  // Safe body renderer: handle string, object, or narrative structures
  const renderBody = (content) => {
    if (!content) return null;
    
    // String or number: render directly
    if (typeof content === 'string' || typeof content === 'number') {
      return String(content);
    }
    
    // Narrative object structure (from some pet actions or special events)
    if (content && typeof content === 'object' && !Array.isArray(content)) {
      const parts = [];
      if (content.headline) parts.push(content.headline);
      if (content.paragraph) parts.push(content.paragraph);
      if (Array.isArray(content.bullets) && content.bullets.length > 0) {
        parts.push(content.bullets.map(b => `• ${b}`).join('\n'));
      }
      if (content.tinyTruth) parts.push(`— ${content.tinyTruth}`);
      return parts.filter(Boolean).join('\n\n');
    }
    
    // Fallback: stringify to avoid crash
    return String(content);
  };

  const bodyText = renderBody(body);

  const n = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
  const moneyDeltaN = n(moneyDelta);
  const focusDeltaN = n(focusDelta);
  const loveDeltaN = n(loveDelta);
  const stressDeltaN = n(stressDelta);
  const healthDeltaN = n(healthDelta);

  const handleClose = () => {
    // Always allow user to close. If onClose is missing, fail silently.
    try {
      onClose?.();
    } catch (e) {
      console.error("ActionResultSheet onClose failed:", e);
    }
  };

  // Build cost/gain lines
  let costLine = null;
  if (moneyDeltaN !== 0) {
    const absVal = Math.abs(moneyDeltaN);
    costLine = moneyDeltaN > 0 
      ? `You earned $${formatMoney(absVal)}` 
      : `You spent $${formatMoney(absVal)}`;
  }

  // Build stat delta line (respecting showExactDeltas preference)
  const showExact = gameState.uiPrefs?.showExactDeltas ?? false;
  
  const formatDelta = (val) => {
    if (val === 0) return '0';
    const absVal = Math.abs(val);
    if (absVal < 0.1) return val > 0 ? '+0.1' : '-0.1';
    const rounded = Math.round(val * 10) / 10;
    const display = rounded % 1 === 0 ? Math.round(rounded) : rounded;
    return val > 0 ? `+${display}` : `${display}`;
  };

  const deltaParts = [];
  
  if (showExact) {
    // Exact mode: show numeric deltas
    if (focusDeltaN !== 0) deltaParts.push(`FOCUS ${formatDelta(focusDeltaN)}`);
    if (loveDeltaN !== 0) deltaParts.push(`LOVE ${formatDelta(loveDeltaN)}`);
    if (stressDeltaN !== 0) deltaParts.push(`STRESS ${formatDelta(stressDeltaN)}`);
    if (healthDeltaN !== 0) deltaParts.push(`HEALTH ${formatDelta(healthDeltaN)}`);
    
    const statsText = formatDeltas(deltas);
    if (statsText) deltaParts.push(statsText);
  } else {
    // Qualitative mode: arrow-based tokens
    const describe = (stat, value) => {
      const v = Math.abs(Number(value) || 0);
      if (!v) return null;

      const arrow = value > 0 ? '↑' : '↓';
      let count = 1;
      if (v >= 4) count = 3;
      else if (v >= 2) count = 2;

      return `${stat} ${arrow.repeat(count)}`;
    };
    
    if (focusDeltaN !== 0) {
      const desc = describe('Focus', focusDeltaN);
      if (desc) deltaParts.push(desc);
    }
    if (loveDeltaN !== 0) {
      const desc = describe('Love', loveDeltaN);
      if (desc) deltaParts.push(desc);
    }
    if (stressDeltaN !== 0) {
      const desc = describe('Stress', stressDeltaN);
      if (desc) deltaParts.push(desc);
    }
    if (healthDeltaN !== 0) {
      const desc = describe('Health', healthDeltaN);
      if (desc) deltaParts.push(desc);
    }
    
    // Child stats
    if (deltas && typeof deltas === 'object') {
      Object.entries(deltas).forEach(([k, v]) => {
        const val = Number(v);
        if (val === 0) return;
        const statName = k.charAt(0).toUpperCase() + k.slice(1);
        const desc = describe(statName, val);
        if (desc) deltaParts.push(desc);
      });
    }
  }

  const deltaTokens = deltaParts.filter(Boolean);
  const deltaLine = deltaTokens.join(' • ');

  // Get affordable unlocks if money gained
  const affordableUnlocks = moneyDeltaN > 0 
    ? getAffordableUnlocks(gameState, moneyDeltaN)
    : [];

  const coachNote = meta?.coachNote;
  const backfireNote = meta?.backfireNote;

  const headerKey = inferMomentHeaderKey(`${title} ${body} ${(tags || []).join(" ")}`);

  if (isStorybook) {
    return (
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[350000] flex items-center justify-center p-4 pb-[env(safe-area-inset-bottom)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ background: "rgba(0,0,0,0.55)" }}
              onClick={handleClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="relative w-[min(92vw,520px)] max-w-[520px] max-h-[calc(100dvh-32px)] overflow-hidden rt-popup--storybook rt-modal-surface flex flex-col"
              initial={{ opacity: 0, y: 14, scale: 0.985, rotate: -0.6 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, y: 12, scale: 0.985, rotate: -0.4 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              <PopupHeaderImage headerKey={headerKey} height={140} />

              <div className="flex-1 overflow-y-auto p-4 pt-3" style={{ WebkitOverflowScrolling: "touch" }}>
                <div className="SBStickerRow mb-3">
                  {moneyDeltaN !== 0 && (
                    <SBSticker
                      emoji="💸"
                      label="Money"
                      value={`${moneyDeltaN > 0 ? "+" : "-"}$${formatMoney(Math.abs(moneyDeltaN))}`}
                      tone={moneyDeltaN > 0 ? "mint" : "gold"}
                      size="sm"
                    />
                  )}
                  {focusDeltaN !== 0 && (
                    <SBSticker emoji="⚡" label="Focus" value={formatDelta(focusDeltaN)} tone="blue" size="sm" />
                  )}
                  {loveDeltaN !== 0 && (
                    <SBSticker emoji="💛" label="Love" value={formatDelta(loveDeltaN)} tone="pink" size="sm" />
                  )}
                  {stressDeltaN !== 0 && (
                    <SBSticker emoji="😮‍💨" label="Stress" value={formatDelta(stressDeltaN)} tone="red" size="sm" />
                  )}
                  {healthDeltaN !== 0 && (
                    <SBSticker emoji="🫶" label="Health" value={formatDelta(healthDeltaN)} tone="mint" size="sm" />
                  )}
                </div>

                <div className="rt-paper-outcome rt-torn-all rt-paper-elev mb-3">
                  <div className="rt-paper-outcome__body whitespace-pre-line">{bodyText}</div>

                  {deltaTokens.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {deltaTokens.map((t, idx) => (
                        <motion.span
                          key={`${t}-${idx}`}
                          className="SBDeltaChip"
                          initial={{ scale: 0.92, rotate: -1.5, opacity: 0 }}
                          animate={{ scale: 1, rotate: 0, opacity: 1 }}
                          transition={{ delay: 0.04 * idx, type: "spring", stiffness: 280, damping: 18 }}
                        >
                          {t}
                        </motion.span>
                      ))}
                    </div>
                  )}
                </div>

                {costLine && (
                  <div className="rt-paper-panel rt-torn-all rt-paper-elev mb-3">
                    <div className="text-sm font-semibold" style={{ color: "var(--ink)" }}>{costLine}</div>
                  </div>
                )}
              </div>

              <div className="p-4 pt-3 border-t border-[rgba(43,33,24,0.22)]">
                <button
                  onClick={handleClose}
                  disabled={!canDismiss}
                  className="rt-paper-continue w-full SBButton SBButton--primary disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {canDismiss ? "Continue" : "Wait…"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <GameModalShell
      open={open}
      title={title}
      headerRight={meta?.emoji ? <span className="text-2xl">{meta.emoji}</span> : null}
      maxWidth="max-w-[420px] sm:max-w-md md:max-w-lg"
      closeOnBackdrop={true}
      onClose={handleClose}
      footer={
        <TourAnchor id="action-result-ok">
          <Button
            data-tour="action-result-ok"
            onClick={handleClose}
            disabled={false}
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {canDismiss ? 'OK' : 'Wait...'}
          </Button>
        </TourAnchor>
      }
    >
      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.map(t => (
            <span key={t} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] uppercase font-bold tracking-wider rounded">
              {t}
            </span>
          ))}
        </div>
      )}

      <p className="text-base text-slate-700 leading-relaxed mb-4 whitespace-pre-line">{bodyText}</p>

      {deltaLine && (
        <div className={`bg-blue-50 rounded-lg px-3 py-2 mb-3 ${typeof document !== 'undefined' && document.documentElement?.dataset?.uiTheme === 'storybook' ? 'SBPanel' : ''}`}>
          {showExact ? (
            <p className="text-sm font-medium text-blue-900">{deltaLine}</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {deltaTokens.map((t, idx) => (
                <span
                  key={`${t}-${idx}`}
                  className="inline-flex items-center rounded-full bg-white/60 px-2.5 py-1 text-xs font-semibold text-blue-900 border border-blue-100"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {costLine && (
        <div className={`${moneyDelta > 0 ? 'bg-emerald-50' : 'bg-amber-50'} rounded-lg px-3 py-2 mb-3 ${typeof document !== 'undefined' && document.documentElement?.dataset?.uiTheme === 'storybook' ? 'SBPanel' : ''}`}>
          {moneyDelta > 0 && (
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-emerald-200 text-emerald-800 text-xs font-bold rounded">
                💸 Payday
              </span>
            </div>
          )}
          <p className={`text-sm font-medium ${moneyDelta > 0 ? 'text-emerald-900' : 'text-amber-900'}`}>
            {costLine}
          </p>
        </div>
      )}

      {moneyDeltaN > 0 && affordableUnlocks.length > 0 && (
        <div className="bg-blue-50 rounded-lg px-3 py-2 mb-4">
          <p className="text-xs font-semibold text-blue-800 mb-2">You can now afford:</p>
          <ul className="space-y-1">
            {affordableUnlocks.map((item) => (
              <li key={item.id} className="text-xs text-blue-700 flex items-center gap-1.5">
                <span>{item.emoji}</span>
                <span>{item.name}</span>
                <span className="text-blue-600">(${formatMoney(item.cost)})</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-3 mb-4">
        {coachNote && (
          <div>
            <button
              onClick={() => setShowCoachNote((prev) => !prev)}
              className="w-full text-left px-3 py-2 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-purple-700">💡 Why this worked</span>
                <span className="text-xs text-purple-600">{showCoachNote ? '▲' : '▼'}</span>
              </div>
            </button>
            {showCoachNote && (
              <div className="mt-2 px-3 py-2 bg-purple-50/50 rounded-lg border border-purple-100">
                <p className="text-xs text-purple-800 leading-relaxed">{coachNote}</p>
              </div>
            )}
          </div>
        )}

        {backfireNote && (
          <div>
            <button
              onClick={() => setShowBackfireNote((prev) => !prev)}
              className="w-full text-left px-3 py-2 bg-gradient-to-br from-rose-50 to-red-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-rose-700">⚠️ Why this backfired</span>
                <span className="text-xs text-rose-600">{showBackfireNote ? '▲' : '▼'}</span>
              </div>
            </button>
            {showBackfireNote && (
              <div className="mt-2 px-3 py-2 bg-rose-50/50 rounded-lg border border-rose-100">
                <p className="text-xs text-rose-800 leading-relaxed">{backfireNote}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameModalShell>
  );
}