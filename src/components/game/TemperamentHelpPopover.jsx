import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { temperamentHelpData } from './temperamentHelpData';

export default function TemperamentHelpPopover({ temperamentId }) {
  const [open, setOpen] = useState(false);
  const data = temperamentHelpData[temperamentId];

  if (!data) return null;

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        aria-label={`About ${temperamentId}`}
        className="p-1 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 rounded"
      >
        <Info className="w-4 h-4" />
      </button>

      {open && (
        <>
          {/* Backdrop to close on click outside */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Popover */}
          <div
            className="absolute bottom-full right-0 mb-2 w-64 bg-white border border-slate-200 rounded-lg shadow-lg p-4 z-50 text-sm"
            role="tooltip"
          >
            <p className="font-semibold text-slate-800 mb-2">{data.description}</p>

            {data.effects && data.effects.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-medium text-slate-600 mb-1">How it tends to affect your child:</p>
                <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                  {data.effects.slice(0, 3).map((effect, idx) => (
                    <li key={idx}>{effect}</li>
                  ))}
                </ul>
              </div>
            )}

            {data.example && (
              <p className="text-xs text-slate-600 italic">
                <strong>Example:</strong> {data.example}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}