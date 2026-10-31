import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ArrowLeft, Sparkles, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useGameState } from '@/components/game/GameStateContext';
import { DEFAULT_LIVING_SETUP, getOwnedCarItem, getOwnedHomeItem, getOwnedMotorcycleItem, resolveCommuteForState, resolveHousingForState } from '@/components/game/livingConfig';

const TOUR_STEPS = [
  {
    id: "moment",
    title: "A Moment Arrives",
    emoji: "✨",
    scene: "It's late. Your child hovers in the doorway like they're about to ask for permission to breathe.\n\nThey finally whisper: \"Can we talk?\"\n\nHow do you respond?",
    whatItMeans: [
      "Every age, you get 1 major moment like this",
      "Your choice affects 4 core stats: Intelligence, Empathy, Discipline, Confidence",
      "It also affects your relationship (LOVE) and your stress level"
    ],
    tryThis: [
      "Read the moment carefully",
      "Each option shows a different parenting approach",
      "There's no single 'right' answer—just tradeoffs"
    ],
    mockUIType: "scenario",
    whereToFind: "These moments appear automatically each year. They'll block Age Up until you respond."
  },
  {
    id: "tutoring",
    title: "You Can Tutor",
    emoji: "📚",
    scene: "Your child is struggling with schoolwork. You can help directly, or hire outside support.",
    whatItMeans: [
      "Parent Tutoring: Costs 1 Focus (your time), boosts 1 stat",
      "Hire a Tutor: Costs money ($1,800/year), boosts 1 stat yearly",
      "Both work—pick based on your Focus vs Money budget"
    ],
    tryThis: [
      "Parent tutoring is intimate but draining",
      "Paid tutors are hands-off but expensive",
      "Mix and match based on your household situation"
    ],
    mockUIType: "tutoring",
    whereToFind: "In-game: tap Actions (⚡) → Tutor. Or open Life Hub → Support."
  },
  {
    id: "realEstate",
    title: "Buy, Rent, Sell Properties",
    emoji: "🏠",
    scene: "A property listing catches your eye: a small cabin near the lake. $85,000. Could be a rental. Could be a long-term hold.",
    whatItMeans: [
      "Buy properties with cash or mortgage (down payment + interest)",
      "Rent them out for yearly income (passive money each age)",
      "Sell later for profit—or loss (market changes, selling has fees)"
    ],
    tryThis: [
      "Check cashflow before buying (mortgage + maintenance + taxes)",
      "Don't over-leverage—debt compounds fast",
      "Selling isn't free—closing costs eat into profit"
    ],
    mockUIType: "realEstate",
    whereToFind: "In-game: tap Actions (⚡) → Real Estate. Buy, manage, and sell properties from the same menu."
  },
  {
    id: "relationships",
    title: "Relationships Matter",
    emoji: "💕",
    scene: "Your partner texts: \"Date night this weekend?\"\n\nYour relationship meter is at 72/100. Small gestures compound over time.",
    whatItMeans: [
      "If partnered: nurture the relationship (date nights, gifts, harmony)",
      "If single: you may get date invites or pursue relationships later",
      "Strong partnerships give passive bonuses; neglected ones cause stress"
    ],
    tryThis: [
      "Check the Relationships panel regularly",
      "Date nights cost money + Focus but boost relationship health",
      "Your child's adulthood outcomes can include marriage/partnering"
    ],
    mockUIType: "relationship",
    whereToFind: "In-game: tap Actions (⚡) → Date (if partnered). Or open Life Hub → Relationships."
  },
  {
    id: "promRoyalty",
    title: "Big Milestones (Prom Royalty)",
    emoji: "👑",
    scene: "The gym erupts. Your child's name is called: Prom Queen.\n\nEmpathy 90+. Confidence 90+. Years of being solid to people.",
    whatItMeans: [
      "Prom Queen/King (Prom Royalty) is RARE and HARD",
      "Requires extreme empathy (90+) AND extreme confidence (90+) at age 18",
      "It's a reward for intentional, balanced parenting over 18 years"
    ],
    tryThis: [
      "Focus on empathy + confidence throughout the run",
      "Use Bond actions, Study modules, and careful scenario choices",
      "It's okay if you don't get it—it's meant to be elite"
    ],
    mockUIType: "prom",
    whereToFind: "This is automatic at age 18 if your child meets the stat thresholds."
  },
  {
    id: "ending",
    title: "The Ending Letter",
    emoji: "💌",
    scene: "\"Dear Mom,\n\nI felt loved more often than not, and that gave me a base to stand on...\"\n\n(The letter continues.)",
    whatItMeans: [
      "At the end, you get a letter from your adult child",
      "It reflects your parenting style, their outcomes, and your relationship",
      "Career, relationships, family, happiness—all shaped by your choices"
    ],
    tryThis: [
      "Play multiple runs to see different outcomes",
      "Try different parenting approaches (strict vs warm vs mixed)",
      "The ending is the payoff—it's designed to feel real"
    ],
    mockUIType: "letter",
    whereToFind: "This appears automatically when your child reaches adulthood (age 18+)."
  }
];

