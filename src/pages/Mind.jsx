import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft } from 'lucide-react';

const SUBMENU_ITEMS = [
  { emoji: '📊', label: 'Development Details', route: 'DevelopmentDetails' },
  { emoji: '🎓', label: 'Study Hub', route: 'StudyHub' },
  { emoji: '🧠', label: 'Toolbox', route: 'Toolbox' },
  { emoji: '👩‍🏫', label: 'Tutoring', route: 'Tutoring' }
];

export default function Mind() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 p-4">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 p-2 hover:bg-white/50 rounded-lg transition-colors flex items-center gap-2 text-slate-600"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <h1 className="text-3xl font-bold text-slate-800 mb-2">🧠 Mind</h1>
        <p className="text-sm text-slate-600 mb-6">Intelligence, learning, and skills</p>

        <div className="space-y-3">
          {SUBMENU_ITEMS.map((item) => (
            <button
              key={item.route}
              onClick={() => navigate(createPageUrl(item.route))}
              className="w-full bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/50 active:scale-[0.98] transition-all p-4 text-left"
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