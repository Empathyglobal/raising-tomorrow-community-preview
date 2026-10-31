// PURE FUNCTIONS ONLY. No React, no hooks.
import { base44 } from '@/api/base44Client';

// Catalogs
export const SOCIAL_PLATFORMS = [
  { id:"instagram", label:"Instagram", emoji:"📸", verifyThreshold:10000, monetizeThreshold:5000,  reachPct:[0.03,0.12], viralChance:0.06, viralMult:[3,10], decayPct:[0.02,0.06], yearlyRpm:0.4, tipsEnabled:false },
  { id:"facebook",  label:"Facebook",  emoji:"👥", verifyThreshold:15000, monetizeThreshold:8000,  reachPct:[0.02,0.08], viralChance:0.03, viralMult:[2,6],  decayPct:[0.02,0.05], yearlyRpm:0.25, tipsEnabled:false },
  { id:"tiktok",    label:"TikTok",    emoji:"🎵", verifyThreshold:20000, monetizeThreshold:10000, reachPct:[0.05,0.18], viralChance:0.10, viralMult:[4,14], decayPct:[0.03,0.08], yearlyRpm:0.2,  tipsEnabled:false },
  { id:"youtube",   label:"YouTube",   emoji:"📺", verifyThreshold:25000, monetizeThreshold:1000,  reachPct:[0.02,0.10], viralChance:0.05, viralMult:[3,9],  decayPct:[0.02,0.05], yearlyRpm:0.9,  tipsEnabled:false },
  { id:"stream",    label:"Livestream",emoji:"🎮", verifyThreshold:30000, monetizeThreshold:500,   reachPct:[0.03,0.12], viralChance:0.07, viralMult:[3,10], decayPct:[0.03,0.07], yearlyRpm:0.6,  tipsEnabled:true  },
  { id:"podcast",   label:"Podcast",   emoji:"🎙️", verifyThreshold:20000, monetizeThreshold:2000, reachPct:[0.02,0.10], viralChance:0.04, viralMult:[2,7],  decayPct:[0.02,0.06], yearlyRpm:0.7,  tipsEnabled:true  }
];

export const SOCIAL_NICHES = [
  { id:'parenting', label:'Parenting', emoji:'👨‍👩‍👧‍👦' },
  { id:'education', label:'Education', emoji:'📚' },
  { id:'comedy', label:'Comedy', emoji:'😂' },
  { id:'gaming', label:'Gaming', emoji:'🎮' },
  { id:'travel', label:'Travel', emoji:'✈️' },
  { id:'food', label:'Food', emoji:'🍜' },
  { id:'fitness', label:'Fitness', emoji:'💪' },
  { id:'lifestyle', label:'Lifestyle', emoji:'✨' },
  { id:'music', label:'Music', emoji:'🎵' },
  { id:'career', label:'Career', emoji:'💼' },
];

export const SOCIAL_TRENDS = [
  { id:'kindness_chain', label:'Kindness Chain', emoji:'🫶' },
  { id:'10sec_tips', label:'10‑Second Tips', emoji:'⏱️' },
  { id:'day_in_life', label:'Day in the Life', emoji:'📅' },
  { id:'budget_meals', label:'Budget Meals', emoji:'🍲' },
  { id:'micro_workouts', label:'Micro‑Workouts', emoji:'🏃' },
  { id:'study_with_me', label:'Study With Me', emoji:'📝' },
  { id:'before_after', label:'Before/After', emoji:'🔁' },
  { id:'travel_hacks', label:'Travel Hacks', emoji:'🧳' },
  { id:'home_setup', label:'Home Setup', emoji:'🏡' },
  { id:'song_snippets', label:'Song Snippets', emoji:'🎶' },
  { id:'gratitude', label:'Gratitude Posts', emoji:'🙏' },
  { id:'mini_pod', label:'Mini‑Pod Clips', emoji:'🎙️' },
];

