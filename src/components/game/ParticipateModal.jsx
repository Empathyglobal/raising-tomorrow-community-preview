import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, ArrowLeft } from 'lucide-react';
import { useGameState } from '@/components/game/GameStateContext';
import { PARTICIPATE_TEMPLATES, HOLIDAY_KITS } from '@/components/game/cultureCatalog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function ParticipateModal({ open, onClose }) {
  const { gameState, logCultureMoment, addCultureEvent } = useGameState();
  const { cultureEvents } = gameState;
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedItem, setSelectedItem] = useState(null); // Template or Event
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: "", date: "", type: "Community", notes: "" });

  const handleSaveEvent = () => {
    addCultureEvent({
      ...newEvent,
      status: 'Planned',
      cultureTags: [] // MVP simplified
    });
    setIsAddingEvent(false);
    toast.success("Event saved.");
  };

  const handleComplete = (item) => {
    // Determine points
    const points = item.points || 60; // Default for custom event
    logCultureMoment({
      id: Date.now(),
      logType: "Participate",
      title: item.title || item.name,
      date: new Date().toISOString().split('T')[0],
      rootsPointsEarned: points,
      notes: "Completed event.",
      createdAt: Date.now()
    });
    toast.success("Celebration logged. Your child is building belonging through experience.");
    setSelectedItem(null);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-[110] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 50, opacity: 0 }}
          className="bg-slate-50 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh]"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-white p-4 border-b border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">Participate</h2>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-100">
              {['upcoming', 'holidays', 'my_events'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-sm font-medium capitalize transition-colors ${activeTab === tab ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {tab.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            
            {activeTab === 'upcoming' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
                  <h3 className="font-bold text-slate-800 mb-2">Upcoming moments</h3>
                  <p className="text-sm text-slate-500 mb-6">Add a real event—or pick an “at-home version” if going out isn’t possible.</p>
                  
                  {cultureEvents.length === 0 ? (
                    <div className="py-4 text-sm text-slate-400 italic">
                      No upcoming events yet. Add one you already know about, or choose a holiday kit.
                    </div>
                  ) : (
                    <div className="space-y-2 text-left mb-6">
                      {cultureEvents.map(evt => (
                        <div key={evt.id} className="p-3 border rounded-lg">
                          <div className="font-bold">{evt.name}</div>
                          <div className="text-xs text-slate-500">{evt.date} • {evt.type}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-center gap-3">
                    <Button onClick={() => setIsAddingEvent(true)} className="bg-indigo-600 text-white">+ Add an event</Button>
                    <Button variant="outline" onClick={() => setActiveTab('holidays')}>Browse Holiday Kits</Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'holidays' && (
              <div className="grid gap-4">
                <div className="mb-2">
                  <h3 className="font-bold text-slate-800">Holiday Kits</h3>
                  <p className="text-sm text-slate-500">A simple way to celebrate without pressure.</p>
                </div>
                {HOLIDAY_KITS.map(kit => (
                  <div key={kit.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-indigo-900">{kit.title}</h4>
                      <span className="text-xs bg-amber-50 text-amber-800 px-2 py-1 rounded-full">{kit.points} pts</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{kit.description}</p>
                    <Button size="sm" variant="outline" onClick={() => handleComplete(kit)}>Mark as Completed (Quick)</Button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'my_events' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-slate-800">My Events</h3>
                    <p className="text-sm text-slate-500">Anything you want: a festival, family dinner, etc.</p>
                  </div>
                  <Button size="sm" onClick={() => setIsAddingEvent(true)}>+ Add</Button>
                </div>

                <div className="space-y-2">
                  {cultureEvents.map(evt => (
                    <div key={evt.id} className="bg-white p-4 rounded-xl border border-slate-200">
                      <div className="font-bold text-slate-800">{evt.name}</div>
                      <div className="text-xs text-slate-500 mb-2">{evt.date} • {evt.type}</div>
                      <Button size="sm" variant="ghost" className="text-emerald-600" onClick={() => handleComplete(evt)}>Mark Complete</Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </motion.div>

      {/* Add Event Modal Overlay */}
      {isAddingEvent && (
        <div className="fixed inset-0 bg-black/70 z-[120] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl p-6">
            <h3 className="font-bold text-lg mb-4">Add Event</h3>
            <div className="space-y-3">
              <Input placeholder="Event name" value={newEvent.name} onChange={e => setNewEvent({...newEvent, name: e.target.value})} />
              <Input type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Type</label>
                <select 
                  className="w-full border rounded h-10 px-3"
                  value={newEvent.type}
                  onChange={e => setNewEvent({...newEvent, type: e.target.value})}
                >
                  <option>Community event</option>
                  <option>Holiday celebration</option>
                  <option>At-home celebration</option>
                </select>
              </div>
              <textarea 
                className="w-full border rounded p-3 text-sm h-20"
                placeholder="Notes"
                value={newEvent.notes}
                onChange={e => setNewEvent({...newEvent, notes: e.target.value})}
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="ghost" onClick={() => setIsAddingEvent(false)}>Cancel</Button>
              <Button onClick={handleSaveEvent} className="bg-indigo-600 text-white">Save event</Button>
            </div>
          </div>
        </div>
      )}

    </AnimatePresence>
  );
}