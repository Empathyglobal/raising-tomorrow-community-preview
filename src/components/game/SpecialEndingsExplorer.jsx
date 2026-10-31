import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

const SPECIAL_ENDINGS_CATALOG = [
  // Main legendary/special/secret endings
  { id: 'MARS_PIONEER', title: '🏆 Legendary: First Human on Mars', category: 'Legendary', trophyId: 'mars_pioneer' },
  { id: 'HERO_PRESIDENT', title: '🗳️ Legendary: The President (Listener)', category: 'Legendary', trophyId: 'hero_president' },
  { id: 'ASTEROID_TYCOON', title: '☄️ Legendary: Asteroid Tycoon', category: 'Legendary', trophyId: 'asteroid_tycoon' },
  { id: 'TIME_TRAVELER', title: '⏳ Legendary: Time Traveler', category: 'Legendary', trophyId: 'time_traveler' },
  { id: 'SUPERVILLAIN_ARC', title: '🧨 Legendary: Supervillain Arc', category: 'Legendary', trophyId: 'supervillain_arc' },
  { id: 'BLOCKCRAFT_2', title: '🧱 Special: Blockcraft 2', category: 'Special', trophyId: 'blockcraft_2' },
  { id: 'CULT_LEADER', title: '🕯️ Special: Cult Leader', category: 'Special', trophyId: 'cult_leader', endingCode: 'RT-FAITH-CULT' },
  { id: 'HUMAN_RESISTANCE', title: '🤖 Secret: Human Resistance', category: 'Secret', trophyId: 'human_resistance' },
  
  // Special Start endings
  { id: 'WAR_ZONE_TRAGIC', title: '💔 Special Start: War Zone (Tragic)', category: 'Special Start', endingCode: 'RT-GZ-TRAGIC' },
  { id: 'WAR_ZONE_HOPE', title: '🕊️ Special Start: War Zone (Hope)', category: 'Special Start', endingCode: 'RT-GZ-HOPE' },
  { id: 'REFUGEE_TRAGIC', title: '💔 Special Start: Refugee Camp (Tragic)', category: 'Special Start', endingCode: 'RT-SY-TRAGIC' },
  { id: 'REFUGEE_HOPE', title: '🕊️ Special Start: Refugee Camp (Hope)', category: 'Special Start', endingCode: 'RT-SY-HOPE' },
  { id: 'PRK_001_DYNASTY', title: '🟥 Insane Start: Dynasty Maintained', category: 'Special Start', endingCode: 'RT-PRK-001' },
  { id: 'PRK_002_OVERTHROWN', title: '🟦 Insane Start: Overthrown', category: 'Special Start', endingCode: 'RT-PRK-002' },
  { id: 'PRK_003_UNIFIER', title: '🟩 Insane Start: Elections & Unification', category: 'Special Start', endingCode: 'RT-PRK-003' }
];

const CATEGORY_COLORS = {
  Legendary: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
  Special: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
  Secret: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
  'Special Start': 'bg-blue-500/20 text-blue-300 border-blue-400/40'
};

export default function SpecialEndingsExplorer({ onLoadEnding, onBackToRandom }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortMode, setSortMode] = useState('alpha'); // 'alpha' | 'category'

  const filteredAndSorted = useMemo(() => {
    let results = [...SPECIAL_ENDINGS_CATALOG];

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(e => 
        e.title.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        (e.trophyId && e.trophyId.toLowerCase().includes(q)) ||
        (e.endingCode && e.endingCode.toLowerCase().includes(q))
      );
    }

    // Filter by category
    if (categoryFilter !== 'All') {
      results = results.filter(e => e.category === categoryFilter);
    }

    // Sort
    if (sortMode === 'alpha') {
      results.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortMode === 'category') {
      results.sort((a, b) => {
        if (a.category !== b.category) return a.category.localeCompare(b.category);
        return a.title.localeCompare(b.title);
      });
    }

    return results;
  }, [searchQuery, categoryFilter, sortMode]);

  const categories = ['All', ...new Set(SPECIAL_ENDINGS_CATALOG.map(e => e.category))];

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h3 className="text-xl font-bold text-amber-300 mb-4">🔍 Special Endings Explorer</h3>
      
      <p className="text-sm text-slate-400 mb-4">
        Load any special ending deterministically (no RNG grinding needed).
      </p>

      {/* Controls */}
      <div className="space-y-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by title, ID, trophy, or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortMode} onValueChange={setSortMode}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alpha">A → Z</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto mb-4 pr-2">
        {filteredAndSorted.length === 0 ? (
          <div className="text-center text-slate-500 py-8 text-sm">
            No endings match your search.
          </div>
        ) : (
          filteredAndSorted.map(ending => (
            <div
              key={ending.id}
              className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-200 mb-1">{ending.title}</div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[ending.category]}`}>
                      {ending.category}
                    </span>
                    {ending.trophyId && (
                      <span className="text-[10px] text-slate-500 font-mono">
                        Trophy: {ending.trophyId}
                      </span>
                    )}
                    {ending.endingCode && (
                      <span className="text-[10px] text-slate-500 font-mono">
                        {ending.endingCode}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => onLoadEnding(ending.id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
                >
                  Load
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Back to Random */}
      <Button
        onClick={onBackToRandom}
        variant="outline"
        className="w-full border-white/20 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
      >
        ↩️ Back to Random Test
      </Button>
    </div>
  );
}