import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Check } from 'lucide-react';
import { useGameState } from '@/components/game/GameStateContext';
import {
  normalizeSocialMediaState,
  SOCIAL_PLATFORMS,
  SOCIAL_NICHES,
  formatFollowersShort,
  simulatePostOutcome,
  pickTrendForAge,
  resolveEngage,
  resolveCollab,
  resolveGoLive,
  resolvePodcastRecord,
  resolveBuyFollowers,
  generateBrandDealOffers,
  resolveBrandDeal,
  BACKLASH_RESPONSES,
  resolveBacklashResponse,
  APPEAL_STRATEGIES,
  resolveAppealChoice,
  resolveRebrand,
  resolveDeleteAccount
} from '@/components/game/socialMediaSystem';
import { appendHumor } from './humorUtils';
import PostMomentModal from '@/components/game/PostMomentModal.jsx';
import { toast } from 'sonner';

const POST_TYPES = [
  { id: 'comedy', emoji: '😂', label: 'Comedy' },
  { id: 'edu', emoji: '📚', label: 'Educational' },
  { id: 'life', emoji: '✨', label: 'Lifestyle' },
  { id: 'contro', emoji: '🔥', label: 'Controversial' }
];

export default function SocialMediaModal({ open, onClose }) {
  const {
    gameState,
    updateState,
    spendFocus,
    addLog,
    recordTimelineEntry,
    emitActionResult,
    applyFameDelta,
    applyDeltas,
    applyStress
  } = useGameState();

  const [creatingPlatform, setCreatingPlatform] = useState(null);
  const [postResult, setPostResult] = useState(null);
  const [postTypePickerPlatform, setPostTypePickerPlatform] = useState(null);
  const [buyFollowersConfirm, setBuyFollowersConfirm] = useState(null);
  const [brandDealsOpen, setBrandDealsOpen] = useState(null);
  const [brandOffers, setBrandOffers] = useState([]);
  const [backlashOpen, setBacklashOpen] = useState(null);
  const [appealOpen, setAppealOpen] = useState(null);
  const [rebrandOpen, setRebrandOpen] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const postingRef = React.useRef(false);

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Always work from normalized state (computed, not stored)
  const sm = React.useMemo(() => normalizeSocialMediaState(gameState.socialMedia), [gameState.socialMedia]);

  // Persist normalization ONLY when modal opens (safe effect)
  React.useEffect(() => {
    if (!open) return;
    
    const original = gameState.socialMedia || {};
    let needsUpdate = !original || original.version !== 3;
    const next = normalizeSocialMediaState(original);
    
    SOCIAL_PLATFORMS.forEach(p => {
      const accOrig = original?.accounts?.[p.id];
      if (!accOrig) { needsUpdate = true; return; }
      if (accOrig.niche && !next.accounts[p.id].nicheId) {
        next.accounts[p.id].nicheId = accOrig.niche;
        needsUpdate = true;
      }
    });
    
    if (needsUpdate) {
      updateState({ socialMedia: next });
    }
  }, [open]);

  const findPlatform = (id) => SOCIAL_PLATFORMS.find(p => p.id === id);
  const findNiche = (id) => SOCIAL_NICHES.find(n => n.id === id);

  // Helper: Extract message text safely (message can be object or string)
  const getMsgText = (msg) => {
    if (typeof msg === 'string') return msg;
    return msg?.text || '';
  };

  // Helper: Apply resolver result safely
  const applySocialResolverResult = (platformId, result, actionLabel) => {
    if (!result) return;
    
    const msgText = getMsgText(result.message);
    const next = normalizeSocialMediaState(gameState.socialMedia);
    const acc = next.accounts[platformId];
    if (!acc) return;

    // Apply updates patch
    if (result.updates && result.updates[platformId]) {
      const patch = result.updates[platformId];
      Object.keys(patch).forEach(key => {
        if (key === 'followersDelta') acc.followers = Math.max(0, (acc.followers || 0) + patch[key]);
        else if (key === 'postsThisAgeDelta') acc.postsThisAge = (acc.postsThisAge || 0) + patch[key];
        else if (key === 'collabsThisAgeDelta') acc.collabsThisAge = (acc.collabsThisAge || 0) + patch[key];
        else if (key === 'engagementDelta') acc.engagement = Math.max(0, Math.min(100, (acc.engagement || 50) + patch[key]));
        else if (key === 'strikesDelta') acc.strikes = (acc.strikes || 0) + patch[key];
        else if (key === 'statusChange') acc.status = patch[key];
        else if (key === 'engagedThisAge') acc.engagedThisAge = patch[key];
        else if (key === 'historyAppend') {
          // FIX: historyAppend can be array
          if (Array.isArray(patch[key])) acc.history = [...(acc.history || []), ...patch[key]].slice(-50);
          else if (patch[key]) acc.history = [...(acc.history || []), patch[key]].slice(-50);
        }
        else acc[key] = patch[key];
      });
    }

    updateState({ socialMedia: next });

    // Apply deltas (stats, money, stress, etc.)
    if (result.deltas) {
      const { stressDelta = 0, loveDelta = 0, moneyDelta = 0, followersDelta = 0, ...statDeltas } = result.deltas;
      if (Object.keys(statDeltas).length) applyDeltas(statDeltas, actionLabel);
      if (stressDelta) applyStress(stressDelta, actionLabel);
      if (loveDelta) applyFameDelta(loveDelta, actionLabel);
      if (moneyDelta) updateState({ money: Math.max(0, gameState.money + moneyDelta) });
    }

    // Log and timeline (using msgText, not object)
    if (msgText) {
      addLog(`📱 ${actionLabel}: ${msgText}`);
      recordTimelineEntry({
        kind: 'social',
        title: `${result.message?.emoji || '📱'} ${actionLabel}`,
        detail: msgText,
        deltas: null,
        moneyDelta: result.deltas?.moneyDelta || 0,
        loveDelta: result.deltas?.loveDelta || 0,
        stressDelta: result.deltas?.stressDelta || 0
      });
    }

    // Emit action result with message object (for popup)
    emitActionResult({
      actionId: `social:${actionLabel}:${Date.now()}`,
      title: result.message?.title || actionLabel,
      body: msgText,
      deltas: result.deltas,
      loveDelta: result.deltas?.loveDelta || 0,
      stressDelta: result.deltas?.stressDelta || 0,
      moneyDelta: result.deltas?.moneyDelta || 0,
      focusDelta: -1,
      tags: ['social'],
      meta: { emoji: result.message?.emoji || '📱' }
    });
  };

  const handleCreateAccount = (platformId, nicheId) => {
    const next = normalizeSocialMediaState(gameState.socialMedia);
    const startFollowers = 100 + Math.floor(Math.random() * 120);
    next.accounts[platformId] = {
      ...next.accounts[platformId],
      active: true,
      createdAtAge: gameState.currentYear,
      nicheId,
      followers: startFollowers,
      verified: false,
      monetized: false,
      lastPostAge: gameState.currentYear,
    };

    updateState({ socialMedia: next });
    
    // Mafia exposure check (hidden)
    if (gameState.specialStartId === 'mafia_family') {
      const totalFollowers = SOCIAL_PLATFORMS.reduce((sum, p) => {
        const a = next.accounts[p.id];
        return sum + (a.active ? (a.followers || 0) : 0);
      }, 0);
      
      if (totalFollowers >= 250000) {
        let p = 0.08;
        if (totalFollowers >= 1000000) p = 0.20;
        
        if (Math.random() < p) {
          updateState({
            finished: true,
            deathEvent: {
              title: '🚔 You got exposed',
              body: 'Your online fame attracted the wrong attention. Investigators connect the dots, and your "business" becomes headline news. You\'re arrested—your child\'s life changes overnight.',
              icon: '🚔'
            }
          });
          onClose();
          return;
        }
      }
    }

    const platform = findPlatform(platformId);
    const niche = findNiche(nicheId);

    addLog(`📱 Created ${platform.label} account (${niche.label}) — started with ${formatFollowersShort(startFollowers)} followers`);
    applyFameDelta(5, 'Started posting online');

    recordTimelineEntry({
      kind: 'social',
      title: `📱 ${platform.label} Account Created`,
      detail: `Started posting about ${niche.label.toLowerCase()} — launched with ${formatFollowersShort(startFollowers)} followers`,
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0
    });

    setCreatingPlatform(null);
  };

  const handlePost = (platformId) => {
    setPostTypePickerPlatform(platformId);
  };

  const handlePostWithType = async (platformId, postType) => {
    // Prevent multiple simultaneous posts
    if (postingRef.current) return;
    postingRef.current = true;

    const ok = spendFocus(1, 'Post');
    if (!ok) {
      postingRef.current = false;
      return;
    }

    const next = normalizeSocialMediaState(gameState.socialMedia);
    const acc = next.accounts[platformId];
    const seed = `${gameState.runSeed || 'seed'}|${platformId}|${gameState.currentYear}|${acc.postsThisAge || 0}`;

    const outcome = await simulatePostOutcome({ platformId, account: acc, currentAge: gameState.currentYear, seed, nicheId: acc.nicheId });

    // Increment post type counter
    const counterKey = `social_post_${postType.id}`;
    const newCount = Number(gameState.counters?.[counterKey] || 0) + 1;
    const isSignature = newCount >= 5;

    // Apply post type modifier
    let followersDelta = Number(outcome.deltas.followersDelta || 0);
    let engagementDelta = Number(outcome.deltas.engagementDelta || 0);
    const followersBefore = acc.followers || 0;
    const maxDeltaThisPost = followersBefore * 0.25;

    switch (postType.id) {
      case 'comedy':
        followersDelta *= 1.15;
        applyDeltas({ confidence: 0.2 }, "Social post: comedy");
        applyStress(0.2);
        break;
      case 'edu':
        followersDelta *= 0.95;
        applyDeltas({ intelligence: 0.2, discipline: 0.1 }, "Social post: educational");
        applyStress(0.2);
        break;
      case 'life':
        followersDelta *= 1.0;
        applyDeltas({ empathy: 0.1 }, "Social post: lifestyle");
        applyStress(0.1);
        break;
      case 'contro':
        followersDelta *= 1.3;
        applyDeltas({ empathy: -0.1, confidence: 0.2 }, "Social post: controversial");
        applyStress(0.8);
        addLog("💬 The comment section is a swamp. But engagement is through the roof.");
        break;
    }

    // Cap follower delta
    followersDelta = Math.min(followersDelta, maxDeltaThisPost);

    // Apply signature perk
    if (isSignature) {
      engagementDelta += 5;
    }

    // Apply deltas to state
    acc.followers = Math.max(0, followersBefore + followersDelta);
    if (Number.isFinite(Number(outcome.deltas.subscribersDelta))) {
      acc.subscribers = Math.max(0, Number(acc.subscribers||0) + Number(outcome.deltas.subscribersDelta));
    }
    acc.lastPostAge = gameState.currentYear;
    acc.postsThisAge = (acc.postsThisAge || 0) + 1;
    acc.engagement = Math.max(0, Math.min(100, (acc.engagement || 50) + engagementDelta));

    // Milestone micro-toasts
    const afterFollowers = acc.followers;
    acc.milestones = acc.milestones || {};
    const thresholds = [1000, 10000, 100000, 1000000];
    thresholds.forEach((th) => {
      const key = `f_${th}`;
      if (followersBefore < th && afterFollowers >= th && !acc.milestones[key]) {
        acc.milestones[key] = true;
        const pretty = th >= 1000000 ? '1M' : th >= 100000 ? '100k' : th >= 10000 ? '10k' : '1k';
        toast(`You hit ${pretty} — the algorithm knows your name now 👀`, { duration: 2600, position: 'top-center' });
      }
    });

    // Money
    const moneyDelta = Number(outcome.deltas.moneyDelta || 0);
    if (moneyDelta) {
      updateState({ money: Number(gameState.money || 0) + moneyDelta });
    }

    updateState({ 
      socialMedia: next,
      counters: { ...(gameState.counters || {}), [counterKey]: newCount }
    });
    
    // Mafia exposure check (hidden)
    if (gameState.specialStartId === 'mafia_family') {
      const totalFollowers = SOCIAL_PLATFORMS.reduce((sum, p) => {
        const a = next.accounts[p.id];
        return sum + (a.active ? (a.followers || 0) : 0);
      }, 0);
      
      if (totalFollowers >= 250000) {
        let p = 0.08;
        if (totalFollowers >= 1000000) p = 0.20;
        
        if (Math.random() < p) {
          updateState({
            finished: true,
            deathEvent: {
              title: '🚔 You got exposed',
              body: 'Your online fame attracted the wrong attention. Investigators connect the dots, and your "business" becomes headline news. You\'re arrested—your child\'s life changes overnight.',
              icon: '🚔'
            }
          });
          onClose();
          return;
        }
      }
    }

    const platform = findPlatform(platformId);
    const niche = findNiche(acc.nicheId);

    const headlineMetric = outcome.metrics.views || outcome.metrics.reach || outcome.metrics.totalViews || outcome.metrics.downloads || 0;
    addLog(`${platform.emoji} ${outcome.tier}: ${formatFollowersShort(headlineMetric)} views • +${formatFollowersShort(followersDelta)} followers (${postType.label})`);

    // Timeline entry
    recordTimelineEntry({
      kind: 'social',
      title: `${platform.emoji} Posted`,
      detail: `${postType.emoji} ${postType.label} post on ${platform.label}: ${formatFollowersShort(headlineMetric)} views, +${formatFollowersShort(followersDelta)} ${outcome.metrics.newSubscribers?`followers / +${formatFollowersShort(outcome.metrics.newSubscribers)} subs`: 'followers'} (${outcome.tier})` ,
      deltas: null,
      moneyDelta: moneyDelta || 0,
      loveDelta: 0,
      stressDelta: 0
    });

    // Show WOW popup
    setPostResult({ ...outcome, platform, niche, postType, followersDelta });
    setPostTypePickerPlatform(null);
    postingRef.current = false;
  };

  const handleInfluencerFocus = (platformId) => {
    const ok = spendFocus(1, 'Influencer Focus');
    if (!ok) return;

    const next = normalizeSocialMediaState(gameState.socialMedia);
    const acc = next.accounts[platformId];
    const before = acc.followers || 0;
    const after = Math.max(before * 2, before + 50);

    acc.followers = after;
    acc.lastPostAge = gameState.currentYear; // prevent next-year decay
    acc.postsThisAge = (acc.postsThisAge || 0) + 1;
    acc.engagement = Math.min(100, (acc.engagement || 50) + 2);

    updateState({ socialMedia: next });
    
    // Mafia exposure check (hidden)
    if (gameState.specialStartId === 'mafia_family') {
      const totalFollowers = SOCIAL_PLATFORMS.reduce((sum, p) => {
        const a = next.accounts[p.id];
        return sum + (a.active ? (a.followers || 0) : 0);
      }, 0);
      
      if (totalFollowers >= 250000) {
        let p = 0.08;
        if (totalFollowers >= 1000000) p = 0.20;
        
        if (Math.random() < p) {
          updateState({
            finished: true,
            deathEvent: {
              title: '🚔 You got exposed',
              body: 'Your online fame attracted the wrong attention. Investigators connect the dots, and your "business" becomes headline news. You\'re arrested—your child\'s life changes overnight.',
              icon: '🚔'
            }
          });
          onClose();
          return;
        }
      }
    }

    const platform = findPlatform(platformId);
    const gained = after - before;
    addLog(`📱 ${platform.label} Influencer Focus: +${formatFollowersShort(gained)} followers`);
    applyFameDelta(10, 'Viral growth');

    emitActionResult({
      actionId: 'influencerFocus',
      title: `${platform.emoji} Influencer Focus`,
      body: `Followers grew from ${formatFollowersShort(before)} to ${formatFollowersShort(after)}.`,
      deltas: {},
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ['social'],
      meta: { emoji: platform.emoji, platform: platform.label }
    });

    recordTimelineEntry({
      kind: 'social',
      title: `${platform.emoji} Influencer Focus`,
      detail: `Now ${formatFollowersShort(after)} followers`,
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0
    });
  };

  const handleRequestVerification = (platformId) => {
    const platform = findPlatform(platformId);
    const next = normalizeSocialMediaState(gameState.socialMedia);
    const acc = next.accounts[platformId];

    if (acc.lastVerificationRequestAge === gameState.currentYear) return; // once per year

    let baseChance = 30;
    if (acc.followers >= platform.verifyThreshold * 2) baseChance = 70;
    else if (acc.followers >= platform.verifyThreshold * 1.5) baseChance = 55;
    else if (acc.followers >= platform.verifyThreshold) baseChance = 40;

    const strikesPenalty = (acc.strikes || 0) * 15;
    const totalChance = Math.max(5, Math.min(90, baseChance - strikesPenalty));
    const approved = Math.random() * 100 < totalChance;

    acc.lastVerificationRequestAge = gameState.currentYear;
    if (approved) acc.verified = true;

    updateState({ socialMedia: next });

    if (approved) {
      addLog(`✅ ${platform.label} verification approved!`);
      applyFameDelta(15, 'Verified online');
      // Mini‑toast milestone
      toast(`Verified on ${platform.label} — the blue check appears ✨`, { duration: 2600, position: 'top-center' });
      emitActionResult({
        actionId: 'verification',
        title: `✅ ${platform.label} Verified!`,
        body: `You got the blue checkmark. Credibility unlocked.`,
        deltas: {}, loveDelta: 0, stressDelta: -0.5, moneyDelta: 0, focusDelta: 0,
        tags: ['social'], meta: { emoji: '✅', platform: platform.label }
      });
      recordTimelineEntry({ kind: 'social', title: `✅ ${platform.label} Verified`, detail: 'Got the blue checkmark', deltas: null, moneyDelta: 0, loveDelta: 0, stressDelta: -0.5 });
    } else {
      addLog(`❌ ${platform.label} verification denied`);
      emitActionResult({
        actionId: 'verification',
        title: `❌ Verification Denied`,
        body: appendHumor(`${platform.label} rejected your verification request.\n\nKeep growing.`, 'socialDenied', { platformName: platform.label }),
        deltas: {}, loveDelta: 0, stressDelta: 0.5, moneyDelta: 0, focusDelta: 0, tags: ['social'], meta: { emoji: '❌', platform: platform.label }
      });
    }
  };

  const handleApplyMonetization = (platformId) => {
    const platform = findPlatform(platformId);
    const next = normalizeSocialMediaState(gameState.socialMedia);
    const acc = next.accounts[platformId];

    if (acc.lastMonetizeRequestAge === gameState.currentYear) return; // once per year

    let baseChance = 40;
    if (acc.followers >= platform.monetizeThreshold * 3) baseChance = 80;
    else if (acc.followers >= platform.monetizeThreshold * 2) baseChance = 65;
    else if (acc.followers >= platform.monetizeThreshold) baseChance = 50;

    const strikesPenalty = (acc.strikes || 0) * 20;
    const totalChance = Math.max(5, Math.min(95, baseChance - strikesPenalty));
    const approved = Math.random() * 100 < totalChance;

    acc.lastMonetizeRequestAge = gameState.currentYear;
    if (approved) acc.monetized = true;

    updateState({ socialMedia: next });

    if (approved) {
      addLog(`💰 ${platform.label} monetization approved!`);
      applyFameDelta(10, 'Monetized audience');
      // Mini‑toast milestone
      toast(`${platform.label} monetization unlocked — the money printer hums 🤑`, { duration: 2600, position: 'top-center' });
      emitActionResult({ actionId:'monetization', title:`💰 ${platform.label} Monetized!`, body:`Your account is now monetized. You'll earn from followers each year.`, deltas:{}, loveDelta:0, stressDelta:0, moneyDelta:0, focusDelta:0, tags:['social'], meta:{ emoji:'💰', platform: platform.label } });
      recordTimelineEntry({ kind:'social', title:`💰 ${platform.label} Monetized`, detail:'Account approved for monetization', deltas:null, moneyDelta:0, loveDelta:0, stressDelta:0 });
    } else {
      addLog(`❌ ${platform.label} monetization denied`);
      emitActionResult({ actionId:'monetization', title:`❌ Monetization Denied`, body: appendHumor(`${platform.label} rejected your monetization application.\n\nKeep growing.`, 'socialDenied', { platformName: platform.label }), deltas:{}, loveDelta:0, stressDelta:0.5, moneyDelta:0, focusDelta:0, tags:['social'], meta:{ emoji:'❌', platform: platform.label } });
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100]"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[85vh] overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">📱 Social Media</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Build your following</p>
                </div>
                <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)] space-y-4">
                {SOCIAL_PLATFORMS.map(platform => {
                  const account = sm.accounts[platform.id];

                  if (!account.active) {
                    return (
                      <div key={platform.id} className="border-2 border-slate-200 rounded-xl p-4 bg-white">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{platform.emoji}</span>
                            <span className="font-semibold text-slate-800">{platform.label}</span>
                          </div>
                          <button
                            onClick={() => setCreatingPlatform(platform.id)}
                            className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg"
                          >
                            Create Account
                          </button>
                        </div>

                        {creatingPlatform === platform.id && (
                          <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
                            <p className="text-sm text-slate-600 mb-2">Choose your niche:</p>
                            {SOCIAL_NICHES.map(niche => (
                              <button
                                key={niche.id}
                                onClick={() => handleCreateAccount(platform.id, niche.id)}
                                className="w-full text-left px-3 py-2 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                              >
                                <span className="mr-2">{niche.emoji}</span>
                                <span className="text-sm font-medium">{niche.label}</span>
                              </button>
                            ))}
                            <button
                              onClick={() => setCreatingPlatform(null)}
                              className="w-full text-center px-3 py-2 text-sm text-slate-500 hover:text-slate-700"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  }

                  const canVerify = account.followers >= platform.verifyThreshold && !account.verified && account.lastVerificationRequestAge !== gameState.currentYear;
                  const canMonetize = account.followers >= platform.monetizeThreshold && !account.monetized && account.lastMonetizeRequestAge !== gameState.currentYear;
                  const nicheObj = findNiche(account.nicheId);

                  // Trend of the year
                  const trendForAge = pickTrendForAge(gameState.runSeed, gameState.currentYear);

                  return (
                    <div key={platform.id} className="border-2 border-blue-200 rounded-xl p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{platform.emoji}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-800">{platform.label}</span>
                              {account.verified && <span className="text-blue-500">✓</span>}
                              {account.monetized && <span className="text-green-600 text-xs">💰</span>}
                            </div>
                            <div className="text-xs text-slate-600">
                              {nicheObj ? (<><span className="mr-1">{nicheObj.emoji}</span>{nicheObj.label}</>) : 'No niche yet'}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-slate-800">{formatFollowersShort(account.followers || 0)}</div>
                          <div className="text-[10px] text-slate-500">followers</div>
                        </div>
                      </div>

                      {account.strikes > 0 && (
                        <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                          <div className="text-xs text-red-700">⚠️ Strikes: {account.strikes}/3</div>
                        </div>
                      )}

                      <div className="space-y-2">
                        {/* Trend of the Year */}
                        {trendForAge && (
                          <div className="bg-white/60 p-2 rounded-lg text-xs border border-blue-300">
                            <span className="text-slate-600">📈 Trend: </span>
                            <span className="font-semibold">{trendForAge.emoji} {trendForAge.label}</span>
                          </div>
                        )}

                        {postTypePickerPlatform === platform.id ? (
                          <>
                            <div className="text-xs font-semibold text-slate-600 mb-2">Choose post type:</div>
                            <div className="grid grid-cols-2 gap-2">
                              {POST_TYPES.map(pt => {
                              const count = gameState.counters?.[`social_post_${pt.id}`] || 0;
                              const isSignature = count >= 5;
                              const isPosting = postingRef.current;
                              return (
                               <button
                                 key={pt.id}
                                 onClick={() => handlePostWithType(platform.id, pt)}
                                 disabled={gameState.actionPoints < 1 || isPosting}
                                 className={`px-2 py-2 rounded-lg text-xs font-medium transition-colors ${
                                   gameState.actionPoints < 1 || isPosting
                                     ? 'opacity-50 cursor-not-allowed'
                                     : 'bg-purple-500 hover:bg-purple-600 text-white'
                                 }`}
                               >
                                 <div>{pt.emoji}</div>
                                 <div>{pt.label}</div>
                                 {isSignature && <div className="text-[10px] mt-1 text-purple-100">⭐ Signature</div>}
                                 {count > 0 && <div className="text-[10px] text-purple-100">{count}x</div>}
                               </button>
                              );
                              })}
                            </div>
                            <button
                              onClick={() => setPostTypePickerPlatform(null)}
                              className="w-full px-3 py-2 text-xs text-slate-600 hover:text-slate-800"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handlePost(platform.id)}
                            disabled={gameState.actionPoints < 1}
                            className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg"
                          >
                            ✍️ Post (1 Focus)
                          </button>
                        )}

                        <button
                          onClick={() => handleInfluencerFocus(platform.id)}
                          disabled={gameState.actionPoints < 1}
                          className="w-full px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg"
                        >
                          <TrendingUp className="inline w-4 h-4 mr-1" />
                          Influencer Focus (1 Focus): Double Followers
                        </button>

                        {canVerify && (
                          <button
                            onClick={() => handleRequestVerification(platform.id)}
                            className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg"
                          >
                            <Check className="inline w-4 h-4 mr-1" />
                            Request Verification ({formatFollowersShort(platform.verifyThreshold)}+ needed)
                          </button>
                        )}

                        {canMonetize && (
                          <button
                            onClick={() => handleApplyMonetization(platform.id)}
                            className="w-full px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg"
                          >
                            💰 Apply for Monetization ({formatFollowersShort(platform.monetizeThreshold)}+ needed)
                          </button>
                        )}

                        {/* Simple Actions */}
                        <div className="border-t border-blue-200 pt-3 mt-3 space-y-2">
                          <div className="text-xs font-semibold text-slate-600 mb-2">Quick Actions (1 Focus each)</div>

                          {/* Engage */}
                          <button
                            onClick={() => {
                              if (!spendFocus(1, 'Engage')) { toast.error('Not enough Focus.'); return; }
                              const result = resolveEngage({ gameState, platformId: platform.id });
                              applySocialResolverResult(platform.id, result, 'Engage');
                            }}
                            disabled={account.engagedThisAge}
                            className={`w-full px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                              account.engagedThisAge
                                ? 'opacity-50 cursor-not-allowed bg-slate-100 text-slate-500'
                                : 'bg-purple-500 hover:bg-purple-600 text-white active:scale-95'
                            }`}
                          >
                            💬 Engage ({account.engagedThisAge ? 'done' : 'go'})
                          </button>

                          {/* Collab */}
                          <button
                            onClick={() => {
                              if (!spendFocus(1, 'Collab')) { toast.error('Not enough Focus.'); return; }
                              const result = resolveCollab({ gameState, platformId: platform.id });
                              applySocialResolverResult(platform.id, result, 'Collab');
                            }}
                            disabled={(account.collabsThisAge || 0) >= 1}
                            className={`w-full px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                              (account.collabsThisAge || 0) >= 1
                                ? 'opacity-50 cursor-not-allowed bg-slate-100 text-slate-500'
                                : 'bg-orange-500 hover:bg-orange-600 text-white active:scale-95'
                            }`}
                          >
                            🤝 Collab ({(account.collabsThisAge || 0) >= 1 ? 'done' : 'go'})
                          </button>

                          {/* Go Live */}
                          <button
                            onClick={() => {
                              if (!spendFocus(1, 'Go Live')) { toast.error('Not enough Focus.'); return; }
                              const result = resolveGoLive({ gameState, platformId: platform.id, lengthId: 'short' });
                              applySocialResolverResult(platform.id, result, 'Go Live');
                            }}
                            disabled={(account.postsThisAge || 0) >= 3}
                            className={`w-full px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                              (account.postsThisAge || 0) >= 3
                                ? 'opacity-50 cursor-not-allowed bg-slate-100 text-slate-500'
                                : 'bg-red-500 hover:bg-red-600 text-white active:scale-95'
                            }`}
                          >
                            🎥 Go Live ({(account.postsThisAge || 0) >= 3 ? 'cool down' : 'go'})
                          </button>

                          {/* Record Podcast */}
                          <button
                            onClick={() => {
                              if (!spendFocus(1, 'Record Podcast')) { toast.error('Not enough Focus.'); return; }
                              const result = resolvePodcastRecord({ gameState, platformId: platform.id, formatId: 'episode' });
                              applySocialResolverResult(platform.id, result, 'Record Podcast');
                            }}
                            className="w-full px-3 py-2 text-xs font-medium rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white active:scale-95 transition-all"
                          >
                            🎙️ Record Podcast
                          </button>

                          {/* Buy Followers (with confirm) */}
                          <button
                            onClick={() => setBuyFollowersConfirm(platform.id)}
                            disabled={gameState.money < 250}
                            className={`w-full px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                              gameState.money < 250
                                ? 'opacity-50 cursor-not-allowed bg-slate-100 text-slate-500'
                                : 'bg-pink-600 hover:bg-pink-700 text-white active:scale-95'
                            }`}
                          >
                            ⚠️ Buy Followers ($250)
                          </button>

                          {/* Brand Deal */}
                          {account.active && account.monetized && account.status === 'active' && (
                            <button
                              onClick={() => {
                                const offers = generateBrandDealOffers({ gameState, platformId: platform.id });
                                setBrandOffers(offers);
                                setBrandDealsOpen(platform.id);
                              }}
                              disabled={(account.brandDealsThisAge || 0) >= 1}
                              className={`w-full px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                                (account.brandDealsThisAge || 0) >= 1
                                  ? 'opacity-50 cursor-not-allowed bg-slate-100 text-slate-500'
                                  : 'bg-emerald-500 hover:bg-emerald-600 text-white active:scale-95'
                              }`}
                            >
                              📣 Brand Deal ({(account.brandDealsThisAge || 0) >= 1 ? 'done' : 'go'})
                            </button>
                          )}

                          {/* Backlash Response */}
                          {account.lastBacklashAge === gameState.currentYear && (
                            <button
                              onClick={() => setBacklashOpen(platform.id)}
                              className="w-full px-3 py-2 text-xs font-medium rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white active:scale-95 transition-all"
                            >
                              ⚡ Handle Backlash
                            </button>
                          )}

                          {/* Appeal */}
                          {(account.status === 'shadowbanned' || account.status === 'suspended') && (
                            <button
                              onClick={() => setAppealOpen(platform.id)}
                              className="w-full px-3 py-2 text-xs font-medium rounded-lg bg-blue-500 hover:bg-blue-600 text-white active:scale-95 transition-all"
                            >
                              ⚖️ Appeal
                            </button>
                          )}

                          {/* Rebrand */}
                          {account.active && (
                            <button
                              onClick={() => setRebrandOpen(platform.id)}
                              className="w-full px-3 py-2 text-xs font-medium rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white active:scale-95 transition-all"
                            >
                              🔁 Rebrand
                            </button>
                          )}

                          {/* Delete Account */}
                          {account.active && (
                            <button
                              onClick={() => setDeleteConfirm(platform.id)}
                              className="w-full px-3 py-2 text-xs font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white active:scale-95 transition-all"
                            >
                              🗑️ Delete Account
                            </button>
                          )}
                          </div>
                        </div>
                        </div>
                        );
                        })}
                        </div>
                        </div>
                        </motion.div>

                        {/* Buy Followers Confirm Dialog */}
                        {buyFollowersConfirm && (
                          <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4" onClick={() => setBuyFollowersConfirm(null)}>
                            <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                              <div className="px-5 py-4 border-b bg-pink-50">
                                <div className="font-semibold text-slate-900">Buy Followers?</div>
                              </div>
                              <div className="p-5 space-y-3">
                                <p className="text-sm text-slate-600">Cost: $250 • Gain: ~1,200 followers</p>
                                <p className="text-xs text-slate-500">⚠️ 25% chance of getting shadowbanned for suspicious activity.</p>
                              </div>
                              <div className="px-5 py-4 border-t bg-slate-50 flex gap-3 justify-end">
                                <button 
                                  className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50" 
                                  onClick={() => setBuyFollowersConfirm(null)}
                                >
                                  Cancel
                                </button>
                                <button
                                  className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white"
                                  onClick={() => {
                                    if (!spendFocus(1, 'Buy Followers')) { toast.error('Not enough Focus.'); return; }
                                    const result = resolveBuyFollowers({ gameState, platformId: buyFollowersConfirm, tierId: 'small' });
                                    applySocialResolverResult(buyFollowersConfirm, result, 'Buy Followers');
                                    setBuyFollowersConfirm(null);
                                  }}
                                >
                                  Confirm
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Brand Deals Picker */}
                        {brandDealsOpen && (
                          <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4" onClick={() => setBrandDealsOpen(null)}>
                            <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                              <div className="px-5 py-4 border-b bg-emerald-50">
                                <div className="font-semibold text-slate-900">📣 Brand Deals</div>
                              </div>
                              <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
                                {brandOffers.map(offer => (
                                  <button
                                    key={offer.id}
                                    onClick={() => {
                                      const result = resolveBrandDeal({ gameState, platformId: brandDealsOpen, offerId: offer.id });
                                      applySocialResolverResult(brandDealsOpen, result, `Brand Deal: ${offer.label}`);
                                      setBrandDealsOpen(null);
                                    }}
                                    className="w-full text-left p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 transition-all"
                                  >
                                    <div className="font-semibold text-slate-800 text-sm">{offer.label}</div>
                                    <div className="text-xs text-slate-600">Payout: ${offer.amount}</div>
                                    {offer.repRisk > 0 && <div className="text-xs text-red-600">⚠️ Reputation risk: {offer.repRisk}</div>}
                                  </button>
                                ))}
                              </div>
                              <div className="px-5 py-3 border-t bg-slate-50">
                                <button 
                                  className="w-full px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-sm" 
                                  onClick={() => setBrandDealsOpen(null)}
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Backlash Response Picker */}
                        {backlashOpen && (
                          <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4" onClick={() => setBacklashOpen(null)}>
                            <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                              <div className="px-5 py-4 border-b bg-yellow-50">
                                <div className="font-semibold text-slate-900">⚡ Handle Backlash</div>
                                <div className="text-xs text-slate-600 mt-1">How do you respond?</div>
                              </div>
                              <div className="p-4 space-y-2">
                                {BACKLASH_RESPONSES.map(resp => (
                                  <button
                                    key={resp.id}
                                    onClick={() => {
                                      const result = resolveBacklashResponse({ gameState, platformId: backlashOpen, responseId: resp.id, context: null });
                                      applySocialResolverResult(backlashOpen, result, `Backlash: ${resp.label}`);
                                      setBacklashOpen(null);
                                    }}
                                    className="w-full text-left p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-yellow-50 hover:border-yellow-300 transition-all"
                                  >
                                    <div className="font-semibold text-slate-800 text-sm">{resp.label}</div>
                                  </button>
                                ))}
                              </div>
                              <div className="px-5 py-3 border-t bg-slate-50">
                                <button 
                                  className="w-full px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-sm" 
                                  onClick={() => setBacklashOpen(null)}
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Appeal Picker */}
                        {appealOpen && (
                          <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4" onClick={() => setAppealOpen(null)}>
                            <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                              <div className="px-5 py-4 border-b bg-blue-50">
                                <div className="font-semibold text-slate-900">⚖️ Appeal Decision</div>
                                <div className="text-xs text-slate-600 mt-1">Choose your strategy:</div>
                              </div>
                              <div className="p-4 space-y-2">
                                {APPEAL_STRATEGIES.map(strat => (
                                  <button
                                    key={strat.id}
                                    onClick={() => {
                                      const result = resolveAppealChoice({ gameState, platformId: appealOpen, strategyId: strat.id });
                                      applySocialResolverResult(appealOpen, result, `Appeal: ${strat.label}`);
                                      setAppealOpen(null);
                                    }}
                                    className="w-full text-left p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition-all"
                                  >
                                    <div className="font-semibold text-slate-800 text-sm">{strat.label}</div>
                                  </button>
                                ))}
                              </div>
                              <div className="px-5 py-3 border-t bg-slate-50">
                                <button 
                                  className="w-full px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-sm" 
                                  onClick={() => setAppealOpen(null)}
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Rebrand Picker */}
                        {rebrandOpen && (
                          <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4" onClick={() => setRebrandOpen(null)}>
                            <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                              <div className="px-5 py-4 border-b bg-indigo-50">
                                <div className="font-semibold text-slate-900">🔁 Rebrand</div>
                                <div className="text-xs text-slate-600 mt-1">⚠️ Can hurt reputation short-term.</div>
                              </div>
                              <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
                                {SOCIAL_NICHES.map(niche => (
                                  <button
                                    key={niche.id}
                                    onClick={() => {
                                      const result = resolveRebrand({ gameState, platformId: rebrandOpen, newNicheId: niche.id });
                                      applySocialResolverResult(rebrandOpen, result, `Rebrand: ${niche.label}`);
                                      setRebrandOpen(null);
                                    }}
                                    className="w-full text-left p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 transition-all"
                                  >
                                    <div className="text-sm"><span className="mr-2">{niche.emoji}</span><span className="font-semibold text-slate-800">{niche.label}</span></div>
                                  </button>
                                ))}
                              </div>
                              <div className="px-5 py-3 border-t bg-slate-50">
                                <button 
                                  className="w-full px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-sm" 
                                  onClick={() => setRebrandOpen(null)}
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Delete Account Confirm */}
                        {deleteConfirm && (
                          <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
                            <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                              <div className="px-5 py-4 border-b bg-red-50">
                                <div className="font-semibold text-slate-900">🗑️ Delete Account?</div>
                              </div>
                              <div className="p-5 space-y-3">
                                <p className="text-sm text-slate-600">This action cannot be undone.</p>
                                <p className="text-xs text-slate-500">Your account will be permanently removed.</p>
                              </div>
                              <div className="px-5 py-4 border-t bg-slate-50 flex gap-3 justify-end">
                                <button 
                                  className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50" 
                                  onClick={() => setDeleteConfirm(null)}
                                >
                                  Cancel
                                </button>
                                <button
                                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                                  onClick={() => {
                                    const result = resolveDeleteAccount({ gameState, platformId: deleteConfirm });
                                    applySocialResolverResult(deleteConfirm, result, 'Delete Account');
                                    setDeleteConfirm(null);
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        <PostMomentModal open={!!postResult} onClose={() => setPostResult(null)} outcome={postResult} platform={postResult?.platform} niche={postResult?.niche} />
                        </>
                        )}
                        </AnimatePresence>
                        );
                        }