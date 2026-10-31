import React from 'react';
import { Slider } from '@/components/ui/slider';

export default function SfxVolumeSlider({ value, onChange }) {
  const safeVol = (v, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : fallback;
  };

  return (
    <div className="pl-4 space-y-1">
      <label className="text-xs text-slate-600">
        Volume: {Math.round(safeVol(value, 0.7) * 100)}%
      </label>
      <Slider
        value={[safeVol(value, 0.7)]}
        onValueChange={onChange}
        min={0}
        max={1}
        step={0.1}
        className="w-full"
      />
    </div>
  );
}