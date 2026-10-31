import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BOOKSTORE_CATALOG } from './bookstoreData';
import { useGameState, formatMoney } from '@/components/game/GameStateContext';

/**
 * BookstoreModal
 * UI-only modal.
 * - Purchase logic lives in the parent via `onPurchase(book)`.
 * - ownedBooks is expected to be: { [bookId]: { purchasedAtAge: number } }
 */
export default function BookstoreModal({
  open,
  onClose,
  onPurchase,
  ownedBooks = {},
  money,
}) {
  const { getLocalAmount } = useGameState();

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  const handlePurchase = (book) => {
    if (!onPurchase) return;
    if (ownedBooks?.[book.id]) return;

    onPurchase(book);
    // Close to avoid stacking over the ActionResultSheet
    if (onClose) onClose();
  };

  const handleViewAmazon = (url) => {
    // External purchasing is unavailable in this private local preview.
    return;
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1200]"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[1201] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden pointer-events-auto">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold mb-1">📚 Bookstore</h2>
                <p className="text-indigo-100 text-sm">
                  Small books. Big ripple effects.
                  {Number.isFinite(Number(money)) ? ` • Money: $${Number(money)}` : ''}
                </p>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(80vh-180px)]">
                <div className="space-y-4">
                  {BOOKSTORE_CATALOG.map((book) => {
                    const isOwned = !!ownedBooks?.[book.id];
                    return (
                      <div
                        key={book.id}
                        className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-800 mb-1">
                              {book.title}
                            </h3>
                            <p className="text-sm text-slate-600 mb-2">by {book.author}</p>
                            <div className="flex items-center gap-3 text-sm">
                              <span className="font-semibold text-slate-700">${formatMoney(getLocalAmount(book.price))}</span>
                              <span className="text-emerald-600 font-medium">
                                Empathy +{book.effects?.empathy ?? 0}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <Button
                              onClick={() => handlePurchase(book)}
                              disabled={isOwned}
                              className={`min-w-[120px] ${
                                isOwned
                                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                                  : 'bg-indigo-600 hover:bg-indigo-700'
                              }`}
                            >
                              {isOwned ? (
                                <>
                                  <Check className="w-4 h-4 mr-1" />
                                  Owned
                                </>
                              ) : (
                                `Buy ($${typeof getLocalAmount === 'function' ? formatMoney(getLocalAmount(book.price)) : book.price})`
                              )}
                            </Button>

                            <Button
                              onClick={() => handleViewAmazon(book.amazonUrl)}
                              variant="outline"
                              className="min-w-[120px]"
                            >
                              External store unavailable
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-slate-200 p-4 bg-slate-50">
                <Button onClick={onClose} variant="outline" className="w-full">
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}