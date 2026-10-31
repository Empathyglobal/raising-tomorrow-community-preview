import React from 'react';
import { X, Play, Save, Trash2, Pencil, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useConfirm } from './ConfirmProvider';
import { useGameState, formatMoney } from '@/components/game/GameStateContext';
import { listSlots, getActiveSlotId, setActiveSlotId, renameSlot, deleteSlot } from './saveManager';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';


function formatUpdatedAt(updatedAt) {
  if (!updatedAt) return 'Never';
  try {
    const d = new Date(updatedAt);
    if (Number.isNaN(d.getTime())) return 'Unknown';
    return d.toLocaleString();
  } catch {
    return 'Unknown';
  }
}

export default function SaveLoadModal({
  open,
  onClose,
  mode = 'inGame', // 'inGame' | 'start'
  onAfterLoad,
  onStartNew,
}) {
  const confirm = useConfirm();
  const { gameState, saveGameToSlot, loadGameFromSlot } = useGameState();
  const [slots, setSlots] = React.useState([]);
  const [activeSlotId, setActiveSlotIdState] = React.useState('slot1');
  const [renamingSlotId, setRenamingSlotId] = React.useState(null);
  const [renameValue, setRenameValue] = React.useState('');

  const refresh = React.useCallback(() => {
    try {
      setSlots(listSlots());
      setActiveSlotIdState(getActiveSlotId() || 'slot1');
    } catch (e) {
      console.error('Failed to refresh save slots:', e);
    }
  }, []);

  React.useEffect(() => {
    if (open) {
      refresh();
    }
  }, [open, refresh]);

  // ISSUE B FIX: Safe body scroll lock with proper restoration
  React.useEffect(() => {
    if (open) {
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
    } else {
      const scrollY = -parseInt(document.body.style.top || '0', 10);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      window.scrollTo(0, scrollY);
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [open]);

  const handleLoad = async (slotId) => {
    const slot = slots.find(s => s.slotId === slotId);
    if (!slot?.exists || !slot?.started) return;

    if (mode === 'inGame') {
      const ok = await confirm({
        title: 'Load this family?',
        description: `${slot.label}\n${slot.childName || 'Family'} · Age ${slot.currentYear ?? 0}\n\nYour current game is autosaved, but you'll switch families.`,
        confirmText: 'Load'
      });
      if (!ok) return;
    }

    const ok = typeof loadGameFromSlot === 'function' ? loadGameFromSlot(slotId) : false;
    if (!ok) {
      toast.error('Could not load that save slot.');
      return;
    }

    refresh();
    onClose?.();
    if (typeof onAfterLoad === 'function') {
      onAfterLoad(slotId);
    }
  };

  const handleSaveCopy = async (slotId) => {
    if (!gameState?.childAvatarPicked && (gameState?.currentYear ?? 0) === 0) {
      toast.info('Nothing to save yet. Start a family first.');
      return;
    }

    const slot = slots.find(s => s.slotId === slotId);
    const isOverwriting = slot?.exists && slot?.started;

    if (isOverwriting) {
      const ok = await confirm({
        title: 'Overwrite this slot?',
        description: `Replace "${slot.label}"\n${slot.childName || 'Family'} · Age ${slot.currentYear ?? 0}\n\nWith current family:\n${gameState.childName || 'Family'} · Age ${gameState.currentYear ?? 0}`,
        confirmText: 'Overwrite',
        destructive: true
      });
      if (!ok) return;
    }

    const labelToPreserve = slot?.exists ? slot.label : null;
    const ok = typeof saveGameToSlot === 'function' ? saveGameToSlot(slotId, labelToPreserve) : false;
    if (!ok) {
      toast.error('Could not save to that slot.');
      return;
    }
    
    toast.success('Saved successfully!');

    refresh();
  };

  const handleSetActive = (slotId) => {
    // In 'start' mode: user is picking a slot for new family
    if (mode === 'start' && typeof onStartNew === 'function') {
      onStartNew(slotId);
      return;
    }
    
    // Legacy path (should not be reachable in inGame mode anymore)
    const ok = setActiveSlotId(slotId);
    if (!ok) {
      toast.error('Could not set active slot. Please try again.');
      return;
    }
    setActiveSlotIdState(slotId);
    refresh();
    toast.success(`Active slot set to ${slotId.toUpperCase()}`);
  };

  const startRenaming = (slotId) => {
    const slot = slots.find(s => s.slotId === slotId);
    setRenamingSlotId(slotId);
    setRenameValue(slot?.label || '');
  };

  const commitRename = () => {
    if (!renamingSlotId) return;
    const next = (renameValue || '').trim();
    if (!next) return;

    const ok = renameSlot(renamingSlotId, next);
    if (!ok) {
      toast.error('Could not rename that slot.');
      return;
    }

    setRenamingSlotId(null);
    setRenameValue('');
    refresh();
    toast.success('Renamed!');
  };

  const handleDelete = async (slotId) => {
    if (slotId === gameState.activeSaveSlotId) {
      toast.info('Load another save before deleting this active slot. This protects it from autosave recreation.');
      return;
    }
    const slot = slots.find(s => s.slotId === slotId);
    if (!slot?.exists) return;

    const ok = await confirm({
      title: 'Delete this save?',
      description: `${slot.label}\n${slot.childName || 'Family'} · Age ${slot.currentYear ?? 0}\n\nThis cannot be undone.`,
      confirmText: 'Delete',
      destructive: true
    });
    if (!ok) return;

    const deleted = deleteSlot(slotId);
    if (!deleted) {
      toast.error('Could not delete that slot.');
      return;
    }
    
    toast.success('Deleted!');

    // If we deleted the active slot, fall back to slot1
    if (slotId === activeSlotId) {
      setActiveSlotId('slot1');
      setActiveSlotIdState('slot1');
    }

    refresh();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop - ISSUE B FIX */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[51] flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="rt-modal-glass bg-gradient-to-br from-slate-50 to-amber-50/30 rounded-2xl shadow-2xl border border-amber-200/50 max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="p-5 border-b border-slate-200/50 bg-white/80 backdrop-blur-sm flex items-start justify-between gap-4 flex-shrink-0">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Save &amp; Load</h2>
                  <p className="text-sm text-slate-600 mt-1">
                    {mode === 'start'
                      ? 'Choose a family to continue, or pick a slot for a new family.'
                      : 'Save a copy, switch families, or manage your save slots.'}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    Active slot: <span className="font-semibold">{activeSlotId.toUpperCase()}</span>
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto flex-1">
                <div className="space-y-4">
                  {slots.map((slot) => {
                    const isActive = slot.slotId === activeSlotId;
                    const isEmpty = !slot.exists || !slot.started;
                    const isRenaming = renamingSlotId === slot.slotId;

                    return (
                      <div
                        key={slot.slotId}
                        className={`rounded-2xl border-2 p-4 ${
                          isActive ? 'border-indigo-400 bg-indigo-50/30' : 'border-slate-200 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                {slot.slotId.toUpperCase()}
                              </div>
                              {isActive && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                                  ACTIVE
                                </span>
                              )}
                            </div>

                            {isRenaming ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  value={renameValue}
                                  onChange={(e) => setRenameValue(e.target.value)}
                                  className="h-9"
                                  placeholder="Slot name"
                                />
                                <Button
                                  onClick={commitRename}
                                  className="h-9 px-3 rounded-xl"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setRenamingSlotId(null);
                                    setRenameValue('');
                                  }}
                                  className="h-9 px-3 rounded-xl"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div className="font-bold text-slate-900 truncate">{slot.label}</div>
                                <button
                                  onClick={() => startRenaming(slot.slotId)}
                                  className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
                                  title="Rename slot"
                                  disabled={!slot.exists}
                                >
                                  <Pencil className="w-4 h-4 text-slate-500" />
                                </button>
                              </div>
                            )}

                            <div className="text-sm text-slate-600 mt-1">
                              {isEmpty ? (
                                <span className="text-slate-500 italic">Empty</span>
                              ) : (
                                <>
                                  <span className="font-semibold">{slot.childName || 'Family'}</span>
                                  <span className="text-slate-400"> · </span>
                                  Age {slot.currentYear ?? 0}
                                  {slot.finished && (
                                    <>
                                      <span className="text-slate-400"> · </span>
                                      <span className="text-emerald-700 font-semibold">Finished</span>
                                    </>
                                  )}
                                </>
                              )}
                            </div>

                            {!isEmpty && Number.isFinite(Number(slot.money)) && (
                              <div className="text-sm text-slate-700 font-semibold mt-1">
                                💰 ${formatMoney(slot.money)}
                              </div>
                            )}

                            <div className="text-xs text-slate-500 mt-1">
                              Last updated: {formatUpdatedAt(slot.updatedAt)}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 shrink-0">
                            {mode === 'start' ? (
                              <>
                                <Button
                                  onClick={() => handleLoad(slot.slotId)}
                                  className="h-9 px-4 rounded-xl"
                                  disabled={isEmpty}
                                >
                                  <Play className="w-4 h-4 mr-2" />
                                  Play
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => handleSetActive(slot.slotId)}
                                  className="h-9 px-4 rounded-xl"
                                >
                                  Use for New
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  onClick={() => handleLoad(slot.slotId)}
                                  className="h-9 px-4 rounded-xl"
                                  disabled={isEmpty}
                                >
                                  <Play className="w-4 h-4 mr-2" />
                                  Load
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => handleSaveCopy(slot.slotId)}
                                  className="h-9 px-4 rounded-xl"
                                >
                                  <Save className="w-4 h-4 mr-2" />
                                  Save Copy
                                </Button>
                              </>
                            )}

                            <Button
                              variant="outline"
                              onClick={() => handleDelete(slot.slotId)}
                              className="h-9 px-4 rounded-xl text-red-600 border-red-200 hover:bg-red-50"
                              disabled={!slot.exists}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
