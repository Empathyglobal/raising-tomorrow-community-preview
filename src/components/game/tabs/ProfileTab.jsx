import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import DesktopRightRail from '@/components/game/DesktopRightRail';
import { ChevronRight, DollarSign, TrendingUp, TrendingDown, Briefcase, Building2 } from 'lucide-react';
import { useGameState, describeStat, COMMITMENT_DEFS, formatMoney, getCountryScale, hasAnyChild } from '../GameStateContext';
import { toast } from 'sonner';
import CoverHeader from '@/components/game/CoverHeader';
import { getUiThemeFromDom } from '@/components/lib/uiTheme';
import { FAMILY_PATTERN_CATALOG, DEFAULT_PATTERN_SEVERITY } from '../familyPatternCatalog';
import { CULTURAL_ROOTS } from '../culturalRootsData';
import PlayerSpriteAvatar from '../PlayerSpriteAvatar';
import FamilyPatternDetailsModal from '../FamilyPatternDetailsModal';
import { FAMILY_VALUES_CATALOG } from '../faithValuesCatalog';
import ChildTraumaDetailsModal from '../ChildTraumaDetailsModal';
import { normalizePlayerCareer } from '../careerSystem';
import ChallengesPreviewCard from '@/components/game/challenges/ChallengesPreviewCard';
import DailyAdventuresHubModal from '@/components/game/DailyAdventuresHubModal.jsx';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { resolveHousingForState, resolveCommuteForState, getFoodStrategyById } from '../livingConfig';
import { computeQoLFocusBonus, getTierOption, QOL_TIER_DEFS } from '../qualityOfLifeConfig';
import { getFamilyPatternMods } from '../familyPatternEffects';
import { getCoopHouseholdFocusMeta, isLocalCoopEnabled } from "@/components/game/localCoop";

function clamp01to3(n) {
  const v = Number(n || 0);
  if (Number.isNaN(v)) return 0;
  return Math.max(0, Math.min(3, v));
}

function dots(severity) {
  const s = clamp01to3(severity);
  const filled = '●'.repeat(s);
  const empty = '○'.repeat(3 - s);
  return `${filled}${empty}`;
}

