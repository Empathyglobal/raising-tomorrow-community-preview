import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useGameState } from "@/components/game/GameStateContext";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Bookshelf() {
  const navigate = useNavigate();
  const { gameState } = useGameState();
  const { studiedItems } = gameState;

  // Sort by age (newest first)
  const sortedItems = [...studiedItems].sort((a, b) => b.age - a.age);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-6">
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
            <h1 className="text-3xl font-bold text-slate-800">📚 Bookshelf</h1>
            <p className="text-sm text-slate-500 mt-1">Modules studied: {studiedItems.length}</p>
          </div>
        </div>

        {/* Items List */}
        {sortedItems.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center border border-slate-200">
            <div className="text-6xl mb-4">📖</div>
            <p className="text-slate-600 text-lg">Nothing studied yet.</p>
            <p className="text-slate-500 text-sm mt-2">Use the Study button to add to your learning log!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedItems.map((item, index) => (
              <motion.div
                key={`${item.id}_${item.age}_${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0">📚</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 text-lg">
                      {item.label} — Age {item.age}
                    </h3>
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-3 italic">
                      "{item.phrase}"
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}