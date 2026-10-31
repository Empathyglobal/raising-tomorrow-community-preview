import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState, formatMoney } from '@/components/game/GameStateContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, Download, AlertTriangle } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';

export default function IncomeExpenses() {
  const navigate = useNavigate();
  const { gameState } = useGameState();
  const { money, currentYear, moneyTransactions, yearCheckpoints } = gameState;

  // Toast on mount if unseen recap exists
  useEffect(() => {
    const recap = gameState?.urnCrypto?.lastMarketRecap;
    if (recap?.unseen) {
      toast(`⚱️ Urn Market moved — your crypto is now ~$${formatMoney(recap.portfolioAfter)} (unrealized).`, { duration: 4500 });
    }
  }, [gameState?.urnCrypto?.lastMarketRecap?.unseen]);

  // Derive unique ages from transactions + currentYear + checkpoints
  const availableAges = useMemo(() => {
    const ages = new Set([currentYear]);
    (moneyTransactions || []).forEach(tx => ages.add(tx.age));
    (yearCheckpoints || []).forEach(cp => ages.add(cp.age));
    return Array.from(ages).sort((a, b) => b - a); // Descending
  }, [currentYear, moneyTransactions, yearCheckpoints]);

  const [selectedAge, setSelectedAge] = useState(currentYear);

  // Filter Transactions for Selected Age
  const ageTransactions = useMemo(() => {
    return (moneyTransactions || [])
      .filter(tx => tx.age === selectedAge)
      .sort((a, b) => b.ts - a.ts); // Newest first
  }, [moneyTransactions, selectedAge]);

  // Calculate Totals
  const { income, expenses, net } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    ageTransactions.forEach(tx => {
      if (tx.amount >= 0) inc += tx.amount;
      else exp += Math.abs(tx.amount);
    });
    return { income: inc, expenses: exp, net: inc - exp };
  }, [ageTransactions]);

  // Calculate Breakdowns
  const breakdowns = useMemo(() => {
    const incMap = {};
    const expMap = {};

    ageTransactions.forEach(tx => {
      const cat = tx.category || 'uncategorized';
      if (tx.amount >= 0) {
        incMap[cat] = (incMap[cat] || 0) + tx.amount;
      } else {
        expMap[cat] = (expMap[cat] || 0) + Math.abs(tx.amount);
      }
    });

    const sortMap = (map) => Object.entries(map)
      .sort(([, a], [, b]) => b - a)
      .map(([cat, amt]) => ({ category: cat, amount: amt }));

    return {
      income: sortMap(incMap),
      expenses: sortMap(expMap)
    };
  }, [ageTransactions]);

  // Reconciliation Logic
  const reconciliation = useMemo(() => {
    // Find checkpoint for START of this age
    const startCP = (yearCheckpoints || []).find(cp => cp.kind === 'yearStart' && cp.age === selectedAge);
    
    // Find checkpoint for START of next age (or use current money if this is current year)
    let endMoney = 0;
    const endCP = (yearCheckpoints || []).find(cp => cp.kind === 'yearStart' && cp.age === selectedAge + 1);
    
    if (selectedAge === currentYear) {
      endMoney = Number(money || 0);
    } else if (endCP) {
      endMoney = Number(endCP.snapshot?.money || 0);
    } else {
      endMoney = null;
    }

    if (!startCP || endMoney === null) return null;

    const startMoney = Number(startCP.snapshot?.money || 0);
    const actualDelta = endMoney - startMoney;
    
    // Compute tracked delta ONLY within checkpoint window
    const startAt = startCP.at;
    const endAt = (selectedAge === currentYear) ? Date.now() : (endCP ? endCP.at : null);
    
    if (!endAt) return null;
    
    const trackedDeltaWindow = (moneyTransactions || [])
      .filter(tx => tx.age === selectedAge && tx.ts >= startAt && tx.ts < endAt)
      .reduce((sum, tx) => sum + (tx.amount || 0), 0);
    
    const untracked = actualDelta - trackedDeltaWindow;

    // Only show if discrepancy is significant (>1 due to rounding)
    if (Math.abs(untracked) < 2) return null;

    return { startMoney, endMoney, actualDelta, trackedDelta: trackedDeltaWindow, untracked };
  }, [yearCheckpoints, selectedAge, currentYear, money, moneyTransactions]);

  const fmtSigned = (n) => `${n < 0 ? '-' : '+'}$${formatMoney(Math.abs(n))}`;

  const handleExportCSV = () => {
    const headers = ['Date', 'Age', 'Type', 'Category', 'Source', 'Note', 'Amount'];
    const rows = ageTransactions.map(tx => [
      new Date(tx.ts).toISOString(),
      tx.age,
      tx.type,
      tx.category,
      `"${tx.source || ''}"`,
      `"${tx.note || ''}"`,
      tx.amount
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `money_tx_age_${selectedAge}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="rt-container py-3 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Button>
          <div className="font-bold text-slate-800">Income & Expenses</div>
          <div className="w-9" /> {/* Spacer */}
        </div>
        
        {/* Age Selector */}
        <div className="rt-container pb-3">
          <select 
            value={selectedAge} 
            onChange={(e) => setSelectedAge(Number(e.target.value))}
            className="w-full p-2 bg-slate-100 rounded-lg text-slate-700 font-medium border-none focus:ring-2 focus:ring-indigo-500"
          >
            {availableAges.map(age => (
              <option key={age} value={age}>
                Age {age} {age === currentYear ? '(Current)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rt-container py-6 space-y-6">
        
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
            <div className="text-xs text-emerald-600 font-semibold uppercase tracking-wider mb-1">Income</div>
            <div className="text-emerald-700 font-bold text-lg">+${formatMoney(income)}</div>
          </div>
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-center">
            <div className="text-xs text-rose-600 font-semibold uppercase tracking-wider mb-1">Expenses</div>
            <div className="text-rose-700 font-bold text-lg">-${formatMoney(expenses)}</div>
          </div>
          <div className={`border rounded-xl p-3 text-center ${net >= 0 ? 'bg-blue-50 border-blue-100' : 'bg-amber-50 border-amber-100'}`}>
            <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${net >= 0 ? 'text-blue-600' : 'text-amber-600'}`}>Net</div>
            <div className={`font-bold text-lg ${net >= 0 ? 'text-blue-700' : 'text-amber-700'}`}>
              {net >= 0 ? '+' : '-'}${formatMoney(Math.abs(net))}
            </div>
          </div>
        </div>

        {/* Reconciliation Warning */}
        {reconciliation && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800">
              <div className="font-bold mb-1">Untracked Adjustments Detected</div>
              <p>
                The ledger says net {fmtSigned(reconciliation.trackedDelta)}, 
                but your actual balance changed by {fmtSigned(reconciliation.actualDelta)}.
              </p>
              <p className="mt-1 font-mono font-bold">
                Difference: {fmtSigned(reconciliation.untracked)}
              </p>
            </div>
          </div>
        )}

        {/* Breakdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {breakdowns.expenses.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                <TrendingDown className="w-3 h-3" /> Top Expenses
              </h3>
              <div className="space-y-2">
                {breakdowns.expenses.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-slate-600 capitalize">{item.category}</span>
                    <span className="font-medium text-slate-800">-${formatMoney(item.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {breakdowns.income.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                <TrendingUp className="w-3 h-3" /> Top Income
              </h3>
              <div className="space-y-2">
                {breakdowns.income.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-slate-600 capitalize">{item.category}</span>
                    <span className="font-medium text-slate-800">+${formatMoney(item.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Transaction List */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-700 text-sm">Transactions</h3>
            <Button variant="ghost" size="sm" onClick={handleExportCSV} className="h-8 text-xs text-slate-500 hover:text-indigo-600">
              <Download className="w-3 h-3 mr-1" /> CSV
            </Button>
          </div>
          
          {ageTransactions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No transactions recorded for Age {selectedAge}.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {ageTransactions.map(tx => (
                <div key={tx.id} className="p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors">
                  <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${tx.amount >= 0 ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-slate-800 text-sm truncate pr-2">{tx.source}</span>
                      <span className={`font-bold text-sm flex-shrink-0 ${tx.amount >= 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                        {tx.amount >= 0 ? '+' : ''}{formatMoney(tx.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-slate-400 capitalize">{tx.category}</span>
                      {tx.note && <span className="text-xs text-slate-400 italic truncate max-w-[120px]">{tx.note}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}