export default function ProfileTab() {
  const navigate = useNavigate();
  const { gameState } = useGameState();
  const isStorybook = getUiThemeFromDom() === 'storybook';

  const {
    love,
    stress,
    passportStamps,
    studiedItems,
    inventory,
    parentName,
    parentAvatar,
    familyPatterns,
    childTraumaEvents,
    childAttachment,
    playerCultures,
    childCultureBond,
    moneyTransactions,
    currentYear
  } = gameState;

  const hasChild = hasAnyChild(gameState);
  const parentAge = Number(gameState.parentAgeAtBirth ?? 28) + Number(gameState.currentYear ?? 0);

  const career = React.useMemo(() => normalizePlayerCareer(gameState.playerCareer, gameState), [gameState.playerCareer, gameState]);

  // Calculate "This Year" finance summary
  const thisYearFinance = React.useMemo(() => {
    let inc = 0;
    let exp = 0;
    (moneyTransactions || []).forEach(tx => {
      if (tx.age === currentYear) {
        if (tx.amount >= 0) inc += tx.amount;
        else exp += Math.abs(tx.amount);
      }
    });
    return { inc, exp, net: inc - exp };
  }, [moneyTransactions, currentYear]);

  const [patternModalOpen, setPatternModalOpen] = React.useState(false);
  const [selectedPatternId, setSelectedPatternId] = React.useState(null);
  const [openTrauma, setOpenTrauma] = React.useState(null);
  const [dailyAdventuresOpen, setDailyAdventuresOpen] = React.useState(false);
  const [snapshotOpen, setSnapshotOpen] = React.useState(false);

  const selectedIds = familyPatterns?.selectedIds || [];
  const severityById = familyPatterns?.severityById || {};
  const resolvedById = familyPatterns?.resolvedById || {};

  const totalUnresolvedLoad = selectedIds.reduce((sum, id) => {
    const sev = severityById[id] ?? DEFAULT_PATTERN_SEVERITY;
    const resolved = Boolean(resolvedById[id]) || Number(sev || 0) <= 0;
    if (resolved) return sum;
    return sum + Number(sev || 0);
  }, 0);

  const selectedPattern = React.useMemo(() => {
    if (!selectedPatternId) return null;
    return FAMILY_PATTERN_CATALOG.find(p => p.id === selectedPatternId) || null;
  }, [selectedPatternId]);

  const selectedSeverity = selectedPatternId
    ? (severityById[selectedPatternId] ?? DEFAULT_PATTERN_SEVERITY)
    : 0;

  const selectedResolved = selectedPatternId
    ? (Boolean(resolvedById[selectedPatternId]) || Number(selectedSeverity || 0) <= 0)
    : false;

  const parentDisplayName = (String(gameState.caregiverMeta?.player?.title || '').trim())
    || (parentName && String(parentName).trim())
    || (gameState.legacyParentName && String(gameState.legacyParentName).trim())
    || (gameState.parentRole === 'dad' ? 'Dad' : gameState.parentRole === 'mom' ? 'Mom' : 'Parent');

  const parentDisplayAvatar = parentAvatar || '🧑';
  // Compute parent sprite index (fallback for old saves)
  const toneIdx = Number(gameState.childAvatarToneIndex ?? 0);
  const roleLower = String(gameState.parent?.role || gameState.parentRole || '').toLowerCase();
  const derivedGender = (roleLower === 'mom' || roleLower === 'mother' || roleLower === 'grandma') ? 'female' : 'male';
  const genderKey = gameState.parentAvatarGender || derivedGender;
  const fallbackSpriteIndex = (toneIdx % 4);
  const parentSpriteIndex = Number.isFinite(Number(gameState.parentAvatarSpriteIndex))
    ? Number(gameState.parentAvatarSpriteIndex)
    : fallbackSpriteIndex;

  const openPattern = (patternId) => {
    setSelectedPatternId(patternId);
    setPatternModalOpen(true);
  };

  return (
    <div className="h-full overflow-y-auto pb-24 pt-4">
      <div className="rt-container space-y-4">
        {isStorybook ? (
          <>
            <CoverHeader cover={{ id: 'self_care', title: 'Profile' }} />
            <div className="SBDoodleDivider mb-3" />
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-slate-800 mb-1">Profile</h2>
            <p className="text-sm text-slate-500 mb-4">Parent profile & collections</p>
          </>
        )}

        {/* Finance Card */}
        <div className="space-y-2">
          <button
            onClick={() => {
              const hasUnseen = gameState.urnCrypto?.lastMarketRecap?.unseen === true;
              if (hasUnseen) {
                const recap = gameState.urnCrypto.lastMarketRecap;
                toast(`⚱️ Urn Market moved — your bags: $${formatMoney(recap.portfolioBefore)} → $${formatMoney(recap.portfolioAfter)} (${recap.delta >= 0 ? '+' : ''}$${formatMoney(Math.abs(recap.delta))} unrealized)`, { duration: 4000 });
              }
              navigate(createPageUrl('IncomeExpenses'));
            }}
            className="w-full bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors text-left"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">Income & Expenses</div>
                  <div className="text-xs text-slate-500">Age {currentYear} Summary</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
            
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span className="font-medium text-emerald-700">+${formatMoney(thisYearFinance.inc)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingDown className="w-3 h-3 text-rose-500" />
                <span className="font-medium text-rose-700">-${formatMoney(thisYearFinance.exp)}</span>
              </div>
              <div className="ml-auto font-mono text-slate-400">
                Net: {thisYearFinance.net >= 0 ? '+' : '-'}${formatMoney(Math.abs(thisYearFinance.net))}
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/crypto')}
            className="w-full bg-white rounded-xl px-4 py-2 border border-slate-200 shadow-sm hover:border-purple-300 transition-colors text-left flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">⚱️</span>
              <span className="text-sm font-medium text-slate-800">Urn Crypto</span>
              {gameState.urnCrypto?.lastMarketRecap?.unseen && (
                <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">NEW</span>
              )}
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Snapshot Card */}
        <button
          onClick={() => setSnapshotOpen(true)}
          className="w-full bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors text-left"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                <span className="text-lg">📌</span>
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800">Snapshot</div>
                <div className="text-xs text-slate-500">Quick overview of your current situation</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </button>

        <ChallengesPreviewCard />

        {/* Daily Adventures */}
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-sm font-bold text-slate-800">Daily Adventures</div>
              <div className="text-xs text-slate-500">2 featured today (Parenting + Adult). Practice mode = unlimited.</div>
            </div>
            <button
              onClick={() => setDailyAdventuresOpen(true)}
              className="px-3 py-1 rounded-md bg-indigo-600 text-white text-xs"
            >Open</button>
          </div>
        </div>

         {/* Player Info */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">You (The Parent)</h3>
          <div className="flex items-center gap-3 mb-3">
            <PlayerSpriteAvatar
              genderKey={genderKey}
              ageNumber={parentAge}
              index={parentSpriteIndex}
              size={56}
              fallbackEmoji={parentDisplayAvatar}
              className="rounded-2xl bg-white border border-slate-200 shadow-sm"
            />
            <div>
              <div className="text-lg font-bold text-slate-800">{parentDisplayName}</div>
              <div className="text-xs text-slate-500">Playing as parent</div>
              <div className="grid grid-cols-1 gap-2 mt-2">
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <Briefcase className="w-4 h-4 text-slate-500" />
                  <span className="font-medium">{career.jobTitle || 'No current job'}</span>
                  {!!career.companyName && <span className="text-slate-400">• {career.companyName}</span>}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium">${formatMoney(career.yearlyIncome || 0)}/yr</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cultural Roots */}
          {playerCultures && playerCultures.length > 0 && (
            <div className="mt-3 pt-3 border-t border-indigo-200">
              <div className="text-xs font-semibold text-slate-600 mb-2">Cultural Roots</div>
              <div className="space-y-3">
                {playerCultures.map(id => {
                  const def = CULTURAL_ROOTS.find(c => c.id === id);
                  if (!def) return null;
                  const bond = childCultureBond?.[id] || 0;
                  
                  return (
                    <div key={id}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-700 font-medium">{def.label}</span>
                        <span className="text-slate-500">{bond}/100</span>
                      </div>
                      <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-indigo-100">
                        <div 
                          className="h-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(0, bond))}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Family Patterns */}
          <div className="mt-3 pt-3 border-t border-indigo-200">
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs font-semibold text-slate-600">Family Patterns</div>
              {selectedIds.length > 0 && (
                <div className="text-[10px] text-slate-500">{selectedIds.length} selected</div>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              Tap a pattern to see what happened, how it can affect you, and what it means in the game.
            </p>

            {selectedIds.length === 0 ? (
              <div className="text-xs text-slate-500">None selected this run.</div>
            ) : (
              <div className="space-y-1">
                {selectedIds.map(patternId => {
                  const pattern = FAMILY_PATTERN_CATALOG.find(p => p.id === patternId);
                  if (!pattern) return null;

                  const sev = severityById?.[patternId] ?? DEFAULT_PATTERN_SEVERITY;
                  const resolved = Boolean(resolvedById?.[patternId]) || Number(sev || 0) <= 0;

                  return (
                    <button
                      key={patternId}
                      onClick={() => openPattern(patternId)}
                      className="w-full flex items-center justify-between text-xs px-2 py-1 rounded-md hover:bg-white/60 transition-colors"
                    >
                      <span className={`min-w-0 truncate ${resolved ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                        {pattern.label}
                      </span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] text-slate-500 font-mono">{dots(sev)}</span>
                        {resolved && <span className="text-emerald-600">✓</span>}
                        <ChevronRight className="w-3 h-3 text-slate-300" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Baby Pressure Card (child-free mode) */}
        {!hasChild && (
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="font-bold text-slate-800">🍼 Baby Pressure</div>
            <div className="text-sm text-slate-600 mt-1">
              A mix of age, vibes, and unsolicited opinions. If it gets high, your stress can climb.
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>0</span>
                <span>{Math.round(gameState.babyPressure || 0)}/100</span>
                <span>100</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-400"
                  style={{ width: `${Math.max(0, Math.min(100, Math.round(gameState.babyPressure || 0)))}%` }}
                />
              </div>
              <div className="text-xs text-slate-600 mt-2">
                {Math.round(gameState.babyPressure || 0) < 50
                  ? "Pretty chill. Your timeline isn't yelling."
                  : Math.round(gameState.babyPressure || 0) < 75
                  ? 'The pressure is whispering. Annoying, but manageable.'
                  : 'The pressure is LOUD. Expect stress creep unless you actively manage it.'}
              </div>
            </div>
          </div>
        )}

        {/* Health Alerts */}
        {(gameState.playerHealth <= 35 || gameState.childSickThisAge || gameState.playerSickThisAge || gameState.partnerSickThisAge) && (
          <div className="space-y-2">
            {gameState.playerHealth <= 35 && (
              <div className={`p-3 rounded-xl border ${gameState.playerHealth <= 20 ? 'bg-rose-50 border-rose-300' : 'bg-amber-50 border-amber-300'}`}>
                <div className="text-sm font-semibold text-slate-800">
                  {gameState.playerHealth <= 20 ? "🚨 You're not feeling good." : "🤒 You're not feeling good."}
                </div>
                <div className="text-xs text-slate-600 mt-1">Consider visiting Health (Doctor) soon.</div>
              </div>
            )}
            {gameState.childSickThisAge && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-300">
                <div className="text-sm font-semibold text-slate-800">🤒 {gameState.childName} needs a doctor</div>
                <div className="text-xs text-slate-600 mt-1">{gameState.childSickNote || 'Injury/sickness this year.'}</div>
              </div>
            )}
            {gameState.playerSickThisAge && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-300">
                <div className="text-sm font-semibold text-slate-800">🤕 You need a doctor</div>
                <div className="text-xs text-slate-600 mt-1">{gameState.playerSickNote || 'Injury/sickness this year.'}</div>
              </div>
            )}
            {gameState.partnerSickThisAge && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-300">
                <div className="text-sm font-semibold text-slate-800">🤕 Your partner needs a doctor</div>
                <div className="text-xs text-slate-600 mt-1">{gameState.partnerSickNote || 'Injury/sickness this year.'}</div>
              </div>
            )}
          </div>
        )}

        {/* Bond, Stress & Health (conditionally hide Love if no child) */}
        {hasChild ? (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-4 border border-rose-200">
              <div className="text-xs text-rose-600 font-medium mb-1">Love</div>
              <div className="text-3xl font-bold text-rose-700">{Math.round(love)}</div>
              <div className="text-xs text-rose-600 mt-1">{describeStat('love', love).label}</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
              <div className="text-xs text-orange-600 font-medium mb-1">Stress</div>
              <div className="text-3xl font-bold text-orange-700">{Math.round(stress)}</div>
              <div className="text-xs text-orange-600 mt-1">{describeStat('stress', stress).label}</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
              <div className="text-xs text-emerald-600 font-medium mb-1">Your Health</div>
              <div className={`text-3xl font-bold ${gameState.playerHealth <= 35 ? 'text-rose-700' : 'text-emerald-700'}`}>{Math.round(gameState.playerHealth ?? 75)}</div>
              <div className="text-xs text-emerald-600 mt-1">{describeStat('playerHealth', gameState.playerHealth ?? 75).label}</div>
              {gameState.stats?.health !== undefined && (
                <div className="mt-2 pt-2 border-t border-emerald-100">
                  <div className="text-[10px] text-slate-500 mb-0.5">Child Health (stat)</div>
                  <div className={`text-sm font-semibold ${gameState.stats.health <= 3 ? 'text-amber-600' : 'text-slate-700'}`}>
                    {(() => {
                      const base = Number(gameState.stats?.health ?? 0);
                      const buf = Number((gameState.statBuffer ?? {}).health ?? 0);
                      if (Math.abs(buf) >= 0.05) return (base + buf).toFixed(1);
                      return Math.round(base);
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
              <div className="text-xs text-orange-600 font-medium mb-1">Stress</div>
              <div className="text-3xl font-bold text-orange-700">{Math.round(stress)}</div>
              <div className="text-xs text-orange-600 mt-1">{describeStat('stress', stress).label}</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
              <div className="text-xs text-emerald-600 font-medium mb-1">Health</div>
              <div className={`text-3xl font-bold ${gameState.playerHealth <= 35 ? 'text-rose-700' : 'text-emerald-700'}`}>{Math.round(gameState.playerHealth ?? 75)}</div>
              <div className="text-xs text-emerald-600 mt-1">{describeStat('playerHealth', gameState.playerHealth ?? 75).label}</div>
            </div>
          </div>
        )}

        {/* Active Commitments */}
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Active Commitments</h3>
          <div className="text-sm text-slate-700">
            {(() => {
              const active = [];
              if (gameState.commitments?.afterSchoolCare) active.push(COMMITMENT_DEFS.afterSchoolCare.label);
              if (gameState.commitments?.cleaningHelp) active.push(COMMITMENT_DEFS.cleaningHelp.label);
              if (gameState.commitments?.mealKits) active.push(COMMITMENT_DEFS.mealKits.label);
              return active.length > 0 ? active.join(', ') : 'None';
            })()}
          </div>
        </div>

        {/* Worries & Wounds (child-specific, hide if no child) */}
        {hasChild && (
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Worries &amp; Wounds</h3>
            <p className="text-xs text-slate-500 mb-1">
              A narrative tracker for moments that left a mark. Not a diagnosis.
            </p>
            <p className="text-[11px] text-slate-500 mb-3">Tap a wound to explain it.</p>

            {childTraumaEvents && childTraumaEvents.length > 0 ? (
              <div className="space-y-3">
                {childTraumaEvents.map(t => {
                  const sev = Number(t.severity || 1);
                  const dots = sev === 1 ? "●" : sev === 2 ? "●●" : "●●●";
                  const firstAge = t.firstAge !== undefined ? t.firstAge : t.age;
                  const lastAge = t.lastAge !== undefined ? t.lastAge : firstAge;
                  const ageText = firstAge === lastAge ? `Age ${firstAge}` : `Ages ${firstAge}–${lastAge}`;
                  return (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setOpenTrauma(t)}
                      className="w-full p-3 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 text-left transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-slate-800">{t.label}</div>
                        <div className="text-[10px] text-slate-500">{dots}</div>
                      </div>
                      {t.description && (
                        <div className="text-xs text-slate-600 mt-1">{t.description}</div>
                      )}
                      <div className="text-[10px] text-slate-400 mt-2">
                        {ageText}{t.count > 1 ? ` • ${t.count} times` : ''}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-sm text-slate-700">No major scars tracked yet.</div>
            )}
          </div>
        )}

        {/* Collections */}
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Collections & Details</h3>
          <div className="space-y-2">
            {hasChild && (
              <button
                onClick={() => navigate(createPageUrl('DevelopmentDetails'))}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">📊</span>
                  <span className="text-sm font-medium text-slate-800">Development Details</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            )}

            <button
              onClick={() => navigate(createPageUrl('Passport'))}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🛂</span>
                <div>
                  <div className="text-sm font-medium text-slate-800">Passport</div>
                  <div className="text-xs text-slate-500">{passportStamps?.length || 0} stamps</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => navigate(createPageUrl('Bookshelf'))}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">📚</span>
                <div>
                  <div className="text-sm font-medium text-slate-800">Bookshelf</div>
                  <div className="text-xs text-slate-500">{studiedItems?.length || 0} modules</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => navigate(createPageUrl('Inventory'))}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🎒</span>
                <div>
                  <div className="text-sm font-medium text-slate-800">Inventory</div>
                  <div className="text-xs text-slate-500">{Array.isArray(inventory?.items) ? inventory.items.length : 0} items</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => navigate(createPageUrl('Collections'))}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🗂️</span>
                <span className="text-sm font-medium text-slate-800">Collections (Books/Games)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => navigate(createPageUrl('TrophyCase'))}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🏆</span>
                <span className="text-sm font-medium text-slate-800">Trophy Case</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => navigate(createPageUrl('Toolbox'))}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🧠</span>
                <span className="text-sm font-medium text-slate-800">Toolbox</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => navigate(createPageUrl('Challenges'))}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🏁</span>
                <div>
                  <div className="text-sm font-medium text-slate-800">Challenges</div>
                  <div className="text-xs text-slate-500">Activate quests and earn diamonds</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      <ChildTraumaDetailsModal
        open={!!openTrauma}
        trauma={openTrauma}
        childName={gameState.childName}
        onClose={() => setOpenTrauma(null)}
      />

      <FamilyPatternDetailsModal
        open={patternModalOpen}
        pattern={selectedPattern}
        severity={selectedSeverity}
        resolved={selectedResolved}
        parentDisplayName={parentDisplayName}
        childName={gameState.childName}
        totalUnresolvedLoad={totalUnresolvedLoad}
        onClose={() => {
          setPatternModalOpen(false);
          setSelectedPatternId(null);
        }}
      />

      <DailyAdventuresHubModal
        open={dailyAdventuresOpen}
        onClose={() => setDailyAdventuresOpen(false)}
      />

      {/* Snapshot Drawer */}
      <Drawer open={snapshotOpen} onOpenChange={setSnapshotOpen}>
        <DrawerContent className="max-h-[85vh] flex flex-col min-h-0">
          <div className="px-4 pt-4 pb-2 flex-shrink-0">
            <div className="text-base font-semibold text-slate-900">Snapshot</div>
            <div className="text-xs text-slate-500 mt-0.5">Quick overview of your current situation</div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-4 pb-10">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-200">
                <div className="text-sm font-semibold text-slate-900">Current</div>
              </div>

              <div className="px-4 py-3 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm text-slate-600">Age</div>
                  <div className="text-sm font-semibold text-slate-900 tabular-nums">{currentYear}</div>
                </div>

                <div className="h-px bg-slate-100" />

                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm text-slate-600">Cash</div>
                  <div className="text-sm font-semibold text-slate-900 tabular-nums">${formatMoney(gameState.money || 0)}</div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm text-slate-600">Job</div>
                  <div className="text-sm font-semibold text-slate-900 text-right">{career.jobTitle || 'None'}</div>
                </div>

                <div className="pt-2">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Income</div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm text-slate-600">Yearly</div>
                  <div className="text-sm font-semibold text-emerald-700 tabular-nums">${formatMoney(career.yearlyIncome || 0)}</div>
                </div>

                <div className="pt-2">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Family</div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm text-slate-600">Type</div>
                  <div className="text-sm font-semibold text-slate-900 text-right capitalize">{gameState.householdType || 'two'}</div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm text-slate-600">Children</div>
                  <div className="text-sm font-semibold text-slate-900 tabular-nums">{(gameState.kids?.length || 0) + 1}</div>
                </div>
                
                {/* Faith */}
                {(() => {
                  const faith = gameState.faith || {};
                  const tradition = faith.tradition || null;
                  const status = faith.status || 'none';
                  const history = Array.isArray(faith.history) ? faith.history : [];
                  const values = Array.isArray(faith.values) ? faith.values : [];
                  const refusedFrom = faith.refusedFromTradition || null;
                  
                  // Show if tradition exists OR status is refused
                  if (!tradition && status !== 'refused') return null;
                  
                  const statusLabel = 
                    status === 'committed' ? 'Committed' :
                    status === 'questioning' ? 'Questioning' :
                    status === 'not_practicing' ? 'Not Practicing' :
                    status === 'refused' ? 'Refused' : '';
                  
                  let displayText = '';
                  if (tradition) {
                    displayText = `${tradition} — ${statusLabel}`;
                  } else if (status === 'refused') {
                    const priorTradition = refusedFrom || 'a faith';
                    displayText = `None — Refused (was raised around ${priorTradition})`;
                  }
                  
                  return (
                    <>
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm text-slate-600">Faith</div>
                        <div className="text-sm font-semibold text-slate-900 text-right">{displayText}</div>
                      </div>
                      {values.length === 2 && tradition && (
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm text-slate-600">Values</div>
                          <div className="text-sm font-semibold text-slate-900 text-right">
                            {values.map(k => FAMILY_VALUES_CATALOG.find(v => v.key === k)?.label || k).join(', ')}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
                
                {/* Focus Breakdown */}
                <div className="pt-3 mt-3 border-t border-slate-100">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Focus (This Age)</div>
                  
                  {(() => {
                    const coopMeta = getCoopHouseholdFocusMeta(gameState);
                    
                    if (coopMeta) {
                      // Co-op mode: show Turn + Household
                      return (
                        <>
                          <div className="flex items-center justify-between gap-3 mb-1">
                            <div className="text-sm text-slate-600">Turn Focus</div>
                            <div className="text-sm font-semibold text-indigo-700 tabular-nums">{coopMeta.activeRemaining} / {coopMeta.activeMax}</div>
                          </div>
                          <div className="flex items-center justify-between gap-3 mb-2">
                            <div className="text-sm text-slate-600">Household Focus</div>
                            <div className="text-sm font-semibold text-slate-700 tabular-nums">{coopMeta.householdRemaining} / {coopMeta.householdMax}</div>
                          </div>
                        </>
                      );
                    } else {
                      // Non-coop: show single focus line
                      return (
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <div className="text-sm text-slate-600">Remaining</div>
                          <div className="text-sm font-semibold text-indigo-700 tabular-nums">{gameState.actionPoints || 0} / {gameState.maxFocusTokens || 0}</div>
                        </div>
                      );
                    }
                  })()}
                  
                  <div className="bg-slate-50 rounded-lg p-3 space-y-1.5 text-xs">
                    {(() => {
                       const coopMeta = getCoopHouseholdFocusMeta(gameState);
                       const base = Number(gameState.baseMaxFocusTokens ?? 5);
                       const partnerBonus = Number(gameState.focusBonusPartner || 0);
                      
                      // Living setup
                      const setup = gameState.livingSetup || { housingId: 'apartment_basic', commuteId: 'bus', foodStrategyId: 'standard' };
                      let livingFocusMod = 0;
                      try {
                        const housing = resolveHousingForState(gameState, setup.housingId);
                        const commute = resolveCommuteForState(gameState, setup.commuteId);
                        const foodStrat = getFoodStrategyById(setup.foodStrategyId || 'standard');
                        livingFocusMod = (housing.focusMod || 0) + (commute.focusMod || 0) + (foodStrat.focusMod || 0);
                      } catch {}
                      
                      // QoL
                      let qolFocusMod = 0;
                      try {
                        qolFocusMod = computeQoLFocusBonus(gameState, currentYear + 1);
                      } catch {}
                      
                      // Pattern mods
                      const patternIds = gameState.familyPatterns?.selectedIds || [];
                      const patternMods = getFamilyPatternMods(patternIds);
                      const patternFocusMod = Number(patternMods.maxFocusMod || 0);
                      
                      // Penalties
                      const stressPenalty = Math.floor((gameState.stress || 0) / 20);
                      const fatiguePenalty = (gameState.zeroFocusStreakYears >= 3) ? 1 : 0;
                      
                      const total = coopMeta ? coopMeta.householdMax : (gameState.maxFocusTokens || 0);
                      
                      return (
                        <>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Base</span>
                            <span className="font-mono text-slate-900">+{base}</span>
                          </div>
                          {partnerBonus > 0 && (
                            <div className="flex justify-between">
                              <span className="text-slate-600">Partner Bonus</span>
                              <span className="font-mono text-emerald-600">+{partnerBonus}</span>
                            </div>
                          )}
                          {livingFocusMod !== 0 && (
                            <div className="flex justify-between">
                              <span className="text-slate-600">Living Setup</span>
                              <span className={`font-mono ${livingFocusMod > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {livingFocusMod > 0 ? '+' : ''}{livingFocusMod}
                              </span>
                            </div>
                          )}
                          {qolFocusMod !== 0 && (
                            <div className="flex justify-between">
                              <span className="text-slate-600">Quality of Life</span>
                              <span className={`font-mono ${qolFocusMod > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {qolFocusMod > 0 ? '+' : ''}{qolFocusMod}
                              </span>
                            </div>
                          )}
                          {patternFocusMod !== 0 && (
                            <div className="flex justify-between">
                              <span className="text-slate-600">Family Patterns</span>
                              <span className={`font-mono ${patternFocusMod > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {patternFocusMod > 0 ? '+' : ''}{patternFocusMod}
                              </span>
                            </div>
                          )}
                          {stressPenalty > 0 && (
                            <div className="flex justify-between">
                              <span className="text-slate-600">Stress Penalty</span>
                              <span className="font-mono text-rose-600">-{stressPenalty}</span>
                            </div>
                          )}
                          {fatiguePenalty > 0 && (
                            <div className="flex justify-between">
                              <span className="text-slate-600">Fatigue Penalty</span>
                              <span className="font-mono text-rose-600">-{fatiguePenalty}</span>
                            </div>
                          )}
                          <div className="h-px bg-slate-200 my-1" />
                          <div className="flex justify-between font-semibold">
                            <span className="text-slate-900">{coopMeta ? 'Household Total' : 'Total'}</span>
                            <span className="font-mono text-indigo-700">{total}</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

            <div className="h-12" />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}