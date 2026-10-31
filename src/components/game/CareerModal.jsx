import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, DollarSign, Search, Handshake, BookOpen, Puzzle, Megaphone, Music, Clapperboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGameState, formatMoney, createSeededRng } from '@/components/game/GameStateContext';
import { getJobById, EDUCATION_RANK, ensureNoTrailingZero, EDUCATION_LEVELS, EDUCATION_FIELDS, getJobBoardForYear } from './jobSystem';
import { normalizePlayerCareer, getCareerStatusLabel, getWealthStatusLabel } from './careerSystem';
import { getMajorById } from './educationSystem';
import { getFluentLanguages } from './languageData';
import { pickHumor, appendHumor } from './humorUtils';
import { CAREER_FLAVOR } from './careerActionFlavorBank';
import { hasShopItem } from './shopCatalog';
import RaiseNegotiationMiniGame from '@/components/game/minigames/RaiseNegotiationMiniGame';
import ReadTheRoomMiniGame from '@/components/game/minigames/ReadTheRoomMiniGame';

const SPECIAL_TRACK_DEFAULTS = {
  aerospace: { xp: 0, launches: 0, discoveries: 0, mishaps: 0 },
  tech: { xp: 0, patents: 0, breakthroughs: [], nobelle: {} },
  culinary: { xp: 0, stars: 0, signatureDishes: 0 },
  police: { xp: 0, commendations: 0, casesClosed: 0, highRiskOps: 0, communityWins: 0 },
  bounty: { xp: 0, bounties: 0, highRiskOps: 0, ethics: 50 }
};

const SPECIAL_TRACK_META = {
  aerospace: { title: 'Aerospace Program', emoji: '🚀' },
  tech: { title: 'Tech Innovator', emoji: '🧲' },
  culinary: { title: 'Culinary Track', emoji: '🍽️' },
  police: { title: 'Police Track', emoji: '🚓' },
  bounty: { title: 'Bounty Hunter', emoji: '🎯' }
};

const SPECIAL_TRACK_ACTIONS = {
  aerospace: [
    { id: 'sc_aero_sim', label: 'Run Simulation', focus: 1, hint: 'XP + • safer progress' },
    { id: 'sc_aero_prototype', label: 'Prototype Component', focus: 1, hint: 'XP + • prep for launches' },
    { id: 'sc_aero_launch', label: 'Lead Launch', focus: 2, hint: 'Big payoff • big pressure' }
  ],
  tech: [
    { id: 'sc_tech_prototype', label: 'Prototype Experiment', focus: 1, hint: 'XP + • build momentum' },
    { id: 'sc_tech_patent', label: 'File Patent', focus: 1, hint: 'Costs money • can pay back' },
    { id: 'sc_tech_moonshot', label: 'Moonshot Demo', focus: 2, hint: 'Breakthrough chance' }
  ],
  culinary: [
    { id: 'sc_culinary_grind', label: 'Kitchen Grind', focus: 1, hint: 'XP + • performance +' },
    { id: 'sc_culinary_cookoff', label: 'Enter Cookoff', focus: 1, hint: 'Prize money chance' },
    { id: 'sc_culinary_chefs_table', label: 'Chef\'s Table Night', focus: 2, hint: 'Micheline star chance' }
  ],
  police: [
    { id: 'sc_police_patrol', label: 'Patrol Shift', focus: 1, hint: 'Overtime + • XP +' },
    { id: 'sc_police_case', label: 'Investigate Case', focus: 1, hint: 'Cases + • rep +' },
    { id: 'sc_police_outreach', label: 'Community Outreach', focus: 1, hint: 'Reputation + • safer' },
    { id: 'sc_police_raid', label: 'High‑Risk Raid', focus: 2, hint: 'Huge pay • death risk ↑' }
  ],
  bounty: [
    { id: 'sc_bounty_track', label: 'Track a Skip', focus: 1, hint: 'Find leads • XP +' },
    { id: 'sc_bounty_negotiate', label: 'Bring In (Negotiate)', focus: 1, hint: 'Safer • ethics +' },
    { id: 'sc_bounty_force', label: 'Bring In (Force)', focus: 2, hint: 'Big bounty • death risk ↑' }
  ]
};

const clampIntLocal = (n, min, max) => Math.max(min, Math.min(max, Math.round(Number(n || 0))));

// =========================
// SPACE CAREER SYSTEM (BitLife-style)
// =========================
const SPACE_JOB_IDS = new Set(['aerospace_program', 'space_contractor']);

const DEFAULT_SPACE_PROGRAM = {
  enrolled: true,
  track: null, // specialization
  readiness: 35,

  // Medical clearance system (yearly)
  medicalClearedYear: null,
  medicalAttemptedYear: null,
  medicalRetestUsedYear: null,
  rehabBonusYear: null,
  groundedUntilYear: null,
  groundedReason: null, // 'medical' | 'catastrophic'
  permanentlyGrounded: false,

  // Mission + outcomes
  missionCount: 0,
  successfulMissions: 0,
  failedMissions: 0,
  lastMissionYear: null,

  // Progression goodies
  setiSignals: 0,
  firstContact: false,

  asteroidHoldings: 0,
  totalMiningProfit: 0,

  papersPublished: 0,
  researchImpact: 0,
  nobelPrize: false
};

const SPACE_SPECIALIZATIONS = [
  { id: 'astronaut', label: 'Astronaut Track', emoji: '🧑‍🚀', hint: 'Missions + readiness bonuses.' },
  { id: 'mission_control', label: 'Mission Control', emoji: '🛰️', hint: 'Safer missions, better outcomes.' },
  { id: 'propulsion', label: 'Propulsion Engineer', emoji: '⚙️', hint: 'Boost mission success; reduce failure.' },
  { id: 'astrobiology', label: 'Astrobiology / SETI', emoji: '🧫', hint: 'SETI + research synergy.' },
  { id: 'space_law', label: 'Space Law & Ethics', emoji: '⚖️', hint: 'Reputation boosts; fewer scandals.' },
  { id: 'asteroid', label: 'Asteroid Venture', emoji: '☄️', hint: 'Mining, profits, chaos.' }
];

const SPACE_MISSIONS = [
  // BOTH
  { id:'orbital_repair', title:'Orbital Repair EVA', sector:'both', minJobLevel:3, minReadiness:60, focusCost:2, baseSuccess:0.62, money:1200, rep:3, fame:6, riskCatastrophe:0.02, blurb:'Spacewalk repairs under a clock that hates you.' },
  { id:'debris_cleanup', title:'Orbital Debris Cleanup', sector:'both', minJobLevel:3, minReadiness:55, focusCost:2, baseSuccess:0.70, money:900, rep:5, fame:4, riskCatastrophe:0.015, blurb:'Prevent a disaster by removing dangerous fragments.' },

  // AGENCY-LEANING
  { id:'microgravity_lab', title:'Microgravity Science Run', sector:'agency', minJobLevel:3, minReadiness:50, focusCost:1, baseSuccess:0.78, money:650, rep:6, fame:3, riskCatastrophe:0.01, blurb:'Experiments, samples, and the quiet thrill of discovery.' },
  { id:'lunar_survey', title:'Lunar Surface Survey', sector:'agency', minJobLevel:4, minReadiness:75, focusCost:3, baseSuccess:0.55, money:2200, rep:8, fame:10, riskCatastrophe:0.04, blurb:'Moon boots. Serious science. Serious danger.' },

  // PRIVATE-LEANING
  { id:'commercial_tourism', title:'Commercial Tourism Demo Flight', sector:'private', minJobLevel:3, minReadiness:65, focusCost:2, baseSuccess:0.60, money:2600, rep:2, fame:8, riskCatastrophe:0.03, blurb:'A high-profile flight with more cameras than comfort.' },
  { id:'asteroid_prospect', title:'Asteroid Prospecting Flight', sector:'private', minJobLevel:4, minReadiness:80, focusCost:3, baseSuccess:0.50, money:4200, rep:3, fame:10, riskCatastrophe:0.05, blurb:'Scan a rock for treasure and try not to die doing it.' },

  // LEGENDARY (BOTH — but rare)
  { id:'mars_attempt', title:'Mars Attempt (Legendary)', sector:'both', minJobLevel:5, minReadiness:92, focusCost:4, baseSuccess:0.35, money:6500, rep:12, fame:25, riskCatastrophe:0.12, blurb:'History-level attempt. Also: history-level risk.' }
];

function clamp01(x){ return Math.max(0, Math.min(1, x)); }
function clamp(n,min,max){ const v = Number(n)||0; return Math.max(min, Math.min(max, v)); }

