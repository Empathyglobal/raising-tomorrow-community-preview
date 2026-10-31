import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useGameState, formatMoney } from '@/components/game/GameStateContext';
import { getJobById } from '@/components/game/jobSystem';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const BUSINESS_CATALOG = [
  {
    id: 'candle_soap',
    emoji: '🕯️',
    label: 'Candle & Soap Shop',
    desc: 'Handmade scents, online drops, and gift boxes.',
    relatedJobIds: ['marketing', 'graphic_designer', 'sales_rep', 'chemist']
  },
  {
    id: 'pet_services',
    emoji: '🐶',
    label: 'Pet Services (Walking/Sitting)',
    desc: 'Regular clients, weekend sits, and holiday rush.',
    relatedJobIds: ['veterinarian']
  },
  {
    id: 'home_bakery',
    emoji: '🍪',
    label: 'Home Bakery & Custom Cakes',
    desc: 'Small batches, big feelings, occasional flour explosions.',
    relatedJobIds: ['chef', 'food_service']
  },
  {
    id: 'tutoring',
    emoji: '🧠',
    label: 'Tutoring & Test Prep',
    desc: 'Online sessions, worksheets, and "wait… I get it!" moments.',
    relatedJobIds: ['teacher', 'instructional_designer', 'professor', 'librarian', 'school_counselor']
  },
  {
    id: 'art_commissions',
    emoji: '🎨',
    label: 'Art & Design Commissions',
    desc: 'Logos, portraits, brand kits, and the occasional "make it pop."',
    relatedJobIds: ['graphic_designer', 'ux_designer', 'content_creator', 'marketing']
  },
  {
    id: 'handy_service',
    emoji: '🧰',
    label: 'Home Repairs & Handy Service',
    desc: 'Fixes, installs, and "I can do that" confidence.',
    relatedJobIds: ['mechanic', 'electrician', 'plumber']
  },
  {
    id: 'auto_repair',
    emoji: '🛠️',
    label: 'Auto Repair Garage',
    desc: 'Diagnostics, brakes, and customers who swear "it only does that sometimes."',
    relatedJobIds: ['mechanic']
  },
  {
    id: 'licensed_trades',
    emoji: '🚿',
    label: 'Licensed Plumbing/Electrical',
    desc: 'Emergency calls, inspections, and very expensive tools.',
    relatedJobIds: ['plumber', 'electrician']
  },
  {
    id: 'bookkeeping_tax',
    emoji: '🧾',
    label: 'Bookkeeping & Tax Prep',
    desc: 'Receipts, spreadsheets, and making numbers behave.',
    relatedJobIds: ['accountant', 'financial_analyst']
  },
  {
    id: 'web_app_studio',
    emoji: '🧑‍💻',
    label: 'Web/App Studio',
    desc: 'Sites, apps, and clients who want it "simple… like Instagram."',
    relatedJobIds: ['software_engineer', 'data_scientist', 'ux_designer', 'project_manager']
  },
  {
    id: 'legal_consulting',
    emoji: '⚖️',
    label: 'Legal Consulting & Document Help',
    desc: 'Contracts, filings, and "read the fine print" energy.',
    relatedJobIds: ['lawyer', 'paralegal', 'legal_assistant', 'compliance_officer']
  },
  {
    id: 'adventure_tours',
    emoji: '🥾',
    label: 'Adventure Tours & Outdoor Lessons',
    desc: 'Guided hikes, safety briefings, and wholesome adrenaline.',
    relatedJobIds: ['park_ranger', 'scuba_instructor', 'bungee_jump_instructor', 'environmental_scientist']
  },
  {
    id: 'wellness_studio',
    emoji: '🧘',
    label: 'Wellness Coaching & Yoga',
    desc: 'Classes, 1:1 plans, and chanting your way to rent money.',
    relatedJobIds: ['yoga_instructor', 'physical_therapist', 'psychologist', 'nurse']
  },
  {
    id: 'content_agency',
    emoji: '📣',
    label: 'Content & Social Media Agency',
    desc: 'Brand deals, scheduling, captions, and algorithm prayers.',
    relatedJobIds: ['content_creator', 'marketing', 'sales_rep', 'journalist']
  }
];

const CAREER_BONUS_TIERS = [
  { years: 20, bonus: 0.25, label: 'Master' },
  { years: 15, bonus: 0.18, label: 'Veteran' },
  { years: 10, bonus: 0.12, label: 'Experienced' },
  { years: 5, bonus: 0.06, label: 'Skilled' }
];

const clamp = (n, min, max) => Math.max(min, Math.min(max, Number(n || 0)));

function computeBusinessSuccessChance(investmentAmount, careerBonus = 0) {
  const baseChance = 0.35;
  const investmentBonus = ((Number(investmentAmount || 20000) - 20000) / 80000) * 0.25;
  return clamp(baseChance + investmentBonus + (Number(careerBonus) || 0), 0.35, 0.85);
}

function getBusinessCareerSynergy(gameState, business) {
  const yearsByJobIdRaw = gameState?.playerCareer?.yearsByJobId;
  const yearsByJobId = (yearsByJobIdRaw && typeof yearsByJobIdRaw === 'object') ? yearsByJobIdRaw : {};
  const related = Array.isArray(business?.relatedJobIds) ? business.relatedJobIds : [];

  const breakdown = related
    .map(jobId => {
      const years = Number(yearsByJobId[jobId] || 0);
      const title = getJobById(jobId)?.title || jobId;
      return { jobId, title, years };
    })
    .filter(x => x.years > 0);

  const totalYears = breakdown.reduce((sum, x) => sum + x.years, 0);
  const tier = CAREER_BONUS_TIERS.find(t => totalYears >= t.years) || null;

  return {
    totalYears,
    bonus: tier ? tier.bonus : 0,
    tierLabel: tier ? tier.label : null,
    breakdown
  };
}

const prettyPct = (p) => `${Math.round((Number(p || 0) * 100))}%`;


