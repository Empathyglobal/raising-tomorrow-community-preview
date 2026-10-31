import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft } from 'lucide-react';

const SUBMENU_ITEMS = [
  { emoji: '🎯', label: 'Strategies', route: 'Strategies' },
  { emoji: '🛡️', label: 'Parent Tools', route: 'ParentTools' },
  { emoji: '💪', label: 'Wellbeing', route: 'Wellbeing' }
];

export default function Growth() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50/30 p-4">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 p-2 hover:bg-white/50 rounded-lg transition-colors flex items-center gap-2 text-slate-600"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <h1 className="text-3xl font-bold text-slate-800 mb-2">📈 Growth</h1>
        <p className="text-sm text-slate-600 mb-6">Confidence, resilience, and development</p>

        <div className="space-y-3">
          {SUBMENU_ITEMS.map((item) => (
            <button
              key={item.route}
              onClick={() => navigate(createPageUrl(item.route))}
              className="w-full bg-white border border-slate-200 rounded-xl hover:border-green-400 hover:bg-green-50/50 active:scale-[0.98] transition-all p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{item.emoji}</span>
                <div className="flex-1">
                  <div className="font-semibold text-slate-800">{item.label}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}