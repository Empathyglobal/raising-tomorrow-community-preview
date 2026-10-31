import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { useGameState } from '@/components/game/GameStateContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Slider } from '@/components/ui/slider';

const AGE_RANGES = [
  "Baby (0–12 months)",
  "Toddler (1–3)",
  "Preschool (3–5)",
  "School Age (6–10)",
  "Tween (11–13)",
  "Teen (14–18)"
];

const FOCUS_AREAS = [
  "Language",
  "Food & cooking",
  "Music & dance",
  "Stories & history",
  "Holidays & rituals",
  "Community & events",
  "Art & crafts",
  "Faith & spirituality",
  "Nature & place",
  "Family values"
];

const TIME_PREFS = [
  "5 minutes (tiny steps)",
  "10–15 minutes (short activities)",
  "30–60 minutes (family time)",
  "Mixed (some quick, some deeper)"
];

export default function CulturePlanSetup({ open, onClose }) {
  const { gameState, saveCulturePlan } = useGameState();
  const [step, setStep] = useState(1);
  
  // Form State
  const [cultures, setCultures] = useState([]);
  const [newCulture, setNewCulture] = useState("");
  const [childName, setChildName] = useState(gameState.childName || "");
  const [ageRange, setAgeRange] = useState(AGE_RANGES[2]);
  const [taughtLevels, setTaughtLevels] = useState({}); // { "CultureName": 25 }
  const [focusAreas, setFocusAreas] = useState([]);
  const [timePref, setTimePref] = useState(TIME_PREFS[1]);

  // Handlers
  const addCulture = () => {
    if (newCulture.trim() && !cultures.includes(newCulture.trim())) {
      const c = newCulture.trim();
      setCultures([...cultures, c]);
      setTaughtLevels(prev => ({ ...prev, [c]: 25 }));
      setNewCulture("");
    }
  };

  const removeCulture = (c) => {
    setCultures(cultures.filter(x => x !== c));
    const next = { ...taughtLevels };
    delete next[c];
    setTaughtLevels(next);
  };

  const toggleFocus = (f) => {
    if (focusAreas.includes(f)) setFocusAreas(focusAreas.filter(x => x !== f));
    else setFocusAreas([...focusAreas, f]);
  };

  const handleSave = () => {
    const plan = {
      cultures,
      childName,
      ageRange,
      taughtLevels,
      focusAreas,
      timePreference: timePref,
      createdAt: Date.now()
    };
    saveCulturePlan(plan);
    toast.success("Saved. Your Culture Plan is ready.");
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-[150] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Your Culture Plan</h2>
              <p className="text-xs text-slate-500 mt-1">
                Choose what “culture” means for your family.
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* Intro */}
            <p className="text-sm text-slate-600 leading-relaxed bg-blue-50 p-3 rounded-lg border border-blue-100">
              This can include nationality, ethnicity, tribe, religion, language, region, or family traditions. You’re in control—these are suggestions, not rules.
            </p>

            {/* A: Cultures */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">Your culture(s)</label>
              <p className="text-xs text-slate-500 mb-3">Add one or more cultures. You can be specific (e.g., “Punjabi”) or broad (e.g., “Filipino”).</p>
              
              <div className="flex gap-2 mb-3">
                <Input 
                  value={newCulture} 
                  onChange={e => setNewCulture(e.target.value)} 
                  placeholder="Type a culture (e.g. Mexican, Yoruba...)"
                  className="flex-1"
                  onKeyDown={e => e.key === 'Enter' && addCulture()}
                />
                <Button onClick={addCulture} variant="outline" className="shrink-0 border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100">
                  + Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {cultures.map(c => (
                  <span key={c} className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                    {c}
                    <button onClick={() => removeCulture(c)} className="hover:text-indigo-950"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            </div>

            {/* B: Child */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-3">Child Profile</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Child Name</label>
                  <Input value={childName} onChange={e => setChildName(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Age Range</label>
                  <select 
                    value={ageRange} 
                    onChange={e => setAgeRange(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    {AGE_RANGES.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* C: Levels */}
            {cultures.length > 0 && (
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">Culture Taught Level</label>
                <p className="text-xs text-slate-500 mb-4 flex items-center gap-1">
                  How much of this culture has your child learned so far?
                  <span className="text-[10px] bg-slate-100 px-1 rounded border" title="This helps us suggest the right next step">ℹ️</span>
                </p>
                
                <div className="space-y-6">
                  {cultures.map(c => (
                    <div key={c}>
                      <div className="flex justify-between text-xs font-medium mb-2">
                        <span>{c}</span>
                        <span className="text-indigo-600">
                          {taughtLevels[c] === 0 ? "Just starting" : 
                           taughtLevels[c] <= 25 ? "A little" : 
                           taughtLevels[c] <= 50 ? "Somewhat" : 
                           taughtLevels[c] <= 75 ? "A lot" : "Deeply connected"}
                        </span>
                      </div>
                      <Slider 
                        value={[taughtLevels[c]]} 
                        min={0} max={100} step={5} 
                        onValueChange={([v]) => setTaughtLevels({...taughtLevels, [c]: v})}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* D: Focus */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">What you want more of</label>
              <p className="text-xs text-slate-500 mb-3">What do you want more of in your home right now?</p>
              <div className="flex flex-wrap gap-2">
                {FOCUS_AREAS.map(f => (
                  <button
                    key={f}
                    onClick={() => toggleFocus(f)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      focusAreas.includes(f) 
                        ? 'bg-amber-100 border-amber-300 text-amber-900' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-amber-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* E: Time */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">Time & Energy</label>
              <p className="text-xs text-slate-500 mb-3">What feels realistic most weeks?</p>
              <div className="space-y-2">
                {TIME_PREFS.map(t => (
                  <label key={t} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="timePref" 
                      checked={timePref === t} 
                      onChange={() => setTimePref(t)} 
                      className="accent-indigo-600"
                    />
                    {t}
                  </label>
                ))}
              </div>
            </div>

            {/* Safety Note */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-500 italic">
              Note: Your family gets to define your culture. If something here doesn’t fit, edit it, rename it, or ignore it. Belonging should feel safe.
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 bg-white">
            <Button onClick={handleSave} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              Save Culture Plan
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}