export const STRIKE_REASONS = [
  { id:"spam", label:"Spam / repetitive posting" },
  { id:"copyright", label:"Copyright claim" },
  { id:"misleading_ad", label:"Misleading ad disclosure" },
  { id:"harassment", label:"Harassment / heated replies" },
  { id:"fake_followers", label:"Suspicious follower activity" },
];

export const BACKLASH_RESPONSES = [
  { id:'apologize', label:'Apologize' },
  { id:'ignore', label:'Ignore' },
  { id:'double', label:'Double Down' },
];

export const APPEAL_STRATEGIES = [
  { id:'polite', label:'Polite appeal' },
  { id:'evidence', label:'Provide evidence' },
  { id:'public', label:'Public post about it' },
  { id:'angry', label:'Angry email' },
];

export const CELEBRITY_REPLY_STYLES = [
  { id:'funny', label:'Funny reply' },
  { id:'kind', label:'Kind compliment' },
  { id:'hot_take', label:'Hot take (risky)' },
];

export const STREAM_LENGTHS = [
  { id:'short',  label:'Short (30m)', stress:+0.3, mult:1.1, tipRate:0.5 },
  { id:'medium', label:'Medium (1h)', stress:+0.6, mult:1.3, tipRate:1.0 },
  { id:'long',   label:'Long (2h)',  stress:+1.0, mult:1.7, tipRate:1.6 },
  { id:'marathon',label:'Marathon (4h)', stress:+1.8, mult:2.4, tipRate:2.5 },
];

export const PODCAST_FORMATS = [
  { id:'episode',    label:'Episode', mult:1.1, stress:+0.3 },
  { id:'live_qa',    label:'Live Q&A', mult:1.3, stress:+0.6 },
  { id:'mini_season',label:'Mini‑season', mult:1.8, stress:+1.2 },
];

// Utils
const clamp = (n,min,max)=>Math.max(min,Math.min(max,n));
export const formatFollowersShort = (n)=>{
  if (n>=1_000_000) return (n/1_000_000).toFixed(1)+'M';
  if (n>=1_000) return (n/1_000).toFixed(1)+'K';
  return String(Math.floor(n));
};

