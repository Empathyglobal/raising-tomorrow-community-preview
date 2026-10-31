import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function FamilyBackgroundModal({ open, siblings = [], niecesNephews = [], onClose }) {
  const hasSibs = Array.isArray(siblings) && siblings.length > 0;
  const hasNN = Array.isArray(niecesNephews) && niecesNephews.length > 0;

  const summaryLines = [];
  if (hasSibs) {
    const names = siblings.map(s => s.name).join(', ');
    summaryLines.push(`Siblings: ${names}`);
  }
  if (hasNN) {
    const names = niecesNephews.map(n => n.name).join(', ');
    summaryLines.push(`Nieces/Nephews: ${names}`);
  }
  const body = summaryLines.length ? summaryLines.join(' \u2022 ') : 'You grew up without nearby siblings or nieces/nephews.';

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1200]">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="w-full max-w-md rounded-xl bg-white shadow-xl ring-1 ring-black/5 p-6"
            >
              <h2 className="text-xl font-semibold mb-2">Family Background</h2>
              <p className="text-slate-600 mb-6 whitespace-pre-wrap">{body}</p>
              <div className="flex justify-end">
                <Button onClick={onClose} className="bg-indigo-600 hover:bg-indigo-700">Alright… that explains a lot.</Button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}