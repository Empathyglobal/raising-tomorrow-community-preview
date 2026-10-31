import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useGameState } from '@/components/game/GameStateContext';
import { RARE_MOMENTS } from '@/components/content/rareMoments';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export default function RareMomentsAlbum() {
  const navigate = useNavigate();
  const { gameState } = useGameState();
  const unlocked = gameState.unlockedRareMoments || {};
  const total = RARE_MOMENTS.length;
  const count = Object.keys(unlocked).length;
  const progress = Math.round((count / total) * 100);

  const [selected, setSelected] = React.useState(null);

  const handleBack = () => {
    try {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate(createPageUrl('Game'));
      }
    } catch {
      navigate(createPageUrl('Game'));
    }
  };

  const onShare = async (moment) => {
    const text = `${moment.title} — ${moment.description}\n#RaisingTomorrow`;
    try {
      if (navigator?.share) {
        await navigator.share({ text });
      } else if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        try { toast.success('Copied to clipboard', { icon: '📋' }); } catch {}
      } else {
        toast.error('Sharing is not supported on this device.');
        return;
      }
    } catch (e) {
      console.warn('Share failed', e);
      toast.error('Share failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 text-white">
      <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur border-b border-white/10 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button onClick={handleBack} className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Rare Moments — {count}/{total}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-4"><Progress value={progress} /></div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {RARE_MOMENTS.map((m) => {
            const isUnlocked = !!unlocked[m.id];
            return (
              <button key={m.id} onClick={() => isUnlocked && setSelected(m)} className={`rounded-xl p-3 border transition ${isUnlocked ? 'border-emerald-400/40 bg-emerald-500/10 hover:bg-emerald-500/20' : 'border-white/10 bg-white/5 cursor-default'}`}>
                <div className="text-xs uppercase tracking-wide text-white/60">{isUnlocked ? m.rarity : 'locked'}</div>
                <div className="mt-1 font-semibold text-sm">{isUnlocked ? m.title : '???'}</div>
                {isUnlocked && <div className="mt-1 text-[11px] text-white/60">Unlocked age {unlocked[m.id]?.unlockedAtAge}</div>}
              </button>
            );
          })}
        </div>

        {selected && (
          <div className="fixed inset-0 z-[12000] flex items-center justify-center p-4">
            <button className="absolute inset-0 z-0 bg-black/50" onClick={() => setSelected(null)} aria-label="Close" />
            <div className="relative z-10 w-full max-w-md bg-white text-slate-900 rounded-2xl shadow-xl p-5">
              <div className="text-xs uppercase tracking-wide text-slate-500">{selected.rarity}</div>
              <h3 className="text-xl font-bold mt-1">{selected.title}</h3>
              <p className="mt-2 text-slate-700 text-sm">{selected.description}</p>
              <div className="mt-4 flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
                <Button onClick={() => onShare(selected)}>Share</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}