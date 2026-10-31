import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useGameState } from "@/components/game/GameStateContext";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Collections() {
  const navigate = useNavigate();
  const { gameState } = useGameState();
  const { bookshelf, passportStamps, gameShelf } = gameState;

  const normalizeStamp = (stamp) => {
    const s = (stamp && typeof stamp === 'object') ? stamp : {};
    const name = s.name || s.place || 'Unknown destination';
    const age = Number(s.age ?? 0);
    const flagEmoji = s.flagEmoji || s.flag || (!s.landmarkEmoji ? s.emoji : null) || '';
    const landmarkEmoji = s.landmarkEmoji || (s.flagEmoji ? s.emoji : null) || '✈️';
    const memory = s.memory || s.punchline || '';
    const souvenir = s.souvenir || null;
    return { ...s, name, age, flagEmoji, landmarkEmoji, memory, souvenir };
  };

  const videoGames = gameShelf.filter(g => g.kind === 'video_game');
  const boardGames = gameShelf.filter(g => g.kind === 'board_game');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/30 p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Button
              onClick={() => navigate(createPageUrl('Game'))}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold text-slate-800">Collections</h1>
          </div>
          <p className="text-xs text-slate-500 ml-11">
            Everything you've collected across this life
          </p>
        </motion.div>

        {/* Bookshelf */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-slate-100 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <span>📚</span>
            Bookshelf ({bookshelf.length})
          </h3>
          {bookshelf.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No books yet</p>
          ) : (
            <div className="space-y-2">
              {bookshelf.map((book, idx) => (
                <div key={idx} className="p-3 bg-amber-50 rounded-lg">
                  <div className="font-medium text-slate-800 text-sm">
                    {book.title} <span className="text-xs text-slate-500">(Age {book.age})</span>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">{book.punchline}</div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Passport Stamps */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-slate-100 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <span>🛂</span>
            Passport Stamps ({passportStamps.length})
          </h3>
          {passportStamps.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No travels yet</p>
          ) : (
            <div className="space-y-2">
              {(Array.isArray(passportStamps) ? passportStamps : [])
                .filter(s => s && typeof s === 'object')
                .sort((a, b) => Number(b.age ?? 0) - Number(a.age ?? 0))
                .map((stamp, idx) => {
                  const s = normalizeStamp(stamp);
                  const key = s.id || `${s.code || 'stamp'}_${s.age}_${idx}`;
                  return (
                    <div key={key} className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl" aria-label="Landmark">{s.landmarkEmoji}</span>
                        {s.flagEmoji && (
                          <span className="text-xl" aria-label="Flag">{s.flagEmoji}</span>
                        )}
                        <div className="font-medium text-slate-800 text-sm">
                          {s.name}{' '}
                          <span className="text-xs text-slate-500">(Age {s.age})</span>
                        </div>
                      </div>
                      {s.memory && (
                        <div className="text-xs text-slate-600 mt-1 italic">"{s.memory}"</div>
                      )}
                      {s.souvenir && (
                        <div className="mt-2 text-[10px] text-slate-500">Souvenir: {s.souvenir}</div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </motion.div>

        {/* Game Shelf */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-slate-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <span>🎮</span>
            Game Shelf ({gameShelf.length})
          </h3>
          
          {gameShelf.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No games yet</p>
          ) : (
            <>
              {videoGames.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-slate-600 mb-2">Video Games</h4>
                  <div className="space-y-2">
                    {videoGames.map((game, idx) => (
                      <div key={idx} className="p-3 bg-violet-50 rounded-lg">
                        <div className="font-medium text-slate-800 text-sm">
                          {game.title} <span className="text-xs text-slate-500">(Age {game.age})</span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1">{game.punchline}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {boardGames.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-600 mb-2">Board Games</h4>
                  <div className="space-y-2">
                    {boardGames.map((game, idx) => (
                      <div key={idx} className="p-3 bg-green-50 rounded-lg">
                        <div className="font-medium text-slate-800 text-sm">
                          {game.title} <span className="text-xs text-slate-500">(Age {game.age})</span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1">{game.punchline}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}