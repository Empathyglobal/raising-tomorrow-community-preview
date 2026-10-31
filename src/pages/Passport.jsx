import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { childNameify } from '../components/game/childNameifyUtil';
import { useGameState } from '../components/game/GameStateContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Passport() {
  const navigate = useNavigate();
  const { gameState } = useGameState();
  const { passportStamps } = gameState;

  const normalizeStamp = (stamp) => {
    const s = (stamp && typeof stamp === 'object') ? stamp : {};
    
    // New schema (after landmark-passport update):
    // { name, age, code, flagEmoji, landmarkEmoji, memory, souvenir }
    //
    // Back-compat:
    // - older stamps used `emoji` as the flag
    // - some legacy pages used `place` / `punchline`
    const name = s.name || s.place || 'Unknown destination';
    const age = Number(s.age ?? 0);
    
    const flagEmoji = s.flagEmoji || s.flag || (!s.landmarkEmoji ? s.emoji : null) || '';
    const landmarkEmoji = s.landmarkEmoji || (s.flagEmoji ? s.emoji : null) || '✈️';
    
    const memory = s.memory || s.punchline || '';
    const souvenir = s.souvenir || null;
    
    return {
      ...s,
      name,
      age,
      flagEmoji,
      landmarkEmoji,
      memory,
      souvenir
    };
  };

  // Sort stamps by age (newest first)
  const sortedStamps = (Array.isArray(passportStamps) ? passportStamps : [])
    .filter(s => s && typeof s === 'object')
    .sort((a, b) => Number(b.age ?? 0) - Number(a.age ?? 0));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(createPageUrl('Game'))}
            className="flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">🛂 Passport</h1>
            <p className="text-sm text-slate-500 mt-1">Stamps collected: {passportStamps?.length || 0}</p>
          </div>
        </div>

        {/* Stamps List */}
        {sortedStamps.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center border border-slate-200">
            <div className="text-6xl mb-4">✈️</div>
            <p className="text-slate-600 text-lg">No stamps yet.</p>
            <p className="text-slate-500 text-sm mt-2">
              Travel internationally to collect passport stamps (flag + landmark).
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedStamps.map((stamp, idx) => {
              const s = normalizeStamp(stamp);
              const key = s.id || `${s.code || 'stamp'}_${s.age}_${idx}`;
              return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="relative w-14 h-14 flex-shrink-0 flex items-center justify-center">
                    <div className="text-4xl" aria-label="Landmark stamp">{s.landmarkEmoji}</div>
                    {s.flagEmoji && (
                      <div className="absolute -bottom-1 -right-1 text-xl" aria-label="Country flag">
                        {s.flagEmoji}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 text-lg">
                      {s.name} — Age {s.age}
                    </h3>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed italic">
                      "{childNameify(s.memory || 'A hazy memory you can\'t quite put into words.', gameState.childName)}"
                    </p>
                    {s.souvenir && (
                      <div className="mt-3 inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                        Souvenir: {s.souvenir}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}