function hashStringToInt(str) {
  let h = 0;
  const s = String(str || '');
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i);
    h |= 0;
  }
  return h;
}

function seededRandom01(seedStr) {
  let state = hashStringToInt(seedStr);
  state = state + 0x6D2B79F5 | 0;
  let t = Math.imul(state ^ state >>> 15, 1 | state);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
}

const DEFAULT_BUSINESS_SETTINGS = {
  staffing: 'balanced', // 'budget' | 'balanced' | 'premium'
  secondChanceHiring: false
};

function normalizeBusinessSettings(raw) {
  const r = (raw && typeof raw === 'object') ? raw : {};
  const staffingRaw = String(r.staffing || 'balanced');
  const staffing = (staffingRaw === 'budget' || staffingRaw === 'premium' || staffingRaw === 'balanced')
    ? staffingRaw
    : 'balanced';
  return {
    staffing,
    secondChanceHiring: Boolean(r.secondChanceHiring)
  };
}

function getActiveBusinessFromState(gameState) {
  const id = gameState?.businessIdeaId;
  const label = gameState?.businessIdea;

  if (id) {
    const found = BUSINESS_CATALOG.find(b => b.id === id);
    if (found) return found;
  }
  if (label) {
    const found = BUSINESS_CATALOG.find(b => b.label === label);
    if (found) return found;
  }
  return null;
}

const STAFFING_LABELS = {
  budget: 'Budget Staff',
  balanced: 'Balanced Team',
  premium: 'Premium Staff'
};

