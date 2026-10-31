import React, { useEffect, useMemo, useState } from 'react';
import { X, ChevronRight, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState, hasAnyChild } from "@/components/game/GameStateContext";
import RelationshipProfileModal from './RelationshipProfileModal';
import PlayerSpriteAvatar from '@/components/game/PlayerSpriteAvatar';
import { shouldUseSpriteForRole, getSpriteMetaForPerson } from '@/components/game/relationshipSpriteUtils';
import { getRoleLabel } from '@/components/game/kinshipLabels';

const SECTIONS = [
  { id: 'household', title: 'Household', roles: ['child', 'partner', 'wife', 'husband'] },
  { id: 'side', title: 'Side Relationships', roles: ['side_partner'] },
  { id: 'family', title: 'Your Family', roles: ['my_mom', 'my_dad', 'sibling', 'inlaw_mom', 'inlaw_dad'] },
  { id: 'childParents', title: "Child's Parents", roles: ['mother_of_child', 'father_of_child'] },
  { id: 'friends', title: 'Friends', roles: ['my_best_friend', 'friend'] },
  { id: 'theirWorld', title: 'Their World', roles: ['teacher', 'best_friend'] },
];

const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, n));

export default function RelationshipsModal({ open, onClose, onViewChildProfile }) {
  const { gameState } = useGameState();
  const { relationships, currentYear, love } = gameState;

  const [selectedPersonId, setSelectedPersonId] = useState(null);

  useEffect(() => {
    if (!open) setSelectedPersonId(null);
  }, [open]);

  const roster = useMemo(() => {
    const list = Array.isArray(relationships?.roster) ? relationships.roster : [];
    const metList = list.filter((p) => (p?.createdAtAge ?? 0) <= currentYear);
    
    const hasChild = hasAnyChild(gameState);
    const CHILD_DEPENDENT_ROLES = new Set(['child','father_of_child','mother_of_child','teacher','best_friend']);
    
    return hasChild ? metList : metList.filter(p => !CHILD_DEPENDENT_ROLES.has(p.role));
  }, [relationships?.roster, currentYear, gameState]);

  const grouped = useMemo(() => {
    const byId = Object.fromEntries(roster.map(p => [p.id, p]));
    const used = new Set();

    const groups = SECTIONS.map(section => {
      const people = roster
        .filter(p => section.roles.includes(p.role))
        .sort((a, b) => (section.roles.indexOf(a.role) - section.roles.indexOf(b.role)));
      people.forEach(p => used.add(p.id));
      return { ...section, people };
    });

    // Anything not captured
    const leftovers = roster.filter(p => !used.has(p.id));
    if (leftovers.length) {
      groups.push({ id: 'other', title: 'Other', roles: [], people: leftovers });
    }

    return { groups, byId };
  }, [roster]);

  const getMeter = (person) => {
    if (!person) return 50;
    if (person.role === 'child') return clamp(Math.round((love ?? 0) * 10));
    return clamp(person.meter ?? 50);
  };

  const openPerson = (person) => {
    if (!person) return;
    if (person.role === 'child') {
      onClose?.();
      onViewChildProfile?.();
      return;
    }
    setSelectedPersonId(person.id);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Relationships</h2>
                    <p className="text-white/80">Tap someone to interact</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {roster.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No relationships yet</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {grouped.groups
                      .filter(g => g.people.length)
                      .map(group => (
                        <div key={group.id}>
                          <div className="text-xs font-semibold tracking-wide text-slate-500 uppercase mb-2">
                            {group.title}
                          </div>

                          <div className="space-y-3">
                            {group.people.map(person => {
                              const meter = getMeter(person);
                              const isUnknownIdentity = 
                                person.identityStatus === 'unknown' || 
                                person.identityStatus === 'sealed_until_18' ||
                                (person.name && person.name.startsWith('Unknown'));
                              const roleLabel = getRoleLabel(person, gameState, { short: true });
                              return (
                                <button
                                  key={person.id}
                                  onClick={() => !isUnknownIdentity && openPerson(person)}
                                  disabled={isUnknownIdentity}
                                  className={`w-full text-left bg-slate-50 rounded-xl p-4 border border-slate-200 transition-colors ${
                                    isUnknownIdentity 
                                      ? 'opacity-60 cursor-not-allowed' 
                                      : 'hover:bg-slate-100'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    {/* Avatar: use sprites for all human relationships */}
                                    <div>
                                      {isUnknownIdentity ? (
                                        <div className="w-[52px] h-[52px] rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center text-2xl">
                                          ❓
                                        </div>
                                      ) : (() => {
                                        const meta = getSpriteMetaForPerson(person, gameState);
                                        return (
                                          <PlayerSpriteAvatar
                                            genderKey={meta.genderKey}
                                            ageNumber={meta.ageNumber}
                                            index={meta.index}
                                            size={52}
                                            fallbackEmoji={person.emoji}
                                            className="rounded-xl bg-slate-50 border border-slate-100 shadow-sm"
                                          />
                                        );
                                      })()}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                          <div className="font-semibold text-slate-800 truncate">
                                            {person.name}
                                          </div>
                                          <div className="text-xs text-slate-500">
                                            {roleLabel}
                                          </div>
                                          {isUnknownIdentity && (
                                            <div className="text-[10px] text-slate-400 mt-1">
                                              Identity unknown — cannot interact
                                            </div>
                                          )}
                                        </div>
                                        {!isUnknownIdentity && (
                                          <ChevronRight className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                                        )}
                                      </div>

                                      {!isUnknownIdentity && (
                                        <div className="mt-3">
                                          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                              className="h-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-300"
                                              style={{ width: `${meter}%` }}
                                            />
                                          </div>
                                          <div className="mt-1 flex items-center justify-between">
                                            <span className="text-[10px] text-slate-500">Relationship</span>
                                            <span className="text-[10px] font-semibold text-slate-700">{meter}/100</span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Person Profile Modal */}
          <RelationshipProfileModal
            open={!!selectedPersonId}
            personId={selectedPersonId}
            onClose={() => setSelectedPersonId(null)}
          />
        </>
      )}
    </AnimatePresence>
  );
}