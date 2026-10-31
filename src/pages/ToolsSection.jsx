import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft } from 'lucide-react';

function HubButton({ emoji, label, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white border border-slate-200 rounded-xl p-4 transition-all active:scale-[0.98] hover:border-cyan-400 hover:bg-cyan-50/50"
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl leading-none">{emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-slate-800">{label}</div>
          {description && <div className="text-xs text-slate-600 mt-0.5">{description}</div>}
        </div>
      </div>
    </button>
  );
}

export default function ToolsSection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50/30 p-4 pb-24">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <h1 className="text-3xl font-bold text-slate-800 mb-2">🧰 Tools & Other</h1>
        <p className="text-sm text-slate-600 mb-6">Catch-all for useful things that don't fit elsewhere</p>

        <div className="space-y-2">
          <HubButton
            emoji="📵"
            label="Phone Management"
            description="Give or take away the phone"
            onClick={() => navigate(createPageUrl('ParentTools'))}
          />
          <HubButton
            emoji="📚"
            label="Bookshelf"
            description="View your study modules"
            onClick={() => navigate(createPageUrl('Bookshelf'))}
          />
          <HubButton
            emoji="🎒"
            label="Inventory"
            description="All items you own"
            onClick={() => navigate(createPageUrl('Inventory'))}
          />
          <HubButton
            emoji="🗂️"
            label="Collections"
            description="Books, games, and purchases"
            onClick={() => navigate(createPageUrl('Collections'))}
          />
          <HubButton
            emoji="🏆"
            label="Trophy Case"
            description="Achievements and unlocks"
            onClick={() => navigate(createPageUrl('TrophyCase'))}
          />
          <HubButton
            emoji="🛂"
            label="Passport"
            description="Travel stamps"
            onClick={() => navigate(createPageUrl('Passport'))}
          />
          <HubButton
            emoji="📊"
            label="Development Details"
            description="Full stats and tiers"
            onClick={() => navigate(createPageUrl('DevelopmentDetails'))}
          />
          <HubButton
            emoji="❓"
            label="How to Play"
            description="Game guide"
            onClick={() => navigate(createPageUrl('HowToPlay'))}
          />
          <HubButton
            emoji="ℹ️"
            label="About"
            description="Learn about this game"
            onClick={() => navigate(createPageUrl('About'))}
          />
        </div>
      </div>
    </div>
  );
}