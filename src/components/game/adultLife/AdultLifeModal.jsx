import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function AdultLifeModal({ open, onOpenChange, popup, onChoose }) {
  if (!popup) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>🧑‍👧 Adult Life — {popup.kidName}</DialogTitle>
        </DialogHeader>

        <div className="text-sm whitespace-pre-line mb-4">{popup.body}</div>

        <div className="space-y-2">
          {popup.choices?.map((c) => (
            <Button
              key={c.id}
              variant="secondary"
              className="w-full justify-start text-left h-auto py-3"
              onClick={() => onChoose(c.id)}
            >
              <div className="flex gap-3">
                <div className="font-mono w-10 shrink-0">{c.letter}. {c.emoji}</div>
                <div>
                  <div className="font-semibold">{c.text}</div>
                  <div className="text-xs opacity-80 mt-1 whitespace-pre-line">{c.consequence}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}