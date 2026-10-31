import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FAMILY_VALUES_CATALOG } from './faithValuesCatalog';

export default function ValuesConversationModal({ open, onClose, onConfirm, childName, runSeed, currentYear }) {
  const [selectedValues, setSelectedValues] = React.useState([]);
  const [tone, setTone] = React.useState('warm');

  const handleToggleValue = (valueKey) => {
    setSelectedValues(prev => {
      if (prev.includes(valueKey)) {
        return prev.filter(k => k !== valueKey);
      }
      if (prev.length < 2) {
        return [...prev, valueKey];
      }
      // Already have 2, replace the first
      return [prev[1], valueKey];
    });
  };

  const handleConfirm = () => {
    if (selectedValues.length !== 2) {
      return;
    }
    onConfirm({ values: selectedValues, tone });
    setSelectedValues([]);
    setTone('warm');
  };

  const tones = [
    { id: 'warm', label: 'Warm & Story-Based', emoji: '💛', description: 'Share stories and connect emotionally' },
    { id: 'direct', label: 'Direct & Practical', emoji: '🎯', description: 'Clear expectations, no fluff' },
    { id: 'example', label: 'Lead by Example', emoji: '🌟', description: 'Model instead of preach' }
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[200]"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl my-8 max-h-[85vh] flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">💬 Values Conversation</h3>
                  <p className="text-sm text-slate-600 mt-1">Pick 2 values to discuss</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {FAMILY_VALUES_CATALOG.map((value) => {
                    const isSelected = selectedValues.includes(value.key);
                    const isDisabled = selectedValues.length >= 2 && !isSelected;
                    
                    return (
                      <button
                        key={value.key}
                        onClick={() => handleToggleValue(value.key)}
                        disabled={isDisabled}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-50'
                            : isDisabled
                              ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                              : 'border-slate-200 bg-white hover:border-indigo-300'
                        }`}
                      >
                        <div className="text-lg mb-1">{value.emoji}</div>
                        <div className="text-sm font-semibold text-slate-800">{value.label}</div>
                        {isSelected && (
                          <div className="mt-1 text-xs text-indigo-600">
                            ✓ Selected
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mb-4">
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Conversation tone:</label>
                  <div className="space-y-2">
                    {tones.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTone(t.id)}
                        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                          tone === t.id
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-slate-200 bg-white hover:border-amber-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{t.emoji}</span>
                          <span className="font-semibold text-slate-800">{t.label}</span>
                        </div>
                        <p className="text-xs text-slate-600">{t.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-200 flex-shrink-0">
                <div className="text-sm text-slate-600 text-center mb-3">
                  {selectedValues.length}/2 values selected
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    disabled={selectedValues.length !== 2}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}