const BUSINESS_MANAGEMENT_ACTIONS = {
  candle_soap: [
    { id: 'upgrade_gear', emoji: '🧪', label: 'Upgrade Production Gear', cost: 700, kind: 'income', incomeMultiplier: 1.10, blurb: 'Income +10%', narrative: 'New melters, molds, and labels. You ship faster and cleaner.' },
    { id: 'wholesale_boutiques', emoji: '🛍️', label: 'Wholesale to Boutiques', cost: 800, kind: 'income', incomeMultiplier: 1.08, blurb: 'Income +8%', narrative: 'Small shops carry your products. Steady repeat orders.' },
    { id: 'influencer_drop', emoji: '✨', label: 'Influencer Drop', cost: 900, kind: 'roll', blurb: '55% +12% | 35% +5% | 10% -6%', outcomes: [
      { max: 55, incomeMultiplier: 1.12, narrative: 'The collab sells out. Your DMs become a packing list.' },
      { max: 90, incomeMultiplier: 1.05, narrative: 'A decent bump. Not viral, but definitely helpful.' },
      { max: 100, incomeMultiplier: 0.94, narrative: 'The hype fizzles and returns sting a bit. You regroup.' }
    ] }
  ],
  pet_services: [
    { id: 'hire_walker', emoji: '🦴', label: 'Hire a Part‑Time Walker', cost: 600, kind: 'income', incomeMultiplier: 1.09, blurb: 'Income +9%', narrative: 'More time slots, fewer "sorry, I\'m booked."' },
    { id: 'scheduling_app', emoji: '📅', label: 'Scheduling App + Pet‑Cam', cost: 450, kind: 'income', incomeMultiplier: 1.06, blurb: 'Income +6%', narrative: 'Clients love the updates. You love the automation.' },
    { id: 'vet_partner', emoji: '🏥', label: 'Partner With a Local Vet', cost: 700, kind: 'roll', blurb: '60% +10% | 30% +4% | 10% -5%', outcomes: [
      { max: 60, incomeMultiplier: 1.10, narrative: 'Referrals roll in. You become the "go‑to" sitter.' },
      { max: 90, incomeMultiplier: 1.04, narrative: 'A few new clients. It\'s a nice steady trickle.' },
      { max: 100, incomeMultiplier: 0.95, narrative: 'The partnership is awkward and doesn\'t convert. Oof.' }
    ] }
  ],
  home_bakery: [
    { id: 'upgrade_oven', emoji: '🔥', label: 'Upgrade Oven & Mixer', cost: 1200, kind: 'income', incomeMultiplier: 1.12, blurb: 'Income +12%', narrative: 'More capacity, fewer "my whisk snapped" emergencies.' },
    { id: 'farmers_market', emoji: '🧺', label: 'Farmers Market Booth', cost: 400, kind: 'income', incomeMultiplier: 1.07, blurb: 'Income +7%', narrative: 'Local regulars become a line. You start selling out early.' },
    { id: 'wedding_gamble', emoji: '💒', label: 'Big Wedding Order Gamble', cost: 650, kind: 'roll', blurb: '50% +15% | 40% +6% | 10% -10%', outcomes: [
      { max: 50, incomeMultiplier: 1.15, narrative: 'Photos go everywhere. Your calendar fills up.' },
      { max: 90, incomeMultiplier: 1.06, narrative: 'It goes fine. Solid money, solid referrals.' },
      { max: 100, incomeMultiplier: 0.90, narrative: 'A stressful mess and some refunds. You survive… barely.' }
    ] }
  ],
  tutoring: [
    { id: 'course_pack', emoji: '📚', label: 'Build a Course Pack', cost: 300, kind: 'income', incomeMultiplier: 1.08, blurb: 'Income +8%', narrative: 'Reusable materials = faster sessions and better results.' },
    { id: 'targeted_ads', emoji: '🎯', label: 'Run Targeted Ads', cost: 600, kind: 'income', incomeMultiplier: 1.09, blurb: 'Income +9%', narrative: 'You get on parents\' radar right before exam season.' },
    { id: 'assistant_tutor', emoji: '🧑‍🏫', label: 'Hire an Assistant Tutor', cost: 900, kind: 'roll', blurb: '70% +10% | 20% +4% | 10% -7%', outcomes: [
      { max: 70, incomeMultiplier: 1.10, narrative: 'You scale smoothly. Students stick around.' },
      { max: 90, incomeMultiplier: 1.04, narrative: 'Some help is better than none. Slight growth.' },
      { max: 100, incomeMultiplier: 0.93, narrative: 'Bad fit. You spend time fixing issues and lose momentum.' }
    ] }
  ],
  art_commissions: [
    { id: 'template_store', emoji: '🛒', label: 'Launch a Template Pack Store', cost: 250, kind: 'income', incomeMultiplier: 1.07, blurb: 'Income +7%', narrative: 'Digital products = passive sales while you sleep.' },
    { id: 'hire_va', emoji: '🧑‍💼', label: 'Hire a Virtual Assistant', cost: 700, kind: 'income', incomeMultiplier: 1.09, blurb: 'Income +9%', narrative: 'Less inbox chaos. More time to actually create.' },
    { id: 'raise_rates', emoji: '💰', label: 'Raise Rates (Risky)', cost: 0, kind: 'roll', blurb: '60% +8% | 40% -4%', outcomes: [
      { max: 60, incomeMultiplier: 1.08, narrative: 'Clients accept it. You work less for more.' },
      { max: 100, incomeMultiplier: 0.96, narrative: 'Some clients dip. You adjust and refine your offer.' }
    ] }
  ],
  handy_service: [
    { id: 'pro_tools', emoji: '🧰', label: 'Buy Pro Tools & Storage', cost: 1000, kind: 'income', incomeMultiplier: 1.11, blurb: 'Income +11%', narrative: 'Faster jobs, fewer repeat trips. You look legit.' },
    { id: 'flyer_blitz', emoji: '📮', label: 'Local Flyer Blitz', cost: 350, kind: 'income', incomeMultiplier: 1.07, blurb: 'Income +7%', narrative: 'Neighborhood jobs stack up. You become "the fixer."' },
    { id: 'big_contract', emoji: '🏗️', label: 'Take a Big Contract', cost: 500, kind: 'roll', blurb: '55% +14% | 30% +6% | 15% -8%', outcomes: [
      { max: 55, incomeMultiplier: 1.14, narrative: 'Crushed it. You earn trust and bigger leads.' },
      { max: 85, incomeMultiplier: 1.06, narrative: 'Some stress, some money. Net win.' },
      { max: 100, incomeMultiplier: 0.92, narrative: 'Overruns and callbacks. That one hurt.' }
    ] }
  ],
  auto_repair: [
    { id: 'scanner', emoji: '🔧', label: 'Buy a Diagnostic Scanner', cost: 900, kind: 'income', incomeMultiplier: 1.10, blurb: 'Income +10%', narrative: 'You find problems faster. Customers think you\'re a wizard.' },
    { id: 'parts_deal', emoji: '📦', label: 'Negotiate Parts Supplier Deal', cost: 450, kind: 'income', incomeMultiplier: 1.06, blurb: 'Income +6%', narrative: 'Better margins, fewer "backordered" nightmares.' },
    { id: 'fleet_pitch', emoji: '🚚', label: 'Pitch a Fleet Contract', cost: 700, kind: 'roll', blurb: '50% +16% | 35% +7% | 15% -6%', outcomes: [
      { max: 50, incomeMultiplier: 1.16, narrative: 'You land it. Repeat work for months.' },
      { max: 85, incomeMultiplier: 1.07, narrative: 'You pick up a couple commercial clients. Nice.' },
      { max: 100, incomeMultiplier: 0.94, narrative: 'They go with someone else. You wasted a week.' }
    ] }
  ],
  licensed_trades: [
    { id: 'emergency_line', emoji: '📞', label: 'Launch an Emergency Call Line', cost: 600, kind: 'income', incomeMultiplier: 1.09, blurb: 'Income +9%', narrative: 'You get the late‑night calls (and the late‑night rates).' },
    { id: 'permits', emoji: '🪪', label: 'Certifications & Permits', cost: 800, kind: 'income', incomeMultiplier: 1.10, blurb: 'Income +10%', narrative: 'More jobs unlocked. Fewer "sorry, not allowed."' },
    { id: 'hire_licensed_help', emoji: '👷', label: 'Hire Licensed Helper', cost: 1200, kind: 'roll', blurb: '65% +12% | 25% +5% | 10% -7%', outcomes: [
      { max: 65, incomeMultiplier: 1.12, narrative: 'They\'re solid. You can take bigger jobs.' },
      { max: 90, incomeMultiplier: 1.05, narrative: 'Not perfect, but helps you keep up.' },
      { max: 100, incomeMultiplier: 0.93, narrative: 'Bad hire. Time, money, and headaches.' }
    ] }
  ],
  bookkeeping_tax: [
    { id: 'automation', emoji: '🤖', label: 'Automation Software', cost: 500, kind: 'income', incomeMultiplier: 1.08, blurb: 'Income +8%', narrative: 'Receipts categorize themselves. You feel powerful.' },
    { id: 'referrals', emoji: '🤝', label: 'Referral Partnership', cost: 650, kind: 'income', incomeMultiplier: 1.09, blurb: 'Income +9%', narrative: 'Accountants, lawyers, and a steady stream of clients.' },
    { id: 'buy_client_book', emoji: '📈', label: 'Buy a Client Book', cost: 900, kind: 'roll', blurb: '60% +13% | 30% +6% | 10% -6%', outcomes: [
      { max: 60, incomeMultiplier: 1.13, narrative: 'The clients stay. Your baseline jumps.' },
      { max: 90, incomeMultiplier: 1.06, narrative: 'Some churn, but overall growth.' },
      { max: 100, incomeMultiplier: 0.94, narrative: 'Too much churn. You overpaid a bit.' }
    ] }
  ],
  web_app_studio: [
    { id: 'productize', emoji: '📦', label: 'Productize a Service', cost: 400, kind: 'income', incomeMultiplier: 1.08, blurb: 'Income +8%', narrative: 'Clear packages, clear pricing, fewer weird calls.' },
    { id: 'contractor_dev', emoji: '🧑‍💻', label: 'Hire a Contractor Developer', cost: 1200, kind: 'roll', blurb: '70% +12% | 20% +5% | 10% -8%', outcomes: [
      { max: 70, incomeMultiplier: 1.12, narrative: 'More output, more projects, more cash.' },
      { max: 90, incomeMultiplier: 1.05, narrative: 'Some speedup. Still worth it.' },
      { max: 100, incomeMultiplier: 0.92, narrative: 'Miscommunication costs you. You clean it up.' }
    ] },
    { id: 'launch_hunt', emoji: '🚀', label: 'Big Launch Push', cost: 600, kind: 'roll', blurb: '45% +18% | 40% +7% | 15% -5%', outcomes: [
      { max: 45, incomeMultiplier: 1.18, narrative: 'You hit a wave of attention. Leads flood in.' },
      { max: 85, incomeMultiplier: 1.07, narrative: 'Nice bump. You stay busy.' },
      { max: 100, incomeMultiplier: 0.95, narrative: 'Meh launch. You learn and iterate.' }
    ] }
  ],
  legal_consulting: [
    { id: 'flat_fee', emoji: '🧾', label: 'Offer Flat‑Fee Packages', cost: 300, kind: 'income', incomeMultiplier: 1.07, blurb: 'Income +7%', narrative: 'Clients love clarity. You love fewer negotiations.' },
    { id: 'accountant_network', emoji: '🧑‍🤝‍🧑', label: 'Partner With Accountants', cost: 700, kind: 'income', incomeMultiplier: 1.10, blurb: 'Income +10%', narrative: 'Referrals stack up right when filings hit.' },
    { id: 'workshop', emoji: '🎤', label: 'Host a Compliance Workshop', cost: 500, kind: 'roll', blurb: '55% +14% | 35% +6% | 10% -6%', outcomes: [
      { max: 55, incomeMultiplier: 1.14, narrative: 'You become "the person" in the niche. Great leads.' },
      { max: 90, incomeMultiplier: 1.06, narrative: 'A few solid clients come out of it.' },
      { max: 100, incomeMultiplier: 0.94, narrative: 'Low turnout. A little embarrassing, but fine.' }
    ] }
  ],
  adventure_tours: [
    { id: 'safety_gear', emoji: '⛑️', label: 'Buy Safety Gear', cost: 900, kind: 'income', incomeMultiplier: 1.09, blurb: 'Income +9%', narrative: 'Safer tours = better reviews and fewer cancellations.' },
    { id: 'hotel_partner', emoji: '🏨', label: 'Partner With Hotels', cost: 700, kind: 'income', incomeMultiplier: 1.10, blurb: 'Income +10%', narrative: 'Concierge referrals are basically free marketing.' },
    { id: 'viral_clip', emoji: '📹', label: 'Chase a Viral Clip', cost: 250, kind: 'roll', blurb: '45% +20% | 40% +8% | 15% -8%', outcomes: [
      { max: 45, incomeMultiplier: 1.20, narrative: 'It pops off. Tour bookings explode.' },
      { max: 85, incomeMultiplier: 1.08, narrative: 'Some traction. You get a few extra groups.' },
      { max: 100, incomeMultiplier: 0.92, narrative: 'It flops, and you eat some costs. Rough.' }
    ] }
  ],
  wellness_studio: [
    { id: 'studio_slot', emoji: '🏠', label: 'Rent a Better Studio Slot', cost: 700, kind: 'income', incomeMultiplier: 1.09, blurb: 'Income +9%', narrative: 'Better times + better space = better retention.' },
    { id: 'cert', emoji: '🎓', label: 'New Certification', cost: 800, kind: 'income', incomeMultiplier: 1.10, blurb: 'Income +10%', narrative: 'Higher trust, higher rates, happier clients.' },
    { id: 'corporate_pitch', emoji: '🏢', label: 'Corporate Wellness Pitch', cost: 600, kind: 'roll', blurb: '50% +16% | 35% +7% | 15% -6%', outcomes: [
      { max: 50, incomeMultiplier: 1.16, narrative: 'You land a contract. Reliable monthly income.' },
      { max: 85, incomeMultiplier: 1.07, narrative: 'A couple workshops. Nice exposure.' },
      { max: 100, incomeMultiplier: 0.94, narrative: 'No bite. You wasted time chasing it.' }
    ] }
  ],
  content_agency: [
    { id: 'hire_editor', emoji: '🧑‍💼', label: 'Hire VA / Editor', cost: 900, kind: 'income', incomeMultiplier: 1.10, blurb: 'Income +10%', narrative: 'More output, less burnout. Your calendar relaxes.' },
    { id: 'automation_tools', emoji: '⚙️', label: 'Automation Tools', cost: 450, kind: 'income', incomeMultiplier: 1.07, blurb: 'Income +7%', narrative: 'Scheduling gets smoother. You stop babysitting posts.' },
    { id: 'brand_sprint', emoji: '🤳', label: 'Brand Deal Sprint', cost: 600, kind: 'roll', blurb: '55% +15% | 30% +7% | 15% -6%', outcomes: [
      { max: 55, incomeMultiplier: 1.15, narrative: 'You lock a big deal. Cha‑ching.' },
      { max: 85, incomeMultiplier: 1.07, narrative: 'A couple good deals. Solid.' },
      { max: 100, incomeMultiplier: 0.94, narrative: 'Flaky brands waste your time. You reset.' }
    ] }
  ]
};

