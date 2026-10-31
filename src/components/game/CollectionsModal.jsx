import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useGameState } from './GameStateContext';

export default function CollectionsModal({ open, onClose }) {
  const { gameState } = useGameState();
  const [activeTab, setActiveTab] = useState('quotes');
  
  const collections = gameState.metaProgress?.collections || {
    kidQuotes: [],
    stickers: [],
    photos: [],
    goldenMoments: []
  };
  
  const tabs = [
    { id: 'quotes', label: 'Kid Quotes', emoji: '💬', count: collections.kidQuotes.length },
    { id: 'stickers', label: 'Stickers', emoji: '⭐', count: collections.stickers.length },
    { id: 'golden', label: 'Golden Moments', emoji: '✨', count: collections.goldenMoments.length }
  ];
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose?.(); }}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            <div className="text-2xl">📚 Collections</div>
          </DialogTitle>
        </DialogHeader>
        
        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.emoji} {tab.label} ({tab.count})
            </button>
          ))}
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-0 py-4">
          {activeTab === 'quotes' && (
            <div className="space-y-3">
              {collections.kidQuotes.length === 0 ? (
                <div className="text-center text-slate-400 py-8">
                  No quotes collected yet. Complete daily dilemmas!
                </div>
              ) : (
                collections.kidQuotes.map((quote, idx) => (
                  <div key={idx} className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                    <div className="text-sm font-medium text-purple-900 mb-1">
                      {quote.childName || 'Child'}, Age {quote.unlockedAtYear}
                    </div>
                    <div className="text-slate-700 italic">"{quote.text}"</div>
                  </div>
                ))
              )}
            </div>
          )}
          
          {activeTab === 'stickers' && (
            <div className="grid grid-cols-2 gap-3">
              {collections.stickers.length === 0 ? (
                <div className="col-span-2 text-center text-slate-400 py-8">
                  No stickers earned yet. Complete daily dilemmas!
                </div>
              ) : (
                collections.stickers.map((sticker, idx) => (
                  <div key={idx} className="bg-amber-50 rounded-xl p-4 border border-amber-200 text-center">
                    <div className="text-2xl mb-2">{sticker.name.split(' ')[0]}</div>
                    <div className="text-sm font-medium text-amber-900">
                      {sticker.name.substring(sticker.name.indexOf(' ') + 1)}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          
          {activeTab === 'golden' && (
            <div className="space-y-4">
              {collections.goldenMoments.length === 0 ? (
                <div className="text-center text-slate-400 py-8">
                  No golden moments yet. Keep building connection!
                </div>
              ) : (
                collections.goldenMoments.map((moment, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-300">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="text-3xl">✨</div>
                      <div>
                        <div className="font-semibold text-amber-900">
                          {moment.title}
                        </div>
                        <div className="text-xs text-amber-700">
                          Year {moment.unlockedAtYear}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-700 italic leading-relaxed">
                      {moment.text}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        
        <Button
          onClick={onClose}
          variant="outline"
          className="w-full mt-4"
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}