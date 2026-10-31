import React from 'react';
import IconForKey from './IconForKey';

const TierPill = ({ label, active }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
    active ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-slate-100 border-slate-200 text-slate-500'
  }`}>{label}</span>
);

export default function BadgeCard({ def, earned, onClick, isNew = false }) {
  const best = earned?.bestTierEarned || null;
  const statusText = best ? `${best} Tier` : 'Locked';
  const achieved = new Set(best ? [best] : []);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl p-4 border transition-all bg-white/80 hover:bg-white shadow-sm ${
        best ? 'border-amber-200' : 'border-slate-200'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="relative">
          <IconForKey iconKey={def.iconKey} />
          {isNew && (
            <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow">NEW</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-800 truncate">{def.name}</h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${best ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>{statusText}</span>
          </div>
          <p className="text-sm text-slate-600 mt-1 line-clamp-2">{def.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <TierPill label="Bronze" active={best === 'Bronze' || best === 'Silver' || best === 'Gold'} />
            <TierPill label="Silver" active={best === 'Silver' || best === 'Gold'} />
            <TierPill label="Gold" active={best === 'Gold'} />
          </div>
        </div>
      </div>
    </button>
  );
}