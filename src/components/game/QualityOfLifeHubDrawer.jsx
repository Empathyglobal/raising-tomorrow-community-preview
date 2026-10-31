import React from 'react';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { useGameState } from './GameStateContext';
import { resolveHousingForState, resolveCommuteForState, getFoodStrategyById } from './livingConfig';
import { getTierOption, QOL_TIER_DEFS, QOL_SUBSCRIPTIONS, isSubscriptionValidForAge } from './qualityOfLifeConfig';
import { getUiThemeFromDom } from '@/components/lib/uiTheme';

export default function QualityOfLifeHubDrawer({ open, onClose, onOpenSection }) {
  const { gameState } = useGameState();
  const isStorybook = getUiThemeFromDom() === 'storybook';
  
  const livingSetup = gameState.livingSetup || { housingId: 'apartment_basic', commuteId: 'bus', foodStrategyId: 'standard' };
  const housing = resolveHousingForState(gameState, livingSetup.housingId);
  const commute = resolveCommuteForState(gameState, livingSetup.commuteId);
  const foodStrat = getFoodStrategyById(livingSetup.foodStrategyId || 'standard');
  
  const qol = gameState.qol || { internetTier: 'basic', homeOfficeTier: 'none' };
  const internetTier = getTierOption(QOL_TIER_DEFS.internet, qol.internetTier);
  const homeOfficeTier = getTierOption(QOL_TIER_DEFS.homeOffice, qol.homeOfficeTier);
  
  const nextAge = (gameState.currentYear || 0) + 1;
  const commitments = gameState.commitments || {};
  const activeSubs = Object.entries(commitments)
    .filter(([id, enabled]) => enabled && QOL_SUBSCRIPTIONS[id] && isSubscriptionValidForAge(QOL_SUBSCRIPTIONS[id], nextAge, gameState))
    .map(([id]) => QOL_SUBSCRIPTIONS[id]);
  
  const sections = [
    { 
      id: 'home', 
      label: '🏠 Housing', 
      current: housing.label 
    },
    { 
      id: 'transport', 
      label: '🚗 Transportation', 
      current: commute.label 
    },
    { 
      id: 'food', 
      label: '🍽️ Food Strategy', 
      current: foodStrat.label 
    },
    { 
      id: 'internet', 
      label: '📶 Internet', 
      current: internetTier.label 
    },
    { 
      id: 'homeoffice', 
      label: '💻 Home Office', 
      current: homeOfficeTier.label 
    },
    { 
      id: 'subscriptions', 
      label: '✨ Subscriptions', 
      current: activeSubs.length > 0 ? `${activeSubs.length} active` : 'None' 
    }
  ];
  
  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className={`h-[85vh] overflow-hidden ${isStorybook ? 'rt-modal-sheet rt-popup--storybook rt-paper-elev' : ''}`}>
        <div className="px-4 pt-4 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="shrink-0 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base font-semibold">✨ Quality of Life</div>
                <div className="text-xs text-slate-500 mt-1">
                  These choices affect next age's Focus and living costs.
                </div>
              </div>
              <button
                onClick={() => onClose(false)}
                className="px-3 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
          
          {/* Body */}
          <div className="flex-1 min-h-0 overflow-y-auto pb-6 space-y-3">
            {sections.map(section => (
              <button
                key={section.id}
                data-tour={section.id === 'home' ? 'qolhub-housing' : undefined}
                onClick={() => {
                  onClose(false);
                  setTimeout(() => onOpenSection(section.id), 100);
                }}
                className={`w-full p-4 rounded-xl border transition-all text-left border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 active:scale-[0.98] ${isStorybook ? 'SBPanel' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="font-semibold text-slate-800 text-sm mb-1">{section.label}</div>
                    <div className="text-xs text-slate-500">Current: {section.current}</div>
                  </div>
                  <div className="text-2xl">&rsaquo;</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}