const COMPANY_POLICY_ACTIONS = {
  staffing: [
    { id: 'staff_budget', emoji: '💸', label: 'Hire Cheaper Employees', cost: 250, kind: 'policy', policyUpdate: { staffing: 'budget' }, incomeMultiplier: 1.03, blurb: 'Cheaper payroll, higher mistake risk.', narrative: 'Lower wages, faster hiring… but you\'ll need to supervise.' },
    { id: 'staff_balanced', emoji: '⚖️', label: 'Keep a Balanced Team', cost: 0, kind: 'policy', policyUpdate: { staffing: 'balanced' }, incomeMultiplier: 1.00, blurb: 'Steady and predictable.', narrative: 'You keep staffing sane and sustainable.' },
    { id: 'staff_premium', emoji: '💎', label: 'Hire Premium Employees', cost: 1200, kind: 'policy', policyUpdate: { staffing: 'premium' }, incomeMultiplier: 1.06, blurb: 'Costs more, smoother ops.', narrative: 'You pay for skill. Clients notice the difference.' }
  ],
  hiring: [
    { id: 'hiring_second_chance', emoji: '🤝', label: 'Second‑Chance Hiring (Convicts OK)', cost: 0, kind: 'policy', policyUpdate: { secondChanceHiring: true }, incomeMultiplier: 1.02, blurb: 'Risk: theft OR fierce loyalty.', narrative: 'You run a second‑chance program. High risk, high reward.' },
    { id: 'hiring_strict_checks', emoji: '🧾', label: 'Strict Background Checks', cost: 200, kind: 'policy', policyUpdate: { secondChanceHiring: false }, incomeMultiplier: 1.00, blurb: 'More stable, less drama.', narrative: 'You tighten screening and reduce surprise risk.' }
  ]
};

