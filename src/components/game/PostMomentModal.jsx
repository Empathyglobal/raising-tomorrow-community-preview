import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy } from 'lucide-react';
import { formatFollowersShort } from '@/components/game/socialMediaSystem';

export default function PostMomentModal({ open, onClose, outcome, platform, niche }) {
  if (!open || !outcome) return null;
  const { tier, content, metrics, moment } = outcome;

  const isHype = tier === 'VIRAL' || tier === 'LEGENDARY';
  
  // De-duplicate headline/reasonLine
  const shouldShowReasonLine = moment?.reasonLine && 
    moment.reasonLine.trim().toLowerCase() !== (moment?.headline || '').trim().toLowerCase();

  const copyText = () => {
    const headlineMetric = metrics.views || metrics.reach || metrics.totalViews || metrics.downloads || 0;
    const lines = [
      `${platform?.emoji || '📱'} ${platform?.label || 'Post'} — ${tier}`,
      `${moment?.headline || ''}  [${moment?.badge || ''}]`,
      content?.hook ? `“${content.hook}”` : '',
      content?.caption || '',
      content?.hashtags?.join(' ') || '',
      '',
      `Stats: ${headlineMetric.toLocaleString()} views | +${formatFollowersShort(Number(outcome?.deltas?.followersDelta||0))} followers${metrics.newSubscribers?` | +${formatFollowersShort(metrics.newSubscribers)} subs`:''}${metrics.shares?` | ${formatFollowersShort(metrics.shares)} shares`:''}`
    ].filter(Boolean).join('\n');
    try { navigator.clipboard?.writeText(lines); } catch {}
  };

  // Lightweight confetti using CSS sparkles
  const Sparkles = () => (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => (
        <span key={i} className="absolute w-1.5 h-1.5 bg-amber-400 rounded-full animate-sparkle"
          style={{
            left: `${(i * 17) % 100}%`,
            top: `${(i * 37) % 100}%`,
            animationDelay: `${(i%10)*0.12}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes sparkle { 0%{transform:translateY(0) scale(1); opacity:1} 100%{transform:translateY(40px) scale(0.6); opacity:0} }
        .animate-sparkle { animation: sparkle 1.2s ease-out infinite; filter: drop-shadow(0 0 4px rgba(251,191,36,0.8)); }
      `}</style>
    </div>
  );

  const TierBadge = ({ tier }) => {
    const map = {
      FLOP: 'bg-slate-200 text-slate-700',
      SOLID: 'bg-blue-100 text-blue-700',
      BANGER: 'bg-pink-100 text-pink-700',
      VIRAL: 'bg-amber-100 text-amber-800',
      LEGENDARY: 'bg-purple-100 text-purple-800'
    };
    return <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${map[tier]||map.SOLID}`}>{tier}</span>;
  };

  const metricCells = [];
  if (platform?.id === 'facebook') {
    metricCells.push(['Reach', metrics.reach]);
    metricCells.push(['Reactions', metrics.reactions||metrics.likes]);
    metricCells.push(['Comments', metrics.comments]);
    metricCells.push(['Shares', metrics.shares]);
    metricCells.push(['New Followers', metrics.newFollowers]);
  } else if (platform?.id === 'stream') {
    metricCells.push(['Peak CCV', metrics.peakCCV]);
    metricCells.push(['Total Views', metrics.totalViews]);
    metricCells.push(['Chat Msgs', metrics.chatMsgs]);
    metricCells.push(['Follows', metrics.newFollowers]);
    if (metrics.tips) metricCells.push(['Tips', `$${metrics.tips.toLocaleString()}`]);
  } else if (platform?.id === 'podcast') {
    metricCells.push(['Downloads', metrics.downloads]);
    metricCells.push(['New Subs', metrics.newSubscribers]);
    if (metrics.ratingsBump) metricCells.push(['Ratings +', metrics.ratingsBump]);
    if (metrics.shares) metricCells.push(['Shares', metrics.shares]);
    if (metrics.estRevenue!=null) metricCells.push(['Revenue', `$${Number(metrics.estRevenue).toLocaleString()}`]);
  } else {
    const head = metrics.views || metrics.reach || 0;
    metricCells.push(['Views', head]);
    if (metrics.likes!=null) metricCells.push(['Likes', metrics.likes]);
    if (metrics.comments!=null) metricCells.push(['Comments', metrics.comments]);
    if (metrics.shares!=null) metricCells.push(['Shares', metrics.shares]);
    if (metrics.newSubscribers!=null) metricCells.push(['New Subs', metrics.newSubscribers]);
    if (metrics.estRevenue!=null) metricCells.push(['Revenue', `$${Number(metrics.estRevenue).toLocaleString()}`]);
    metricCells.push(['New Followers', metrics.newFollowers]);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 bg-black/70 z-[1200]" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose} />
          <motion.div className="fixed inset-0 z-[1201] flex items-center justify-center p-4"
            initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.95}}>
            <div className="relative w-full max-w-xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
              {isHype && <Sparkles />}
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-amber-50 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{platform?.emoji || '📱'}</span>
                  <div className="text-slate-800 font-bold text-lg">{platform?.label || 'Post'}</div>
                  <TierBadge tier={tier} />
                </div>
                <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center shrink-0">
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto">
                <div>
                  <div className="text-sm font-semibold text-slate-700 mb-1">{moment?.badge || 'Momentum'}</div>
                  <div className="text-2xl font-extrabold text-slate-900 leading-snug">{moment?.headline || 'A moment happens'}</div>
                  {shouldShowReasonLine && <div className="text-sm text-slate-600 mt-1">{moment.reasonLine}</div>}
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  {content?.hook && <div className="text-base font-semibold mb-1">{content.hook}</div>}
                  <div className="text-sm text-slate-700">{content?.caption}</div>
                  {content?.hashtags?.length>0 && (
                    <div className="mt-2 text-xs text-slate-500">{content.hashtags.join(' ')}</div>
                  )}
                </div>

                {Array.isArray(content?.comments) && content.comments.length>0 && (
                  <div>
                    <div className="text-xs font-semibold text-slate-500 mb-2">Top comments</div>
                    <div className="flex flex-wrap gap-2">
                      {content.comments.slice(0,4).map((c,i)=> (
                        <div key={i} className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs text-slate-700 shadow-sm">{c}</div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-xs font-semibold text-slate-500 mb-2">Performance</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {metricCells.map(([label,val],i)=> (
                      <div key={i} className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3">
                        <div className="text-[10px] uppercase tracking-wide text-amber-700 font-semibold">{label}</div>
                        <div className="text-xl font-extrabold text-slate-900">{typeof val==='number'? val.toLocaleString(): val}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-slate-500">Share this moment</div>
                  <button onClick={copyText} className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold inline-flex items-center gap-2">
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}