function mulberry32(seed){
  return function(){
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function hashString(str){
  let h=0; for (let i=0;i<str.length;i++){h=((h<<5)-h)+str.charCodeAt(i); h|=0;} return Math.abs(h);
}

export function pickTrendForAge(runSeed, age){
  const rng = mulberry32(hashString(`${runSeed||'seed'}|trend|${age}`));
  const idx = Math.floor(rng()*SOCIAL_TRENDS.length);
  return SOCIAL_TRENDS[idx];
}

const defaultAccount = () => ({
  active:false,
  createdAtAge:null,
  nicheId:null,
  followers:0,
  verified:false,
  monetized:false,
  status:'active',
  shadowbannedUntilAge:null,
  suspendedUntilAge:null,
  strikes:0,
  lastStrikeReasonId:null,
  lastStrikeAge:null,
  engagement:50,
  reputation:60,
  lastPostAge:null,
  postsThisAge:0,
  brandDealsThisAge:0,
  collabsThisAge:0,
  engagedThisAge:false,
  celebrityReplyThisAge:false,
  crossPromotedThisAge:false,
  postStreak:0,
  bestPostStreak:0,
  lastBacklashAge:null,
  history:[],
});

export function normalizeSocialMediaState(sm){
  const base = {
    version:3,
    lastProcessedAge:null,
    trendByAge:{},
    accounts:{}
  };
  const out = { ...(sm||{}), ...base };
  const ids = SOCIAL_PLATFORMS.map(p=>p.id);
  out.accounts = { ...(sm?.accounts||{}) };
  ids.forEach(id=>{
    const cur = sm?.accounts?.[id]||{};
    const acc = { ...defaultAccount(), ...cur };
    // history cap
    acc.history = Array.isArray(acc.history)? acc.history.slice(-50):[];
    out.accounts[id]=acc;
  });
  if (typeof out.lastProcessedAge !== 'number') out.lastProcessedAge = null;
  if (!out.trendByAge || typeof out.trendByAge !== 'object') out.trendByAge = {};
  out.version = 3;
  return out;
}

export function getPlatform(id){ return SOCIAL_PLATFORMS.find(p=>p.id===id); }

export function computeProjectedYearlyIncome(gameState, sm){
  const s = normalizeSocialMediaState(sm);
  let total = 0;
  for (const pid of Object.keys(s.accounts)){
    const acc = s.accounts[pid];
    const plat = getPlatform(pid);
    if (!plat || !acc.active || acc.status!=='active' || !acc.monetized) continue;
    total += computeYearEndIncomeForAccount(acc, plat, gameState);
  }
  return Math.round(total);
}

export function computeYearEndIncomeForAccount(account, platform, gameState){
  const engagementFactor = clamp((account.engagement||50)/100, 0.2, 1.4);
  // yearly RPM per follower (rough proxy)
  const rpm = platform.yearlyRpm;
  return Math.round((account.followers||0) * rpm * engagementFactor);
}

export function computeInactivityDecay(account, platform){
  const [minP,maxP] = platform.decayPct;
  const pct = minP + (maxP-minP)*0.6; // mid‑heavy decay
  const lost = Math.round((account.followers||0)*pct);
  return { followersLost: Math.min(account.followers||0, lost), engagementLost: 3 };
}

function smallHistoryEntry(type, text){
  return { ts: Date.now(), type, text };
}

// ---- Resolvers (pure) ----
function applyStrike(account, reasonId, currentYear){
  const strikes = clamp((account.strikes||0)+1, 0, 99);
  const out = { strikes, lastStrikeReasonId: reasonId, lastStrikeAge: currentYear };
  let statusChange = null;
  if (strikes >= 3){
    const years = 1 + Math.floor(Math.random()*3);
    out.status='suspended';
    out.suspendedUntilAge=(currentYear+years);
    statusChange='suspended';
  } else if (strikes >= 1 && account.status==='active'){
    out.status='shadowbanned';
    out.shadowbannedUntilAge=currentYear+1;
    statusChange='shadowbanned';
  }
  return { patch: out, statusChange };
}

export function resolveCreateAccount({ gameState, platformId, nicheId }){
  const acc = defaultAccount();
  acc.active=true; acc.createdAtAge=gameState.currentYear; acc.nicheId=nicheId; acc.followers=100+Math.floor(Math.random()*120);
  return {
    updates:{ [platformId]: acc },
    deltas:{ followersDelta: acc.followers, moneyDelta:0, stressDelta:0, loveDelta:0 },
    message:{ title:`Account Created`, text:`Started ${platformId} in ${nicheId}.`, emoji:'📱', tags:['social'] }
  };
}

export function resolvePost({ gameState, platformId, postId, chaseTrend }){
  const platform = getPlatform(platformId);
  const baseReach = platform.reachPct[0] + (platform.reachPct[1]-platform.reachPct[0])*(0.5);
  let followersGain = Math.round((Math.max(50, Math.random()*150)) * (1 + (chaseTrend?0.6:0)));
  let backlash = false; let backlashContext = null;
  // Chance viral
  const viral = Math.random() < platform.viralChance * (chaseTrend?1.2:1.0);
  if (viral){ followersGain *= Math.floor(platform.viralMult[0]+Math.random()*(platform.viralMult[1]-platform.viralMult[0])); }
  // Chance flop
  if (!viral && Math.random()<0.12){ followersGain = -Math.max(10, Math.floor(Math.random()*120)); }
  // Chance backlash
  if (Math.random()<0.10){ backlash=true; backlashContext={ reason:'Tone‑deaf post', severity:1+Math.floor(Math.random()*2) } }

  const engagementDelta = viral? +6 : (followersGain>0? +2 : -2);
  const history = smallHistoryEntry('post', `${postId}${chaseTrend?' (trend)':''}: ${followersGain>=0?'+':''}${followersGain}`);

  return {
    updates:{ [platformId]: { postsThisAgeDelta:+1, followersDelta:followersGain, engagementDelta, lastPostAge:gameState.currentYear, postStreakDelta:+1, historyAppend:[history] } },
    deltas:{ followersDelta: followersGain, moneyDelta:0, stressDelta: viral?0.3:0, loveDelta:0, engagementDelta, backlash, backlashContext },
    message:{ title:`${platform.emoji} Post`, text: viral?`It goes big.`:(followersGain>=0?`Decent reach.`:`It flops.`), emoji: platform.emoji, tags:['social','post'] }
  };
}

export function resolveEngage({ gameState, platformId }){
  const gain = 50+Math.floor(Math.random()*120);
  return {
    updates:{ [platformId]: { engagedThisAge:true, followersDelta:gain, engagementDelta:+3, historyAppend:[smallHistoryEntry('engage', `+${gain} followers`)] } },
    deltas:{ followersDelta:gain, moneyDelta:0, stressDelta:-0.2, loveDelta:0 },
    message:{ title:'Engaged with community', text:'Replies and kindness build momentum.', emoji:'💬', tags:['social'] }
  };
}

export function resolveCollab({ gameState, platformId }){
  const gain = 200+Math.floor(Math.random()*400);
  return {
    updates:{ [platformId]: { collabsThisAgeDelta:+1, followersDelta:gain, engagementDelta:+4, historyAppend:[smallHistoryEntry('collab', `+${gain} followers`)] } },
    deltas:{ followersDelta:gain, moneyDelta:0, stressDelta:+0.3, loveDelta:0 },
    message:{ title:'Collab', text:'Crossover boosts visibility.', emoji:'🤝', tags:['social'] }
  };
}

export function generateBrandDealOffers({ gameState, platformId }){
  const offers = [1,2,3].map(i=>({ id:`offer_${i}`, label:`Brand Deal #${i}`, amount: 200 + Math.floor(Math.random()*600), repRisk: i===3?2:(i===2?1:0) }));
  return offers;
}

export function resolveBrandDeal({ gameState, platformId, offerId }){
  const amt = 200 + Math.floor(Math.random()*600);
  const repHit = offerId.endsWith('3') ? -2 : (offerId.endsWith('2')? -1 : 0);
  return {
    updates:{ [platformId]: { brandDealsThisAgeDelta:+1, historyAppend:[smallHistoryEntry('brand', `$${amt}`)] } },
    deltas:{ followersDelta:Math.floor(amt/10), moneyDelta:+amt, stressDelta:+0.2, loveDelta:0, reputationDelta:repHit },
    message:{ title:'Brand Deal', text:`Paid placement earned $${amt}.`, emoji:'📣', tags:['social','money'] }
  };
}

export function resolveBuyFollowers({ gameState, platformId, tierId }){
  const cost = tierId==='large'? 1500 : tierId==='medium'? 600 : 250;
  let gain = tierId==='large'? 8000 : tierId==='medium'? 3000 : 1200;
  let strike = false; if (Math.random()<0.25){ strike=true; gain = Math.floor(gain*0.4); }
  const deltas = { followersDelta:gain, moneyDelta:-cost, stressDelta:+0.2, loveDelta:0 };
  let statusChange=null, strikeReasonId=null, strikesDelta=0;
  if (strike){
    strikesDelta=+1; strikeReasonId='fake_followers'; statusChange='shadowbanned';
  }
  return {
    updates:{ [platformId]: { followersDelta:gain, historyAppend:[smallHistoryEntry('buy', `+${gain} for $${cost}`)], strikesDelta, statusChange } },
    deltas:{ ...deltas, strikesDelta, statusChange, strikeReasonId },
    message:{ title:'Buy Followers', text: strike? 'Growth looks suspicious. Risk backfired.' : 'Numbers jump… for now.', emoji:'🧮', tags:['social','risk'] }
  };
}

export function resolveAppealChoice({ gameState, platformId, strategyId }){
  let success = 0.4; if (strategyId==='evidence') success=0.65; else if (strategyId==='polite') success=0.55; else if (strategyId==='public') success=0.45; else if (strategyId==='angry') success=0.25;
  const ok = Math.random()<success;
  const patch = ok? { status:'active', shadowbannedUntilAge:null, suspendedUntilAge:null }: {};
  const rep = ok? +2 : -1;
  return {
    updates:{ [platformId]: { ...patch, historyAppend:[smallHistoryEntry('appeal', ok?'Approved':'Denied')] } },
    deltas:{ reputationDelta: rep, stressDelta: ok? -0.3 : +0.3 },
    message:{ title:'Appeal', text: ok?'Appeal approved.':'Appeal denied.', emoji: ok?'✅':'❌', tags:['social'] }
  };
}

export function resolveBacklashResponse({ gameState, platformId, responseId, context }){
  let rep=0, followers=0, strikesDelta=0, statusChange=null;
  if (responseId==='apologize'){ rep=+3; followers=-Math.floor(50+Math.random()*120); }
  else if (responseId==='ignore'){ rep=-1; followers=-Math.floor(100+Math.random()*200); }
  else if (responseId==='double'){ rep=-3; followers=Math.floor(200+Math.random()*600); if (Math.random()<0.25){ strikesDelta=+1; statusChange='shadowbanned'; } }
  return {
    updates:{ [platformId]: { followersDelta:followers, historyAppend:[smallHistoryEntry('backlash', `${responseId} ${followers>=0?'+':''}${followers}`)], strikesDelta, statusChange } },
    deltas:{ followersDelta:followers, reputationDelta:rep, strikesDelta, statusChange },
    message:{ title:'Backlash handled', text:`You chose to ${responseId}.`, emoji:'⚖️', tags:['social'] }
  };
}

export function resolveReplyToCelebrity({ gameState, platformId, styleId }){
  const gain = styleId==='hot_take'? 500+Math.floor(Math.random()*1000): 200+Math.floor(Math.random()*500);
  const rep = styleId==='hot_take'? -2 : +1;
  return {
    updates:{ [platformId]: { celebrityReplyThisAge:true, followersDelta:gain, historyAppend:[smallHistoryEntry('reply', `+${gain}`)] } },
    deltas:{ followersDelta:gain, reputationDelta:rep, stressDelta:+0.2 },
    message:{ title:'Replied to Celebrity', text:'Your reply gets noticed.', emoji:'⭐', tags:['social'] }
  };
}

export function resolveCrossPromote({ gameState, fromPlatformId, toPlatformId }){
  const gain = 300 + Math.floor(Math.random()*700);
  return {
    updates:{ [toPlatformId]: { crossPromotedThisAge:true, followersDelta:gain, historyAppend:[smallHistoryEntry('xpromo', `+${gain} from ${fromPlatformId}`)] } },
    deltas:{ followersDelta:gain, stressDelta:+0.2 },
    message:{ title:'Cross‑Promote', text:`Boosted ${toPlatformId} using ${fromPlatformId}.`, emoji:'🔁', tags:['social'] }
  };
}

export function resolveGoLive({ gameState, lengthId }){
  const opt = STREAM_LENGTHS.find(x=>x.id===lengthId)||STREAM_LENGTHS[0];
  const gain = 300 + Math.floor(Math.random()*600)*opt.mult;
  const tips = Math.round(gain * 0.03 * opt.tipRate);
  return {
    updates:{ stream: { followersDelta:Math.round(gain), engagedThisAge:true, historyAppend:[smallHistoryEntry('live', `+${Math.round(gain)} • $${tips} tips`)] } },
    deltas:{ followersDelta:Math.round(gain), moneyDelta:+tips, stressDelta:opt.stress },
    message:{ title:'Go Live', text:`Stream pulls in new fans.`, emoji:'🎥', tags:['social'] }
  };
}

export function resolvePodcastRecord({ gameState, formatId }){
  const opt = PODCAST_FORMATS.find(x=>x.id===formatId)||PODCAST_FORMATS[0];
  const gain = 200 + Math.floor(Math.random()*500)*opt.mult;
  return {
    updates:{ podcast: { followersDelta:Math.round(gain), engagedThisAge:true, historyAppend:[smallHistoryEntry('pod', `+${Math.round(gain)}`)] } },
    deltas:{ followersDelta:Math.round(gain), stressDelta:opt.stress },
    message:{ title:'Recorded Podcast', text:`Format: ${opt.label}.`, emoji:'🎙️', tags:['social'] }
  };
}

export function resolveRebrand({ gameState, platformId, newNicheId }){
  return {
    updates:{ [platformId]: { nicheId:newNicheId, reputationDelta:+1, historyAppend:[smallHistoryEntry('rebrand', newNicheId)] } },
    deltas:{ reputationDelta:+1, stressDelta:+0.2 },
    message:{ title:'Rebrand', text:`New focus: ${newNicheId}.`, emoji:'🔁', tags:['social'] }
  };
}

export function resolveDeleteAccount({ gameState, platformId }){
  return {
    updates:{ [platformId]: { active:false, followers:0, historyAppend:[smallHistoryEntry('delete', 'account removed')] } },
    deltas:{ followersDelta:0, stressDelta:+0.2 },
    message:{ title:'Deleted', text:`${platformId} removed.`, emoji:'🗑️', tags:['social'] }
  };
}

// ---- Viral Post Outcome Simulator ----
export async function simulatePostOutcome({ platformId, account, currentAge, seed, nicheId }){
  const plat = getPlatform(platformId) || { reachPct:[0.03,0.1], viralChance:0.05, viralMult:[3,10] };
  const followers = Math.max(0, Number(account?.followers||0));
  const engagement = Math.max(0, Math.min(100, Number(account?.engagement||50)));
  const verified = !!account?.verified;
  const monetized = !!account?.monetized;

  // Seeded RNG
  const s = String(seed || `${currentAge}:${platformId}:${account?.postsThisAge||0}:${account?.followers||0}`);
  const rng = mulberry32(hashString(s));
  const rand = () => rng();

  // Scale factors
  const engFactor = 0.6 + (engagement/100)*0.9; // 0.6..1.5
  const credFactor = (verified?1.12:1.0) * (monetized?1.08:1.0);

  // Base reach
  const [minR,maxR] = plat.reachPct || [0.03,0.1];
  const baseReachPct = minR + (maxR-minR)*(0.35 + 0.3*rand());
  let reachBase = Math.max(400, Math.round(followers * baseReachPct * engFactor * credFactor));

  // Viral check
  const viralChance = (plat.viralChance||0.05) * (0.9 + (engagement/100)) * (0.8 + Math.min(1.4, Math.sqrt(followers||1)/100));
  const goesViral = rand() < viralChance;
  const viralMult = goesViral ? (plat.viralMult[0] + (plat.viralMult[1]-plat.viralMult[0])*(0.4+0.6*rand())) : 1.0;

  // Views by platform
  let metrics = {};
  let views = Math.round(reachBase * (0.8 + 0.6*rand()) * viralMult);
  views = Math.max(800, views);

  const likeRate = 0.04 + 0.08*rand();
  const commentRate = 0.006 + 0.01*rand();
  const shareRate = 0.005 + 0.015*rand();
  const saveRate = 0.01 + 0.02*rand();

  let newFollowers = Math.round(views * (0.0025 + 0.004*rand()) * (engagement/60));
  if (goesViral) newFollowers = Math.round(newFollowers * (1.8 + 1.2*rand()));
  newFollowers = Math.max(5, newFollowers);

  let newSubscribers = 0;
  let estRevenue = 0;

  const fillCommon = () => ({
    likes: Math.round(views * likeRate),
    comments: Math.round(views * commentRate),
    shares: Math.round(views * shareRate),
  });

  if (platformId === 'instagram'){
    metrics = { views, reach: Math.round(views*0.9), ...fillCommon(), saves: Math.round(views*saveRate), newFollowers };
  } else if (platformId === 'facebook'){
    const reactions = Math.round(views*likeRate);
    metrics = { reach: Math.round(views), reactions, likes: reactions, comments: Math.round(views*commentRate), shares: Math.round(views*shareRate), newFollowers };
  } else if (platformId === 'tiktok'){
    metrics = { views, likes: Math.round(views*likeRate), comments: Math.round(views*commentRate), shares: Math.round(views*shareRate), newFollowers };
  } else if (platformId === 'youtube'){
    newSubscribers = Math.max(2, Math.round(newFollowers*0.6));
    const watchTimeMinutes = Math.round(views * (1.2 + 2.5*rand()));
    const sharesYT = Math.round(views * shareRate * 0.6);
    if (monetized) estRevenue = Math.round((views/1000) * (0.8 + 1.4*rand()) * 1.0);
    metrics = { views, likes: Math.round(views*likeRate), comments: Math.round(views*commentRate), shares: sharesYT, newSubscribers, watchTimeMinutes, estRevenue };
  } else if (platformId === 'stream'){
    const peakCCV = Math.max(12, Math.round( (followers*0.01 + 20*rand()) * (goesViral? (2.0+1.2*rand()):1) ));
    const totalViews = Math.round(peakCCV * (15 + 60*rand()));
    const chatMsgs = Math.round(totalViews * (0.05 + 0.12*rand()));
    newSubscribers = Math.max(1, Math.round(newFollowers*0.3));
    const tips = monetized ? Math.round(totalViews * (0.002 + 0.004*rand())) : 0;
    estRevenue = tips;
    metrics = { peakCCV, totalViews, chatMsgs, newFollowers, newSubscribers, tips };
  } else if (platformId === 'podcast'){
    const downloads = Math.max(120, Math.round( (followers*0.3 + 150*rand()) * (goesViral? (1.8+1.0*rand()):1) ));
    newSubscribers = Math.max(1, Math.round(newFollowers*0.5));
    const sharesPod = Math.round(downloads * (0.02 + 0.05*rand()));
    const ratingsBump = +( (0.0 + 0.2*rand()).toFixed(1) );
    if (monetized) estRevenue = Math.round(downloads * (0.02 + 0.06*rand()));
    metrics = { downloads, shares: sharesPod, newSubscribers, ratingsBump, estRevenue };
  } else {
    metrics = { views, likes: Math.round(views*likeRate), comments: Math.round(views*commentRate), shares: Math.round(views*shareRate), newFollowers };
  }

  // Tiering by engagement-based score (deterministic)
  const roll = rand();
  const score = roll + (engagement/100)*0.35 + (Math.log10(followers+10))*0.08 + (verified?0.05:0) + (monetized?0.03:0);
  let tier = 'FLOP';
  if (score < 0.55) tier = 'FLOP';
  else if (score < 0.72) tier = 'SOLID';
  else if (score < 0.85) tier = 'BANGER';
  else if (score < 0.95) tier = 'VIRAL';
  else tier = 'LEGENDARY';

  const engagementDelta = tier==='LEGENDARY' ? +6 : tier==='VIRAL' ? +4 : tier==='BANGER' ? +2 : tier==='OK' ? +1 : -1;

  const deltas = {
    followersDelta: Number(metrics.newFollowers||newFollowers||0),
    subscribersDelta: Number(metrics.newSubscribers||0),
    moneyDelta: Number(estRevenue||0),
    engagementDelta,
  };

  // Viral headline/badge/reason microcopy
  const tierBadges = {
    FLOP: 'Ouch (but funny)',
    SOLID: 'Steady Growth',
    BANGER: 'Hot Clip',
    VIRAL: 'TRENDING',
    LEGENDARY: 'Internet History'
  };
  const tierReasons = {
    FLOP: ['Posted at 3am','Algorithm blinked','Only your aunt liked it'],
    SOLID: ['Algorithm nod','Found your people','Nice save rate'],
    BANGER: ['People watched to the end','Comments popping','Perfect timing'],
    VIRAL: ['Clipped and remixed 💀','Trending #3','Algorithm blessing'],
    LEGENDARY: ['Front page energy','Everywhere at once','The internet saluted']
  };
  const badge = tierBadges[tier] || 'Momentum';
  const reasonLine = (tierReasons[tier]||['Momentum'])[(Math.floor(rand()*3))% (tierReasons[tier]?.length||1)];
  const headline = tier === 'FLOP' ? reasonLine : (tier === 'SOLID' ? reasonLine : (tier === 'LEGENDARY' ? 'Unforgettable' : reasonLine));
  const moment = { headline, badge, reasonLine };

  // Content (LLM preferred)
  const content = await generatePostExample({ platformId, nicheId, tier, seed: s });

  return { tier, content, metrics, deltas, moment };
}

export async function generatePostExample({ platformId, nicheId, tier, seed }){
  const platform = getPlatform(platformId)?.label || platformId;
  const niche = (SOCIAL_NICHES.find(n=>n.id===nicheId)?.label) || 'General';
  const schema = {
    type: 'object',
    properties: {
      title: { type: 'string' },
      caption: { type: 'string' },
      hook: { type: 'string' },
      hashtags: { type: 'array', items: { type: 'string' } },
      thumbnailAlt: { type: 'string' },
      comments: { type: 'array', items: { type: 'string' } }
    },
    required: ['caption','hook','hashtags','comments']
  };
  const prompt = `You generate safe, PG, viral-feeling social media post examples. Platform: ${platform}. Niche: ${niche}. Tone: funny, clever, family-friendly, punchy, no slurs, no harassment, no explicit content, no real-person allegations. Length limits: title<=80, caption<=180, hook<=120. Provide 4-7 hashtags and 3-5 short top comments. Avoid politics or sensitive topics.`;
  try {
    const res = await base44.integrations.Core.InvokeLLM({ prompt, add_context_from_internet: false, response_json_schema: schema });
    const out = res || {};
    // basic clean
    out.hashtags = Array.isArray(out.hashtags) ? out.hashtags.slice(0,7) : [];
    out.comments = Array.isArray(out.comments) ? out.comments.slice(0,5) : [];
    return {
      title: (out.title||'').slice(0,80),
      caption: (out.caption||'').slice(0,180),
      hook: (out.hook||'').slice(0,120),
      hashtags: out.hashtags,
      thumbnailAlt: out.thumbnailAlt || `${niche} post thumbnail`,
      comments: out.comments
    };
  } catch (e) {
    // Fallback templates (deterministic by seed)
    const r = mulberry32(hashString(String(seed||'seed')+platform+niche));
    const hooks = [
      'POV: you needed this today',
      'Tiny tip, huge payoff',
      'No one tells you this part…',
      'This saved my sanity',
      'If you know, you know'
    ];
    const caps = [
      'Quick win for busy humans 🚀',
      'Tried & true — low effort, high joy',
      'We tested this so you don’t have to',
      'Parent hack unlocked 🔑',
      'Bookmark for later!'
    ];
    const cmts = [
      'Adding this to my routine fr',
      'Ok but why is this actually genius',
      'The algorithm did something right today',
      'My brain: “we do this now”',
      'Wholesome AND useful??'
    ];
    const tags = ['#lifehack','#relatable','#dailywin','#lowefforthighimpact','#wholesome','#parenting','#learn'];
    const pick = (arr)=> arr[Math.floor(r()*arr.length)];
    return {
      title: tier==='LEGENDARY' ? 'Front-page energy' : (tier==='VIRAL' ? 'It popped off' : pick(hooks)),
      caption: pick(caps),
      hook: pick(hooks),
      hashtags: Array.from({length:5},()=>pick(tags)),
      thumbnailAlt: `${niche} — ${platform}`,
      comments: Array.from({length:4},()=>pick(cmts))
    };
  }
}