const STABILIZE_ACTION = {
  id: 'stabilize',
  emoji: '🧘',
  label: 'Stabilize',
  cost: 0,
  kind: 'roll',
  blurb: '75% hold | 25% -2%',
  outcomes: [
    { max: 75, incomeMultiplier: 1.00, narrative: 'You keep things steady. Nothing flashy, nothing broken.' },
    { max: 100, incomeMultiplier: 0.98, narrative: 'A small market dip. You tighten up and ride it out.' }
  ]
};

export default function SmallBusinessModal({ open, onClose }) {
  const { gameState, updateState, applyMoneyDelta, addLog, recordTimelineEntry, emitActionResult, unlockFinanceCollectible, getLocalAmount } = useGameState();

  const { businessAttempted, businessStatus, businessIdea, businessIdeaId, businessIncomePerYear, businessIncomeStartAge, businessManagedAge, businessSettings, money, runSeed, currentYear } = gameState;
  
  const [selectedIdeaId, setSelectedIdeaId] = React.useState('');
  const [investmentAmount, setInvestmentAmount] = React.useState(20000);
  const [showInvestmentPicker, setShowInvestmentPicker] = React.useState(false);

  // Reset investment picker when opening modal
  React.useEffect(() => {
    if (open && !businessAttempted) {
      setShowInvestmentPicker(false);
      setInvestmentAmount(20000);
    }
  }, [open, businessAttempted]);

  // Pick random default on mount
  React.useEffect(() => {
    if (!selectedIdeaId) {
      const randomIndex = Math.floor(Math.random() * BUSINESS_CATALOG.length);
      setSelectedIdeaId(BUSINESS_CATALOG[randomIndex].id);
    }
  }, [selectedIdeaId]);

  const selectedBusiness = BUSINESS_CATALOG.find(b => b.id === selectedIdeaId) || BUSINESS_CATALOG[0];
  const synergy = getBusinessCareerSynergy(gameState, selectedBusiness);
  const previewSuccessChance = computeBusinessSuccessChance(investmentAmount, synergy.bonus);

  // Active business (for the manage flow)
  const activeBusiness = getActiveBusinessFromState(gameState) || BUSINESS_CATALOG.find(b => b.label === businessIdea) || null;
  const activeBusinessLabel = activeBusiness?.label || businessIdea || 'Your Business';
  const activeBusinessEmoji = activeBusiness?.emoji || '💼';
  const manageActions = BUSINESS_MANAGEMENT_ACTIONS[activeBusiness?.id] || [];
  const normalizedBizSettings = normalizeBusinessSettings(businessSettings);
  const staffingLabel = STAFFING_LABELS[normalizedBizSettings.staffing] || 'Balanced Team';
  const hiringLabel = normalizedBizSettings.secondChanceHiring ? 'Second‑Chance Hiring: ON' : 'Background Checks: STRICT';
// Block body scroll when modal is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const rollBusinessOutcome = (invested, businessId) => {
    // Deterministic roll based on runSeed + age + idea + invested amount + attempt count.
    const attemptCount = (gameState.smallBusinessHistory || []).length;
    const seedStr = `${runSeed}|biz|age:${currentYear}|idea:${businessId}|invest:${invested}|attempt:${attemptCount}`;
    return seededRandom01(seedStr); // 0..1
  };

  const handleStartBusiness = () => {
  const localInvestment = getLocalAmount(investmentAmount);
  if (money < localInvestment) {
    toast('Not enough money to invest.', { icon: '💼' });
    return;
  }

  const biz = selectedBusiness || BUSINESS_CATALOG[0];
  const ideaLabel = biz.label;

  const { bonus: careerBonus, totalYears, tierLabel } = synergy || { bonus: 0, totalYears: 0, tierLabel: null };

  // Calculate success chance based on investment + career synergy
  const successChance = computeBusinessSuccessChance(investmentAmount, careerBonus);

  // Roll outcome (deterministic)
  const roll = rollBusinessOutcome(investmentAmount, biz.id);

  let status = 'failed';
  let netProfit = 0;
  let outcomeDetail = '';
  let actualMoneyDelta = 0;

  if (roll < successChance) {
    // SUCCESS: profit 10%-60% ROI
    status = 'success';

    // NOTE: profit size is intentionally not deterministic; only the win/lose roll is deterministic.
    const profitMultiplier = 0.10 + (Math.random() * 0.50); // 0.10 to 0.60
    netProfit = Math.round(investmentAmount * profitMultiplier);
    actualMoneyDelta = netProfit;

    // Also award ongoing income for major successes
    let income = 0;
    if (profitMultiplier >= 0.45) {
      income = Math.round(investmentAmount * 0.20);
      outcomeDetail = `It becomes a major success! You earned $${formatMoney(getLocalAmount(netProfit))} profit, plus +$${formatMoney(getLocalAmount(income))}/year ongoing.`;
    } else {
      outcomeDetail = `It works! You earned $${formatMoney(getLocalAmount(netProfit))} profit.`;
    }

    // Persist business only for major successes (same rule as before, just clearer + bug-fixed status)
    updateState(prev => ({
      businessAttempted: income > 0,
      businessStatus: income > 0 ? 'major_success' : 'success',
      businessIncomePerYear: income > 0 ? income : 0,
      businessIncomeStartAge: income > 0 ? currentYear + 1 : null,
      // Prevent managing on the same year you launch
      businessManagedAge: income > 0 ? currentYear : null,
      businessIdea: ideaLabel,
      businessIdeaId: biz.id,
      businessSettings: income > 0 ? { ...DEFAULT_BUSINESS_SETTINGS } : null
    }));
  } else {
    // FAIL: lose 40%-100% of investment
    status = 'failed';
    const lossMultiplier = 0.40 + (Math.random() * 0.60); // 0.40 to 1.00
    const loss = Math.round(investmentAmount * lossMultiplier);
    actualMoneyDelta = -loss;
    outcomeDetail = `It doesn't take off. You lost $${formatMoney(getLocalAmount(loss))}.`;

    // Record the failed attempt status so the UI can show "previous attempt didn't work out"
    updateState({
      businessAttempted: false,
      businessStatus: 'failed',
      businessIncomePerYear: 0,
      businessIncomeStartAge: null,
      businessManagedAge: null,
      businessIdea: ideaLabel,
      businessIdeaId: biz.id,
      businessSettings: null
    });
  }

  const actualMoneyDeltaLocal = getLocalAmount(actualMoneyDelta);

  // Apply money change
  applyMoneyDelta(actualMoneyDeltaLocal, { title: "Small Business Attempt", category: "business" });

  // Record attempt history
  updateState(prev => ({
    smallBusinessHistory: [
      ...(prev.smallBusinessHistory || []),
      { age: currentYear, invested: investmentAmount, outcome: status, netProfit: actualMoneyDeltaLocal, businessId: biz.id, idea: ideaLabel }
    ]
  }));

  addLog(`💼 Small business attempt: ${ideaLabel}.`);

  // Unlock collectible on first attempt
  if (!(gameState.smallBusinessHistory || []).length) {
    try { unlockFinanceCollectible?.('business_license', `Started: ${ideaLabel}`); } catch {}
  }

  const careerLine = careerBonus > 0
    ? `Career bonus: +${prettyPct(careerBonus)} (${totalYears} years • ${tierLabel || 'Experienced'})

`
    : '';

  emitActionResult({
    actionId: 'business',
    title: `💼 Small Business: ${ideaLabel}`,
    body: `Invested: $${formatMoney(getLocalAmount(investmentAmount))}

${careerLine}${outcomeDetail}`,
    deltas: {},
    loveDelta: 0,
    stressDelta: 0,
    moneyDelta: actualMoneyDeltaLocal,
    focusDelta: 0,
    tags: ['finance', 'business'],
    meta: { emoji: '💼', idea: ideaLabel, businessId: biz.id, status, invested: investmentAmount, netProfit: actualMoneyDeltaLocal, careerBonus }
  });

  recordTimelineEntry({
    kind: 'finance',
    title: `💼 Small Business: ${ideaLabel}`,
    detail: `${careerLine}${outcomeDetail}`.trim(),
    deltas: null,
    moneyDelta: actualMoneyDeltaLocal,
    loveDelta: 0,
    stressDelta: 0,
    meta: { businessAttempt: true, invested: investmentAmount, outcome: status, businessId: biz.id }
  });

  onClose();
};
  
  const handleManageBusiness = (action) => {
    const activeBiz = activeBusiness || BUSINESS_CATALOG.find(b => b.label === businessIdea) || BUSINESS_CATALOG[0];
    const bizLabel = activeBiz?.label || businessIdea || 'Your Business';
    const bizId = activeBiz?.id || businessIdeaId || 'unknown';

    const settingsNow = normalizeBusinessSettings(businessSettings);
    const willUpdateSettings = (action?.kind === 'policy');
    const nextSettings = willUpdateSettings ? { ...settingsNow, ...(action.policyUpdate || {}) } : settingsNow;

    const costBase = Number(action.cost || 0);
    const localCost = getLocalAmount(costBase);

    if (money < localCost) {
      addLog(`💼 Not enough money to manage: ${action.label}`);
      return;
    }

    // Pay the management cost (localized)
    if (localCost > 0) {
      applyMoneyDelta(-localCost, `Business: ${action.label}`);
    }

    const roundIncome = (val) => Math.round(Number(val || 0) / 50) * 50;
    const applyMult = (income, mult) => roundIncome(Number(income || 0) * Number(mult || 1));

    let narrative = action.narrative || '';
    let newIncome = Number(businessIncomePerYear || 0);
    let extraMoneyDeltaBase = 0;
    const sideNotes = [];

    // Resolve the action outcome (deterministic per runSeed/year/action)
    const seedBase = `${runSeed}|biz_manage|age:${currentYear}|biz:${bizId}|action:${action.id}`;
    const roll100 = Math.floor(seededRandom01(seedBase) * 100) + 1;

    if (action.kind === 'roll') {
      const outcomes = Array.isArray(action.outcomes) ? action.outcomes : [];
      const chosen = outcomes.find(o => roll100 <= Number(o.max || 0)) || outcomes[outcomes.length - 1];
      if (chosen) {
        newIncome = applyMult(newIncome, chosen.incomeMultiplier ?? 1);
        narrative = chosen.narrative || narrative || 'You make a move.';
      }
    } else {
      newIncome = applyMult(newIncome, action.incomeMultiplier ?? 1);
      narrative = narrative || 'You make a move.';
    }

    // Apply ongoing "company settings" flavor (risk/reward) — but not on the same year you change policy
    if (!willUpdateSettings) {
      // Staffing effects
      if (nextSettings.staffing === 'budget') {
        const r = Math.floor(seededRandom01(`${seedBase}|staff_budget`) * 100) + 1;
        if (r <= 22) {
          newIncome = applyMult(newIncome, 0.94);
          extraMoneyDeltaBase -= 350;
          sideNotes.push('Budget hires cut corners → refunds + rework.');
        }
      } else if (nextSettings.staffing === 'premium') {
        const r = Math.floor(seededRandom01(`${seedBase}|staff_premium`) * 100) + 1;
        if (r <= 25) {
          newIncome = applyMult(newIncome, 1.05);
          sideNotes.push('Premium team overdelivers → 5‑star reviews.');
        }
      }

      // Second‑chance hiring (convicts OK): theft OR fierce loyalty
      if (nextSettings.secondChanceHiring) {
        const r = Math.floor(seededRandom01(`${seedBase}|second_chance`) * 100) + 1;
        if (r <= 35) {
          newIncome = applyMult(newIncome, 0.95);
          extraMoneyDeltaBase -= 800;
          sideNotes.push('Second‑chance hire steals supplies… rough.');
        } else {
          newIncome = applyMult(newIncome, 1.06);
          sideNotes.push('Second‑chance hire becomes fiercely loyal. Big win.');
        }
      }
    }

    const extraMoneyDeltaLocal = getLocalAmount(extraMoneyDeltaBase);
    if (extraMoneyDeltaLocal !== 0) {
      applyMoneyDelta(extraMoneyDeltaLocal, 'Business incident');
    }

    updateState({
      businessIncomePerYear: newIncome,
      businessManagedAge: currentYear,
      businessSettings: nextSettings
    });

    const totalMoneyDelta = (-localCost) + extraMoneyDeltaLocal;
    const incomeLocal = getLocalAmount(newIncome);

    addLog(`💼 Business managed: ${action.label} → ${narrative}`);

    recordTimelineEntry({
      age: currentYear,
      kind: 'finance',
      title: `💼 Business: ${bizLabel} — ${action.label}`,
      detail: `${narrative}${sideNotes.length ? ` (${sideNotes.join(' ')})` : ''} New income: +$${formatMoney(incomeLocal)}/year.`,
      deltas: null,
      moneyDelta: totalMoneyDelta,
      loveDelta: 0,
      stressDelta: 0,
      meta: {
        businessId: bizId,
        managementChoice: action.id,
        newIncome,
        staffing: nextSettings.staffing,
        secondChanceHiring: nextSettings.secondChanceHiring
      }
    });

    onClose();
  };

  const getStatusDisplay = () => {
    const localIncome = getLocalAmount(businessIncomePerYear);
    switch (businessStatus) {
      case 'failed': return 'Failed';
      case 'side_gig': return `Side Gig (+$${formatMoney(localIncome)}/year)`;
      case 'success': return `Success (+$${formatMoney(localIncome)}/year)`;
      case 'major_success': return `Major Success (+$${formatMoney(localIncome)}/year)`;
      default: return 'Unknown';
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
                <h3 className="text-xl font-bold text-slate-800">💼 Small Business</h3>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-4 space-y-4">
                {!businessAttempted || businessStatus === 'failed' ? (
                  <>
                    {businessStatus === 'failed' && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                        The previous attempt didn't work out. You can try again with a new investment.
                      </div>
                    )}

                    {!showInvestmentPicker ? (
                      <>
                        {/* Info */}
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                          <h4 className="font-semibold text-amber-900 mb-2">Investment: $20,000 - $100,000</h4>
                          <div className="text-sm text-amber-800 space-y-1">
                            <div>Higher investment = better success odds + higher profit potential</div>
                            <div className="mt-2 space-y-0.5 text-xs">
                              <div>• Base success: 35%</div>
                              <div>• Max success (100k): 60% (before career bonus)</div>
                              <div>• Career bonus tiers: 5y +6% • 10y +12% • 15y +18% • 20y +25%</div>
                              <div>• If successful: 10%-60% ROI</div>
                              <div>• If failed: lose 40%-100%</div>
                            </div>
                          </div>
                        </div>

                        {/* Idea selector */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Choose a business idea:
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {BUSINESS_CATALOG.map((idea) => (
                              <button
                                key={idea.id}
                                onClick={() => setSelectedIdeaId(idea.id)}
                                className={`p-3 rounded-lg border-2 transition-all text-left ${
                                  selectedIdeaId === idea.id
                                    ? 'border-amber-500 bg-amber-50'
                                    : 'border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <div className="text-2xl mb-1">{idea.emoji}</div>
                                <div className="text-xs font-medium text-slate-700">{idea.label}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Selected idea details */}
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{selectedBusiness.emoji}</span>
                            <div className="font-semibold text-slate-800 text-sm">{selectedBusiness.label}</div>
                          </div>
                          <div className="text-xs text-slate-600 mt-1">{selectedBusiness.desc}</div>

                          <div className="text-xs text-slate-600 mt-2">
                            <span className="font-medium text-slate-700">Related careers:</span>{' '}
                            {selectedBusiness.relatedJobIds
                              .map(id => getJobById(id)?.title)
                              .filter(Boolean)
                              .join(', ')}
                          </div>

                          {synergy.bonus > 0 ? (
                            <>
                              <div className="text-xs text-emerald-700 mt-2">
                                Your experience: {synergy.totalYears} years → +{Math.round(synergy.bonus * 100)}% success chance
                              </div>
                              {synergy.breakdown.length > 0 && (
                                <div className="text-xs text-slate-600 mt-1">
                                  Relevant experience: {synergy.breakdown.map(b => `${b.title} ${b.years}y`).join(' • ')}
                                </div>
                              )}
                              <div className="text-xs text-slate-600 mt-1">
                                Bonus tiers: 5y +6% • 10y +12% • 15y +18% • 20y +25%
                              </div>
                            </>
                          ) : (
                            <div className="text-xs text-slate-500 mt-2">
                              No career bonus yet (0 years in related careers).
                            </div>
                          )}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-2">
                          <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => setShowInvestmentPicker(true)}
                            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                          >
                            Choose Investment
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Investment Amount Picker */}
                        <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700">Investment Amount</span>
                            <span className="text-lg font-bold text-slate-800">${formatMoney(getLocalAmount(investmentAmount))}</span>
                          </div>

                          <input
                            type="range"
                            min="20000"
                            max="100000"
                            step="10000"
                            value={investmentAmount}
                            onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                            className="w-full"
                          />

                          <div className="flex justify-between text-xs text-slate-500">
                            <span>$20k</span>
                            <span>$100k</span>
                          </div>

                          <div className="mt-2 space-y-1 text-xs text-slate-600">
                            <div>Success chance: ~{Math.round(previewSuccessChance * 100)}%</div>
                            <div className="text-slate-500">Cash on hand: ${formatMoney(money)}</div>
                          </div>
                        </div>

                        {/* Money warning */}
                        {money < getLocalAmount(investmentAmount) && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                            Not enough money. You need ${formatMoney(getLocalAmount(investmentAmount))}.
                          </div>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-3 pt-2">
                          <Button
                            variant="outline"
                            onClick={() => setShowInvestmentPicker(false)}
                            className="flex-1"
                          >
                            Back
                          </Button>
                          <Button
                            onClick={handleStartBusiness}
                            disabled={money < getLocalAmount(investmentAmount)}
                            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                          >
                            Invest ${formatMoney(getLocalAmount(investmentAmount))}
                          </Button>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {/* MANAGE FLOW */}
                    <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-sm text-slate-600">Business:</span>
                          <div className="font-semibold text-slate-800 mt-1">{activeBusinessEmoji} {activeBusinessLabel}</div>
                          <div className="text-xs text-slate-600 mt-1">
                            Staffing: <span className="font-medium text-slate-700">{staffingLabel}</span> • {hiringLabel}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-slate-600">Income:</span>
                          <div className="font-medium text-emerald-700 mt-1">+${formatMoney(getLocalAmount(businessIncomePerYear))}/year</div>
                        </div>
                      </div>
                    </div>

                    {businessManagedAge === currentYear ? (
                      <>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                          {Number(businessIncomeStartAge) === Number(currentYear) + 1
                            ? 'You launched your business this year. You can manage it starting next year.'
                            : 'You already managed your business this year.'}
                        </div>
                        
                        <Button onClick={onClose} variant="outline" className="w-full mt-4">
                          Close
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="text-sm text-slate-600">
                          Choose one action this year to influence your business income:
                        </div>
                        <div className="space-y-3">
                          {/* Business moves */}
                          <div>
                            <div className="text-xs font-semibold text-slate-700 mb-2">This year's move</div>
                            <div className="space-y-2">
                              {manageActions.map((action) => {
                                const localCost = getLocalAmount(action.cost || 0);
                                const disabled = money < localCost;
                                return (
                                  <button
                                    key={action.id}
                                    onClick={() => handleManageBusiness(action)}
                                    disabled={disabled}
                                    className="w-full text-left p-3 rounded-lg border-2 border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                  >
                                    <div className="font-semibold text-slate-800 text-sm">
                                      {action.emoji} {action.label} {action.cost > 0 ? `($${formatMoney(localCost)})` : '(Free)'}
                                    </div>
                                    <div className="text-xs text-slate-600 mt-1">{action.blurb}</div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Company settings */}
                          <div>
                            <div className="text-xs font-semibold text-slate-700 mb-2">Company settings</div>

                            <div className="space-y-2">
                              {COMPANY_POLICY_ACTIONS.staffing.map((action) => {
                                const localCost = getLocalAmount(action.cost || 0);
                                const isCurrent = action.policyUpdate?.staffing === normalizedBizSettings.staffing;
                                const disabled = isCurrent || (money < localCost);
                                return (
                                  <button
                                    key={action.id}
                                    onClick={() => handleManageBusiness(action)}
                                    disabled={disabled}
                                    className="w-full text-left p-3 rounded-lg border-2 border-slate-200 bg-white hover:border-purple-400 hover:bg-purple-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                  >
                                    <div className="font-semibold text-slate-800 text-sm">
                                      {action.emoji} {action.label} {action.cost > 0 ? `($${formatMoney(localCost)})` : '(Free)'} {isCurrent ? '✓ Current' : ''}
                                    </div>
                                    <div className="text-xs text-slate-600 mt-1">{action.blurb}</div>
                                  </button>
                                );
                              })}
                            </div>

                            <div className="space-y-2 mt-2">
                              {COMPANY_POLICY_ACTIONS.hiring.map((action) => {
                                const localCost = getLocalAmount(action.cost || 0);
                                const isCurrent = action.policyUpdate?.secondChanceHiring === normalizedBizSettings.secondChanceHiring;
                                const disabled = isCurrent || (money < localCost);
                                return (
                                  <button
                                    key={action.id}
                                    onClick={() => handleManageBusiness(action)}
                                    disabled={disabled}
                                    className="w-full text-left p-3 rounded-lg border-2 border-slate-200 bg-white hover:border-purple-400 hover:bg-purple-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                  >
                                    <div className="font-semibold text-slate-800 text-sm">
                                      {action.emoji} {action.label} {action.cost > 0 ? `($${formatMoney(localCost)})` : '(Free)'} {isCurrent ? '✓ Current' : ''}
                                    </div>
                                    <div className="text-xs text-slate-600 mt-1">{action.blurb}</div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Stabilize */}
                          <div>
                            <div className="text-xs font-semibold text-slate-700 mb-2">Keep it steady</div>
                            <button
                              onClick={() => handleManageBusiness(STABILIZE_ACTION)}
                              className="w-full text-left p-3 rounded-lg border-2 border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50 transition-all"
                            >
                              <div className="font-semibold text-slate-800 text-sm">{STABILIZE_ACTION.emoji} {STABILIZE_ACTION.label} (Free)</div>
                              <div className="text-xs text-slate-600 mt-1">{STABILIZE_ACTION.blurb}</div>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                    
                    <Button onClick={onClose} variant="outline" className="w-full mt-4">
                      Close
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}