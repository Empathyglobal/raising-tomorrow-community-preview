import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ExternalLink, X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGameState, hasAnyChild } from '@/components/game/GameStateContext';
import { LIBRARY_SECTIONS } from './libraryData';
import { toast } from 'sonner';
import { getBookLearningToastCopy, renderBookLearningToastDescription, formatBookBonusLine } from './bookLearningToasts';

function formatEffectsDisplay(book, hasChild) {
  const section = book.sectionMode || 'oneTime';
  
  if (section === 'repeatable') {
    const parts = [];
    const stress = Number(book.stressDelta || 0);
    if (stress !== 0) parts.push(`Stress ${stress}`);
    
    if (hasChild && book.childEffects) {
      Object.entries(book.childEffects).forEach(([k, v]) => {
        if (v) parts.push(`${k.charAt(0).toUpperCase() + k.slice(1)} +${v}`);
      });
    }
    
    return parts.length ? parts.join(' • ') : 'Stress relief';
  }
  
  // One-time section
  return formatBookBonusLine(book.effects);
}

export default function LibraryModal({ open, onClose }) {
  const { gameState, applyDeltas, recordTimelineEntry, updateState, spendFocus, addLog, awardStudyPoints, applyStress } = useGameState();
  const hasChild = hasAnyChild(gameState);
  
  const [activeSectionId, setActiveSectionId] = React.useState('parenting');
  const [view, setView] = React.useState('list');
  const [selectedId, setSelectedId] = React.useState(null);

  const activeSection = LIBRARY_SECTIONS.find(s => s.id === activeSectionId) || LIBRARY_SECTIONS[0];
  const sortedCatalog = React.useMemo(
    () => [...activeSection.books].sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999)),
    [activeSection]
  );

  const selectedBook = React.useMemo(
    () => sortedCatalog.find((b) => b.id === selectedId) || null,
    [sortedCatalog, selectedId]
  );

  const libraryState = gameState?.library && typeof gameState.library === 'object' && !Array.isArray(gameState.library)
    ? gameState.library
    : {};
  const claimedById = libraryState?.claimedById && typeof libraryState.claimedById === 'object'
    ? libraryState.claimedById
    : {};
  const readById = libraryState?.readById && typeof libraryState.readById === 'object'
    ? libraryState.readById
    : {};

  const hasClaimed = React.useCallback((bookId) => !!claimedById?.[bookId], [claimedById]);
  const getReadCount = React.useCallback((bookId) => Number(readById?.[bookId] || 0), [readById]);

  React.useEffect(() => {
    if (!open) {
      setView('list');
      setSelectedId(null);
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const handleClose = () => {
    setView('list');
    setSelectedId(null);
    onClose?.();
  };

  const openAmazon = (url) => {
    if (!url) return;
    // External purchasing is unavailable in this private local preview.
    return;
  };

  const markOpened = (book) => {
    updateState((prev) => {
      const prevLib = prev?.library || {};
      const openedById = prevLib?.openedById || {};
      const currentCount = Number(openedById?.[book.id] || 0);
      return {
        library: {
          ...prevLib,
          openedById: {
            ...openedById,
            [book.id]: currentCount + 1
          }
        }
      };
    });
  };

  const openBookDetails = (book) => {
    setSelectedId(book.id);
    setView('details');
    markOpened(book);
  };

  const claimBookBonus = (book) => {
    if (!book || hasClaimed(book.id)) return;

    if (!spendFocus(1, `Library: ${book.title}`)) {
      addLog?.("⏳ Not enough focus to read this book.");
      return;
    }
    
    awardStudyPoints(1, `Library: ${book.title}`);
    applyDeltas(book.effects, `Library: ${book.title}`);

    updateState((prev) => {
      const prevLib = prev?.library || {};
      const claimed = prevLib?.claimedById || {};
      return {
        library: {
          ...prevLib,
          claimedById: {
            ...claimed,
            [book.id]: {
              claimedAtAge: prev?.currentYear ?? null
            }
          }
        }
      };
    });

    recordTimelineEntry?.({
      kind: 'grow',
      title: `Library: ${book.title}`,
      detail: `${book.author} • ${formatBookBonusLine(book.effects)}`,
      deltas: book.effects,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0,
      meta: {
        source: 'library',
        bookId: book.id,
        sectionId: book.sectionId || activeSectionId
      }
    });

    const copy = getBookLearningToastCopy(book.id, book.title, book);
    const bonusLine = `Bonus banked: ${formatBookBonusLine(book.effects)} (one-time)`;

    toast(`📚 ${book.title}`, {
      icon: copy.icon || '📚',
      duration: 6500,
      position: 'top-center',
      description: renderBookLearningToastDescription(copy, {
        childName: gameState?.childName || '',
        hasChild,
        bonusLine,
        sourceLine: '🏛️ Library • Focus -1 • One-time bonus'
      })
    });

    addLog?.(`📚 Read: "${book.title}" — ${formatBookBonusLine(book.effects)}.`);
    
    setView('summary');
  };

  const readFictionBook = (book) => {
    if (!book) return;

    if (!spendFocus(1, `Fiction: ${book.title}`)) {
      addLog?.("⏳ Not enough focus to read this book.");
      return;
    }

    const stressDelta = Number(book.stressDelta || -3);
    applyStress(stressDelta, `Fiction: ${book.title}`);

    const childDeltas = hasChild && book.childEffects ? book.childEffects : null;
    if (childDeltas) {
      applyDeltas(childDeltas, `Fiction: ${book.title}`);
    }

    updateState((prev) => {
      const prevLib = prev?.library || {};
      const readCounts = prevLib?.readById || {};
      return {
        library: {
          ...prevLib,
          readById: {
            ...readCounts,
            [book.id]: (Number(readCounts[book.id] || 0)) + 1
          }
        }
      };
    });

    recordTimelineEntry?.({
      kind: 'care',
      title: `Read: ${book.title}`,
      detail: `${book.author} • Stress ${stressDelta}${childDeltas ? ' • Child effects applied' : ''}`,
      deltas: childDeltas,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: stressDelta,
      meta: {
        source: 'library_fiction',
        bookId: book.id
      }
    });

    const copy = getBookLearningToastCopy(book.id, book.title, book);

    toast(`📖 ${book.title}`, {
      icon: copy.icon || '📖',
      duration: 6500,
      position: 'top-center',
      description: renderBookLearningToastDescription(copy, {
        childName: gameState?.childName || '',
        hasChild,
        bonusLine: `Stress ${stressDelta}${childDeltas ? ' • Child curiosity sparked' : ''}`,
        sourceLine: '📖 Fiction • Focus -1 • Repeatable'
      })
    });

    addLog?.(`📖 Read: "${book.title}" (Fiction) — Stress ${stressDelta}.`);
    
    setView('summary');
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1100]"
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
            className="fixed inset-0 z-[1101] p-4 overflow-y-auto"
          >
            <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">🏛️ Library</h2>
                    <p className="text-sm text-slate-600 mt-1">
                      {activeSection.mode === 'oneTime' 
                        ? 'Each book grants a one-time bonus.' 
                        : 'Read again and again for stress relief.'}
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-slate-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                {view === 'list' && (
                  <>
                    <div className="flex gap-2 mb-4">
                      {LIBRARY_SECTIONS.map(section => (
                        <button
                          key={section.id}
                          onClick={() => setActiveSectionId(section.id)}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                            activeSectionId === section.id
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {section.emoji} {section.label}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-3">
                      {sortedCatalog.map((book) => {
                        const claimed = hasClaimed(book.id);
                        const readCount = getReadCount(book.id);
                        const isRepeatable = activeSection.mode === 'repeatable';

                        return (
                          <div
                            key={book.id}
                            className="p-3 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="text-sm font-semibold text-slate-800">
                                  {book.rank}. {book.title}
                                </div>
                                <div className="text-xs text-slate-500 mt-0.5">{book.author}</div>
                              </div>

                              {isRepeatable ? (
                                readCount === 0 ? (
                                  <Badge variant="outline" className="whitespace-nowrap border-purple-200 text-purple-700">
                                    Repeatable
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="whitespace-nowrap">
                                    Read {readCount}x
                                  </Badge>
                                )
                              ) : (
                                claimed ? (
                                  <Badge variant="secondary" className="whitespace-nowrap">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Bonus claimed
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="whitespace-nowrap border-indigo-200 text-indigo-700">
                                    Bonus available
                                  </Badge>
                                )
                              )}
                            </div>

                            {Array.isArray(book.tags) && book.tags.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {book.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-[10px] text-slate-600">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            <div className="mt-2 text-xs text-slate-600">
                              <span className="font-semibold">{isRepeatable ? 'Effect:' : 'Bonus:'}</span>{' '}
                              {formatEffectsDisplay(book, hasChild)}
                            </div>

                            <div className="mt-3 flex gap-2">
                              <Button
                                onClick={() => openBookDetails(book)}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                              >
                                Open
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => openAmazon(book.amazonUrl)}
                                className="flex items-center gap-2"
                              >
                                <ExternalLink className="w-4 h-4" />
                                Amazon
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {view === 'details' && selectedBook && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <button
                        onClick={() => {
                          setView('list');
                          setSelectedId(null);
                        }}
                        className="flex items-center gap-1 text-slate-600 hover:text-slate-800 text-sm"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </button>
                    </div>

                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">{selectedBook.title}</h3>
                        <p className="text-sm text-slate-500">{selectedBook.author}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        {activeSection.emoji} {activeSection.label}
                      </Badge>
                    </div>

                    {activeSection.mode === 'repeatable' && (
                      <Badge variant="outline" className="mb-3 border-purple-200 text-purple-700">
                        Repeatable
                      </Badge>
                    )}

                    {Array.isArray(selectedBook.tags) && selectedBook.tags.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-1">
                        {selectedBook.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-[10px] text-slate-600">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {selectedBook.blurb && (
                      <p className="text-sm text-slate-700 leading-relaxed mb-3">{selectedBook.blurb}</p>
                    )}

                    <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-3 mb-4">
                      <div className="text-xs font-semibold text-indigo-900 mb-1">
                        {activeSection.mode === 'oneTime' ? 'One-time bonus' : 'Effect'}
                      </div>
                      <div className="text-sm text-indigo-900">
                        {activeSection.mode === 'oneTime' 
                          ? `Bonus: ${formatBookBonusLine(selectedBook.effects)}`
                          : formatEffectsDisplay(selectedBook, hasChild)}
                      </div>
                      {activeSection.mode === 'oneTime' && (
                        <div className="text-[11px] text-indigo-800 mt-1">
                          You can reopen this book anytime, but the bonus is awarded only once.
                        </div>
                      )}
                      {activeSection.mode === 'repeatable' && (
                        <div className="text-[11px] text-indigo-800 mt-1">
                          Read this book again and again for stress relief{hasChild ? ' and child curiosity' : ''}.
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      {activeSection.mode === 'oneTime' ? (
                        <Button
                          onClick={() => claimBookBonus(selectedBook)}
                          disabled={hasClaimed(selectedBook.id)}
                          className={`w-full h-11 font-semibold ${
                            hasClaimed(selectedBook.id)
                              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white'
                          }`}
                        >
                          {hasClaimed(selectedBook.id) ? 'Bonus already claimed' : 'Check out (1 Focus) — Claim bonus'}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => readFictionBook(selectedBook)}
                          className="w-full h-11 font-semibold bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
                        >
                          Read (1 Focus) — Reduce stress
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        onClick={() => openAmazon(selectedBook.amazonUrl)}
                        className="w-full h-11 flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        External store unavailable
                      </Button>

                      {selectedBook.amazonUrl && (
                        <a
                          href={selectedBook.amazonUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-[11px] text-slate-500 break-all underline decoration-slate-300 hover:text-slate-700"
                        >
                          {selectedBook.amazonUrl}
                        </a>
                      )}

                      <Button
                        onClick={() => setView('summary')}
                        className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white"
                      >
                        Next: Summary
                      </Button>
                    </div>
                  </div>
                )}

                {view === 'summary' && selectedBook && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <button
                        onClick={() => setView('details')}
                        className="flex items-center gap-1 text-slate-600 hover:text-slate-800 text-sm"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </button>
                    </div>

                    <div className="mb-3">
                      <h3 className="text-lg font-bold text-slate-800">Summary</h3>
                      <p className="text-sm text-slate-600 mt-0.5">
                        {selectedBook.title} <span className="text-slate-400">•</span> {selectedBook.author}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 mb-4">
                      <div className="text-xs font-semibold text-slate-700 mb-1">What you'll learn</div>
                      <ul className="list-disc ml-5 space-y-1 text-sm text-slate-700">
                        {(selectedBook.whatYouLearn || []).map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {hasChild && activeSection.mode === 'repeatable' && selectedBook.whatYouTellChild && (
                      <div className="rounded-xl border border-purple-200 bg-purple-50 p-3 mb-4">
                        <div className="text-xs font-semibold text-purple-900 mb-1">
                          What you share with {gameState?.childName || 'your child'}
                        </div>
                        <ul className="list-disc ml-5 space-y-1 text-sm text-purple-900">
                          {selectedBook.whatYouTellChild.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-3 mb-4">
                      <div className="text-xs font-semibold text-indigo-900 mb-1">
                        {activeSection.mode === 'oneTime' ? 'Bonus' : 'Effect'}
                      </div>
                      <div className="text-sm text-indigo-900">
                        {activeSection.mode === 'oneTime'
                          ? `Bonus: ${formatBookBonusLine(selectedBook.effects)}`
                          : formatEffectsDisplay(selectedBook, hasChild)}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        onClick={() => openAmazon(selectedBook.amazonUrl)}
                        className="w-full h-11 flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        External store unavailable
                      </Button>

                      {selectedBook.amazonUrl && (
                        <a
                          href={selectedBook.amazonUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-[11px] text-slate-500 break-all underline decoration-slate-300 hover:text-slate-700"
                        >
                          {selectedBook.amazonUrl}
                        </a>
                      )}

                      <Button onClick={() => setView('list')} className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white">
                        Back to Library list
                      </Button>
                    </div>
                  </div>
                )}

                {view !== 'list' && !selectedBook && (
                  <div className="text-sm text-slate-600">
                    Could not load that book. Please go back to the list.
                    <div className="mt-3">
                      <Button onClick={() => setView('list')} className="w-full">
                        Back to list
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}