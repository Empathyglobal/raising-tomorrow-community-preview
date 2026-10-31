import React from "react";
import { useGameState } from './GameStateContext';
import { AnimatePresence, motion } from "framer-motion";
import { childNameify } from "./childNameifyUtil";
import { isStorybookPopupsActive } from "@/components/lib/uiTheme";
import PopupHeaderImage from '@/components/storybook/PopupHeaderImage';
import SBSticker from '@/components/storybook/SBSticker';
import { inferMomentHeaderKey } from '@/components/storybook/momentHeaderKey';

export default function KidLogicPopupModal({
  open,
  popup,
  childName,
  disabled = false,
  onChoose,
}) {
  const { gameState } = useGameState();

  if (!open || !popup) return null;
  const isStorybook = isStorybookPopupsActive(gameState);

  const kidText = childNameify(popup.kid, childName);

  const headerKey = inferMomentHeaderKey(kidText);

  const choices = [
    {
      key: "empathize",
      label: "Empathize",
      subtitle: "Validate + guide",
      emoji: "🤝",
      text: childNameify(popup.options?.empathize || "", childName),
    },
    {
      key: "ignore",
      label: "Ignore",
      subtitle: "Don't feed it",
      emoji: "🫥",
      text: childNameify(popup.options?.ignore || "", childName),
    },
    {
      key: "boundary",
      label: "Boundary",
      subtitle: "Calm rule + follow-through",
      emoji: "🧱",
      text: childNameify(popup.options?.boundary || "", childName),
    },
  ];

  if (isStorybook) {
    return (
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[2000] flex items-center justify-center p-4 rt-popup--storybook"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="relative w-full max-w-2xl"
              initial={{ opacity: 0, y: 14, scale: 0.985, rotate: -0.6 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, y: 12, scale: 0.985, rotate: -0.4 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              <div className="rt-paper-note -mb-6 relative z-10 overflow-hidden">
                <PopupHeaderImage headerKey={headerKey} height={140} />
                <div className="px-4 pt-3 pb-2">
                  <h2 className="text-xl font-bold" style={{ color: "var(--ink)" }}>🤪 Kid Logic Moment</h2>

                  <div className="SBStickerRow mt-2">
                    <SBSticker emoji="🧠" label="Interpretation" value="Kid Logic" tone="purple" size="sm" />
                    <SBSticker emoji="🫶" label="Goal" value="Stay calm" tone="mint" size="sm" />
                  </div>

                  <p className="mt-3" style={{ color: "var(--ink)" }}>{kidText}</p>
                </div>
              </div>

              <div className="rt-paper-panel pt-8">
                {choices.map(c => (
                  <button
                    key={c.key}
                    disabled={disabled}
                    onClick={() => onChoose?.(c.key)}
                    className="rt-paper-choice rt-paper-choice--orange"
                  >
                    <div className="rt-choice-title">{c.label}</div>
                    <div className="rt-choice-sub">{c.text}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/70"
            style={{ zIndex: 10000 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{ zIndex: 10001 }}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
          >
            <div className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-white/10">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-2xl font-bold text-white">🤪 Kid Logic Moment</h2>
                <p className="text-sm text-white/70 mt-1">
                  Choose how you respond. (No perfect answers.)
                </p>
              </div>

              <div className="p-6 overflow-y-auto">
                <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                  <div className="text-xs uppercase tracking-wider text-white/60 mb-2">
                    Kid says
                  </div>
                  <div className="text-white text-lg font-semibold leading-snug">
                    {kidText}
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {choices.map((c) => (
                    <button
                      key={c.key}
                      disabled={disabled}
                      onClick={() => onChoose?.(c.key)}
                      className="w-full text-left rounded-2xl p-4 bg-white/5 hover:bg-white/10 border border-white/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{c.emoji}</div>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="font-semibold text-white">{c.label}</span>
                            <span className="text-xs text-white/60">{c.subtitle}</span>
                          </div>
                          <div className="mt-1 text-white/90 text-sm leading-relaxed">
                            {c.text}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-4 text-xs text-white/40">
                  Tip: "Ignore" is best for harmless nonsense. For safety/health, a calm boundary is usually best.
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}