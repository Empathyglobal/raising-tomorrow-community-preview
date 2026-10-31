import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Study() {
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

        <h1 className="text-3xl font-bold text-slate-800 mb-2">🎓 Study</h1>
        
        <div className="bg-white rounded-xl p-8 border border-slate-200 text-center">
          <p className="text-slate-600">Study modules will be added in a future update.</p>
        </div>
      </div>
    </div>
  );
}