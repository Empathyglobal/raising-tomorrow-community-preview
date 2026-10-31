import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGameState, formatMoney } from '@/components/game/GameStateContext';
import { toast } from 'sonner';

export default function Crypto() {
  const navigate = useNavigate();
  const { gameState, ensureUrnCryptoInitialized, buyUrnCrypto, sellUrnCrypto, markUrnCryptoRecapSeen } = useGameState();
  const [dismissedBanner, setDismissedBanner] = useState(false);

  useEffect(() => {
    ensureUrnCryptoInitialized();
  }, [ensureUrnCryptoInitialized]);

  const urnCrypto = gameState?.urnCrypto || {};
  const { tokens = [], pricesById = {}, positions = {}, lastMarketRecap, tradeFeeRate = 0.025, gasFee = 3 } = urnCrypto;
  const money = gameState?.money || 0;

  // Calculate portfolio
  const totalCostBasis = Object.values(positions).reduce((sum, pos) => sum + (pos?.costBasis || 0), 0);
  const portfolioValue = Object.entries(positions).reduce((sum, [id, pos]) => {
    const price = Number(pricesById[id] || 0);
    return sum + (pos?.qty || 0) * price;
  }, 0);
  const unrealizedPL = portfolioValue - totalCostBasis;

  const handleBuy = (tokenId, qty) => {
    // Handle decrement (negative qty = sell)
    if (qty < 0) {
      handleSell(tokenId, Math.abs(qty));
      return;
    }
    
    if (qty < 1) return;
    const price = Number(pricesById[tokenId] || 100);
    const gross = qty * price;
    const fee = Math.ceil(gross * tradeFeeRate);
    const totalCost = gross + fee + gasFee;
    
    if (money < totalCost) {
      toast.error('Not enough money');
      return;
    }
    buyUrnCrypto(tokenId, qty);
    toast.success(`Bought ${qty} tokens for $${formatMoney(totalCost)}`);
  };

  const handleSell = (tokenId, qty) => {
    const pos = positions[tokenId];
    if (!pos || pos.qty < qty) {
      toast.error('Not enough holdings');
      return;
    }
    sellUrnCrypto(tokenId, qty);
    toast.success(`Sold ${qty} tokens`);
  };

  const handleDismissBanner = () => {
    markUrnCryptoRecapSeen();
    setDismissedBanner(true);
  };

  const showBanner = lastMarketRecap?.unseen && !dismissedBanner;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(-1)}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">⚱️ Urn Crypto</h1>
            <p className="text-xs text-white/60">HODL Market</p>
          </div>
          <div className="text-right space-y-1">
            <div>
              <div className="text-xs text-white/60">Cash</div>
              <div className="text-lg font-bold text-green-400">${formatMoney(money)}</div>
            </div>
            {portfolioValue > 0 && (
              <div>
                <div className="text-xs text-white/60">Bags</div>
                <div className="text-sm font-bold text-purple-300">${formatMoney(portfolioValue)}</div>
              </div>
            )}
          </div>
        </div>

        {/* Market Recap */}
        {showBanner && lastMarketRecap && (
          <div className="bg-amber-500/20 border border-amber-500/40 rounded-xl p-4 mb-6">
            <div className="font-bold text-white mb-2">
              🎲 Market moved
              <span className="ml-2 text-xs opacity-70">Age {lastMarketRecap.age}</span>
            </div>
            
            <div className="text-sm text-white/90 mb-2">{lastMarketRecap.headline}</div>
            
            <div className="text-sm text-white/85 mb-2">
              Your bags: ${formatMoney(lastMarketRecap.portfolioBefore)} → ${formatMoney(lastMarketRecap.portfolioAfter)}
              <span className={lastMarketRecap.delta >= 0 ? "text-green-400 ml-2" : "text-red-400 ml-2"}>
                ({lastMarketRecap.delta >= 0 ? '+' : ''}${formatMoney(lastMarketRecap.delta)} unrealized)
              </span>
            </div>
            
            {lastMarketRecap.changes && lastMarketRecap.changes.length > 0 && (
              <div className="mt-2 space-y-1 text-xs text-white/80">
                {lastMarketRecap.changes.map((c) => (
                  <div key={c.id} className="flex justify-between">
                    <span>{c.emoji} {c.name}:</span>
                    <span className={c.pct >= 0 ? "text-green-300" : "text-red-300"}>
                      {c.pct >= 0 ? '+' : ''}{c.pct}%
                    </span>
                  </div>
                ))}
              </div>
            )}

            <Button
              onClick={handleDismissBanner}
              size="sm"
              className="mt-3 bg-amber-500 hover:bg-amber-600 text-white"
            >
              Got it
            </Button>
          </div>
        )}

        {/* Hint */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/20">
          <div className="font-bold text-sm text-white mb-1">Urn Market</div>
          <div className="text-xs text-white/80 leading-relaxed mb-2">
            Prices move each age-up. You only get cash when you sell. Fees: {(tradeFeeRate * 100).toFixed(1)}% + ${gasFee} gas per trade.
          </div>
          <div className="text-[10px] text-white/50">
            Fictional in-game tokens. Not real crypto. No real money.
          </div>
        </div>

        {/* Portfolio Summary */}
        {portfolioValue > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/20">
            <div className="text-sm text-white/80 space-y-1">
              <div className="flex justify-between">
                <span>Portfolio Value:</span>
                <span className="font-bold text-purple-300">${formatMoney(portfolioValue)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Cost Basis:</span>
                <span className="font-bold text-amber-400">${formatMoney(totalCostBasis)}</span>
              </div>
              <div className="flex justify-between">
                <span>Unrealized P/L:</span>
                <span className={`font-bold ${unrealizedPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {unrealizedPL >= 0 ? '+' : ''}${formatMoney(unrealizedPL)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Token List */}
        <div className="space-y-3">
          {tokens.map((token) => {
            const pos = positions[token.id] || { qty: 0, costBasis: 0 };
            const holdings = pos.qty || 0;
            const price = Number(pricesById[token.id] || 100);
            const marketValue = holdings * price;
            
            return (
              <div
                key={token.id}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{token.emoji}</div>
                    <div>
                      <div className="font-bold text-white">{token.name}</div>
                      <div className="text-xs text-white/60">{token.symbol}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">${formatMoney(price)}</div>
                    {holdings > 0 && (
                      <>
                        <div className="text-xs text-green-400">{holdings}× = ${formatMoney(marketValue)}</div>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  {/* Decrement controls */}
                  <div className="flex gap-1">
                    <Button
                      onClick={() => handleBuy(token.id, -10)}
                      size="sm"
                      disabled={holdings < 10}
                      className="flex-1 bg-orange-600/80 hover:bg-orange-700 text-white disabled:opacity-30"
                      aria-label="Decrease by 10"
                    >
                      -10
                    </Button>
                    <Button
                      onClick={() => handleBuy(token.id, -5)}
                      size="sm"
                      disabled={holdings < 5}
                      className="flex-1 bg-orange-600/80 hover:bg-orange-700 text-white disabled:opacity-30"
                      aria-label="Decrease by 5"
                    >
                      -5
                    </Button>
                    <Button
                      onClick={() => handleBuy(token.id, -1)}
                      size="sm"
                      disabled={holdings < 1}
                      className="flex-1 bg-orange-600/80 hover:bg-orange-700 text-white disabled:opacity-30"
                      aria-label="Decrease by 1"
                    >
                      -1
                    </Button>
                  </div>
                  {/* Increment controls */}
                  <div className="flex gap-1">
                    <Button
                      onClick={() => handleBuy(token.id, 1)}
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      aria-label="Increase by 1"
                    >
                      +1
                    </Button>
                    <Button
                      onClick={() => handleBuy(token.id, 5)}
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      aria-label="Increase by 5"
                    >
                      +5
                    </Button>
                    <Button
                      onClick={() => handleBuy(token.id, 10)}
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      aria-label="Increase by 10"
                    >
                      +10
                    </Button>
                  </div>
                </div>
                
                {holdings > 0 && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleSell(token.id, 1)}
                      size="sm"
                      disabled={holdings < 1}
                      className="flex-1 bg-red-600/80 hover:bg-red-700 text-white disabled:opacity-30"
                    >
                      Sell 1
                    </Button>
                    <Button
                      onClick={() => handleSell(token.id, 5)}
                      size="sm"
                      disabled={holdings < 5}
                      className="flex-1 bg-red-600/80 hover:bg-red-700 text-white disabled:opacity-30"
                    >
                      Sell 5
                    </Button>
                    <Button
                      onClick={() => handleSell(token.id, holdings)}
                      size="sm"
                      disabled={holdings === 0}
                      className="flex-1 bg-red-600/80 hover:bg-red-700 text-white disabled:opacity-30"
                    >
                      Sell All
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}