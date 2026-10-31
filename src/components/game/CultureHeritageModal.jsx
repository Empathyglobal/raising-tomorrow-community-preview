import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, MapPin, CheckCircle2, ChevronRight, BookOpen, Users, Star } from 'lucide-react';
import { useGameState } from '@/components/game/GameStateContext';
import { CULTURE_LEVELS, TEACH_TEMPLATES, PARTICIPATE_TEMPLATES, HOLIDAY_KITS } from '@/components/game/cultureCatalog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import CulturePlanSetup from '@/components/game/CulturePlanSetup';
import TeachCultureModal from '@/components/game/TeachCultureModal';
import ParticipateModal from '@/components/game/ParticipateModal';

export default function CultureHeritageModal({ open, onClose }) {
  const { gameState, logCultureMoment } = useGameState();
  const { culturePlan, cultureStats, cultureLogs } = gameState;
  const [setupOpen, setSetupOpen] = useState(false);
  const [teachOpen, setTeachOpen] = useState(false);
  const [participateOpen, setParticipateOpen] = useState(false);
  const [addTraditionOpen, setAddTraditionOpen] = useState(false);

  // New tradition form
  const [newTradition, setNewTradition] = useState({ name: "", when: "", what: "", why: "" });

  const currentLevel = CULTURE_LEVELS.find(l => l.level === cultureStats.level) || CULTURE_LEVELS[0];
  
  // Weekly Quest Logic
  const getWeeklyQuest = () => {
    // Deterministic random based on week/year could go here, for MVP just picking 3
    // 1 Teach, 1 Teach (diff), 1 Participate
    const t1 = TEACH_TEMPLATES[0];
    const t2 = TEACH_TEMPLATES[5];
    const p1 = PARTICIPATE_TEMPLATES[0];
    return [t1, t2, p1];
  };
  const weeklyQuest = getWeeklyQuest();

  // Logs
  const recentLogs = (cultureLogs || []).slice(0, 5);

  const handleStartQuest = (template, type) => {
    if (type === 'Teach') {
        // We need to pass the specific template to TeachModal if supported, 
        // but for now TeachModal selects from list. 
        // Enhancement: Pass initialSelection to TeachModal
        // I'll implement TeachModal to accept an initialTemplate
        setTeachOpen(true); // Ideally pass template ID
    } else {
        setParticipateOpen(true);
    }
  };

  const handleAddTradition = () => {
      // In a real app, save this to culturePlan.traditions or similar
      toast.success("Tradition added! (This is a mock for MVP)");
      setAddTraditionOpen(false);
  };

  if (!open) return null;

  // Render Setup if no plan
  if (!culturePlan && !setupOpen) {
    // If no plan, show setup directly or empty state. 
    // The prompt says "CARD EMPTY STATE CTA: Set up Culture Plan".
    // If we are here, we are "viewing" the page. 
    // I'll show the setup modal immediately if plan is missing on load?
    // Or render the empty state.
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-slate-50 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col min-h-[80vh] max-h-[90vh]"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-white p-6 border-b border-slate-200">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Culture & Heritage</h2>
                <p className="text-sm text-slate-500">Two paths, one purpose: helping your child feel proud, grounded, and connected.</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            {/* Summary Strip */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                <div className="text-[10px] uppercase tracking-wider font-bold text-indigo-400">Culture Level</div>
                <div className="text-sm font-bold text-indigo-900">{currentLevel.name} <span className="text-indigo-400 font-normal">(Lvl {currentLevel.level})</span></div>
              </div>
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                <div className="text-[10px] uppercase tracking-wider font-bold text-emerald-400">This Week</div>
                <div className="text-sm font-bold text-emerald-900">{cultureStats.pointsThisWeek} Roots Points</div>
              </div>
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                <div className="text-[10px] uppercase tracking-wider font-bold text-amber-400">Next Moment</div>
                <div className="text-sm font-bold text-amber-900 truncate">The Family Name Story</div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {!culturePlan ? (
               <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
                 <h3 className="text-lg font-bold text-slate-700 mb-2">Start Your Culture Plan</h3>
                 <p className="text-sm text-slate-500 mb-6 max-w-xs mx-auto">Define what culture means to your family and get personalized ideas.</p>
                 <Button onClick={() => setSetupOpen(true)} className="bg-indigo-600 text-white">Set up Culture Plan</Button>
               </div>
            ) : (
              <>
                {/* Choose Your Path */}
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setTeachOpen(true)}
                    className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all text-left group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-3 bg-indigo-100 text-indigo-700 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <BookOpen className="w-6 h-6" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Teach Culture</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">At-home stories, language, traditions, and family identity.</p>
                  </button>

                  <button 
                    onClick={() => setParticipateOpen(true)}
                    className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all text-left group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-3 bg-emerald-100 text-emerald-700 rounded-full group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Users className="w-6 h-6" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Participate</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">Events, holidays, and community moments you can actually do.</p>
                  </button>
                </div>

                {/* Weekly Quest */}
                <div>
                  <div className="flex items-baseline justify-between mb-3">
                    <h3 className="text-md font-bold text-slate-800">This Week’s Culture Quest</h3>
                    <span className="text-xs text-slate-400">Consistency beats intensity.</span>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-100 text-xs text-slate-500">
                      Three small actions—mix and match. If you do even one, you’re building roots.
                    </div>
                    {weeklyQuest.map((item, i) => (
                      <div key={item.id} className="p-4 border-b border-slate-100 last:border-0 flex justify-between items-center hover:bg-slate-50">
                        <div>
                          <div className="font-semibold text-slate-800 text-sm mb-0.5">{item.title}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-2">
                            <Clock className="w-3 h-3" /> {item.time}m • <Star className="w-3 h-3 text-amber-400" /> {item.points} pts
                          </div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleStartQuest(item, item.type)}>Start</Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Traditions */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-md font-bold text-slate-800">Your Family Traditions</h3>
                      <p className="text-xs text-slate-500">New or inherited. Small is powerful.</p>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => setAddTraditionOpen(true)}>+ Add</Button>
                  </div>
                  
                  {/* Empty State for Traditions (MVP) */}
                  <div className="bg-white p-6 rounded-2xl border border-dashed border-slate-200 text-center text-sm text-slate-400">
                    No traditions yet. Add one your family can repeat.
                  </div>
                </div>

                {/* Recent Logs */}
                <div>
                  <h3 className="text-md font-bold text-slate-800 mb-3">Recent Moments</h3>
                  {recentLogs.length === 0 ? (
                    <div className="bg-white p-6 rounded-2xl border border-dashed border-slate-200 text-center text-sm text-slate-400">
                      Your first moment is waiting. Teach something small or join a celebration, then log it here.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {recentLogs.map(log => (
                        <div key={log.id} className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-sm text-slate-800">{log.title}</div>
                            <div className="text-xs text-slate-500">
                              {log.logType} • {new Date(log.date).toLocaleDateString()} • +{log.rootsPointsEarned} pts
                            </div>
                            {log.childReaction && <div className="text-xs text-indigo-600 mt-1">Reaction: {log.childReaction}</div>}
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Modals */}
      <CulturePlanSetup open={setupOpen} onClose={() => setSetupOpen(false)} />
      <TeachCultureModal open={teachOpen} onClose={() => setTeachOpen(false)} />
      <ParticipateModal open={participateOpen} onClose={() => setParticipateOpen(false)} />
      
      {/* Quick Add Tradition Modal (Inline for MVP simplicity) */}
      {addTraditionOpen && (
        <div className="fixed inset-0 bg-black/60 z-[160] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl p-6">
            <h3 className="font-bold text-lg mb-4">Add a Tradition</h3>
            <div className="space-y-3">
              <Input placeholder="Tradition Name (e.g. Sunday family meal)" />
              <Input placeholder="When we do it" />
              <Input placeholder="What we do" />
              <Input placeholder="Why it matters" />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="ghost" onClick={() => setAddTraditionOpen(false)}>Cancel</Button>
              <Button onClick={handleAddTradition}>Save</Button>
            </div>
          </div>
        </div>
      )}

    </AnimatePresence>
  );
}