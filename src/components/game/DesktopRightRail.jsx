import React from 'react';
import { useGameState, formatMoney } from '@/components/game/GameStateContext';
import { getCountryByIso3 } from '@/components/game/GameStateContext';
import { DollarSign, Home, Users, TrendingUp, AlertCircle } from 'lucide-react';

export default function DesktopRightRail() {
  const { gameState } = useGameState();
  
  const {
    currentYear,
    money,
    countryIso3,
    playerCareer,
    partnerCareer,
    householdType,
    childName,
    childSickThisAge,
    childSickNote,
    kids
  } = gameState;
  
  const country = getCountryByIso3(countryIso3);
  const countryLabel = country?.name || 'Unknown';
  
  // Calculate household income
  const playerIncome = Number(playerCareer?.yearlyIncome || 0);
  const partnerIncome = householdType === 'two' ? Number(partnerCareer?.yearlyIncome || 0) : 0;
  const totalIncome = playerIncome + partnerIncome;
  
  // Family composition
  const familyType = householdType === 'two' ? 'Two Parents' : 'Single Parent';
  const childCount = Array.isArray(kids) && kids.length > 1 ? kids.length : 1;
  
  return (
    <div className="space-y-4 sticky top-4">
      {/* Income Card */}
      <div className="rt-card">
        <div className="rt-card-header">
          <h3 className="text-sm font-semibold text-slate-700">Income</h3>
        </div>
        <div className="rt-card-body space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Yearly</span>
            <span className="font-semibold text-emerald-700">${formatMoney(totalIncome)}</span>
          </div>
          {householdType === 'two' && partnerIncome > 0 && (
            <>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>You</span>
                <span>${formatMoney(playerIncome)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Partner</span>
                <span>${formatMoney(partnerIncome)}</span>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Family Card */}
      <div className="rt-card">
        <div className="rt-card-header">
          <h3 className="text-sm font-semibold text-slate-700">Family</h3>
        </div>
        <div className="rt-card-body space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Type</span>
            <span className="font-semibold text-slate-800">{familyType}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Children</span>
            <span className="font-semibold text-slate-800">{childCount}</span>
          </div>
        </div>
      </div>
      
      {/* Alert Cards (multiple if needed) */}
      {(childSickThisAge || gameState.playerSickThisAge || gameState.partnerSickThisAge) && (
        <div className="rt-card border-amber-200 bg-amber-50">
          <div className="rt-card-body space-y-3">
            {childSickThisAge && (
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <div className="text-xs font-semibold text-amber-800 mb-1">Child Health Notice</div>
                  <div className="text-xs text-amber-700">{childSickNote || 'Child is injured this year'}</div>
                </div>
              </div>
            )}
            {gameState.playerSickThisAge && (
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <div className="text-xs font-semibold text-amber-800 mb-1">Your Health Notice</div>
                  <div className="text-xs text-amber-700">{gameState.playerSickNote || 'You are injured this year'}</div>
                </div>
              </div>
            )}
            {gameState.partnerSickThisAge && (
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <div className="text-xs font-semibold text-amber-800 mb-1">Partner Health Notice</div>
                  <div className="text-xs text-amber-700">{gameState.partnerSickNote || 'Your partner is injured this year'}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}