import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft } from 'lucide-react';

const SUBMENU_ITEMS = [
  { emoji: '🧰', label: 'Other & Tools', route: 'ToolsSection' }
];

export default function Endgame() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 p-2 hover:bg-white/50 rounded-lg transition-colors flex items-center gap-2 text-slate-600"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <h1 className="text-3xl font-bold text-slate-800 mb-2">🏁 Endgame</h1>
        <p className="text-sm text-slate-600 mb-6">Plan for the future and review outcomes</p>

        <div className="space-y-2">
          {SUBMENU_ITEMS.map((item) => (
            <button
              key={item.route}
              onClick={() => navigate(createPageUrl(item.route))}
              className="w-full bg-white border border-slate-200 rounded-xl hover:border-slate-400 hover:bg-slate-50 active:scale-[0.98] transition-all p-4 flex items-center gap-3"
            >
              <span className="text-2xl">{item.emoji}</span>
              <span className="text-sm font-semibold text-slate-700">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}