export default function HowToPlay() {
  const navigate = useNavigate();
  const [tourOpen, setTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const { gameState, updateState } = useGameState();

  const ownedHome = getOwnedHomeItem(gameState);
  const ownedCar = getOwnedCarItem(gameState);
  const ownedMotorcycle = getOwnedMotorcycleItem(gameState);
  const currentSetup = gameState?.livingSetup || DEFAULT_LIVING_SETUP;
  const currentHousing = resolveHousingForState(gameState, currentSetup.housingId || DEFAULT_LIVING_SETUP.housingId);
  const currentCommute = resolveCommuteForState(gameState, currentSetup.commuteId || DEFAULT_LIVING_SETUP.commuteId);

  const currentStep = TOUR_STEPS[tourStep] || TOUR_STEPS[0];
  const isFirstStep = tourStep === 0;
  const isLastStep = tourStep === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      setTourOpen(false);
      setTourStep(0);
    } else {
      setTourStep(tourStep + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setTourStep(tourStep - 1);
    }
  };

  const handleSkip = () => {
    setTourOpen(false);
    setTourStep(0);
  };

  const renderMockUI = (type) => {
    if (type === "scenario") {
      return (
        <div className="space-y-2">
          <button className="w-full text-left p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 hover:border-green-300 transition-colors">
            <div className="flex items-start gap-2">
              <span className="text-xl">🫶</span>
              <div>
                <div className="font-semibold text-slate-800 text-sm">Connect with empathy</div>
                <div className="text-xs text-slate-600 mt-0.5">You validate their feelings and stay close.</div>
              </div>
            </div>
          </button>
          <button className="w-full text-left p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-300 transition-colors">
            <div className="flex items-start gap-2">
              <span className="text-xl">🧱</span>
              <div>
                <div className="font-semibold text-slate-800 text-sm">Set a boundary</div>
                <div className="text-xs text-slate-600 mt-0.5">You hold a calm limit and follow through.</div>
              </div>
            </div>
          </button>
          <button className="w-full text-left p-3 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 hover:border-amber-300 transition-colors">
            <div className="flex items-start gap-2">
              <span className="text-xl">📚</span>
              <div>
                <div className="font-semibold text-slate-800 text-sm">Teach a skill</div>
                <div className="text-xs text-slate-600 mt-0.5">You coach them through it with patience.</div>
              </div>
            </div>
          </button>
        </div>
      );
    }

    if (type === "tutoring") {
      return (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-slate-800">👨‍🏫 Parent Tutoring</div>
              <div className="text-xs font-medium text-blue-700">Costs 1 Focus</div>
            </div>
            <div className="text-xs text-slate-600">You help directly. Intimate, draining, effective.</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-slate-800">💸 Hire a Tutor (Yearly)</div>
              <div className="text-xs font-medium text-green-700">Costs $1,800/year</div>
            </div>
            <div className="text-xs text-slate-600">Hands-off support. Expensive but steady.</div>
          </div>
        </div>
      );
    }

    if (type === "realEstate") {
      return (
        <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-blue-200">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="font-bold text-slate-900 text-lg">🏡 Lakeside Cabin</div>
              <div className="text-xs text-slate-600 mt-1">2BR • 1BA • Vacation Rental Potential</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-green-700">$85,000</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded bg-white/60">
              <div className="text-slate-500">Down Payment (20%)</div>
              <div className="font-semibold text-slate-800">$17,000</div>
            </div>
            <div className="p-2 rounded bg-white/60">
              <div className="text-slate-500">Est. Rent/Year</div>
              <div className="font-semibold text-green-700">+$8,500</div>
            </div>
            <div className="p-2 rounded bg-white/60">
              <div className="text-slate-500">Mortgage/Year</div>
              <div className="font-semibold text-red-700">-$5,200</div>
            </div>
            <div className="p-2 rounded bg-white/60">
              <div className="text-slate-500">Maintenance</div>
              <div className="font-semibold text-amber-700">-$850/yr</div>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg">
              Buy & Rent Out
            </button>
            <button className="flex-1 px-3 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg">
              Buy & Hold
            </button>
          </div>
          <div className="mt-2 text-xs text-slate-500 italic">
            Later: you can sell for profit (or loss). Selling has fees.
          </div>
        </div>
      );
    }

    if (type === "relationship") {
      return (
        <div className="p-4 rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💑</span>
              <div>
                <div className="font-bold text-slate-900">Partner</div>
                <div className="text-xs text-slate-600">Meter: 72/100</div>
              </div>
            </div>
            <div className="text-xs text-slate-500">Strong</div>
          </div>
          <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-pink-400 to-rose-400" style={{ width: '72%' }} />
          </div>
          <div className="mt-3">
            <button className="w-full px-3 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-medium rounded-lg">
              💕 Date Night ($150 • 1 Focus)
            </button>
          </div>
          <div className="mt-2 text-xs text-slate-600">
            Strong partnerships give passive bonuses. Neglected ones cause stress + child stat penalties.
          </div>
        </div>
      );
    }

    if (type === "prom") {
      return (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-100 via-pink-100 to-amber-100 border-2 border-purple-300">
          <div className="text-center">
            <div className="text-5xl mb-3">👑</div>
            <div className="text-2xl font-bold text-purple-900 mb-2">Prom Queen</div>
            <div className="text-sm text-slate-700 leading-relaxed">
              The gym erupts. With empathy that makes people feel seen and confidence that doesn't need to bully, they win Prom Queen.
            </div>
            <div className="mt-4 text-xs text-purple-800 font-medium">
              Requirements: Empathy 90+ • Confidence 90+ • Age 18
            </div>
            <div className="mt-2 text-xs text-slate-600 italic">
              This is rare and hard. It's okay if you don't get it.
            </div>
          </div>
        </div>
      );
    }

    if (type === "letter") {
      return (
        <div className="p-5 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
          <div className="text-xs uppercase tracking-wide text-amber-700 mb-2">Preview</div>
          <div className="font-serif text-slate-800 text-sm leading-relaxed space-y-2">
            <p className="font-semibold">Dear Mom,</p>
            <p>I felt loved more often than not, and that gave me a base to stand on.</p>
            <p>You taught me empathy, even when it was messy. The cost was boundaries—I had to learn that part later.</p>
            <p className="text-xs text-slate-500 italic">(The letter continues with career, relationships, family, and visits...)</p>
          </div>
          <div className="mt-3 pt-3 border-t border-amber-200">
            <div className="text-xs text-slate-600">
              ✨ The ending reflects your choices, their outcomes, and your relationship over 18 years.
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/30 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8"
      >
        {/* Back Button */}
        <button
          onClick={() => navigate(createPageUrl('Start'))}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        {/* Title */}
        <h1 className="text-3xl font-bold text-slate-900 mb-6">How to Play</h1>

        {/* Guided Tour Button */}
        <div className="mb-6">
          <Button
            onClick={() => setTourOpen(true)}
            className="w-full h-12 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" />
            Start Guided Tour (6 steps)
          </Button>
        </div>

        {/* Quick: Stop renting (use owned home/car) */}
        <div className="mb-6 bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="text-sm font-bold text-slate-800">🏠 Stop Renting</div>
          <div className="text-xs text-slate-600 mt-1">
            If you've bought a home or car in the Shop, switch to it here (or in Actions → Quality of Life) to stop paying rental costs.
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Current: {currentHousing?.emoji} {currentHousing?.label} • {currentCommute?.emoji} {currentCommute?.label}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
            <Button
              type="button"
              variant="outline"
              disabled={!ownedHome}
              onClick={() => {
                if (!ownedHome) return;
                updateState(prev => ({
                  ...prev,
                  livingSetup: {
                    ...(prev.livingSetup || DEFAULT_LIVING_SETUP),
                    housingId: 'owned_home'
                  }
                }));
                toast.success('Now using your owned home.');
              }}
              className="justify-start"
            >
              {ownedHome ? `Use Home: ${ownedHome?.name || 'Owned'}` : 'Use your owned home (locked)'}
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={!ownedCar && !ownedMotorcycle}
              onClick={() => {
                if (ownedCar) {
                  updateState(prev => ({
                    ...prev,
                    livingSetup: {
                      ...(prev.livingSetup || DEFAULT_LIVING_SETUP),
                      commuteId: 'car'
                    }
                  }));
                  toast.success('Now using your owned car.');
                  return;
                }
                if (ownedMotorcycle) {
                  updateState(prev => ({
                    ...prev,
                    livingSetup: {
                      ...(prev.livingSetup || DEFAULT_LIVING_SETUP),
                      commuteId: 'motorcycle'
                    }
                  }));
                  toast.success('Now using your motorcycle.');
                }
              }}
              className="justify-start"
            >
              {ownedCar
                ? `Use Car: ${ownedCar?.name || 'Owned'}`
                : ownedMotorcycle
                  ? `Use Motorcycle: ${ownedMotorcycle?.name || 'Owned'}`
                  : 'Use your owned car (locked)'}
            </Button>
          </div>
        </div>

        {/* Body Text */}
        <div className="space-y-6 text-slate-700 leading-relaxed">
          {/* Section A: Core Loop */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-2xl">✨</span>
              The Core Loop
            </h2>
            <div className="space-y-3 text-sm">
              <p>
                Each year, you get <strong>1 major moment</strong>. Your child faces a challenge, and you choose how to respond.
              </p>
              <p>
                Your choice affects <strong>4 core stats</strong> (Intelligence, Empathy, Discipline, Confidence), your <strong>relationship</strong> (LOVE), and your <strong>stress level</strong>.
              </p>
              <p>
                After you've used your resources (Focus + Money), you <strong>Age Up</strong> and the cycle repeats.
              </p>
              <p className="text-xs text-slate-500 italic">
                You can't do everything. That's the point. Focus vs Money tradeoffs are constant.
              </p>
            </div>
          </section>

          {/* Section B: Main Tools */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-2xl">📚</span>
              Your Main Tools
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">Tutoring (2 types)</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-600 ml-2">
                  <li><strong>Parent Tutoring:</strong> Costs 1 Focus. You help directly. Intimate but draining.</li>
                  <li><strong>Hire a Tutor:</strong> Costs $1,800/year. Hands-off but expensive.</li>
                </ul>
                <p className="text-xs text-slate-500 mt-2">
                  📍 Where: Actions (⚡) → Tutor
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">Actions (Bond, Play, Study, etc.)</h3>
                <p className="text-slate-600">
                  Most actions cost <strong>1 Focus</strong>. Use them to build stats, reduce stress, or strengthen your relationship.
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  📍 Where: Actions tab (⚡) in-game
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-800 mb-1">Study (Unlock Better Options)</h3>
                <p className="text-slate-600">
                  Study parenting frameworks (NVC, co-regulation, boundaries). Unlocked techniques improve your scenario choices.
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  📍 Where: Actions (⚡) → Study
                </p>
              </div>
            </div>
          </section>

          {/* Section C: Real Estate */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-2xl">🏠</span>
              Real Estate (Buy, Rent, Sell)
            </h2>
            <div className="space-y-3 text-sm">
              <p>
                You can <strong>buy properties</strong> (cash or mortgage), <strong>rent them out</strong> for yearly income, and <strong>sell later</strong> for profit—or loss.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h3 className="font-semibold text-slate-800 mb-2">Key mechanics:</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-600 ml-2">
                  <li>Down payment (usually 20%) required</li>
                  <li>Mortgages have interest + yearly payments</li>
                  <li>Rental income is passive (paid yearly)</li>
                  <li>Maintenance + taxes eat into profit</li>
                  <li>Selling has closing costs (not free money)</li>
                  <li>Market changes—prices go up AND down</li>
                </ul>
              </div>
              <p className="text-xs text-slate-500 italic">
                Real estate can be a powerful wealth-builder, but it's not risk-free. Check cashflow before buying.
              </p>
              <p className="text-xs text-slate-500 mt-2">
                📍 Where: Actions (⚡) → Real Estate
              </p>
            </div>
          </section>

          {/* Section D: Relationships */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-2xl">💕</span>
              Relationships + Marriage/Partnering
            </h2>
            <div className="space-y-3 text-sm">
              <p>
                If you're in a <strong>two-parent household</strong>, you have a partner from the start. Nurture the relationship with date nights, gifts, and co-parent harmony.
              </p>
              <p>
                If you're <strong>single</strong>, you may get random date invites or pursue relationships later via the Dating App.
              </p>
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
                <h3 className="font-semibold text-slate-800 mb-1">Why it matters:</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-600 ml-2">
                  <li>Strong partnerships (80+ meter) give yearly bonuses to your child's stats</li>
                  <li>Weak partnerships add stress + child stat penalties</li>
                  <li>Your child's adulthood outcomes can include being married/partnered</li>
                </ul>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                📍 Where: Actions (⚡) → Date | Life Hub → Relationships
              </p>
            </div>
          </section>

          {/* Section E: Big Milestones */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-2xl">👑</span>
              Big Milestones + Story Payoff
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">Prom Queen / Prom King (Prom Royalty)</h3>
                <p className="text-slate-600">
                  At age 18, if your child has <strong>Empathy 90+</strong> AND <strong>Confidence 90+</strong>, they can win Prom Royalty.
                </p>
                <p className="text-xs text-amber-700 font-medium mt-1">
                  ⚠️ This is intentionally rare and hard. It's a reward for elite, balanced parenting.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-800 mb-1">The Ending Letter</h3>
                <p className="text-slate-600">
                  When your child reaches adulthood, you receive a <strong>letter from them</strong> reflecting on your parenting, their outcomes, and your relationship.
                </p>
                <p className="text-slate-600 mt-1">
                  Career, relationships, family, happiness, retirement—all shaped by your choices.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-slate-700 italic">
                  💡 Play multiple runs to see different outcomes. Try strict vs warm vs mixed parenting styles. The ending is designed to feel real.
                </p>
              </div>
            </div>
          </section>

          {/* Quick Tips */}
          <section className="pt-4 border-t border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-2">Quick Tips</h3>
            <ul className="space-y-1 text-xs text-slate-600">
              <li>• Studying unlocks better scenario options</li>
              <li>• Bonding builds love—love builds visits later</li>
              <li>• Debt is allowed, but compounds at 25% APR yearly</li>
              <li>• Your parenting style gets tracked (warmth vs structure)</li>
              <li>• Family Patterns (if selected) add realism + challenge</li>
            </ul>
          </section>
        </div>

        {/* Small Note */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            This experience is designed for adults and includes emotionally realistic outcomes.
          </p>
        </div>

        {/* Bottom Button */}
        <div className="mt-6">
          <Button
            onClick={() => navigate(createPageUrl('Start'))}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
          >
            Got it
          </Button>
        </div>
      </motion.div>

      {/* Guided Tour Dialog */}
      <Dialog open={tourOpen} onOpenChange={(open) => { if (!open) handleSkip(); }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{currentStep.emoji}</span>
                <DialogTitle className="text-xl">{currentStep.title}</DialogTitle>
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Step {tourStep + 1} of {TOUR_STEPS.length}
              </div>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${((tourStep + 1) / TOUR_STEPS.length) * 100}%` }}
              />
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Scene */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {currentStep.scene}
              </div>
            </div>

            {/* Mock UI */}
            {currentStep.mockUIType && (
              <div className="my-4">
                {renderMockUI(currentStep.mockUIType)}
              </div>
            )}

            {/* What It Means */}
            <div>
              <h3 className="font-semibold text-slate-900 text-sm mb-2">What this means:</h3>
              <ul className="space-y-1">
                {currentStep.whatItMeans.map((line, idx) => (
                  <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                    <span className="text-purple-500 mt-0.5">•</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Try This */}
            <div>
              <h3 className="font-semibold text-slate-900 text-sm mb-2">Try this:</h3>
              <ul className="space-y-1">
                {currentStep.tryThis.map((line, idx) => (
                  <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">✓</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Where to Find */}
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-xs font-medium text-blue-900 mb-1">📍 In the real game:</div>
              <div className="text-xs text-slate-700">{currentStep.whereToFind}</div>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="text-xs"
            >
              Skip Tour
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={isFirstStep}
                className="text-sm"
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white text-sm"
              >
                {isLastStep ? 'Finish Tour' : 'Next'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}