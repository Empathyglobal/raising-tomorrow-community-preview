import React from "react";
import { Button } from "@/components/ui/button";
import { useGameState } from "@/components/game/GameStateContext";
import { AnimatePresence, motion } from "framer-motion";

export default function SchoolConfidenceAnxietyV2Modal() {
  const { gameState, resolveSCAv2Popup, skipSCAv2Popup } = useGameState();
  // Queue-safety: if something else opens, allow Skip to just mark consumed
  const pending = gameState.scaV2PopupPending;

  if (!pending) return null;
  const scenario = pending.scenario || {};
  const choices = Array.isArray(scenario.choices) ? scenario.choices : [];

  const getChoiceByKey = (letter) => choices.find((c) => (c.key || c.letter) === letter);

  return (
    <AnimatePresence>
      {pending && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] bg-black/50" onClick={() => skipSCAv2Popup()} />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed inset-0 z-[301] flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border p-6">
              <div className="mb-4">
                <div className="text-xs font-semibold text-amber-600 mb-1">School Confidence & Anxiety</div>
                <h2 className="text-xl font-bold text-slate-900">{scenario.title || "School Moment"}</h2>
              </div>
              <p className="text-slate-700 whitespace-pre-line mb-6">{scenario.body || "Something happened at school."}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(["A","B","C","D"]).map((k) => {
                  const c = getChoiceByKey(k) || { key: k, text: `Choice ${k}`, effects: {} };
                  return (
                    <Button key={k} onClick={() => resolveSCAv2Popup(k)} variant="secondary" className="w-full h-auto whitespace-normal break-words text-left leading-snug px-4 py-3 justify-start items-start">
                      <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-md bg-amber-100 text-amber-700 text-sm font-bold">{k}</span>
                      <span className="flex-1 min-w-0 whitespace-normal break-words text-left leading-snug">{c.text}</span>
                    </Button>
                  );
                })}
              </div>

              <div className="mt-5 flex justify-end">
                <Button variant="ghost" onClick={() => skipSCAv2Popup()}>Skip</Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}