export default function CareerModal({ open, onClose, initialBrowsingJobs = false }) {
  const { 
    gameState, updateState, spendFocus, applyStress, addLog, recordTimelineEntry, emitActionResult,
    getHouseholdYearlyIncome, applyReputationDelta, applyFameDelta,
    applyDeltas, applyMoneyDelta, applyPlayerHealth
  } = useGameState();
  
  const [browsingJobs, setBrowsingJobs] = useState(false);
  const [, setApplyingTo] = useState(null);
  const [raiseGameOpen, setRaiseGameOpen] = useState(false);
  const [readRoomOpen, setReadRoomOpen] = useState(false);
  const [interviewJob, setInterviewJob] = useState(null);
  const [interviewChance, setInterviewChance] = useState(null);
  const [spaceMissionOpen, setSpaceMissionOpen] = useState(false);
  const [jobBrowserMode, setJobBrowserMode] = useState('recommended');
  const [includeSpecialJobsToggle, setIncludeSpecialJobsToggle] = useState(false);
  React.useEffect(() => {
    if (open && initialBrowsingJobs) {
      setBrowsingJobs(true);
    }
  }, [open, initialBrowsingJobs]);
  React.useEffect(() => {
    if (!open) {
      setBrowsingJobs(false);
      setApplyingTo(null);
      setRaiseGameOpen(false);
      setReadRoomOpen(false);
      setInterviewJob(null);
      setInterviewChance(null);
      setSpaceMissionOpen(false);
    }
  }, [open]);
  React.useEffect(() => {
    if (open) { document.body.style.overflow = 'hidden'; } else { document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (gameState.disableCareer && open) {
    return (
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-[100]" onClick={onClose} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-[101] flex items-center justify-center p-4">
              <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 text-center">
                <h3 className="text-xl font-bold text-slate-800 mb-2">🚫 Career Disabled</h3>
                <p className="text-slate-600 mb-4">Career options are not available in this Special Start.</p>
                <Button onClick={onClose}>Close</Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  const playerCareer = normalizePlayerCareer(gameState.playerCareer, gameState) || {
    jobId: null, jobLevelIndex: 0, performance: 55, yearsInJob: 0, employed: true, yearlyIncome: 0, lastWorkedHardAge: -1, lastAskedRaiseAge: -1, lastProcessedAge: -1
  };
  const yNow = gameState.currentYear;
  const yearFlagsNow = playerCareer.flagsByAge?.[yNow] || {};
  const didCareerActionThisYear = Object.keys(yearFlagsNow).length > 0 || playerCareer.lastAskedRaiseAge === yNow || playerCareer.lastWorkedHardAge === yNow;
  const parentEducation = gameState.parentEducation || { highest: { levelId: gameState.playerCareer?.educationLevelId || 'high_school', majorId: null } };

  const currentJob = playerCareer.jobId ? getJobById(playerCareer.jobId) : null;
  const currentLevel = currentJob?.levels?.[playerCareer.jobLevelIndex || 0];

  const jobDisplayTitle=currentLevel?.title||currentJob?.title, jobId=currentJob?.id, isGovAssist=jobId==='government_assistance', isSAHP=jobId==='stay_at_home_parent';
  const spaceProgram=playerCareer?.spaceProgram||{}, jobLevelIndex=Number(playerCareer?.jobLevelIndex||0), isAerospace=jobId==='aerospace';
  const handleMicrogravityExperiment = () => handlePublishPaper();
  const handleAsteroidPitch = () => handleAsteroidVenture();
  const specialTrackId = currentJob?.specialTrackId || null;
  const isSpecialCareerJob = Boolean(currentJob?.isSpecialCareer && specialTrackId && SPECIAL_TRACK_DEFAULTS[specialTrackId]);
  const trackMeta = isSpecialCareerJob ? (SPECIAL_TRACK_META[specialTrackId] || { title: 'Special Track', emoji: '🌟' }) : null;
  const trackState = isSpecialCareerJob
    ? { ...(SPECIAL_TRACK_DEFAULTS[specialTrackId] || {}), ...(gameState.specialCareers?.tracks?.[specialTrackId] || {}) }
    : null;
  const specialActions = isSpecialCareerJob ? (SPECIAL_TRACK_ACTIONS[specialTrackId] || []) : [];

  const isSpecialActionUsedThisYear = (actionId) => {
    const y = gameState.currentYear;
    return Boolean(playerCareer.flagsByAge?.[y]?.[actionId]);
  };

  const unlockTrophiesOnce = (items) => {
    const list = Array.isArray(items) ? items : [];
    if (!list.length) return;

    // Only record timeline for trophies not already unlocked (best-effort).
    const alreadyMap = gameState.trophies?.unlocked || {};

    updateState(prev => {
      let next = prev;
      const trophies0 = prev.trophies || { unlocked: {} };
      const unlocked0 = trophies0.unlocked || {};
      let changed = false;
      let unlocked2 = { ...unlocked0 };

      for (const it of list) {
        const trophyId = it?.id;
        if (!trophyId) continue;
        if (unlocked2[trophyId]) continue;
        unlocked2[trophyId] = { ts: Date.now(), age: prev.currentYear || 0, note: String(it?.note || '') };
        changed = true;
      }

      if (!changed) return prev;

      next = {
        ...prev,
        trophies: {
          ...trophies0,
          unlocked: unlocked2
        }
      };

      return next;
    });

    // timeline entries (best-effort, may skip if already unlocked)
    for (const it of list) {
      const trophyId = it?.id;
      if (!trophyId) continue;
      if (alreadyMap?.[trophyId]) continue;
      try {
        recordTimelineEntry({
          kind: 'trophy',
          title: '🏆 Trophy Unlocked',
          detail: String(it?.note || trophyId),
          age: gameState.currentYear,
          moneyDelta: 0,
          loveDelta: 0,
          stressDelta: 0,
          meta: { trophyId }
        });
      } catch {}
    }
  };

  const renderSpecialTrackStats = () => {
    if (!isSpecialCareerJob || !trackState) return null;

    if (specialTrackId === 'culinary') {
      const stars = Math.max(0, Math.min(3, Number(trackState.stars || 0)));
      return (
        <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
          <div className="p-2 rounded-lg bg-white border border-slate-200">
            <div className="text-slate-500">Micheline Stars</div>
            <div className="font-semibold text-slate-800">{'⭐'.repeat(stars)}{stars < 3 ? '☆'.repeat(3 - stars) : ''}</div>
          </div>
          <div className="p-2 rounded-lg bg-white border border-slate-200">
            <div className="text-slate-500">Signature Dishes</div>
            <div className="font-semibold text-slate-800">{Number(trackState.signatureDishes || 0)}</div>
          </div>
        </div>
      );
    }

    if (specialTrackId === 'tech') {
      const nob = trackState.nobelle || {};
      const nobCount = Object.values(nob).filter(Boolean).length;
      return (
        <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
          <div className="p-2 rounded-lg bg-white border border-slate-200">
            <div className="text-slate-500">Patents</div>
            <div className="font-semibold text-slate-800">{Number(trackState.patents || 0)}</div>
          </div>
          <div className="p-2 rounded-lg bg-white border border-slate-200">
            <div className="text-slate-500">Breakthroughs</div>
            <div className="font-semibold text-slate-800">{Array.isArray(trackState.breakthroughs) ? trackState.breakthroughs.length : 0}</div>
          </div>
          <div className="p-2 rounded-lg bg-white border border-slate-200 col-span-2">
            <div className="text-slate-500">Nobelle Prizes</div>
            <div className="font-semibold text-slate-800">{nobCount > 0 ? `${nobCount} won` : 'None yet'}</div>
          </div>
        </div>
      );
    }

    if (specialTrackId === 'aerospace') {
      return (
        <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
          <div className="p-2 rounded-lg bg-white border border-slate-200">
            <div className="text-slate-500">Launches</div>
            <div className="font-semibold text-slate-800">{Number(trackState.launches || 0)}</div>
          </div>
          <div className="p-2 rounded-lg bg-white border border-slate-200">
            <div className="text-slate-500">Discoveries</div>
            <div className="font-semibold text-slate-800">{Number(trackState.discoveries || 0)}</div>
          </div>
          <div className="p-2 rounded-lg bg-white border border-slate-200 col-span-2">
            <div className="text-slate-500">Mishaps</div>
            <div className="font-semibold text-slate-800">{Number(trackState.mishaps || 0)}</div>
          </div>
        </div>
      );
    }

    if (specialTrackId === 'police') {
      return (
        <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
          <div className="p-2 rounded-lg bg-white border border-slate-200">
            <div className="text-slate-500">Cases Closed</div>
            <div className="font-semibold text-slate-800">{Number(trackState.casesClosed || 0)}</div>
          </div>
          <div className="p-2 rounded-lg bg-white border border-slate-200">
            <div className="text-slate-500">Commendations</div>
            <div className="font-semibold text-slate-800">{Number(trackState.commendations || 0)}</div>
          </div>
          <div className="p-2 rounded-lg bg-white border border-slate-200">
            <div className="text-slate-500">Community Wins</div>
            <div className="font-semibold text-slate-800">{Number(trackState.communityWins || 0)}</div>
          </div>
          <div className="p-2 rounded-lg bg-white border border-slate-200">
            <div className="text-slate-500">High‑Risk Ops</div>
            <div className="font-semibold text-slate-800">{Number(trackState.highRiskOps || 0)}</div>
          </div>
        </div>
      );
    }

    if (specialTrackId === 'bounty') {
      return (
        <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
          <div className="p-2 rounded-lg bg-white border border-slate-200">
            <div className="text-slate-500">Bounties</div>
            <div className="font-semibold text-slate-800">{Number(trackState.bounties || 0)}</div>
          </div>
          <div className="p-2 rounded-lg bg-white border border-slate-200">
            <div className="text-slate-500">Ethics</div>
            <div className="font-semibold text-slate-800">{Math.max(0, Math.min(100, Number(trackState.ethics || 50)))}/100</div>
          </div>
          <div className="p-2 rounded-lg bg-white border border-slate-200 col-span-2">
            <div className="text-slate-500">High‑Risk Ops</div>
            <div className="font-semibold text-slate-800">{Number(trackState.highRiskOps || 0)}</div>
          </div>
        </div>
      );
    }

    return null;
  };

// =========================
// SPACE CAREER SYSTEM (BitLife-style)
// =========================

  // =========================
  // SPACE CAREER HELPERS
  // =========================
  const isSpaceCareer = Boolean(currentJob?.id && SPACE_JOB_IDS.has(currentJob.id));
  const isPrivateSpace = currentJob?.id === 'space_contractor';
  const spaceSectorLabel = isSpaceCareer ? (isPrivateSpace ? 'Private Contractor' : 'Space Agency') : null;

  const ensureSpaceProgram = (pc) => ({ ...DEFAULT_SPACE_PROGRAM, ...(pc?.spaceProgram || {}) });

  const getConditioningScore = () => {
    // Proxy for "fitness": gym habit + general health
    const sessions = Number(gameState.parentStrategyProgress?.gym?.totalSessions || 0);
    const gymScore = clamp(sessions * 4, 0, 100); // ~25 sessions to max
    const health = clamp(Number(gameState.playerHealth ?? 75), 0, 100);
    return clamp(Math.round((gymScore * 0.55) + (health * 0.45)), 0, 100);
  };

  const unlockTrophy = (trophyId, name, note) => {
    const trophies = gameState.trophies || { unlocked: {} };
    if (trophies.unlocked?.[trophyId]) return false;

    updateState({
      trophies: {
        unlocked: {
          ...(trophies.unlocked || {}),
          [trophyId]: {
            unlockedAtAge: gameState.currentYear,
            unlockedAtYear: gameState.currentYear,
            note: note || ''
          }
        }
      }
    });

    addLog(`🏆 Trophy unlocked: ${name}`);
    recordTimelineEntry({
      kind: 'system',
      title: `🏆 Trophy: ${name}`,
      detail: note || 'Unlocked.',
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0
    });
    return true;
  };

  const computeMedicalPassChance = (sp) => {
    const health = clamp(Number(gameState.playerHealth ?? 75), 0, 100);
    const conditioning = getConditioningScore();
    const stress = clamp(Number(gameState.stress ?? 0), 0, 100);
    const burnout = clamp(Number(playerCareer.burnout ?? 0), 0, 100);

    // Base pass chance
    let p = 0.55;
    // Health and conditioning help a lot
    p += (health - 60) * 0.0045;
    p += (conditioning - 60) * 0.0045;

    // Stress and burnout hurt
    p -= (stress - 45) * 0.004;
    p -= (burnout - 40) * 0.0035;

    // Track modifiers
    if (sp.track === 'astronaut') p += 0.03;
    if (sp.track === 'mission_control') p += 0.04;
    if (sp.track === 'propulsion') p += 0.02;
    if (sp.track === 'space_law') p += 0.01;
    if (sp.track === 'asteroid') p -= 0.01;

    // Rehab bonus if you did rehab this year
    if (sp.rehabBonusYear === gameState.currentYear) p += 0.12;

    return clamp01(p);
  };

  const isGroundedNow = (sp) => {
    if (sp.permanentlyGrounded) return true;
    const gu = sp.groundedUntilYear;
    if (gu == null) return false;
    return Number(gu) >= Number(gameState.currentYear);
  };

  const canDoMissionsThisYear = (sp) => {
    if (!isSpaceCareer) return false;
    if (playerCareer.jobLevelIndex < 3) return false; // need at least Astronaut Candidate tier
    if (isGroundedNow(sp)) return false;
    return sp.medicalClearedYear === gameState.currentYear;
  };

  const getAvailableMissions = () => {
    const sector = isPrivateSpace ? 'private' : 'agency';
    return SPACE_MISSIONS.filter(m => (m.sector === 'both' || m.sector === sector));
  };

  const handleChooseSpecialization = (trackId) => {
    if (!isSpaceCareer) return;
    if (!spendFocus(1, 'Choose Space Specialization')) return;

    updateState(prev => {
      const pc = prev.playerCareer || playerCareer;
      const sp = ensureSpaceProgram(pc);
      if (sp.track) return prev; // already chosen
      return {
        ...prev,
        playerCareer: {
          ...pc,
          flagsByAge: {
            ...(pc.flagsByAge || {}),
            [gameState.currentYear]: {
              ...(pc.flagsByAge?.[gameState.currentYear] || {}),
              interacted: true,
              spaceTrack: true
            }
          },
          spaceProgram: { ...sp, track: trackId }
        }
      };
    });

    const chosen = SPACE_SPECIALIZATIONS.find(s => s.id === trackId);
    emitActionResult({
      actionId: 'career',
      title: `${chosen?.emoji || '🛰️'} Space Specialization`,
      body: `You commit to: ${chosen?.label || trackId}.\n\nFocus -1`,
      deltas: null,
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ['career'],
      meta: { emoji: chosen?.emoji || '🛰️', skipTimelineRecord: true }
    });
  };

  const handleSpaceTraining = () => {
    if (!isSpaceCareer) return;
    if (!spendFocus(1, 'Space Training')) return;

    const gain = 8 + Math.floor(Math.random() * 7); // 8-14
    const line = (CAREER_FLAVOR.spaceTraining || [])[Math.floor(Math.random() * (CAREER_FLAVOR.spaceTraining || []).length)] || 'You train hard.';

    applyStress(0.5, 'Space Training');
    applyPlayerHealth(0.6);

    updateState(prev => {
      const pc = prev.playerCareer || playerCareer;
      const sp = ensureSpaceProgram(pc);
      const nextReadiness = clamp(sp.readiness + gain, 0, 100);
      return {
        ...prev,
        playerCareer: {
          ...pc,
          burnout: clamp((pc.burnout || 0) + 2, 0, 100),
          flagsByAge: {
            ...(pc.flagsByAge || {}),
            [gameState.currentYear]: {
              ...(pc.flagsByAge?.[gameState.currentYear] || {}),
              interacted: true,
              spaceTraining: true
            }
          },
          spaceProgram: { ...sp, readiness: nextReadiness }
        }
      };
    });

    addLog(`🛰️ Space training complete. Readiness +${gain}.`);
    emitActionResult({
      actionId: 'career',
      title: '🛰️ Space Training',
      body: `${line}\n\nReadiness +${gain} • Stress +0.5 • Parent Health +0.6 • Focus -1`,
      deltas: null,
      loveDelta: 0,
      stressDelta: 0.5,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ['career'],
      meta: { emoji: '🛰️', skipTimelineRecord: true }
    });
  };

  const handleMedicalClearance = () => {
    if (!isSpaceCareer) return;
    if (!spendFocus(1, 'Medical Clearance')) return;

    const pcNow = normalizePlayerCareer(gameState.playerCareer, gameState) || playerCareer;
    const sp0 = ensureSpaceProgram(pcNow);

    // Limit attempts: 1 per year, +1 re-test if rehab done
    const attempted = sp0.medicalAttemptedYear === gameState.currentYear;
    const canRetest = attempted && sp0.rehabBonusYear === gameState.currentYear && sp0.medicalRetestUsedYear !== gameState.currentYear;
    if (attempted && !canRetest) {
      emitActionResult({
        actionId: 'career',
        title: '🩺 Medical Clearance',
        body: `You already attempted medical clearance this year.\n\nTry rehab first if you need a re-test.`,
        deltas: null,
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        focusDelta: -1,
        tags: ['career'],
        meta: { emoji: '🩺', skipTimelineRecord: true }
      });
      return;
    }

    const passChance = computeMedicalPassChance(sp0);
    const roll = Math.random();
    const pass = roll < passChance;

    const passLine = (CAREER_FLAVOR.spaceMedicalPass || [])[Math.floor(Math.random() * (CAREER_FLAVOR.spaceMedicalPass || []).length)] || 'Cleared.';
    const failLine = (CAREER_FLAVOR.spaceMedicalFail || [])[Math.floor(Math.random() * (CAREER_FLAVOR.spaceMedicalFail || []).length)] || 'Grounded.';

    if (pass) {
      applyStress(-0.5, 'Medical Clearance passed');
      updateState(prev => {
        const pc = prev.playerCareer || playerCareer;
        const sp = ensureSpaceProgram(pc);
        return {
          ...prev,
          playerCareer: {
            ...pc,
            flagsByAge: {
              ...(pc.flagsByAge || {}),
              [gameState.currentYear]: {
                ...(pc.flagsByAge?.[gameState.currentYear] || {}),
                interacted: true,
                spaceMedical: true,
                spaceMedicalPass: true
              }
            },
            spaceProgram: {
              ...sp,
              medicalClearedYear: gameState.currentYear,
              medicalAttemptedYear: gameState.currentYear,
              medicalRetestUsedYear: canRetest ? gameState.currentYear : sp.medicalRetestUsedYear,
              groundedUntilYear: null,
              groundedReason: null
            }
          }
        };
      });

      addLog(`🩺 Medical clearance PASSED (${Math.round(passChance * 100)}%).`);
      emitActionResult({
        actionId: 'career',
        title: '🩺 Medical Clearance: PASSED',
        body: `${passLine}\n\nCleared for missions this year.\nChance: ${Math.round(passChance * 100)}% • Focus -1`,
        deltas: null,
        loveDelta: 0,
        stressDelta: -0.5,
        moneyDelta: 0,
        focusDelta: -1,
        tags: ['career'],
        meta: { emoji: '🩺', skipTimelineRecord: true }
      });
      return;
    }

    // fail => grounded for this year
    applyStress(1.5, 'Medical Clearance failed');
    applyPlayerHealth(-1.2);

    updateState(prev => {
      const pc = prev.playerCareer || playerCareer;
      const sp = ensureSpaceProgram(pc);
      return {
        ...prev,
        playerCareer: {
          ...pc,
          burnout: clamp((pc.burnout || 0) + 4, 0, 100),
          flagsByAge: {
            ...(pc.flagsByAge || {}),
            [gameState.currentYear]: {
              ...(pc.flagsByAge?.[gameState.currentYear] || {}),
              interacted: true,
              spaceMedical: true,
              spaceMedicalFail: true
            }
          },
          spaceProgram: {
            ...sp,
            medicalAttemptedYear: gameState.currentYear,
            medicalRetestUsedYear: canRetest ? gameState.currentYear : sp.medicalRetestUsedYear,
            groundedUntilYear: gameState.currentYear,
            groundedReason: 'medical'
          }
        }
      };
    });

    addLog(`🩺 Medical clearance FAILED (${Math.round(passChance * 100)}%). Grounded this year.`);
    emitActionResult({
      actionId: 'career',
      title: '🩺 Medical Clearance: FAILED',
      body: `${failLine}\n\nYou are GROUNDED for missions this year.\nParent Health -1.2 • Stress +1.5 • Focus -1`,
      deltas: null,
      loveDelta: 0,
      stressDelta: 1.5,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ['career'],
      meta: { emoji: '🩺', skipTimelineRecord: true }
    });
  };

  const handleRehabConditioning = () => {
    if (!isSpaceCareer) return;
    if (!spendFocus(1, 'Conditioning Rehab')) return;

    const line = (CAREER_FLAVOR.spaceRehab || [])[Math.floor(Math.random() * (CAREER_FLAVOR.spaceRehab || []).length)] || 'Rehab.';

    applyStress(-1, 'Conditioning Rehab');
    applyPlayerHealth(2.2);

    updateState(prev => {
      const pc = prev.playerCareer || playerCareer;
      const sp = ensureSpaceProgram(pc);
      return {
        ...prev,
        playerCareer: {
          ...pc,
          flagsByAge: {
            ...(pc.flagsByAge || {}),
            [gameState.currentYear]: {
              ...(pc.flagsByAge?.[gameState.currentYear] || {}),
              interacted: true,
              spaceRehab: true
            }
          },
          spaceProgram: {
            ...sp,
            rehabBonusYear: gameState.currentYear
          }
        }
      };
    });

    addLog('🏋️ Conditioning rehab complete.');
    emitActionResult({
      actionId: 'career',
      title: '🏋️ Conditioning Rehab',
      body: `${line}\n\nParent Health +2.2 • Stress -1 • Focus -1`,
      deltas: null,
      loveDelta: 0,
      stressDelta: -1,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ['career'],
      meta: { emoji: '🏋️', skipTimelineRecord: true }
    });
  };

  const handleSetiListen = () => {
    if (!isSpaceCareer) return;
    if (!spendFocus(1, 'SETI Listen')) return;

    const pcNow = normalizePlayerCareer(gameState.playerCareer, gameState) || playerCareer;
    const sp0 = ensureSpaceProgram(pcNow);

    const nextSignals = (sp0.setiSignals || 0) + 1;

    // Decide trigger BEFORE state update (prevents stale-state bugs)
    let nextFirstContact = Boolean(sp0.firstContact);
    let triggeredFirstContact = false;

    if (!nextFirstContact && nextSignals >= 5) {
      const bonus = (sp0.track === 'astrobiology') ? 0.06 : 0;
      const p = clamp01(0.06 + (nextSignals * 0.03) + ((sp0.researchImpact || 0) * 0.001) + bonus);
      if (Math.random() < p) {
        nextFirstContact = true;
        triggeredFirstContact = true;
      }
    }

    const line =
      (CAREER_FLAVOR.spaceSeti || [])[Math.floor(Math.random() * (CAREER_FLAVOR.spaceSeti || []).length)]
      || 'You listen.';

    updateState(prev => {
      const pc = prev.playerCareer || pcNow;
      const sp = ensureSpaceProgram(pc);
      const y = prev.currentYear;

      return {
        ...prev,
        playerCareer: {
          ...pc,
          flagsByAge: {
            ...(pc.flagsByAge || {}),
            [y]: {
              ...(pc.flagsByAge?.[y] || {}),
              interacted: true,
              setiListen: true
            }
          },
          spaceProgram: { ...sp, setiSignals: nextSignals, firstContact: nextFirstContact }
        }
      };
    });

    // Award EXACTLY ONCE, only when it triggers this action
    if (triggeredFirstContact) {
      applyFameDelta(250, 'First Contact');
      applyReputationDelta(25, 'First Contact');
      unlockTrophy('seti_first_contact', 'First Contact', 'Detected an unmistakable signal: first contact.');
      recordTimelineEntry({
        kind: 'career',
        title: '📡 First Contact',
        detail: 'You detected an unmistakable signal. History changes.',
        moneyDelta: 0,
        loveDelta: 0,
        stressDelta: 2
      });
      applyStress(2, 'First Contact shock');
    }

    addLog('📡 SETI scan complete.');
    emitActionResult({
      actionId: 'career',
      title: '📡 SETI Listen',
      body: `${line}\n\nSETI progress +1 • Focus -1`,
      deltas: null,
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ['career'],
      meta: { emoji: '📡', skipTimelineRecord: true }
    });
  };

  const handlePublishPaper = () => {
    if (!isSpaceCareer) return;
    if (!spendFocus(1, 'Publish Paper')) return;

    const impactGain = 8 + Math.floor(Math.random() * 13); // 8-20

    const pcNow = normalizePlayerCareer(gameState.playerCareer, gameState) || playerCareer;
    const sp0 = ensureSpaceProgram(pcNow);

    const nextPapers = (sp0.papersPublished || 0) + 1;
    const nextImpact = clamp((sp0.researchImpact || 0) + impactGain, 0, 200);

    // Decide trigger BEFORE state update (prevents stale-state bugs)
    let nextNobel = Boolean(sp0.nobelPrize);
    let triggeredNobel = false;

    if (!nextNobel && nextPapers >= 3 && nextImpact >= 110) {
      const rep = clamp(Number(pcNow.careerRep || 55), 0, 100);
      const agencyBonus = isPrivateSpace ? 0 : 0.03;
      const p = clamp01(0.06 + (rep - 70) * 0.004 + (nextImpact - 110) * 0.002 + agencyBonus);
      if (Math.random() < p) {
        nextNobel = true;
        triggeredNobel = true;
      }
    }

    const line =
      (CAREER_FLAVOR.spacePaper || [])[Math.floor(Math.random() * (CAREER_FLAVOR.spacePaper || []).length)]
      || 'You publish.';

    updateState(prev => {
      const pc = prev.playerCareer || pcNow;
      const sp = ensureSpaceProgram(pc);
      const y = prev.currentYear;

      return {
        ...prev,
        playerCareer: {
          ...pc,
          flagsByAge: {
            ...(pc.flagsByAge || {}),
            [y]: {
              ...(pc.flagsByAge?.[y] || {}),
              interacted: true,
              publishPaper: true
            }
          },
          spaceProgram: { ...sp, papersPublished: nextPapers, researchImpact: nextImpact, nobelPrize: nextNobel }
        }
      };
    });

    // Award EXACTLY ONCE, only when it triggers this action
    if (triggeredNobel) {
      applyFameDelta(220, 'Nobel Prize');
      applyReputationDelta(30, 'Nobel Prize');
      applyMoneyDelta(5000, { source: 'Nobel Prize', category: 'career', ageOverride: gameState.currentYear });
      unlockTrophy('nobel_laureate', 'Nobel Laureate', 'Won the Nobel Prize for a scientific breakthrough.');
      recordTimelineEntry({
        kind: 'career',
        title: '🏅 Nobel Prize',
        detail: 'A career-defining scientific honor. You are officially history.',
        moneyDelta: 5000,
        loveDelta: 0,
        stressDelta: 3
      });
      applyStress(3, 'Nobel attention');
    }

    addLog(`🧾 Paper published. Impact +${impactGain}.`);
    emitActionResult({
      actionId: 'career',
      title: '🧾 Publish Paper',
      body: `${line}\n\nResearch Impact +${impactGain} • Focus -1`,
      deltas: null,
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ['career'],
      meta: { emoji: '🧾', skipTimelineRecord: true }
    });
  };

  const handleAsteroidVenture = () => {
    if (!isSpaceCareer) return;
    if (!spendFocus(1, 'Asteroid Venture')) return;

    const pcNow = normalizePlayerCareer(gameState.playerCareer, gameState) || playerCareer;
    const sp0 = ensureSpaceProgram(pcNow);
    const prevTotal = Number(sp0.totalMiningProfit || 0);

    const line = (CAREER_FLAVOR.spaceAsteroid || [])[Math.floor(Math.random() * (CAREER_FLAVOR.spaceAsteroid || []).length)] || 'Asteroids.';
    // Tradeoff: Private pays more, agency gives more rep
    const baseProfit = 700 + Math.floor(Math.random() * 1800); // 700-2500
    const moneyGain = isPrivateSpace ? Math.round(baseProfit * 1.5) : Math.round(baseProfit * 0.65);
    const repGain = isPrivateSpace ? 1 : 3;
    const fameGain = isPrivateSpace ? 2 : 1;

    const nextTotal = prevTotal + moneyGain;
    const crossedTycoon = prevTotal < 45000 && nextTotal >= 45000;

    applyMoneyDelta(moneyGain, { source: 'Asteroid Venture', category: 'career', ageOverride: gameState.currentYear });
    applyReputationDelta(repGain, 'Asteroid Venture');
    applyFameDelta(fameGain, 'Asteroid Venture');
    applyStress(0.5, 'Asteroid Venture');

    updateState(prev => {
      const pc = prev.playerCareer || playerCareer;
      const sp = ensureSpaceProgram(pc);
      const holdings = (sp.asteroidHoldings || 0) + 1;
      return {
        ...prev,
        playerCareer: {
          ...pc,
          flagsByAge: {
            ...(pc.flagsByAge || {}),
            [gameState.currentYear]: {
              ...(pc.flagsByAge?.[gameState.currentYear] || {}),
              interacted: true,
              asteroidVenture: true
            }
          },
          spaceProgram: { ...sp, asteroidHoldings: holdings, totalMiningProfit: nextTotal }
        }
      };
    });

    if (crossedTycoon) {
      unlockTrophy('asteroid_tycoon', 'Asteroid Tycoon', 'Struck it rich as an asteroid miner.');
    }

    addLog(`☄️ Asteroid venture profit +$${formatMoney(moneyGain)}.`);
    emitActionResult({
      actionId: 'career',
      title: '☄️ Asteroid Venture',
      body: `${line}\n\n+$${formatMoney(moneyGain)} • Fame +${fameGain} • Rep +${repGain} • Stress +0.5 • Focus -1`,
      deltas: null,
      loveDelta: 0,
      stressDelta: 0.5,
      moneyDelta: moneyGain,
      focusDelta: -1,
      tags: ['career'],
      meta: { emoji: '☄️', skipTimelineRecord: true }
    });
  };

  // Space Mission modal state
  const runSpaceMission = (mission) => {
    if (!mission) return;
    const pcNow = normalizePlayerCareer(gameState.playerCareer, gameState) || playerCareer;
    const sp0 = ensureSpaceProgram(pcNow);

    // Hard blocks
    if (isGroundedNow(sp0)) {
      const why = sp0.permanentlyGrounded ? 'Permanently grounded' : 'Grounded this year';
      emitActionResult({
        actionId: 'career',
        title: '🚫 Mission Blocked',
        body: `${why} (${sp0.groundedReason || 'status'}).\n\nYou cannot fly missions right now.`,
        deltas: null, loveDelta: 0, stressDelta: 0, moneyDelta: 0, focusDelta: 0,
        tags: ['career'], meta: { emoji: '🚫', skipTimelineRecord: true }
      });
      return;
    }

    if (sp0.medicalClearedYear !== gameState.currentYear) {
      emitActionResult({
        actionId: 'career',
        title: '🩺 Medical Clearance Required',
        body: `You must pass medical clearance THIS YEAR before flying missions.\n\nGo run Medical Clearance first.`,
        deltas: null, loveDelta: 0, stressDelta: 0, moneyDelta: 0, focusDelta: 0,
        tags: ['career'], meta: { emoji: '🩺', skipTimelineRecord: true }
      });
      return;
    }

    if (playerCareer.jobLevelIndex < (mission.minJobLevel || 3)) {
      emitActionResult({
        actionId: 'career',
        title: '📛 Not Cleared For This Mission',
        body: `You need higher seniority for this mission.\n\nCome back after promotions.`,
        deltas: null, loveDelta: 0, stressDelta: 0, moneyDelta: 0, focusDelta: 0,
        tags: ['career'], meta: { emoji: '📛', skipTimelineRecord: true }
      });
      return;
    }

    const ok = spendFocus(mission.focusCost || 2, `Mission: ${mission.title}`);
    if (!ok) return;

    const readiness = clamp(sp0.readiness || 0, 0, 100);
    const perf = clamp(playerCareer.performance || 55, 0, 100);
    const burnout = clamp(playerCareer.burnout || 0, 0, 100);
    const stress = clamp(gameState.stress || 0, 0, 100);

    // Sector modifiers (agency vs private contractor)
    const moneyMult = isPrivateSpace ? 1.35 : 0.70;
    const repMult = isPrivateSpace ? 0.95 : 1.20;
    const fameMult = isPrivateSpace ? 1.05 : 1.10;
    const extraCatRisk = isPrivateSpace ? 0.03 : -0.01;

    // Success chance
    let p = clamp01(mission.baseSuccess || 0.6);
    p += (readiness - (mission.minReadiness || 60)) * 0.003;
    p += (perf - 55) * 0.002;
    p -= (burnout - 40) * 0.003;
    p -= (stress - 50) * 0.0015;

    if (sp0.track === 'mission_control') p += 0.04;
    if (sp0.track === 'propulsion') p += 0.03;
    if (sp0.track === 'astronaut') p += 0.02;
    if (sp0.track === 'asteroid') p -= 0.01;

    p = clamp01(clamp(p, 0.08, 0.92));
    const roll = Math.random();
    const success = roll < p;

    // Rewards baseline
    const moneyGain = Math.round((mission.money || 0) * moneyMult);
    const repGain = Math.round((mission.rep || 0) * repMult);
    const fameGain = Math.round((mission.fame || 0) * fameMult);

    if (success) {
      const successLine = (CAREER_FLAVOR.spaceMissionSuccess || [])[Math.floor(Math.random() * (CAREER_FLAVOR.spaceMissionSuccess || []).length)] || 'Success.';
      const extra = (mission.id === 'debris_cleanup')
        ? ((CAREER_FLAVOR.spaceDebris || [])[Math.floor(Math.random() * (CAREER_FLAVOR.spaceDebris || []).length)] || '')
        : '';

      applyMoneyDelta(moneyGain, { source: `Mission: ${mission.title}`, category: 'career', ageOverride: gameState.currentYear });
      applyReputationDelta(repGain, `Mission: ${mission.title}`);
      applyFameDelta(fameGain, `Mission: ${mission.title}`);
      applyStress(1.0, 'Mission completed');

      updateState(prev => {
        const pc = prev.playerCareer || playerCareer;
        const sp = ensureSpaceProgram(pc);
        return {
          ...prev,
          playerCareer: {
            ...pc,
            performance: clamp((pc.performance || 55) + 4, 0, 100),
            burnout: clamp((pc.burnout || 0) + 6, 0, 100),
            flagsByAge: {
              ...(pc.flagsByAge || {}),
              [gameState.currentYear]: {
                ...(pc.flagsByAge?.[gameState.currentYear] || {}),
                interacted: true,
                spaceMission: true
              }
            },
            spaceProgram: {
              ...sp,
              missionCount: (sp.missionCount || 0) + 1,
              successfulMissions: (sp.successfulMissions || 0) + 1,
              lastMissionYear: gameState.currentYear,
              readiness: clamp((sp.readiness || 0) + 2, 0, 100) // small confidence bump
            }
          }
        };
      });

      addLog(`🚀 Mission success: ${mission.title} (${Math.round(p*100)}% chance).`);
      recordTimelineEntry({
        kind: 'career',
        title: `🚀 Mission Success: ${mission.title}`,
        detail: `${spaceSectorLabel}: +$${formatMoney(moneyGain)}, Rep +${repGain}, Fame +${fameGain}`,
        moneyDelta: moneyGain,
        loveDelta: 0,
        stressDelta: 1
      });

      emitActionResult({
        actionId: 'career',
        title: `🚀 Mission Success`,
        body: `${successLine}${extra ? `\n\n${extra}` : ''}\n\n+$${formatMoney(moneyGain)} • Rep +${repGain} • Fame +${fameGain}\nChance: ${Math.round(p*100)}% • Focus -${mission.focusCost || 2}`,
        deltas: null,
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: moneyGain,
        focusDelta: -(mission.focusCost || 2),
        tags: ['career'],
        meta: { emoji: '🚀', skipTimelineRecord: true }
      });

      // Special: Mars Pioneer trophy if Mars attempt success (trophy already exists)
      if (mission.id === 'mars_attempt') {
        unlockTrophy('mars_pioneer', 'First Human on Mars', 'Became the first human to set foot on Mars.');
      }

      return;
    }

    // FAILURE path
    const failLine = (CAREER_FLAVOR.spaceMissionFail || [])[Math.floor(Math.random() * (CAREER_FLAVOR.spaceMissionFail || []).length)] || 'Failed.';
    applyStress(2.0, 'Mission failed');
    applyPlayerHealth(-2.0);

    // Catastrophic failure chance (the "forces a pivot" edge case)
    let catP = clamp01((mission.riskCatastrophe || 0.02) + extraCatRisk);
    catP += (100 - readiness) * 0.0006;
    catP += (burnout) * 0.0004;
    if (sp0.track === 'mission_control') catP -= 0.01;
    if (sp0.track === 'propulsion') catP -= 0.008;

    catP = clamp01(clamp(catP, 0.005, 0.25));
    const cat = Math.random() < catP;

    if (cat) {
      const catLine = (CAREER_FLAVOR.spaceMissionCatastrophe || [])[Math.floor(Math.random() * (CAREER_FLAVOR.spaceMissionCatastrophe || []).length)] || 'Catastrophe.';
      applyStress(6, 'Catastrophic incident');
      applyPlayerHealth(-10);

      // Pivot outcome:
      // - Space Agency: reassigned + permanently grounded (still employed, can do research/SETI, but no missions)
      // - Private Contractor: fired (career pivot forced)
      if (!isPrivateSpace) {
        updateState(prev => {
          const pc = prev.playerCareer || playerCareer;
          const sp = ensureSpaceProgram(pc);
          return {
            ...prev,
            playerCareer: {
              ...pc,
              performance: clamp((pc.performance || 55) - 10, 0, 100),
              burnout: clamp((pc.burnout || 0) + 18, 0, 100),
              flagsByAge: {
                ...(pc.flagsByAge || {}),
                [gameState.currentYear]: {
                  ...(pc.flagsByAge?.[gameState.currentYear] || {}),
                  interacted: true,
                  spaceMission: true,
                  spaceCatastrophe: true
                }
              },
              spaceProgram: {
                ...sp,
                permanentlyGrounded: true,
                groundedReason: 'catastrophic',
                groundedUntilYear: null,
                missionCount: (sp.missionCount || 0) + 1,
                failedMissions: (sp.failedMissions || 0) + 1,
                lastMissionYear: gameState.currentYear
              }
            }
          };
        });

        recordTimelineEntry({
          kind: 'career',
          title: '🚨 Catastrophic Incident (Reassigned)',
          detail: 'A serious incident ends your flight status. You are reassigned to ground operations permanently.',
          moneyDelta: 0,
          loveDelta: 0,
          stressDelta: 6
        });

        emitActionResult({
          actionId: 'career',
          title: '🚨 Catastrophic Incident',
          body: `${catLine}\n\nYou are permanently grounded and reassigned to ground operations.\nParent Health -10 • Stress +6 • Focus -${mission.focusCost || 2}`,
          deltas: null,
          loveDelta: 0,
          stressDelta: 6,
          moneyDelta: 0,
          focusDelta: -(mission.focusCost || 2),
          tags: ['career'],
          meta: { emoji: '🚨', skipTimelineRecord: true }
        });

        addLog('🚨 Catastrophic incident: permanently grounded (agency reassignment).');
        return;
      }

      // Private: fired
      updateState(prev => {
        const pc = prev.playerCareer || playerCareer;
        const sp = ensureSpaceProgram(pc);
        return {
          ...prev,
          playerCareer: {
            ...pc,
            employed: false,
            yearlyIncome: 0,
            lastFiredAge: gameState.currentYear,
            performance: clamp((pc.performance || 55) - 12, 0, 100),
            burnout: clamp((pc.burnout || 0) + 20, 0, 100),
            flagsByAge: {
              ...(pc.flagsByAge || {}),
              [gameState.currentYear]: {
                ...(pc.flagsByAge?.[gameState.currentYear] || {}),
                interacted: true,
                spaceMission: true,
                spaceCatastrophe: true
              }
            },
            spaceProgram: {
              ...sp,
              permanentlyGrounded: true,
              groundedReason: 'catastrophic',
              missionCount: (sp.missionCount || 0) + 1,
              failedMissions: (sp.failedMissions || 0) + 1,
              lastMissionYear: gameState.currentYear
            }
          }
        };
      });

      recordTimelineEntry({
        kind: 'career',
        title: '🚨 Catastrophic Incident (Fired)',
        detail: 'A serious incident ends your flight status — and your job. Career pivot forced.',
        moneyDelta: 0,
        loveDelta: 0,
        stressDelta: 7
      });

      emitActionResult({
        actionId: 'career',
        title: '🚨 Catastrophic Incident',
        body: `${catLine}\n\nYour employer terminates your contract. You are out.\nParent Health -10 • Stress +6 • Focus -${mission.focusCost || 2}`,
        deltas: null,
        loveDelta: 0,
        stressDelta: 6,
        moneyDelta: 0,
        focusDelta: -(mission.focusCost || 2),
        tags: ['career'],
        meta: { emoji: '🚨', skipTimelineRecord: true }
      });

      addLog('🚨 Catastrophic incident: fired (private contractor).');
      return;
    }

    // Regular failure (non-catastrophic)
    applyReputationDelta(-2, `Mission: ${mission.title} failed`);
    applyFameDelta(-1, `Mission: ${mission.title} failed`);

    updateState(prev => {
      const pc = prev.playerCareer || playerCareer;
      const sp = ensureSpaceProgram(pc);
      return {
        ...prev,
        playerCareer: {
          ...pc,
          performance: clamp((pc.performance || 55) - 4, 0, 100),
          burnout: clamp((pc.burnout || 0) + 8, 0, 100),
          flagsByAge: {
            ...(pc.flagsByAge || {}),
            [gameState.currentYear]: {
              ...(pc.flagsByAge?.[gameState.currentYear] || {}),
              interacted: true,
              spaceMission: true
            }
          },
          spaceProgram: {
            ...sp,
            missionCount: (sp.missionCount || 0) + 1,
            failedMissions: (sp.failedMissions || 0) + 1,
            lastMissionYear: gameState.currentYear,
            readiness: clamp((sp.readiness || 0) - 3, 0, 100)
          }
        }
      };
    });

    addLog(`🧯 Mission failed: ${mission.title}.`);
    recordTimelineEntry({
      kind: 'career',
      title: `🧯 Mission Failed: ${mission.title}`,
      detail: `${spaceSectorLabel}: Non-catastrophic failure. Debrief and fix what broke.`,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 2
    });

    emitActionResult({
      actionId: 'career',
      title: '🧯 Mission Failed',
      body: `${failLine}\n\nRep -2 • Fame -1 • Parent Health -2 • Stress +2\nChance: ${Math.round(p*100)}% • Focus -${mission.focusCost || 2}`,
      deltas: null,
      loveDelta: 0,
      stressDelta: 2,
      moneyDelta: 0,
      focusDelta: -(mission.focusCost || 2),
      tags: ['career'],
      meta: { emoji: '🧯', skipTimelineRecord: true }
    });
  };

  const handleWorkHard = () => {
    if (isGovAssist || isSAHP) return;
    if (playerCareer.lastWorkedHardAge === gameState.currentYear) return;
    
    const ok = spendFocus(1, 'Work Hard');
    if (!ok) return;
    
    const performanceGain = 20 + Math.floor(Math.random() * 11);
    const newPerformance = Math.min(100, (playerCareer.performance || 55) + performanceGain);
    
    updateState({
      playerCareer: {
        ...playerCareer,
        performance: newPerformance,
        lastWorkedHardAge: gameState.currentYear,
        flagsByAge: { ...(playerCareer.flagsByAge||{}), [gameState.currentYear]: { ...(playerCareer.flagsByAge?.[gameState.currentYear]||{}), workedHard: true } }
      }
    });
    
    applyStress(1, 'Work Hard');
    
    addLog(`💼 Worked hard this year. Performance: ${newPerformance}/100`);
    
    emitActionResult({
      actionId: 'career',
      title: '💼 Work Hard',
      body: `${(CAREER_FLAVOR.workHard[Math.floor(Math.random()*CAREER_FLAVOR.workHard.length)]||'You pushed past resistance.')}\n\nPerformance +${performanceGain} \u2022 Stress +1 (now ${newPerformance}/100)`,
      deltas: {},
      loveDelta: 0,
      stressDelta: 1,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ['career'],
      meta: { emoji: '💼', skipTimelineRecord: true }
    });
    

  };

  const handleAskRaise = () => {
    if (playerCareer.lastAskedRaiseAge === gameState.currentYear) return;
    
    // Government Assistance: funny denial, no income change
    if (isGovAssist) {
      const ok = spendFocus(1, 'Ask for Raise');
      if (!ok) return;

      updateState({
        playerCareer: {
          ...playerCareer,
          lastAskedRaiseAge: gameState.currentYear
        }
      });

      applyStress(0.5, 'Asked for raise (assistance)');
      addLog('📝 Asked for a raise on government assistance. The system politely refused.');

      emitActionResult({
        actionId: 'career',
        title: '📝 Benefit Adjustment Request',
        body: `You ask your caseworker for a raise. They blink twice and slide you a pamphlet titled: "That's Not How This Works."\n\nStress +0.5 • Focus -1`,
        deltas: null,
        loveDelta: 0,
        stressDelta: 0.5,
        moneyDelta: 0,
        focusDelta: -1,
        tags: ['career'],
        meta: { emoji: '📝', skipTimelineRecord: true }
      });

      return;
    }

    const ok = spendFocus(1, 'Ask for Raise');
    if (!ok) return;

    // Mark attempt this year and open the mini-game
    updateState({
      playerCareer: {
        ...playerCareer,
        lastAskedRaiseAge: gameState.currentYear
      }
    });
    setRaiseGameOpen(true);
  };

  // Old auto-resolve logic (used when player clicks Skip)
  const resolveRaiseAutoNoSpend = () => {
    const pc = normalizePlayerCareer(gameState.playerCareer, gameState) || playerCareer;
    const performance = pc.performance || 55;
    const baseChance = 20 + ((performance - 40) * 1.0);
    const successChance = Math.max(10, Math.min(85, baseChance));

    const roll = Math.random() * 100;
    const success = roll < successChance;

    // Ensure year marked
    updateState({
      playerCareer: {
        ...pc,
        lastAskedRaiseAge: gameState.currentYear
      }
    });

    if (success) {
      const raisePercent = 5 + Math.floor(Math.random() * 8);
      let newIncome = Math.floor((pc.yearlyIncome || 0) * (1 + raisePercent / 100));
      newIncome = ensureNoTrailingZero(newIncome, pc.yearlyIncome);

      updateState({
        playerCareer: {
          ...pc,
          yearlyIncome: newIncome,
          lastAskedRaiseAge: gameState.currentYear
        }
      });

      addLog(`💰 Got a ${raisePercent}% raise! New salary: $${formatMoney(newIncome)}/year`);
      const line = CAREER_FLAVOR.askRaiseGood[Math.floor(Math.random()*CAREER_FLAVOR.askRaiseGood.length)] || 'They said yes.';
      emitActionResult({
        actionId: 'career',
        title: '💰 Raise Approved!',
        body: `${line}\n\nIncome +${raisePercent}% • Stress -0.5 • Focus -1`,
        deltas: null,
        loveDelta: 0,
        stressDelta: -0.5,
        moneyDelta: 0,
        focusDelta: -1,
        tags: ['career'],
        meta: { emoji: '💰', raisePercent, skipTimelineRecord: true }
      });
    } else {
      applyStress(1, 'Raise denied');
      addLog(`💔 Raise request denied`);
      const line2 = CAREER_FLAVOR.askRaiseBad[Math.floor(Math.random()*CAREER_FLAVOR.askRaiseBad.length)] || 'Not this cycle.';
      emitActionResult({
        actionId: 'career',
        title: '💔 Raise Denied',
        body: `${line2}\n\nStress +1 • Focus -1`,
        deltas: null,
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0,
        focusDelta: -1,
        tags: ['career'],
        meta: { emoji: '💔' }
      });
    }
  };

  const setFlag = (key) => {
    updateState(prev => {
      const pc = normalizePlayerCareer(prev.playerCareer, prev) || {};
      const y = prev.currentYear;
      const flagsByAge = { ...(pc.flagsByAge || {}) };
      const yearFlags = { ...(flagsByAge[y] || {}), [key]: true };
      flagsByAge[y] = yearFlags;
      return { playerCareer: { ...pc, flagsByAge } };
    });
  };

  // [SPACE PROGRAM] helper: unlock existing trophies immediately from this pathway
  const unlockTrophyById = (trophyId, trophyLabel, note) => {
    const trophies = gameState.trophies || { unlocked: {} };
    if (trophies.unlocked?.[trophyId]) return;

    updateState({
      trophies: {
        unlocked: {
          ...(trophies.unlocked || {}),
          [trophyId]: {
            ts: Date.now(),
            age: gameState.currentYear,
            note: note || ''
          }
        }
      }
    });

    addLog(`🏆 Trophy unlocked: ${trophyLabel}`);
    recordTimelineEntry({
      kind: 'system',
      title: `🏆 Trophy: ${trophyLabel}`,
      detail: note || ''
    });
  };



  const handleNetwork = () => {
    if (!spendFocus(1, 'Network')) return;
    const incNet = 10 + Math.floor(Math.random()*11);
    const newNet = Math.min(100, (playerCareer.networking||0) + incNet);
    const newPerf = Math.min(100, (playerCareer.performance||0) + 2);
    updateState(prev => {
      const pc = normalizePlayerCareer(prev.playerCareer, prev) || {};
      const y = prev.currentYear;
      const flagsByAge = { ...(pc.flagsByAge || {}) };
      const yearFlags = { ...(flagsByAge[y] || {}), networked: true };
      flagsByAge[y] = yearFlags;
      const newNet2 = Math.min(100, (pc.networking || 0) + incNet);
      const newPerf2 = Math.min(100, (pc.performance || 0) + 2);
      return { playerCareer: { ...pc, networking: newNet2, performance: newPerf2, flagsByAge } };
    });
    addLog('🤝 You met useful humans.');
    const line = CAREER_FLAVOR.network[Math.floor(Math.random()*CAREER_FLAVOR.network.length)] || 'You met useful humans.';
    emitActionResult({
      actionId: 'career',
      title:'🤝 Network',
      body:`${line}\n\nNetworking +${incNet} • Performance +2`,
      deltas: null,
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: 0,
      focusDelta: -1,
      tags:['career'],
      meta:{ emoji:'🤝', skipTimelineRecord: true }
    });
  };

  const handleTraining = () => {
    if (!spendFocus(1, 'Training')) return;
    const incPerf = 8 + Math.floor(Math.random()*8);
    const newPerf = Math.min(100, (playerCareer.performance||0) + incPerf);
    const newBurn = Math.min(100, (playerCareer.burnout||0) + 2);
    const newRep = Math.min(100, (playerCareer.careerRep||0) + 2);
    updateState(prev => {
      const pc = normalizePlayerCareer(prev.playerCareer, prev) || {};
      const y = prev.currentYear;
      const flagsByAge = { ...(pc.flagsByAge || {}) };
      const yearFlags = { ...(flagsByAge[y] || {}), trained: true };
      flagsByAge[y] = yearFlags;
      const newPerf2 = Math.min(100, (pc.performance || 0) + incPerf);
      const newBurn2 = Math.min(100, (pc.burnout || 0) + 2);
      const newRep2 = Math.min(100, (pc.careerRep || 0) + 2);
      return { playerCareer: { ...pc, performance: newPerf2, burnout: newBurn2, careerRep: newRep2, flagsByAge } };
    });
    addLog('📚 You learned a thing and pretended it was exciting.');
    const line = CAREER_FLAVOR.training[Math.floor(Math.random()*CAREER_FLAVOR.training.length)] || 'You learned a thing.';
    emitActionResult({
      actionId: 'career',
      title:'📚 Training',
      body:`${line}\n\nPerformance +${incPerf} • Industry Rep +2`,
      deltas: null,
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: 0,
      focusDelta: -1,
      tags:['career'],
      meta:{ emoji:'📚', skipTimelineRecord: true }
    });
  };

  const handleReputationPlay = () => {
    if (!spendFocus(1, 'Reputation Play')) return;
    const good = Math.random() < 0.6;
    if (good) {
      updateState(prev => {
        const pc = normalizePlayerCareer(prev.playerCareer, prev) || {};
        const y = prev.currentYear;
        const flagsByAge = { ...(pc.flagsByAge || {}) };
        const yearFlags = { ...(flagsByAge[y] || {}), tookRisk: true };
        flagsByAge[y] = yearFlags;
        const rep2 = Math.min(100, (pc.careerRep || 0) + 4);
        return { playerCareer: { ...pc, careerRep: rep2, flagsByAge } };
      });
      applyReputationDelta(2, 'Played the game (tastefully)');
      addLog('🧩 Office politics… but make it ethical.');
      const line = CAREER_FLAVOR.repGood[Math.floor(Math.random()*CAREER_FLAVOR.repGood.length)] || 'It landed well.';
      emitActionResult({
        actionId: 'career',
        title: '🧩 Rep Play (It Worked)',
        body: `${line}\n\nIndustry Rep +4`,
        deltas: null,
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        focusDelta: -1,
        tags: ['career'],
        meta: { emoji: '🧩', skipTimelineRecord: true }
      });

    } else {
      updateState(prev => {
        const pc = normalizePlayerCareer(prev.playerCareer, prev) || {};
        const y = prev.currentYear;
        const flagsByAge = { ...(pc.flagsByAge || {}) };
        const yearFlags = { ...(flagsByAge[y] || {}), tookRisk: true };
        flagsByAge[y] = yearFlags;
        return { playerCareer: { ...pc, flagsByAge } };
      });
      applyReputationDelta(-4, 'Awkward office politics');
      applyStress(1, 'Office politics');
      addLog('🧩 Attempted politics. The spreadsheet witnessed everything.');
      const line = CAREER_FLAVOR.repBad[Math.floor(Math.random()*CAREER_FLAVOR.repBad.length)] || 'It backfired.';
      emitActionResult({
        actionId: 'career',
        title: '🧩 Rep Play (Backfired)',
        body: `${line}\n\nIndustry Rep -4`,
        deltas: null,
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0,
        focusDelta: -1,
        tags: ['career'],
        meta: { emoji: '🧩', skipTimelineRecord: true }
      });

    }
  };

  const handleAudition = () => {
    if (!spendFocus(1, 'Audition')) return;
    const good = Math.random() < 0.5;
    if (good) {
      applyFameDelta(12, 'Strong audition');
      updateState({ playerCareer: { ...playerCareer, performance: Math.min(100, (playerCareer.performance||0)+3) } });
      const line = CAREER_FLAVOR.auditionGood[Math.floor(Math.random()*CAREER_FLAVOR.auditionGood.length)] || 'Strong audition.';
      addLog('🎬 Nailed the audition. Casting whisper: promising.');

      emitActionResult({
        actionId: 'career',
        title: '🎬 Audition',
        body: `${line}\n\nFame +12 • Performance +3`,
        deltas: null,
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        focusDelta: -1,
        tags: ['career'],
        meta: { emoji: '🎬', skipTimelineRecord: true }
      });
    } else {
      addLog('🎬 Method acting accidentally continued at Parent-Teacher Night.');
      applyStress(1, 'Audition flop');
      const failLine = CAREER_FLAVOR.auditionBad[Math.floor(Math.random()*CAREER_FLAVOR.auditionBad.length)] || 'Not your day.';
      emitActionResult({
        actionId: 'career',
        title: '🎬 Audition (Missed)',
        body: `${failLine}\n\nStress +1 • Focus -1`,
        deltas: null,
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0,
        focusDelta: -1,
        tags: ['career'],
        meta: { emoji: '🎬', skipTimelineRecord: true }
      });

    }
  };

  const handleDropSnippet = () => {
    if (!spendFocus(1, 'Drop Snippet')) return;
    const viral = Math.random() < 0.35;
    if (viral) {
      applyFameDelta(15, 'Song snippet caught on');
      addLog('🎶 Your kid wrote a hook and it’s… actually fire.');
      const line = CAREER_FLAVOR.snippetViral[Math.floor(Math.random()*CAREER_FLAVOR.snippetViral.length)] || 'It pops.';
      emitActionResult({
        actionId: 'career',
        title: '🎶 Drop Snippet',
        body: `${line}\n\nFame +15`,
        deltas: null,
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        focusDelta: -1,
        tags: ['career'],
        meta: { emoji: '🎶', skipTimelineRecord: true }
      });

    } else {
      addLog('🎶 A niche group loved it. You are their niche hero.');
      const lineNV = CAREER_FLAVOR.snippetNotViral[Math.floor(Math.random()*CAREER_FLAVOR.snippetNotViral.length)] || 'It found a tiny home.';
      emitActionResult({
        actionId: 'career',
        title: '🎶 Drop Snippet',
        body: `${lineNV}`,
        deltas: null,
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        focusDelta: -1,
        tags: ['career'],
        meta: { emoji: '🎶', skipTimelineRecord: true }
      });

    }
  };

  const handleCreatorSprint = () => {
    if (!spendFocus(1, 'Creator Sprint')) return;
    applyFameDelta(6, 'Creator sprint');
    addLog('📣 Accidentally started a trend: #SnackBoardDiplomacy');
    const line = CAREER_FLAVOR.creatorSprint[Math.floor(Math.random()*CAREER_FLAVOR.creatorSprint.length)] || 'You shipped.';
    emitActionResult({
      actionId: 'career',
      title: '📣 Creator Sprint',
      body: `${line}\n\nFame +6`,
      deltas: null,
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ['career'],
      meta: { emoji: '📣', skipTimelineRecord: true }
      });
  };

  const MUSIC_FLAVOR = {
    gigGood: [
      'The crowd loved it. You loved the payout even more.',
      'Killer set. Word of mouth: solid.',
      'People asked for an encore. You obliged.',
      'Tight set. Bank account slightly less tight.'
    ],
    gigBad: [
      'Sound guy had opinions. Crowd had none.',
      'Technical difficulties. Crowd still polite though.',
      'One person clapped. Maybe they were in pain.',
      'You played your hearts out to six phones.',
    ],
    studio: [
      'Three hours, one coffee, and a breakthrough.',
      'The engineer said "not bad." You\'ll take it.',
      'Layering, mixing, tweaking—craft matters.',
      'Your voice sounds weird on playback. Always does.'
    ],
    single: {
      viral: [
        'It\u2019s trending. Your comment section is chaos.',
        'Radio picked it up. Royalty letters incoming.',
        'Spotify playlist. Your mom emailed the link to everyone.',
        'The algorithm blessed it. Fame tastes different now.'
      ],
      ok: [
        'Solid response. People shared it with one person.',
        'Your niche loved it. The rest... quiet.',
        'Decent playlist adds. Growth is growth.',
        'TikTok clips gained traction. Dreams getting real.'
      ],
      flop: [
        'Your mom played it. Twice.',
        'It exists. That\u2019s something.',
        'The comments are... constructive?',
        'Therapeutic release, commercial flop.'
      ]
    }
  };

  const handleBookGig = () => {
    if (!spendFocus(1, 'Book Gig')) return;
    const success = Math.random() < 0.65;
    const flagKey = `${gameState.currentYear}:bookGig`;
    
    if (success) {
      const money = 400 + Math.floor(Math.random() * 1001);
      updateState(prev => {
        const pc = normalizePlayerCareer(prev.playerCareer, prev) || {};
        const y = prev.currentYear;
        const flagsByAge = { ...(pc.flagsByAge || {}) };
        const yearFlags = { ...(flagsByAge[y] || {}), bookGig: true };
        flagsByAge[y] = yearFlags;
        const newRep = Math.min(100, (pc.careerRep || 0) + 2);
        const newPerf = Math.min(100, (pc.performance || 0) + 6);
        return { 
          money: Math.max(0, Number(prev.money || 0) + money),
          playerCareer: { ...pc, careerRep: newRep, performance: newPerf, flagsByAge },
          ...(prev.famePoints !== undefined && { famePoints: Math.max(0, Number(prev.famePoints || 0) + 10) })
        };
      });
      applyStress(1, 'Book gig');
      addLog(`🎸 Booked a gig. +$${formatMoney(money)}`);
      const line = MUSIC_FLAVOR.gigGood[Math.floor(Math.random()*MUSIC_FLAVOR.gigGood.length)] || 'Gig went well.';
      emitActionResult({
        actionId: 'career',
        title: '🎸 Book Gig',
        body: `${line}\n\n+$${formatMoney(money)} • Industry Rep +2 • Performance +6 • Stress +1`,
        deltas: null,
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: money,
        focusDelta: -1,
        tags: ['career'],
        meta: { emoji: '🎸', skipTimelineRecord: true }
      });
    } else {
      const money = Math.floor(Math.random() * 251);
      updateState(prev => {
        const pc = normalizePlayerCareer(prev.playerCareer, prev) || {};
        const y = prev.currentYear;
        const flagsByAge = { ...(pc.flagsByAge || {}) };
        const yearFlags = { ...(flagsByAge[y] || {}), bookGig: true };
        flagsByAge[y] = yearFlags;
        const newPerf = Math.min(100, (pc.performance || 0) + 2);
        return { 
          money: Math.max(0, Number(prev.money || 0) + money),
          playerCareer: { ...pc, performance: newPerf, flagsByAge },
          ...(prev.famePoints !== undefined && { famePoints: Math.max(0, Number(prev.famePoints || 0) + 2) })
        };
      });
      addLog(`🎸 Gig didn't pay great, but you played.`);
      const line = MUSIC_FLAVOR.gigBad[Math.floor(Math.random()*MUSIC_FLAVOR.gigBad.length)] || 'Gig happened.';
      emitActionResult({
        actionId: 'career',
        title: '🎸 Book Gig',
        body: `${line}\n\n+$${formatMoney(money)} • Performance +2`,
        deltas: null,
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: money,
        focusDelta: -1,
        tags: ['career'],
        meta: { emoji: '🎸', skipTimelineRecord: true }
      });
    }
  };

  const handleStudioSession = () => {
    if (!spendFocus(1, 'Studio Session')) return;
    const costMoney = 100 + Math.floor(Math.random() * 201);
    const perfGain = 8 + Math.floor(Math.random() * 9);
    const repGain = 1 + Math.floor(Math.random() * 4);
    
    updateState(prev => {
      const pc = normalizePlayerCareer(prev.playerCareer, prev) || {};
      const y = prev.currentYear;
      const flagsByAge = { ...(pc.flagsByAge || {}) };
      const yearFlags = { ...(flagsByAge[y] || {}), studioSession: true };
      flagsByAge[y] = yearFlags;
      const newPerf = Math.min(100, (pc.performance || 0) + perfGain);
      const newRep = Math.min(100, (pc.careerRep || 0) + repGain);
      return { 
        money: Math.max(0, Number(prev.money || 0) - costMoney),
        playerCareer: { ...pc, performance: newPerf, careerRep: newRep, flagsByAge },
        ...(prev.famePoints !== undefined && { famePoints: Math.max(0, Number(prev.famePoints || 0) + 5) })
      };
    });
    addLog(`🎛️ Studio session complete. Performance +${perfGain}.`);
    const line = MUSIC_FLAVOR.studio[Math.floor(Math.random()*MUSIC_FLAVOR.studio.length)] || 'Session went well.';
    emitActionResult({
      actionId: 'career',
      title: '🎛️ Studio Session',
      body: `${line}\n\n-$${formatMoney(costMoney)} (studio costs) • Performance +${perfGain} • Industry Rep +${repGain} • Fame +5`,
      deltas: null,
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: -costMoney,
      focusDelta: -1,
      tags: ['career'],
      meta: { emoji: '🎛️', skipTimelineRecord: true }
    });
  };

  const handleReleaseSingle = () => {
    if (!spendFocus(1, 'Release Single')) return;
    const roll = Math.random();
    let moneyGain, repGain, fameGain, outcome;
    
    if (roll < 0.10) {
      outcome = 'viral';
      moneyGain = 3000 + Math.floor(Math.random() * 6001);
      repGain = 6;
      fameGain = 40;
    } else if (roll < 0.65) {
      outcome = 'decent';
      moneyGain = 500 + Math.floor(Math.random() * 1501);
      repGain = 2;
      fameGain = 12;
    } else {
      outcome = 'flop';
      moneyGain = Math.floor(Math.random() * 301);
      repGain = 0;
      fameGain = 1;
    }
    
    updateState(prev => {
      const pc = normalizePlayerCareer(prev.playerCareer, prev) || {};
      const y = prev.currentYear;
      const flagsByAge = { ...(pc.flagsByAge || {}) };
      const yearFlags = { ...(flagsByAge[y] || {}), releaseSingle: true };
      flagsByAge[y] = yearFlags;
      const newRep = Math.min(100, (pc.careerRep || 0) + repGain);
      return { 
        money: Math.max(0, Number(prev.money || 0) + moneyGain),
        playerCareer: { ...pc, careerRep: newRep, flagsByAge },
        ...(prev.famePoints !== undefined && { famePoints: Math.max(0, Number(prev.famePoints || 0) + fameGain) })
      };
    });
    
    addLog(`📀 Single released. ${outcome === 'viral' ? 'It\'s EVERYWHERE.' : outcome === 'decent' ? 'Good response.' : 'Crickets.'}`);
    const flavorArray = MUSIC_FLAVOR.single[outcome];
    const line = flavorArray[Math.floor(Math.random()*flavorArray.length)] || 'Single out now.';
    emitActionResult({
      actionId: 'career',
      title: '📀 Release Single',
      body: `${line}\n\n+$${formatMoney(moneyGain)} • Industry Rep +${repGain} • Fame +${fameGain}`,
      deltas: null,
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: moneyGain,
      focusDelta: -1,
      tags: ['career'],
      meta: { emoji: '📀', skipTimelineRecord: true }
    });
  };

  const handleGoOnTour = () => {
    if (!spendFocus(2, 'Go On Tour')) return;
    
    const fame = Number(gameState?.famePoints || 0);
    const rep = Number(gameState?.reputation || 0);
    const perf = Number(gameState?.playerCareer?.performance || 50);
    const level = Number(gameState?.playerCareer?.jobLevelIndex || 0);

    let base = Math.round((fame * fame) * 100);
    const mult = 1 + (Math.max(0, level) * 0.04) + ((Math.max(0, perf) - 50) * 0.002);
    const swing = 0.75 + Math.random() * 0.5;

    let payout = Math.round(base * mult * swing);

    if (fame < 10) {
      payout = Math.round(Math.random() * 5000);
    }

    payout = Math.max(0, Math.min(120000000, payout));

    const fameBonus = fame >= 200 ? 25 : 8;
    let repDelta = 0;
    if (payout > 50000000) repDelta = 1;
    else if (payout < 1000 && fame > 100) repDelta = -1;

    updateState(prev => {
      const pc = normalizePlayerCareer(prev.playerCareer, prev) || {};
      const y = prev.currentYear;
      const flagsByAge = { ...(pc.flagsByAge || {}) };
      const yearFlags = { ...(flagsByAge[y] || {}), tour: true };
      flagsByAge[y] = yearFlags;
      const newRep = Math.max(0, Math.min(100, Number(prev.reputation || 50) + repDelta));
      return {
        money: Math.max(0, Number(prev.money || 0) + payout),
        playerCareer: { ...pc, flagsByAge },
        ...(prev.famePoints !== undefined && { famePoints: Math.max(0, Number(prev.famePoints || 0) + fameBonus) }),
        reputation: newRep
      };
    });

    const TOUR_FLAVOR = [
      "You lived on a tour bus and somehow everyone survived.",
      "The crowd screamed. Your knees did not.",
      "The merch table became your second job.",
      "The opening act was incredible. Your sleep schedule was not.",
      "You signed so many things your handwriting evolved into a new language."
    ];

    let flavorLine;
    if (payout > 50000000) {
      flavorLine = "It was a stadium tour. You basically printed money.";
    } else {
      flavorLine = TOUR_FLAVOR[Math.floor(Math.random() * TOUR_FLAVOR.length)];
    }

    addLog(`🌍 Tour complete. +$${formatMoney(payout)}`);
    emitActionResult({
      actionId: 'career',
      title: '🌍 Go On Tour',
      body: `${flavorLine}\n\n+$${formatMoney(payout)} • Fame +${fameBonus}${repDelta !== 0 ? ` • Rep ${repDelta > 0 ? '+' : ''}${repDelta}` : ''}`,
      deltas: null,
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: payout,
      focusDelta: -2,
      tags: ['career'],
      meta: { emoji: '🌍', skipTimelineRecord: true }
    });
  };

  const runSpecialTrackAction = (actionId) => {
    if (!isSpecialCareerJob || !actionId) return;

    const actionDef = (specialActions || []).find(a => a.id === actionId);
    if (!actionDef) return;

    if (isSpecialActionUsedThisYear(actionId)) {
      emitActionResult({
        actionId: 'career',
        title: `${trackMeta?.emoji || '🌟'} ${actionDef.label}`,
        body: `You already did this special track action this year.\n\nTry a different track action or come back next year.`,
        deltas: null,
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        focusDelta: 0,
        tags: ['career'],
        meta: { emoji: trackMeta?.emoji || '🌟', skipTimelineRecord: true }
      });
      return;
    }

    if (!spendFocus(actionDef.focus, actionDef.label)) return;

    const y = gameState.currentYear;
    const t = trackState || { ...(SPECIAL_TRACK_DEFAULTS[specialTrackId] || {}) };
    const perf = Number(playerCareer.performance || 55);
    const cRep = Number(playerCareer.careerRep || 55);
    const rep = Number(gameState.reputation ?? 55);
    const fame = Number(gameState.famePoints || 0);

    const seed = `${gameState.runSeed || 'seed'}|sc|${specialTrackId}|${actionId}|age:${y}|lvl:${playerCareer.jobLevelIndex || 0}|perf:${perf}|cRep:${cRep}|rep:${rep}|fame:${fame}`;
    const rng = createSeededRng(seed);

    let xpGain = 0;
    let moneyDelta = 0;
    let stressDelta = 0;
    let repDelta = 0;        // public reputation
    let fameDelta = 0;       // fame points
    let perfDelta = 0;       // career performance
    let careerRepDelta = 0;  // industry rep
    let incomePct = 0;       // salary bump (fraction, e.g., 0.10 = +10%)

    let isMajor = false;
    let extraYearFlags = {}; // written into playerCareer.flagsByAge[y]
    let trophiesToUnlock = []; // [{id, note}]

    const lines = [];

    // Helper: write track update + flags in one go
    const applyTrackAndCareer = (mutateTrackFn) => {
      updateState(prev => {
        const pc0 = normalizePlayerCareer(prev.playerCareer, prev) || {};
        const flagsByAge = { ...(pc0.flagsByAge || {}) };
        const yearFlags = { ...(flagsByAge[y] || {}), [actionId]: true, ...extraYearFlags };
        flagsByAge[y] = yearFlags;

        const nextPc = { ...pc0, flagsByAge };

        if (perfDelta) nextPc.performance = clampIntLocal((pc0.performance ?? 55) + perfDelta, 0, 100);
        if (careerRepDelta) nextPc.careerRep = clampIntLocal((pc0.careerRep ?? 55) + careerRepDelta, 0, 100);
        if (incomePct) {
          const baseIncome = Number(pc0.yearlyIncome || 0);
          const bumped = Math.round(baseIncome * (1 + incomePct));
          nextPc.yearlyIncome = ensureNoTrailingZero(bumped, baseIncome);
        }

        const sc0 = prev.specialCareers || { version: 1, tracks: {} };
        const tracks0 = { ...(sc0.tracks || {}) };
        const baseT = { ...(SPECIAL_TRACK_DEFAULTS[specialTrackId] || {}), ...(tracks0[specialTrackId] || {}) };

        const nextT = typeof mutateTrackFn === 'function' ? mutateTrackFn(baseT) : baseT;
        tracks0[specialTrackId] = nextT;

        // Trophy unlocks (if any)
        let trophies1 = prev.trophies || { unlocked: {} };
        let unlocked = trophies1.unlocked || {};
        let changed = false;
        let unlocked2 = { ...unlocked };

        for (const it of (Array.isArray(trophiesToUnlock) ? trophiesToUnlock : [])) {
          const trophyId = it?.id;
          if (!trophyId) continue;
          if (unlocked2[trophyId]) continue;
          unlocked2[trophyId] = { ts: Date.now(), age: prev.currentYear || 0, note: String(it?.note || '') };
          changed = true;
        }

        if (!changed) return { ...prev, playerCareer: nextPc, specialCareers: { ...sc0, tracks: tracks0 } };

        const next = {
          ...prev,
          playerCareer: nextPc,
          specialCareers: { ...sc0, tracks: tracks0 },
          trophies: { ...trophies1, unlocked: unlocked2 }
        };

        return next;
      });

      // Best-effort timeline for NEW trophies only
      const already = gameState.trophies?.unlocked || {};
      for (const it of trophiesToUnlock) {
        if (!it?.id) continue;
        if (already[it.id]) continue;
        try {
          recordTimelineEntry({
            kind: 'trophy',
            title: '🏆 Trophy Unlocked',
            detail: String(it?.note || it.id),
            age: gameState.currentYear,
            moneyDelta: 0,
            loveDelta: 0,
            stressDelta: 0,
            meta: { trophyId: it.id }
          });
        } catch {}
      }
    };

    // =============================
    // TRACK LOGIC
    // =============================

    if (specialTrackId === 'culinary') {
      if (actionId === 'sc_culinary_grind') {
        xpGain = 12 + Math.floor(rng.nextFloat() * 6);
        perfDelta = 8 + Math.floor(rng.nextFloat() * 6);
        stressDelta = 1.0;
        moneyDelta = 200 + Math.floor(rng.nextFloat() * 900);
        const sigChance = 0.10 + Math.min(0.12, (Number(t.xp || 0) / 1400));
        const madeSignature = rng.nextFloat() < sigChance;

        lines.push("You grind through service like a machine made of heat and determination.");
        if (madeSignature) {
          careerRepDelta += 2;
          repDelta += 2;
          lines.push("Somewhere between panic and poetry, you create a signature dish that people actually remember.");
        } else {
          lines.push("It's not glamorous, but it's how legends get built: one plate at a time.");
        }

        applyTrackAndCareer((t0) => ({
          ...t0,
          xp: Number(t0.xp || 0) + xpGain,
          signatureDishes: Number(t0.signatureDishes || 0) + (madeSignature ? 1 : 0)
        }));
      }

      if (actionId === 'sc_culinary_cookoff') {
        xpGain = 14 + Math.floor(rng.nextFloat() * 6);
        stressDelta = 1.3;

        const winChanceRaw =
          0.22 +
          Math.min(0.22, (Number(t.xp || 0) / 900)) +
          Math.max(-0.08, Math.min(0.12, (perf - 55) / 300)) +
          Math.max(-0.06, Math.min(0.10, (cRep - 55) / 350));

        const winChance = Math.max(0.10, Math.min(0.80, winChanceRaw));
        const won = rng.nextFloat() < winChance;

        if (won) {
          moneyDelta = 1500 + Math.floor(rng.nextFloat() * 8500);
          repDelta = 4 + Math.floor(rng.nextFloat() * 5);
          fameDelta = 6 + Math.floor(rng.nextFloat() * 10);
          perfDelta = 3;

          lines.push("You enter a cookoff with a calm face and chaotic inner monologue.");
          lines.push("You win. The judge tries to act neutral but fails.");
          lines.push("Your knife skills get applauded like it's a concert.");
        } else {
          moneyDelta = 150 + Math.floor(rng.nextFloat() * 600);
          repDelta = 1;
          fameDelta = 1;
          perfDelta = 2;

          lines.push("You enter a cookoff and immediately realize one contestant is basically a wizard.");
          lines.push("You don't win, but you don't embarrass yourself either. That's a victory of its own.");
        }

        applyTrackAndCareer((t0) => ({
          ...t0,
          xp: Number(t0.xp || 0) + xpGain
        }));
      }

      if (actionId === 'sc_culinary_chefs_table') {
        xpGain = 18 + Math.floor(rng.nextFloat() * 8);
        stressDelta = 2.0;

        const basePayout = 2500 + Math.floor(rng.nextFloat() * 6500);
        moneyDelta = basePayout;
        perfDelta = 4;
        careerRepDelta = 2;

        const stars = Math.max(0, Math.min(3, Number(t.stars || 0)));
        const baseStar =
          0.05 +
          Math.min(0.12, (Number(t.xp || 0) / 900)) +
          Math.max(-0.03, Math.min(0.06, (perf - 60) / 650)) +
          Math.max(-0.03, Math.min(0.06, (cRep - 60) / 700));

        const difficulty = stars * 0.04;
        const starChance = Math.max(0.02, Math.min(0.32, baseStar - difficulty));
        const earnedStar = (stars < 3) && (rng.nextFloat() < starChance);

        lines.push("It's Chef's Table night. The room is quiet in the way rich people get when they're judging you.");

        if (earnedStar) {
          const newStars = Math.min(3, stars + 1);
          isMajor = true;

          moneyDelta = basePayout + 3000 + (newStars * 1500);
          repDelta = 8 + (newStars * 2);
          fameDelta = 12 + (newStars * 4);
          incomePct = 0.10;

          lines.push(`The Micheline Guide awards you a star. You pretend to be cool about it. You are not cool about it.`);

          trophiesToUnlock = [];
          if (newStars === 3) {
            trophiesToUnlock.push({
              id: 'micheline_three_stars',
              note: 'Micheline ⭐⭐⭐ — You earned three stars.'
            });
            lines.push("Three stars. Reservations become a competitive sport.");
          }

          applyTrackAndCareer((t0) => ({
            ...t0,
            xp: Number(t0.xp || 0) + xpGain,
            stars: newStars
          }));
        } else {
          repDelta = 2;
          fameDelta = 2;
          lines.push("No star tonight. But the room leaves satisfied, which is its own kind of power.");
          applyTrackAndCareer((t0) => ({
            ...t0,
            xp: Number(t0.xp || 0) + xpGain
          }));
        }
      }
    }

    if (specialTrackId === 'tech') {
      const breakthroughs = Array.isArray(t.breakthroughs) ? t.breakthroughs : [];
      const nob = t.nobelle || {};

      const pool = [
        { id: 'lightning_capture', name: 'Lightning Capture', trophy: 'lightning_in_a_bottle', prize: 'physics', line: 'You capture lightning in a controlled chamber. Someone whispers: "that is illegal." It is not. Probably.' },
        { id: 'anti_gravity', name: 'Anti‑Gravity', trophy: 'anti_gravity_breakthrough', prize: 'physics', line: 'A test mass rises. You stare at it like it owes you money. Physics files a complaint.' },
        { id: 'miracle_battery', name: 'Miracle Battery', trophy: null, prize: 'chemistry', line: 'Your battery lasts... too long. You unplug it and it keeps being impressive anyway.' },
        { id: 'gene_therapy', name: 'Gene Therapy Leap', trophy: null, prize: 'medicine', line: 'Your treatment works in the simulation. Then it works again. Then the lab goes silent.' },
        { id: 'quantum_weave', name: 'Quantum Network Weave', trophy: null, prize: 'physics', line: 'Your network becomes faster than it has any right to be. Somewhere, a router cries.' }
      ];

      if (actionId === 'sc_tech_prototype') {
        xpGain = 14 + Math.floor(rng.nextFloat() * 7);
        stressDelta = 1.0;
        perfDelta = 6;
        careerRepDelta = 2;
        repDelta = 1;

        lines.push("You build a prototype, break it, swear, rebuild it, and suddenly it works.");
        lines.push("The lab smells like solder and optimism.");

        applyTrackAndCareer((t0) => ({
          ...t0,
          xp: Number(t0.xp || 0) + xpGain
        }));
      }

      if (actionId === 'sc_tech_patent') {
        xpGain = 10 + Math.floor(rng.nextFloat() * 5);
        stressDelta = 1.0;

        const fees = -(1200 + Math.floor(rng.nextFloat() * 1800)); // negative cost
        moneyDelta = fees;

        const acceptChanceRaw =
          0.35 +
          Math.min(0.25, (Number(t.xp || 0) / 700)) +
          Math.max(-0.08, Math.min(0.18, (cRep - 55) / 250));

        const acceptChance = Math.max(0.15, Math.min(0.85, acceptChanceRaw));
        const accepted = rng.nextFloat() < acceptChance;

        if (accepted) {
          const licensing = 5000 + Math.floor(rng.nextFloat() * 35000);
          moneyDelta = fees + licensing;
          repDelta = 3;
          fameDelta = 3;
          careerRepDelta = 3;

          lines.push("You file a patent. Paperwork tries to defeat you. It fails.");
          lines.push("It gets accepted. Someone offers licensing money with suspicious enthusiasm.");

          applyTrackAndCareer((t0) => ({
            ...t0,
            xp: Number(t0.xp || 0) + xpGain,
            patents: Number(t0.patents || 0) + 1
          }));
        } else {
          repDelta = -1;
          lines.push("You file a patent. The reviewer writes back a novel-length rejection.");
          lines.push("You learn new synonyms for 'no.'");
          applyTrackAndCareer((t0) => ({
            ...t0,
            xp: Number(t0.xp || 0) + xpGain
          }));
        }
      }

      if (actionId === 'sc_tech_moonshot') {
        xpGain = 18 + Math.floor(rng.nextFloat() * 13);
        stressDelta = 2.0;

        const breakthroughChanceRaw =
          0.12 +
          Math.min(0.28, (Number(t.xp || 0) / 650)) +
          Math.max(-0.06, Math.min(0.16, (perf - 55) / 260)) +
          Math.max(-0.06, Math.min(0.16, (cRep - 55) / 300));

        const breakthroughChance = Math.max(0.08, Math.min(0.55, breakthroughChanceRaw));
        const hit = rng.nextFloat() < breakthroughChance;

        if (hit) {
          isMajor = true;

          // pick a breakthrough not already owned if possible
          const available = pool.filter(p => !breakthroughs.includes(p.id));
          const chosen = (available.length ? rng.pick(available) : rng.pick(pool));

          const payout = 25000 + Math.floor(rng.nextFloat() * 175000);
          moneyDelta = payout;
          repDelta = 6 + Math.floor(rng.nextFloat() * 7);
          fameDelta = 18 + Math.floor(rng.nextFloat() * 28);
          careerRepDelta = 6;
          perfDelta = 4;
          incomePct = 0.12;

          lines.push("You push a moonshot demo until reality either cooperates or breaks.");
          lines.push(chosen?.line || "Something impossible happens. You take notes like a professional.");

          // breakthrough trophies
          trophiesToUnlock = [];
          if (chosen?.trophy) {
            trophiesToUnlock.push({
              id: chosen.trophy,
              note: chosen.trophy === 'lightning_in_a_bottle'
                ? 'Lightning in a Bottle — You captured lightning.'
                : 'Anti‑Gravity Breakthrough — You made something fall upward.'
            });
          }

          // Nobelle prize chance (category-based)
          const prizeCat = chosen?.prize || null;
          const prizeGate = (Number(t.xp || 0) + xpGain >= 180) && (cRep >= 75) && (perf >= 70);
          const prizeChance = prizeGate ? 0.18 : 0.00;
          const winPrize = prizeCat && !nob?.[prizeCat] && (rng.nextFloat() < prizeChance);

          if (winPrize) {
            const prizeId =
              prizeCat === 'physics' ? 'nobelle_physics' :
              prizeCat === 'chemistry' ? 'nobelle_chemistry' :
              prizeCat === 'medicine' ? 'nobelle_medicine' :
              null;

            if (prizeId) {
              const prizeMoney = 40000 + Math.floor(rng.nextFloat() * 90000);
              moneyDelta += prizeMoney;
              repDelta += 8;
              fameDelta += 25;

              trophiesToUnlock.push({
                id: prizeId,
                note:
                  prizeId === 'nobelle_physics' ? 'Nobelle Prize: Physics — Your work rewrote the rules.' :
                  prizeId === 'nobelle_chemistry' ? 'Nobelle Prize: Chemistry — You turned atoms into applause.' :
                  'Nobelle Prize: Medicine — Your breakthrough saved lives.'
              });

              lines.push("Then it happens: the Nobelle committee calls. You pretend this is normal. It is not normal.");
            }
          }

          applyTrackAndCareer((t0) => ({
            ...t0,
            xp: Number(t0.xp || 0) + xpGain,
            breakthroughs: Array.isArray(t0.breakthroughs)
              ? Array.from(new Set([...(t0.breakthroughs || []), chosen?.id].filter(Boolean)))
              : (chosen?.id ? [chosen.id] : []),
            nobelle: {
              ...(t0.nobelle || {}),
              ...(winPrize && prizeCat ? { [prizeCat]: true } : null)
            }
          }));
        } else {
          // miss
          const burn = -(500 + Math.floor(rng.nextFloat() * 2500));
          moneyDelta = burn;
          repDelta = -1;
          careerRepDelta = 1;

          lines.push("You attempt a moonshot demo.");
          lines.push("Reality declines politely. Your budget does not.");

          applyTrackAndCareer((t0) => ({
            ...t0,
            xp: Number(t0.xp || 0) + xpGain
          }));
        }
      }
    }

    if (specialTrackId === 'aerospace') {
      if (actionId === 'sc_aero_sim') {
        xpGain = 12 + Math.floor(rng.nextFloat() * 7);
        stressDelta = 0.8;
        perfDelta = 6;
        careerRepDelta = 2;
        moneyDelta = 300 + Math.floor(rng.nextFloat() * 900);

        const discoveryChance = 0.06 + Math.min(0.10, (Number(t.xp || 0) / 1400));
        const discovery = rng.nextFloat() < discoveryChance;

        lines.push("You run simulations until the numbers stop screaming.");
        if (discovery) {
          repDelta = 4;
          fameDelta = 3;
          isMajor = true;
          lines.push("A weird pattern emerges. It's either a bug… or a discovery.");
        } else {
          repDelta = 1;
          lines.push("You learn a little more about how not to explode.");
        }

        applyTrackAndCareer((t0) => ({
          ...t0,
          xp: Number(t0.xp || 0) + xpGain,
          discoveries: Number(t0.discoveries || 0) + (discovery ? 1 : 0)
        }));
      }

      if (actionId === 'sc_aero_prototype') {
        xpGain = 14 + Math.floor(rng.nextFloat() * 7);
        stressDelta = 1.0;
        perfDelta = 7;
        careerRepDelta = 2;

        const mishapChance = 0.06 + Math.min(0.08, Number(t.mishaps || 0) * 0.02);
        const mishap = rng.nextFloat() < mishapChance;

        if (mishap) {
          moneyDelta = -(800 + Math.floor(rng.nextFloat() * 2200));
          repDelta = -2;
          stressDelta += 1.2;
          lines.push("A prototype fails in a very educational way.");
          lines.push("You learn two things: how it broke, and how expensive it is to un-break it.");
        } else {
          moneyDelta = 500 + Math.floor(rng.nextFloat() * 1200);
          repDelta = 2;
          lines.push("Your prototype holds. Not perfectly—just enough to make the team smile.");
        }

        applyTrackAndCareer((t0) => ({
          ...t0,
          xp: Number(t0.xp || 0) + xpGain,
          mishaps: Number(t0.mishaps || 0) + (mishap ? 1 : 0)
        }));
      }

      if (actionId === 'sc_aero_launch') {
        xpGain = 18 + Math.floor(rng.nextFloat() * 11);
        stressDelta = 2.2;

        const mishaps = Number(t.mishaps || 0);
        const successChanceRaw =
          0.55 +
          Math.min(0.20, (Number(t.xp || 0) / 900)) +
          Math.max(-0.10, Math.min(0.16, (perf - 55) / 240)) +
          Math.max(-0.10, Math.min(0.16, (cRep - 55) / 280)) -
          Math.min(0.20, mishaps * 0.06);

        const successChance = Math.max(0.25, Math.min(0.92, successChanceRaw));
        const success = rng.nextFloat() < successChance;

        lines.push("Launch day. Your stomach tries to exit your body.");

        if (success) {
          isMajor = true;
          const payout = 8000 + Math.floor(rng.nextFloat() * 42000);
          moneyDelta = payout;
          repDelta = 7;
          fameDelta = 10;
          careerRepDelta = 4;
          perfDelta = 3;
          incomePct = 0.10;

          const bonusDiscovery = rng.nextFloat() < 0.10;
          if (bonusDiscovery) {
            repDelta += 6;
            fameDelta += 8;
            lines.push("The mission returns unexpected data. The room goes silent. Then loud.");
          } else {
            lines.push("Engines roar. Telemetry behaves. Someone cries. It counts as a win.");
          }

          // Nobelle Physics chance (rare)
          const newDiscoveries = Number(t.discoveries || 0) + (bonusDiscovery ? 1 : 0);
          const newLaunches = Number(t.launches || 0) + 1;
          const prizeGate = (Number(t.xp || 0) + xpGain >= 170) && (cRep >= 75) && (newDiscoveries >= 3) && (newLaunches >= 2);
          if (prizeGate && rng.nextFloat() < 0.12) {
            trophiesToUnlock = [{ id: 'nobelle_physics', note: 'Nobelle Prize: Physics — Your aerospace research changed the field.' }];
            repDelta += 8;
            fameDelta += 20;
            moneyDelta += 50000 + Math.floor(rng.nextFloat() * 80000);
            lines.push("Later, the Nobelle committee calls. You answer like a normal person. You are not a normal person anymore.");
          }

          applyTrackAndCareer((t0) => ({
            ...t0,
            xp: Number(t0.xp || 0) + xpGain,
            launches: Number(t0.launches || 0) + 1,
            discoveries: Number(t0.discoveries || 0) + (bonusDiscovery ? 1 : 0)
          }));
        } else {
          moneyDelta = -(1200 + Math.floor(rng.nextFloat() * 3500));
          repDelta = -4;
          perfDelta = -12;
          stressDelta += 1.0;

          lines.push("The launch fails. The silence is loud.");
          lines.push("The team regroups. You learn the kind of humility that only smoke and budgets can teach.");

          applyTrackAndCareer((t0) => ({
            ...t0,
            xp: Number(t0.xp || 0) + xpGain,
            mishaps: Number(t0.mishaps || 0) + 1
          }));
        }
      }
    }

    if (specialTrackId === 'police') {
      if (actionId === 'sc_police_patrol') {
        xpGain = 10 + Math.floor(rng.nextFloat() * 5);
        stressDelta = 1.1;
        moneyDelta = 600 + Math.floor(rng.nextFloat() * 1200);
        repDelta = 1;
        careerRepDelta = 1;

        lines.push("You patrol. You de-escalate nonsense. You write reports about nonsense.");
        lines.push("It's not glamorous, but it keeps people safe.");

        applyTrackAndCareer((t0) => ({
          ...t0,
          xp: Number(t0.xp || 0) + xpGain
        }));
      }

      if (actionId === 'sc_police_case') {
        xpGain = 12 + Math.floor(rng.nextFloat() * 7);
        stressDelta = 1.4;

        const solveChanceRaw =
          0.45 +
          Math.min(0.20, (Number(t.xp || 0) / 1000)) +
          Math.max(-0.10, Math.min(0.14, (perf - 55) / 320));

        const solveChance = Math.max(0.20, Math.min(0.85, solveChanceRaw));
        const solved = rng.nextFloat() < solveChance;

        if (solved) {
          const bonus = 1000 + Math.floor(rng.nextFloat() * 4500);
          moneyDelta = bonus;
          repDelta = 4;
          careerRepDelta = 2;
          perfDelta = 3;

          const commend = rng.nextFloat() < 0.18;
          if (commend) {
            isMajor = true;
            repDelta += 6;
            fameDelta += 4;
            lines.push("You close a case that's been haunting the board for months.");
            lines.push("Your supervisor gives you a commendation with the kind of pride that makes you stand up straighter.");
          } else {
            lines.push("You close a case. It's satisfying in a way sleep can't fix.");
          }

          applyTrackAndCareer((t0) => ({
            ...t0,
            xp: Number(t0.xp || 0) + xpGain,
            casesClosed: Number(t0.casesClosed || 0) + 1,
            commendations: Number(t0.commendations || 0) + (commend ? 1 : 0)
          }));
        } else {
          moneyDelta = 200 + Math.floor(rng.nextFloat() * 900);
          repDelta = -1;
          perfDelta = 1;
          lines.push("The case refuses to cooperate. Leads dry up. Everyone's tired.");
          lines.push("You keep going anyway. That counts for something.");

          applyTrackAndCareer((t0) => ({
            ...t0,
            xp: Number(t0.xp || 0) + xpGain
          }));
        }
      }

      if (actionId === 'sc_police_outreach') {
        xpGain = 8 + Math.floor(rng.nextFloat() * 7);
        stressDelta = -0.5;
        repDelta = 3 + Math.floor(rng.nextFloat() * 5);
        fameDelta = 2 + Math.floor(rng.nextFloat() * 5);

        lines.push("You show up where people don't expect cops to show up: listening first.");
        lines.push("It's slower than a raid. It's also how trust happens.");

        const winsNow = Number(t.communityWins || 0) + 1;
        const peaceGate = (winsNow >= 4) && ((rep + repDelta) >= 85);
        if (peaceGate && rng.nextFloat() < 0.18) {
          isMajor = true;
          trophiesToUnlock = [{ id: 'nobelle_peace', note: 'Nobelle Prize: Peace — You proved listening can be stronger than force.' }];
          repDelta += 8;
          fameDelta += 35;
          lines.push("Years later, they call it a turning point. Then the Nobelle committee calls.");
        }

        applyTrackAndCareer((t0) => ({
          ...t0,
          xp: Number(t0.xp || 0) + xpGain,
          communityWins: Number(t0.communityWins || 0) + 1
        }));
      }

      if (actionId === 'sc_police_raid') {
        xpGain = 14 + Math.floor(rng.nextFloat() * 7);
        stressDelta = 2.2;
        moneyDelta = 3500 + Math.floor(rng.nextFloat() * 10500);
        repDelta = 2 + Math.floor(rng.nextFloat() * 6);
        careerRepDelta = 2;
        perfDelta = 2;

        // THIS is the bug-fix plumbing for risk: write a year-flag so Game.jsx can boost death odds.
        extraYearFlags = { sc_police_high_risk: true };

        lines.push("You gear up for a high‑risk raid. Everyone jokes because that's what humans do before fear.");
        lines.push("You get hazard pay. You also get the kind of adrenaline your body will complain about later.");

        applyTrackAndCareer((t0) => ({
          ...t0,
          xp: Number(t0.xp || 0) + xpGain,
          highRiskOps: Number(t0.highRiskOps || 0) + 1
        }));
      }
    }

    if (specialTrackId === 'bounty') {
      const ethics0 = Math.max(0, Math.min(100, Number(t.ethics ?? 50)));

      if (actionId === 'sc_bounty_track') {
        xpGain = 10 + Math.floor(rng.nextFloat() * 6);
        stressDelta = 0.8;
        moneyDelta = 500 + Math.floor(rng.nextFloat() * 1700);
        careerRepDelta = 1;

        lines.push("You chase leads: phone calls, parking lots, and one suspiciously talkative barista.");
        lines.push("You don't find glory. You find addresses.");

        applyTrackAndCareer((t0) => ({
          ...t0,
          xp: Number(t0.xp || 0) + xpGain
        }));
      }

      if (actionId === 'sc_bounty_negotiate') {
        xpGain = 12 + Math.floor(rng.nextFloat() * 7);
        stressDelta = 1.2;
        moneyDelta = 2500 + Math.floor(rng.nextFloat() * 6500);
        careerRepDelta = 2;

        const ethicsGain = 3 + Math.floor(rng.nextFloat() * 4);
        const ethics1 = Math.max(0, Math.min(100, ethics0 + ethicsGain));

        lines.push("You talk first. You offer a way out that doesn't involve anyone bleeding.");
        lines.push("They come in. The paperwork is annoying. You still prefer it to violence.");

        applyTrackAndCareer((t0) => ({
          ...t0,
          xp: Number(t0.xp || 0) + xpGain,
          bounties: Number(t0.bounties || 0) + 1,
          ethics: ethics1
        }));
      }

      if (actionId === 'sc_bounty_force') {
        xpGain = 14 + Math.floor(rng.nextFloat() * 9);
        stressDelta = 2.0;
        moneyDelta = 6000 + Math.floor(rng.nextFloat() * 12000);
        careerRepDelta = 2;

        // high risk flag for death roll
        extraYearFlags = { sc_bounty_high_risk: true };

        const ethicsDrop = 8 + Math.floor(rng.nextFloat() * 8);
        let ethics1 = Math.max(0, Math.min(100, ethics0 - ethicsDrop));

        lines.push("You choose force. It's faster. It's uglier.");
        lines.push("You get the bigger bounty. You also feel it in your chest on the drive home.");

        // small chance of legal blowback if ethics is low
        const blowback = (ethics1 < 35) && (rng.nextFloat() < 0.10);
        if (blowback) {
          isMajor = true;
          const legal = -(4000 + Math.floor(rng.nextFloat() * 12000));
          moneyDelta += legal;
          repDelta -= 6;
          lines.push("A camera angle goes viral. Lawyers appear like sharks smelling blood.");
          lines.push("You pay legal fees and learn the cost of shortcuts.");
        }

        applyTrackAndCareer((t0) => ({
          ...t0,
          xp: Number(t0.xp || 0) + xpGain,
          bounties: Number(t0.bounties || 0) + 1,
          highRiskOps: Number(t0.highRiskOps || 0) + 1,
          ethics: ethics1
        }));
      }
    }

    // =============================
    // APPLY DELTAS OUTSIDE STATE MERGE
    // =============================
    if (moneyDelta) {
      applyMoneyDelta(moneyDelta, { title: `${trackMeta?.title || 'Special Track'}: ${actionDef.label}`, category: 'career' });
    }
    if (stressDelta) {
      applyStress(stressDelta, `${trackMeta?.title || 'Special Track'}: ${actionDef.label}`);
    }
    if (repDelta) {
      applyReputationDelta(repDelta, `${trackMeta?.title || 'Special Track'}: ${actionDef.label}`);
    }
    if (fameDelta) {
      applyFameDelta(fameDelta, `${trackMeta?.title || 'Special Track'}: ${actionDef.label}`);
    }

    // If trophies were computed by track logic and NOT already injected by applyTrackAndCareer (rare path),
    // ensure they still unlock (for cases where action logic didn't call applyTrackAndCareer due to a future edit).
    if (trophiesToUnlock.length) {
      unlockTrophiesOnce(trophiesToUnlock);
    }

    const title = `${trackMeta?.emoji || '🌟'} ${actionDef.label}`;
    const body =
      `${lines.join('\n')}\n\n` +
      `Track XP +${xpGain}` +
      (moneyDelta ? ` • Money ${moneyDelta >= 0 ? '+' : ''}$${formatMoney(Math.abs(moneyDelta))}` : '') +
      (repDelta ? ` • Reputation ${repDelta > 0 ? '+' : ''}${repDelta}` : '') +
      (fameDelta ? ` • Fame +${fameDelta}` : '') +
      (stressDelta ? ` • Stress ${stressDelta > 0 ? '+' : ''}${stressDelta}` : '') +
      (incomePct ? `\n\nSalary +${Math.round(incomePct * 100)}%` : '') +
      ((specialTrackId === 'police' && extraYearFlags.sc_police_high_risk) ? `\n\n⚠️ High‑risk action: yearly death chance increased.` : '') +
      ((specialTrackId === 'bounty' && extraYearFlags.sc_bounty_high_risk) ? `\n\n⚠️ High‑risk action: yearly death chance increased.` : '');

    addLog(`${title} (${xpGain} XP)`);

    emitActionResult({
      actionId: 'career',
      title,
      body,
      deltas: null,
      loveDelta: 0,
      stressDelta: stressDelta || 0,
      moneyDelta: moneyDelta || 0,
      focusDelta: -Number(actionDef.focus || 0),
      tags: isMajor ? ['career', 'major'] : ['career'],
      meta: { emoji: trackMeta?.emoji || '🌟', skipTimelineRecord: !isMajor }
    });
  };

  const handleApplyToJob = (job) => {
    const isGovAssistJob = job.id === 'government_assistance';
    const isSAHPJob = job.id === 'stay_at_home_parent';

    // Government Assistance rules:
    // - Only if you are unemployed.
    // - Costs 0 Focus to apply.
    if (isGovAssistJob && playerCareer.employed) {
      const alreadyOn = playerCareer.jobId === 'government_assistance';
      const title = '🧾 Government Assistance';
      const body = alreadyOn
        ? `You're already receiving government assistance.\n\nIf you want more income, you'll need to get a job.`
        : `You already have a job.\n\nYou can't apply for government assistance while employed.\nQuit your job first if you want to apply.`;

      addLog(alreadyOn ? '🧾 Already on government assistance.' : '🧾 Tried to apply for government assistance while employed.');

      emitActionResult({
        actionId: 'career',
        title,
        body,
        deltas: null,
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        focusDelta: 0,
        tags: ['career'],
        meta: { emoji: '🧾', skipTimelineRecord: true }
      });

      // Keep the job browser open so the player can pick another job.
      return;
    }

    // Focus cost: Gov Assistance is free; everything else stays 1 Focus.
    const focusCost = isGovAssistJob ? 0 : 1;

    const ok = spendFocus(focusCost, `Apply to ${job.title}`);
    if (!ok) return;

    // Always-accept roles (no roll)
    if (isGovAssistJob || isSAHPJob) {
      const baseSalary = job.baseYearlyIncome;
      const levelMult = job.levels[0].incomeMult || 1.0;
      let newIncome = Math.floor(baseSalary * levelMult);
      newIncome = ensureNoTrailingZero(newIncome, job.id.length);

      updateState({
        playerCareer: {
          ...playerCareer,
          jobId: job.id,
          jobLevelIndex: 0,
          performance: 55,
          yearsInJob: 0,
          employed: true,
          yearlyIncome: newIncome
        }
      });

      if (isGovAssistJob) {
        addLog(`🧾 Government assistance approved. Support: $${formatMoney(newIncome)}/year`);
        emitActionResult({
          actionId: 'career',
          title: '🧾 Assistance Approved',
          body: `Your application is approved.\n\nYearly support: $${formatMoney(newIncome)}.\n\nFocus -0`,
          deltas: {},
          loveDelta: 0,
          stressDelta: -0.5,
          moneyDelta: 0,
          focusDelta: 0,
          tags: ['career'],
          meta: { emoji: job.emoji, job: job.title, skipTimelineRecord: true }
        });
      } else {
        addLog(`🎉 Got hired as ${job.title}! Salary: $${formatMoney(newIncome)}/year`);
        emitActionResult({
          actionId: 'career',
          title: '🎉 Hired!',
          body: `You're now a ${job.levels[0].title}. Yearly income: $${formatMoney(newIncome)}.`,
          deltas: {},
          loveDelta: 0,
          stressDelta: -1,
          moneyDelta: 0,
          focusDelta: -focusCost,
          tags: ['career'],
          meta: { emoji: job.emoji, job: job.title }
        });
      }

      setBrowsingJobs(false);
      setApplyingTo(null);
      return;
    }

    // Qualification + acceptance chance
    const currentEduRank = EDUCATION_RANK[parentEducation.highest.levelId] || 0;
    const requiredRank = EDUCATION_RANK[job.minEducation] || 0;
    const currentMajor = parentEducation.highest.majorId ? getMajorById(parentEducation.highest.majorId) : null;

    // Hard gate: insufficient education
    if (currentEduRank < requiredRank) {
      const needLabel = (EDUCATION_LEVELS.find(e => e.id === job.minEducation)?.label) || job.minEducation;
      const haveLabel = (EDUCATION_LEVELS.find(e => e.id === parentEducation.highest.levelId)?.label) || parentEducation.highest.levelId;
      applyStress(0.5, 'Not qualified');
      addLog(`❌ Not qualified for ${job.title} — requires ${needLabel}, you have ${haveLabel}`);
      emitActionResult({
        actionId: 'career',
        title: '❌ Not Qualified',
        body: `This role requires ${needLabel}. Your current education is ${haveLabel}.`,
        deltas: {},
        loveDelta: 0,
        stressDelta: 0.5,
        moneyDelta: 0,
        focusDelta: -1,
        tags: ['career'],
        meta: { emoji: '❌' }
      });

      setBrowsingJobs(false);
      setApplyingTo(null);
      return;
    }

    let baseChance = playerCareer.employed ? 55 : 65;
    if (currentEduRank > requiredRank) baseChance += 12;
    // field influence
    if (Array.isArray(job.fields) && job.fields.length > 0 && currentMajor) {
      if (job.fields.includes(currentMajor.field)) baseChance += 10;
      else baseChance -= 12; // field mismatch penalty
    }
    // light age/experience influence
    const parentAge = Number(gameState.parentAgeAtBirth || 28) + Number(gameState.currentYear || 0);
    const yearsInJob = Number(playerCareer.yearsInJob || 0);
    baseChance += Math.min(4, Math.max(0, Math.floor(yearsInJob / 2))); // up to +4
    if (parentAge < 22) baseChance -= 2; else if (parentAge > 50) baseChance -= 1; else baseChance += 2;

    const totalChance = Math.max(12, Math.min(90, baseChance));

    // Launch interview mini-game before rolling
    setInterviewJob(job);
    setInterviewChance(totalChance);
    setReadRoomOpen(true);
    return;
  };

  const handleQuitJob = () => {
    updateState({
      playerCareer: {
        ...playerCareer,
        employed: false,
        yearlyIncome: 0
      }
    });
    
    addLog(`🚪 Quit your job as ${currentJob?.title || 'your job'}`);
    
    emitActionResult({
      actionId: 'career',
      title: '🚪 Quit Job',
      body: `You quit your job as ${currentLevel?.title || currentJob?.title}. Time for a change.`,
      deltas: {},
      loveDelta: 0,
      stressDelta: 1,
      moneyDelta: 0,
      focusDelta: 0,
      tags: ['career'],
      meta: { emoji: '🚪' }
    });
    
    recordTimelineEntry({
      kind: 'career',
      title: `🚪 Quit: ${currentJob?.title}`,
      detail: 'Left the job',
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 1
    });
  };

  const recommendedFieldId = (() => {
    const majorId = parentEducation?.highest?.majorId;
    if (majorId) {
      const major = getMajorById(majorId);
      return major?.field || null;
    }
    
    const terminalDegree = parentEducation?.highest?.levelId;
    if (terminalDegree === 'md' || terminalDegree === 'dds' || terminalDegree === 'dvm') return 'health';
    if (terminalDegree === 'jd') return 'law_policy';
    return null;
  })();

  const jobBoard = getJobBoardForYear({
    seed: gameState.runSeed,
    year: gameState.currentYear,
    countryIso3: gameState.countryIso3,
    householdType: gameState.householdType,
    limit: 10,
    educationLevelId: parentEducation?.highest?.levelId || 'high_school',
    fieldId: recommendedFieldId,
    mode: jobBrowserMode,
    includeSpecialCareers: includeSpecialJobsToggle
  });

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
                  <h3 className="text-xl font-bold text-slate-800">💼 Career</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Your professional life</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)] space-y-4">
                {currentJob && playerCareer.employed ? (
                  <>
                    {/* Current Job */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl">{currentJob.emoji}</span>
                          <div>
                            <div className="font-semibold text-slate-800">{jobDisplayTitle}</div>
                            <div className="text-xs text-slate-600">{currentJob.title}</div>
                          </div>
                        </div>
                      
                      <div className="space-y-2 text-sm text-slate-700">
                        <div className="flex justify-between">
                          <span>Your income:</span>
                          <span className="font-semibold">${formatMoney(playerCareer.yearlyIncome)}/year</span>
                        </div>
                        
                        {gameState.householdType === 'two' && (
                          <div className="flex justify-between text-slate-600">
                            <span>Partner income:</span>
                            <span className="font-semibold">
                              {gameState.partnerCareer 
                                ? `$${formatMoney(gameState.partnerCareer.yearlyIncome)}/year` 
                                : '—'}
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between border-t border-slate-200 pt-1 mt-1">
                          <span className="font-bold">Household total:</span>
                          <span className="font-bold text-green-700">
                            ${formatMoney(typeof getHouseholdYearlyIncome === 'function' ? getHouseholdYearlyIncome(gameState) : (Number(playerCareer.yearlyIncome || 0) + (gameState.householdType === 'two' ? Number(gameState.partnerCareer?.yearlyIncome || 0) : 0)))}/year
                          </span>
                        </div>

                        {getFluentLanguages(gameState, 'parent').length > 0 && (
                          <div className="flex justify-between text-green-700 text-xs mt-1">
                            <span>Language Bonus (You):</span>
                            <span>+{getFluentLanguages(gameState, 'parent').length * 5}% ({getFluentLanguages(gameState, 'parent').length} fluent)</span>
                          </div>
                        )}
                        <div className="flex justify-between mt-2">
                          <span>Years in job:</span>
                          <span className="font-semibold">{playerCareer.yearsInJob}</span>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span>Performance:</span>
                            <span className="font-semibold">{playerCareer.performance}/100</span>
                          </div>
                          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500"
                              style={{ width: `${playerCareer.performance}%` }}
                            />
                          </div>
                          <div className={`mt-1 text-[11px] ${didCareerActionThisYear ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {didCareerActionThisYear
                              ? '✅ Career engaged this year (no neglect decay).'
                              : '⚠️ No career actions yet this year: performance will drop -5 at year end.'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status Bars */}
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <StatBar label="Performance" value={playerCareer.performance} color="bg-blue-500" />
                      <StatBar label="Industry Rep" value={playerCareer.careerRep} color="bg-emerald-500" />
                      <StatBar label="Networking" value={playerCareer.networking} color="bg-purple-500" />
                      <StatBar label="Burnout" value={playerCareer.burnout} color="bg-rose-500" />
                    </div>

                    {/* Status Card */}
                    <div className="mt-3 p-3 rounded-lg border border-slate-200 bg-white text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div><span className="text-slate-500">Wealth:</span> <span className="font-semibold">{getWealthStatusLabel(gameState)}</span></div>
                        <div><span className="text-slate-500">Public Rep:</span> <span className="font-semibold">{(gameState.reputation ?? 55) >= 70 ? 'Beloved' : (gameState.reputation ?? 55) >= 50 ? 'Trusted' : 'Shaky'}</span></div>
                        <div><span className="text-slate-500">Fame:</span> <span className="font-semibold">{(gameState.famePoints||0) >= 600 ? 'Global' : (gameState.famePoints||0) >= 300 ? 'National' : (gameState.famePoints||0) >= 150 ? 'Regional' : (gameState.famePoints||0) >= 50 ? 'Local' : 'Unknown'}</span></div>
                        <div><span className="text-slate-500">Career Status:</span> <span className="font-semibold">{getCareerStatusLabel(playerCareer, gameState)}</span></div>
                      </div>
                    </div>

                    {isSpaceCareer && (() => {
                      const sp = ensureSpaceProgram(playerCareer);
                      const grounded = isGroundedNow(sp);
                      const medOk = sp.medicalClearedYear === gameState.currentYear;
                      const conditioning = getConditioningScore();
                      return (
                        <div className="mt-3 p-3 rounded-lg border border-sky-200 bg-sky-50 text-xs">
                          <div className="font-semibold text-slate-800 mb-1">🛰️ Space Program</div>
                          <div className="grid grid-cols-2 gap-2">
                            <div><span className="text-slate-500">Employer:</span> <span className="font-semibold">{spaceSectorLabel}</span></div>
                            <div><span className="text-slate-500">Track:</span> <span className="font-semibold">{sp.track ? (SPACE_SPECIALIZATIONS.find(t=>t.id===sp.track)?.label || sp.track) : 'Unselected'}</span></div>
                            <div><span className="text-slate-500">Readiness:</span> <span className="font-semibold">{Math.round(sp.readiness || 0)}/100</span></div>
                            <div><span className="text-slate-500">Conditioning:</span> <span className="font-semibold">{conditioning}/100</span></div>
                            <div><span className="text-slate-500">Medical:</span> <span className={`font-semibold ${medOk ? 'text-emerald-700' : 'text-amber-700'}`}>{medOk ? 'Cleared (this year)' : 'Not cleared'}</span></div>
                            <div><span className="text-slate-500">Flight Status:</span> <span className={`font-semibold ${grounded ? 'text-rose-700' : 'text-emerald-700'}`}>{grounded ? `Grounded (${sp.groundedReason || 'status'})` : 'Active'}</span></div>
                          </div>
                          {sp.permanentlyGrounded && (
                            <div className="mt-2 text-rose-700">
                              🚫 Permanently grounded: you can still do research/SETI/ventures, but missions are blocked forever.
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* OLD AEROSPACE DASHBOARD REMOVED */}
                    {false && isAerospace && (
                      <div className="mt-3 p-3 rounded-xl border border-slate-200 bg-gradient-to-br from-sky-50 to-indigo-50 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-slate-800">🚀 Space Program Dashboard</div>
                          <div className="text-slate-600">Readiness: <span className="font-semibold">{spaceProgram.readiness}/100</span></div>
                        </div>

                        <div className="grid grid-cols-4 gap-2 mt-2">
                          <div className="p-2 bg-white/70 rounded-lg border border-slate-200">
                            <div className="text-[11px] text-slate-500">Track</div>
                            <div className="font-semibold text-slate-800">
                              {spaceProgram.specialization ? (SPACE_SPECIALIZATIONS.find(s=>s.id===spaceProgram.specialization)?.label || 'Chosen') : 'Unchosen'}
                            </div>
                          </div>
                          <div className="p-2 bg-white/70 rounded-lg border border-slate-200">
                            <div className="text-[11px] text-slate-500">Research</div>
                            <div className="font-semibold text-slate-800">{spaceProgram.researchPoints}</div>
                          </div>
                          <div className="p-2 bg-white/70 rounded-lg border border-slate-200">
                            <div className="text-[11px] text-slate-500">SETI Hits</div>
                            <div className="font-semibold text-slate-800">{spaceProgram.setiHits}</div>
                          </div>
                          <div className="p-2 bg-white/70 rounded-lg border border-slate-200">
                            <div className="text-[11px] text-slate-500">Asteroid Credits</div>
                            <div className="font-semibold text-slate-800">{spaceProgram.asteroidCredits}</div>
                          </div>
                        </div>

                        {!spaceProgram.specialization && (
                          <div className="mt-2">
                            <div className="text-[11px] text-slate-600 mb-1">Choose a track (one-time):</div>
                            <div className="grid grid-cols-3 gap-2">
                              {SPACE_SPECIALIZATIONS.map(spec => (
                                <button
                                  key={spec.id}
                                  onClick={() => handleChooseSpecialization(spec.id)}
                                  className="px-2 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs"
                                >
                                  <div className="font-semibold text-slate-800">{spec.emoji} {spec.label}</div>
                                  <div className="text-[10px] text-slate-500">{spec.desc}</div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-2">
                      {!isGovAssist && !isSAHP && (
                        <button
                          onClick={handleWorkHard}
                          disabled={playerCareer.lastWorkedHardAge === gameState.currentYear || gameState.actionPoints < 1}
                          className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl flex items-center justify-center gap-2"
                        >
                          <TrendingUp className="w-5 h-5" />
                          Work Hard (1 Focus) • Performance +20-30
                        </button>
                      )}

                      {!isSAHP && (
                        <button
                          onClick={handleAskRaise}
                          disabled={playerCareer.lastAskedRaiseAge === gameState.currentYear || gameState.actionPoints < 1}
                          className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl flex items-center justify-center gap-2"
                        >
                          <DollarSign className="w-5 h-5" />
                          Ask for Raise (1 Focus)
                        </button>
                      )}

                      {isSpaceCareer && !ensureSpaceProgram(playerCareer).track && (
                        <div className="mt-2 p-3 rounded-xl border border-slate-200 bg-white">
                          <div className="text-sm font-semibold text-slate-800 mb-2">🧭 Choose your Space Track (costs 1 Focus)</div>
                          <div className="grid grid-cols-2 gap-2">
                            {SPACE_SPECIALIZATIONS.map(opt => (
                              <button
                                key={opt.id}
                                onClick={() => handleChooseSpecialization(opt.id)}
                                disabled={gameState.actionPoints < 1}
                                className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-left disabled:opacity-50"
                              >
                                <div className="font-semibold text-slate-800">{opt.emoji} {opt.label}</div>
                                <div className="text-xs text-slate-600">{opt.hint}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* New Actions */}
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <button onClick={handleNetwork} disabled={playerCareer.flagsByAge?.[gameState.currentYear]?.networked || gameState.actionPoints < 1} className="px-3 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none text-white rounded-xl text-sm flex items-center justify-center gap-2"><Handshake className="w-4 h-4" /> Network</button>
                        <button onClick={handleTraining} disabled={playerCareer.flagsByAge?.[gameState.currentYear]?.trained || gameState.actionPoints < 1} className="px-3 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none text-white rounded-xl text-sm flex items-center justify-center gap-2"><BookOpen className="w-4 h-4" /> Training</button>
                        <button onClick={handleReputationPlay} disabled={playerCareer.flagsByAge?.[gameState.currentYear]?.tookRisk || gameState.actionPoints < 1} className="px-3 py-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none text-white rounded-xl text-sm flex items-center justify-center gap-2"><Puzzle className="w-4 h-4" /> Rep Play</button>
                        {isSpaceCareer && (
                          <>
                            <button
                              onClick={() => setSpaceMissionOpen(true)}
                              disabled={gameState.actionPoints < 1}
                              className="px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm flex items-center justify-center gap-2"
                            >
                              🚀 Missions
                            </button>

                            {!ensureSpaceProgram(playerCareer).track && (
                              <button
                                onClick={() => setSpaceMissionOpen(false)}
                                className="px-3 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-sm flex items-center justify-center gap-2"
                                disabled={gameState.actionPoints < 1}
                              >
                                🧭 Pick Track
                              </button>
                            )}

                            <button
                              onClick={handleSpaceTraining}
                              disabled={gameState.actionPoints < 1}
                              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm flex items-center justify-center gap-2"
                            >
                              🛰️ Training
                            </button>

                            <button
                              onClick={handleMedicalClearance}
                              disabled={gameState.actionPoints < 1}
                              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm flex items-center justify-center gap-2"
                            >
                              🩺 Clearance
                            </button>

                            <button
                              onClick={handleRehabConditioning}
                              disabled={gameState.actionPoints < 1}
                              className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm flex items-center justify-center gap-2"
                            >
                              🏋️ Rehab
                            </button>

                            <button
                              onClick={handleSetiListen}
                              disabled={gameState.actionPoints < 1}
                              className="px-3 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-sm flex items-center justify-center gap-2"
                            >
                              📡 SETI
                            </button>

                            <button
                              onClick={handlePublishPaper}
                              disabled={gameState.actionPoints < 1}
                              className="px-3 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-sm flex items-center justify-center gap-2"
                            >
                              🧾 Paper
                            </button>

                            <button
                              onClick={handleAsteroidVenture}
                              disabled={gameState.actionPoints < 1}
                              className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm flex items-center justify-center gap-2"
                            >
                              ☄️ Venture
                            </button>
                          </>
                        )}
                        {['actor','musician','content_creator'].includes(currentJob?.id) && (
                         <>
                           {currentJob?.id==='actor' && <button onClick={handleAudition} disabled={gameState.actionPoints < 1} className="px-3 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm flex items-center justify-center gap-2"><Clapperboard className="w-4 h-4" /> Audition</button>}
                           {currentJob?.id==='musician' && (
                             <>
                               <button onClick={handleBookGig} disabled={playerCareer.flagsByAge?.[gameState.currentYear]?.bookGig || gameState.actionPoints < 1} className="px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm flex items-center justify-center gap-2"><Music className="w-4 h-4" /> Book Gig</button>
                               <button onClick={handleStudioSession} disabled={playerCareer.flagsByAge?.[gameState.currentYear]?.studioSession || gameState.actionPoints < 1} className="px-3 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-xl text-sm flex items-center justify-center gap-2"><Music className="w-4 h-4" /> Studio Session</button>
                               <button onClick={handleReleaseSingle} disabled={playerCareer.flagsByAge?.[gameState.currentYear]?.releaseSingle || gameState.actionPoints < 1} className="px-3 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-sm flex items-center justify-center gap-2"><Music className="w-4 h-4" /> Release Single</button>
                               <button onClick={handleGoOnTour} disabled={playerCareer.flagsByAge?.[gameState.currentYear]?.tour || gameState.actionPoints < 2} className="px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm flex items-center justify-center gap-2"><Music className="w-4 h-4" /> Go On Tour 🌍 (2)</button>
                             </>
                           )}
                           {currentJob?.id==='content_creator' && <button onClick={handleCreatorSprint} disabled={gameState.actionPoints < 1} className="px-3 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-sm flex items-center justify-center gap-2"><Megaphone className="w-4 h-4" /> Creator Sprint</button>}
                         </>
                        )}
                        {currentJob?.id === 'aerospace_program' && (
                          <>
                            <button
                              onClick={handleSpaceTraining}
                              disabled={playerCareer.flagsByAge?.[gameState.currentYear]?.spaceTraining || gameState.actionPoints < 1}
                              className="px-3 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm flex items-center justify-center gap-2"
                            >
                              🚀 Space Training
                            </button>

                            <button
                              onClick={handleSetiListen}
                              disabled={playerCareer.flagsByAge?.[gameState.currentYear]?.setiListen || gameState.actionPoints < 1}
                              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm flex items-center justify-center gap-2"
                            >
                              📡 SETI Run
                            </button>

                            <button
                              onClick={handleMicrogravityExperiment}
                              disabled={playerCareer.flagsByAge?.[gameState.currentYear]?.microgravity || gameState.actionPoints < 1}
                              className="px-3 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm flex items-center justify-center gap-2"
                            >
                              🧪 Experiment
                            </button>

                            <button
                              onClick={handleAsteroidPitch}
                              disabled={playerCareer.flagsByAge?.[gameState.currentYear]?.asteroidPitch || gameState.actionPoints < 1}
                              className="px-3 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm flex items-center justify-center gap-2"
                            >
                              ☄️ Asteroid Op
                            </button>

                            <button
                              onClick={() => setSpaceMissionOpen(true)}
                              disabled={playerCareer.flagsByAge?.[gameState.currentYear]?.spaceMission || jobLevelIndex < 3}
                              className="col-span-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm flex items-center justify-center gap-2"
                              title={jobLevelIndex < 3 ? 'Reach Astronaut Candidate to run missions.' : ''}
                            >
                              🧑‍🚀 Mission Briefing (Pick Mission)
                            </button>

                            <button
                              onClick={handlePublishPaper}
                              disabled={playerCareer.flagsByAge?.[gameState.currentYear]?.publishPaper || gameState.actionPoints < 1 || Number(spaceProgram.researchPoints || 0) < 4}
                              className="col-span-2 px-3 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm flex items-center justify-center gap-2"
                              title={Number(spaceProgram.researchPoints || 0) < 4 ? 'Build more Research first (SETI/Experiment/Missions).' : ''}
                            >
                              🏅 Publish Breakthrough Paper
                            </button>
                          </>
                        )}
                      </div>

                      {/* Special Career Track Panel (no new popups; runs inside Career) */}
                      {isSpecialCareerJob && (
                        <div className="mt-3 p-3 rounded-xl border border-slate-200 bg-slate-50">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-semibold text-slate-800">
                                🌟 {trackMeta?.emoji} {trackMeta?.title}
                              </div>
                              <div className="text-xs text-slate-600 mt-1">
                                Special track actions are unique and can be used once per year each.
                              </div>
                            </div>
                            <div className="text-right text-xs text-slate-600">
                              <div>Track XP: <span className="font-semibold">{Number(trackState?.xp || 0)}</span></div>
                            </div>
                          </div>

                          {renderSpecialTrackStats()}

                          <div className="grid grid-cols-2 gap-2 mt-3">
                            {specialActions.map(a => (
                              <button
                                key={a.id}
                                onClick={() => runSpecialTrackAction(a.id)}
                                disabled={isSpecialActionUsedThisYear(a.id) || gameState.actionPoints < (a.focus || 1)}
                                className="px-3 py-2 bg-slate-900 hover:bg-slate-950 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm flex flex-col items-center justify-center gap-1"
                              >
                                <span className="font-semibold">{a.label}</span>
                                <span className="text-[11px] opacity-80">{a.focus} Focus • {a.hint}</span>
                              </button>
                            ))}
                          </div>

                          {(specialTrackId === 'police' || specialTrackId === 'bounty') && (
                            <div className="text-[11px] text-rose-700 mt-3">
                              ⚠️ High‑risk actions increase your yearly chance of dying.
                            </div>
                          )}
                        </div>
                      )}

                      <button
                        onClick={() => setBrowsingJobs(true)}
                        className="w-full px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
                      >
                        <Search className="w-5 h-5" />
                        Browse Jobs
                      </button>

                      <button
                        onClick={handleQuitJob}
                        className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl"
                      >
                        Quit Job
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                      <p className="text-sm text-amber-800">You're currently unemployed</p>
                    </div>
                    
                    <button
                      onClick={() => setBrowsingJobs(true)}
                      className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
                    >
                      <Search className="w-5 h-5" />
                      Browse Jobs
                    </button>
                  </div>
                )}

                {/* Job Browser Modal */}
                {browsingJobs && (
                  <div className="fixed inset-0 bg-black/40 z-[102] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl">
                      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                        <h4 className="text-lg font-bold text-slate-800">Browse Jobs</h4>
                        <button
                          onClick={() => {
                            setBrowsingJobs(false);
                            setApplyingTo(null);
                          }}
                          className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center"
                        >
                          <X className="w-4 h-4 text-slate-500" />
                        </button>
                      </div>

                      <div className="px-6 pt-3 pb-2 border-b border-slate-100 space-y-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setJobBrowserMode('recommended')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                              jobBrowserMode === 'recommended'
                                ? 'bg-blue-500 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Recommended
                          </button>
                          <button
                            onClick={() => setJobBrowserMode('all')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                              jobBrowserMode === 'all'
                                ? 'bg-blue-500 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            All Jobs
                          </button>
                        </div>

                        <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={includeSpecialJobsToggle}
                            onChange={(e) => setIncludeSpecialJobsToggle(e.target.checked)}
                            className="rounded"
                          />
                          <span>Include special careers</span>
                        </label>
                      </div>

                      <div className="p-6 overflow-y-auto max-h-[calc(80vh-160px)] space-y-3">
                        {jobBoard.map(job => {
                           const baseSalary = job.baseYearlyIncome;
                           const levelMult = job.levels[0].incomeMult || 1.0;
                           const estimatedIncome = Math.floor(baseSalary * levelMult);

                           return (
                            <div
                              key={job.id}
                              className="w-full text-left px-4 py-3 rounded-xl border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xl">{job.emoji}</span>
                                    <span className="font-semibold text-slate-800">{job.title}</span>
                                  </div>
                                  <div className="flex gap-2 mb-1 flex-wrap">
                                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                      Requires: {(EDUCATION_LEVELS.find(e => e.id === job.minEducation)?.label) || job.minEducation}
                                    </span>
                                    {Array.isArray(job.fields) && job.fields.length > 0 && (
                                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                        Field: {(job.fields || []).map(fid => (EDUCATION_FIELDS.find(f => f.id === fid)?.label || fid)).join(' / ')}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-slate-600 mb-1">{job.blurb}</div>
                                  {(((EDUCATION_RANK[parentEducation.highest.levelId] || 0) < (EDUCATION_RANK[job.minEducation] || 0)) || (Array.isArray(job.fields) && job.fields.length > 0 && parentEducation.highest.majorId && !job.fields.includes((getMajorById(parentEducation.highest.majorId) || {}).field))) && (
                                    <div className="text-xs text-amber-700">You’re not qualified — you can still apply, but rejection is likely.</div>
                                  )}
                                  <div className="text-xs text-slate-500">
                                    ~${formatMoney(estimatedIncome)}/year
                                  </div>
                                </div>
                                <div className="shrink-0 self-center">
                                  {(() => {
                                    const isGovAssistJob = job.id === 'government_assistance';

                                    // Government assistance is always clickable (so it can show the "Not Eligible" popup),
                                    // and it never depends on Focus.
                                    const label = isGovAssistJob
                                      ? (playerCareer.employed ? 'Not Eligible' : 'Apply (FREE)')
                                      : 'Apply (1 Focus)';

                                    const disabled = isGovAssistJob ? false : (gameState.actionPoints < 1);

                                    return (
                                      <button
                                        onClick={() => handleApplyToJob(job)}
                                        disabled={disabled}
                                        title={isGovAssistJob && playerCareer.employed ? 'You can only apply for government assistance if you are unemployed.' : ''}
                                        className="px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        {label}
                                      </button>
                                    );
                                  })()}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        
                        {jobBoard.length === 0 && (
                          <div className="text-center py-8 text-slate-500">
                            <p className="text-sm">No jobs available for your education level</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {isSpaceCareer && (
            <SpaceMissionBriefingModal
              open={spaceMissionOpen}
              onClose={() => setSpaceMissionOpen(false)}
              employerLabel={spaceSectorLabel}
              playerCareer={playerCareer}
              gameYear={gameState.currentYear}
              missions={getAvailableMissions()}
              canFlyNow={canDoMissionsThisYear(ensureSpaceProgram(playerCareer))}
              medicalCleared={ensureSpaceProgram(playerCareer).medicalClearedYear === gameState.currentYear}
              grounded={isGroundedNow(ensureSpaceProgram(playerCareer))}
              onRunMission={(m) => { setSpaceMissionOpen(false); runSpaceMission(m); }}
            />
          )}

          {/* OLD MISSION MODAL REMOVED */}
          {false && spaceMissionOpen && isAerospace && (
            <div className="fixed inset-0 bg-black/50 z-[103] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl w-full max-w-md max-h-[85vh] overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                  <h4 className="text-lg font-bold text-slate-800">🧑‍🚀 Mission Briefing</h4>
                  <button
                    onClick={() => setSpaceMissionOpen(false)}
                    className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)] space-y-3">
                  <div className="text-xs text-slate-600">
                    Readiness: <span className="font-semibold">{spaceProgram.readiness}</span>/100 • Rank gate: Astronaut Candidate+
                  </div>

                  {SPACE_MISSIONS.map(m => {
                    const lockedLevel = jobLevelIndex < m.minJobLevel;
                    const lockedReadiness = Number(spaceProgram.readiness || 0) < m.minReadiness;
                    const lockedFocus = (gameState.actionPoints || 0) < m.focusCost;
                    const lockedYear = playerCareer.flagsByAge?.[gameState.currentYear]?.spaceMission;

                    const disabled = lockedYear || lockedLevel || lockedReadiness || lockedFocus;

                    return (
                      <button
                        key={m.id}
                        onClick={() => runSpaceMission(m)}
                        disabled={disabled}
                        className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-colors ${
                          disabled
                            ? 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                            : 'border-slate-200 hover:border-emerald-400 hover:bg-emerald-50'
                        }`}
                      >
                        <div className="font-semibold text-slate-800">{m.title}</div>
                        <div className="text-xs text-slate-600 mt-1">{m.desc}</div>
                        <div className="text-[11px] text-slate-500 mt-2 flex flex-wrap gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200">Focus: {m.focusCost}</span>
                          <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200">Min Rank: {m.minJobLevel}</span>
                          <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200">Min Readiness: {m.minReadiness}</span>
                          {lockedYear && <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700">Already did a mission this year</span>}
                          {lockedLevel && <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700">Need higher rank</span>}
                          {lockedReadiness && <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700">Need more readiness</span>}
                          {lockedFocus && <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700">Not enough focus</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}
      <RaiseNegotiationMiniGame
        open={raiseGameOpen}
        onClose={() => { resolveRaiseAutoNoSpend(); setRaiseGameOpen(false); }}
        onSkip={() => { resolveRaiseAutoNoSpend(); setRaiseGameOpen(false); }}
        onComplete={(res) => {
          const { success, rating, raisePct } = res || {};
          if (success && raisePct > 0) {
            const pc = normalizePlayerCareer(gameState.playerCareer, gameState) || playerCareer;
            let newIncome = Math.floor((pc.yearlyIncome || 0) * (1 + (raisePct / 100)));
            newIncome = ensureNoTrailingZero(newIncome, pc.yearlyIncome);
            updateState({ playerCareer: { ...pc, yearlyIncome: newIncome, lastAskedRaiseAge: gameState.currentYear } });
            addLog(`💬 Negotiated raise: +${raisePct}% (${rating}). New salary: $${formatMoney(newIncome)}/year`);
            emitActionResult({
              actionId: 'career',
              title: '💬 Negotiated Raise',
              body: `Negotiated raise: +${raisePct}% (${rating})\n\nStress -0.5 • Focus -1`,
              deltas: null,
              loveDelta: 0,
              stressDelta: -0.5,
              moneyDelta: 0,
              focusDelta: -1,
              tags: ['career'],
              meta: { emoji: '💬', rating, raisePct, skipTimelineRecord: true }
            });
          } else {
            applyStress(0.5, 'Raise negotiation denied');
            addLog('💬 Raise negotiation denied.');
            emitActionResult({
              actionId: 'career',
              title: '💔 Raise Denied',
              body: 'Negotiation fell flat.\n\nStress +0.5 • Focus -1',
              deltas: null,
              loveDelta: 0,
              stressDelta: 0.5,
              moneyDelta: 0,
              focusDelta: -1,
              tags: ['career'],
              meta: { emoji: '💔', skipTimelineRecord: true }
            });
          }
          setRaiseGameOpen(false);
        }}
        baseRaiseRange={{ minPct: 5, maxPct: 12 }}
      />

      <ReadTheRoomMiniGame
        open={readRoomOpen}
        contextTag="interview"
        onClose={() => {
          const job = interviewJob; const totalChance = interviewChance || 50;
          const roll = Math.random() * 100;
          const accepted = roll < totalChance;
          if (accepted) {
            const baseSalary = job.baseYearlyIncome;
            const levelMult = job.levels[0].incomeMult || 1.0;
            let newIncome = Math.floor(baseSalary * levelMult);
            newIncome = ensureNoTrailingZero(newIncome, job.id.length);
            updateState({ 
              playerCareer: { 
                ...playerCareer, 
                jobId: job.id,
                jobLevelIndex: 0,
                performance: 55,
                yearsInJob: 0,
                employed: true,
                yearlyIncome: newIncome,
                spaceProgram: SPACE_JOB_IDS.has(job.id) ? { ...DEFAULT_SPACE_PROGRAM, enrolled: true } : (playerCareer.spaceProgram || undefined)
              } 
            });
            addLog(`🎉 Got hired as ${job.title}! Salary: $${formatMoney(newIncome)}/year`);
            emitActionResult({ actionId: 'career', title: '🎉 Hired!', body: `You're now a ${job.levels[0].title}. Yearly income: $${formatMoney(newIncome)}.`, deltas: {}, loveDelta: 0, stressDelta: -1, moneyDelta: 0, focusDelta: -1, tags: ['career'], meta: { emoji: job.emoji, job: job.title } });
          } else {
            applyStress(0.5, 'Job rejection');
            addLog(`❌ ${job.title} application rejected`);
            const childName = gameState.childName || 'your kid';
            const baseBody = `The ${job.title} position went to another candidate. Keep applying.`;
            const body = appendHumor(baseBody, 'jobRejection', { jobTitle: job.title, childName });
            emitActionResult({ actionId: 'career', title: '❌ Application Rejected', body, deltas: {}, loveDelta: 0, stressDelta: 0.5, moneyDelta: 0, focusDelta: -1, tags: ['career'], meta: { emoji: '❌' } });
          }
          setBrowsingJobs(false); setApplyingTo(null); setReadRoomOpen(false);
        }}
        onComplete={(res) => {
          const job = interviewJob; const baseChance = interviewChance || 50; const m = Math.max(0.9, Math.min(1.2, Number(res?.multiplier || 1)));
          const adjusted = Math.max(10, Math.min(90, Math.round(baseChance * m)));
          const delta = adjusted - baseChance;
          // Log mini-game effect
          addLog(`Interview result: ${res?.rating || 'Result'} (${delta >= 0 ? '+' : ''}${delta}% chance)`);
          const roll = Math.random() * 100;
          const accepted = roll < adjusted;
          if (accepted) {
            const baseSalary = job.baseYearlyIncome; const levelMult = job.levels[0].incomeMult || 1.0;
            let newIncome = Math.floor(baseSalary * levelMult); newIncome = ensureNoTrailingZero(newIncome, job.id.length);
            updateState({ 
              playerCareer: { 
                ...playerCareer, 
                jobId: job.id,
                jobLevelIndex: 0,
                performance: 55,
                yearsInJob: 0,
                employed: true,
                yearlyIncome: newIncome,
                spaceProgram: SPACE_JOB_IDS.has(job.id) ? { ...DEFAULT_SPACE_PROGRAM, enrolled: true } : (playerCareer.spaceProgram || undefined)
              } 
            });
            addLog(`🎉 Got hired as ${job.title}! Salary: $${formatMoney(newIncome)}/year`);
            emitActionResult({ actionId: 'career', title: '🎉 Hired!', body: `You're now a ${job.levels[0].title}. Yearly income: $${formatMoney(newIncome)}.`, deltas: {}, loveDelta: 0, stressDelta: -1, moneyDelta: 0, focusDelta: -1, tags: ['career'], meta: { emoji: job.emoji, job: job.title } });
          } else {
            applyStress(0.5, 'Job rejection');
            addLog(`❌ ${job.title} application rejected`);
            const childName = gameState.childName || 'your kid';
            const baseBody = `The ${job.title} position went to another candidate. Keep applying.`;
            const body = appendHumor(baseBody, 'jobRejection', { jobTitle: job.title, childName });
            emitActionResult({ actionId: 'career', title: '❌ Application Rejected', body, deltas: {}, loveDelta: 0, stressDelta: 0.5, moneyDelta: 0, focusDelta: -1, tags: ['career'], meta: { emoji: '❌' } });
          }
          setBrowsingJobs(false); setApplyingTo(null); setReadRoomOpen(false);
        }}
      />
    </AnimatePresence>
  );
}

function StatBar({ label, value, color }) {
  const v = Math.max(0, Math.min(100, Math.round(Number(value)||0)));
  return (
    <div>
      <div className="flex justify-between text-[11px] text-slate-600 mb-1"><span>{label}</span><span>{v}/100</span></div>
      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden"><div className={`h-full ${color}`} style={{ width: `${v}%` }} /></div>
    </div>
  );
}

function SpaceMissionBriefingModal({
  open, onClose, employerLabel, playerCareer, gameYear,
  missions, canFlyNow, medicalCleared, grounded, onRunMission
}) {
  if (!open) return null;

  const sp = { ...(DEFAULT_SPACE_PROGRAM || {}), ...(playerCareer?.spaceProgram || {}) };
  const readiness = Math.round(Number(sp.readiness || 0));
  const level = Number(playerCareer?.jobLevelIndex || 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[120]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="fixed inset-0 z-[121] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <div>
                  <div className="text-lg font-bold text-slate-800">🚀 Mission Briefing</div>
                  <div className="text-xs text-slate-500">{employerLabel} • Year {gameYear} • Readiness {readiness}/100</div>
                </div>
                <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto">
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm">
                  <div className="font-semibold text-slate-800">Status</div>
                  <div className="text-slate-700 mt-1">
                    {grounded ? '🚫 Grounded — missions blocked.' : (medicalCleared ? '🩺 Medical cleared this year.' : '🩺 Medical NOT cleared this year.')}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    Requirement: Job level ≥ 3 (Astronaut Candidate tier), plus readiness thresholds.
                  </div>
                  {level < 3 && (
                    <div className="text-xs text-amber-700 mt-1">📛 You need promotions before flying missions.</div>
                  )}
                </div>

                {!canFlyNow && (
                  <div className="p-3 rounded-xl border border-amber-200 bg-amber-50 text-sm text-amber-800">
                    Missions are currently locked. If it's medical: run 🩺 Clearance in Career actions. If it's grounding: you're blocked.
                  </div>
                )}

                <div className="space-y-2">
                  {missions.map(m => {
                    const eligibleLevel = level >= (m.minJobLevel || 3);
                    const eligibleReadiness = readiness >= (m.minReadiness || 0);
                    const enabled = canFlyNow && eligibleLevel && eligibleReadiness;

                    return (
                      <div key={m.id} className="p-3 rounded-xl border border-slate-200">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-800">{m.title}</div>
                            <div className="text-xs text-slate-600 mt-0.5">{m.blurb}</div>
                            <div className="text-[11px] text-slate-500 mt-1">
                              Needs: Level {m.minJobLevel}+ • Readiness {m.minReadiness}+ • Cost {m.focusCost} Focus
                            </div>
                          </div>
                          <button
                            onClick={() => onRunMission(m)}
                            disabled={!enabled}
                            className="shrink-0 px-3 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Launch
                          </button>
                        </div>

                        {!eligibleLevel && (
                          <div className="text-xs text-amber-700 mt-2">📛 Not enough job seniority.</div>
                        )}
                        {eligibleLevel && !eligibleReadiness && (
                          <div className="text-xs text-amber-700 mt-2">⚠️ Readiness too low. Train more.</div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="text-xs text-slate-500">
                  Tip: Space Agency favors reputation and scientific missions; Private Contractor favors money, but carries higher catastrophic risk.
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}