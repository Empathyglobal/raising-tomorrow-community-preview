import React from "react";

export default function OutcomeShareCard({ sharePack }) {
  const [clean, setClean] = React.useState(false);
  const [toast, setToast] = React.useState("");
  if (!sharePack) return null;

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 1200); };

  const { endingTitle, rarity, oneLiner, receipts = [], code } = sharePack;

  return (
    <div className="w-full max-w-xl mx-auto">
      {!clean && (
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm opacity-70">Share Card Mode</div>
          <button className="px-3 py-1.5 border border-slate-300/30 rounded-md text-xs hover:bg-white/10" onClick={() => setClean(v => !v)}>
            {clean ? "Show UI" : "Clean Screenshot"}
          </button>
        </div>
      )}

      <div className="border border-white/10 rounded-xl p-5 bg-white/5 backdrop-blur-sm shadow">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-2xl font-bold leading-tight text-white">{endingTitle}</div>
            <div className="mt-1 inline-flex px-3 py-1 rounded-full text-xs font-semibold border border-white/20 text-slate-200">
              {rarity}
            </div>
          </div>
          <div className="text-xs opacity-70 text-right text-slate-200">
            <div>Code</div>
            <div className="font-mono font-semibold">{code}</div>
          </div>
        </div>

        {oneLiner && (
          <div className="mt-4 text-lg leading-snug text-slate-100">
            {oneLiner}
          </div>
        )}

        {receipts.length > 0 && (
          <div className="mt-4 border border-white/10 rounded-lg p-3">
            <div className="text-xs font-semibold opacity-70 mb-2 text-slate-300">RECEIPTS</div>
            <div className="space-y-1 font-mono text-sm text-slate-100">
              {receipts.slice(0, 3).map((r, i) => (
                <div key={i}>• {r}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      {!clean && (
        <>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              className="px-3 py-1.5 border border-white/20 rounded-md text-xs text-slate-200 hover:bg-white/10"
              onClick={async () => { try { if (oneLiner) { await navigator.clipboard?.writeText(oneLiner); showToast('Copied one-liner'); } } catch { showToast('Copy failed'); } }}
            >
              Copy one-liner
            </button>
            <button
              className="px-3 py-1.5 border border-white/20 rounded-md text-xs text-slate-200 hover:bg-white/10"
              onClick={async () => { const c = code; if (!c) return; try { await navigator.clipboard?.writeText(c); showToast('Copied code'); } catch { showToast('Copy failed'); } }}
            >
              Copy code
            </button>
          </div>
          {toast && <div className="mt-2 text-xs text-emerald-300">{toast}</div>}
          <div className="mt-3 text-xs opacity-60 text-slate-300">
            Tip: screenshot this card.
          </div>
        </>
      )}
    </div>
  );
}