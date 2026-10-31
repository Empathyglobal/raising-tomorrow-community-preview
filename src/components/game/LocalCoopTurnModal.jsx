import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getCoopSideDisplayName, getCoopSideAvatarMeta } from "@/components/game/localCoop";

export default function LocalCoopTurnModal({ open, onClose, toSide, gameState }) {
  if (!open) return null;
  
  const displayName = getCoopSideDisplayName(gameState, toSide);
  const avatarMeta = getCoopSideAvatarMeta(gameState, toSide);
  const emoji = avatarMeta?.emoji || '🙂';
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="rt-modal-surface max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl">🎮 Switch Controller</DialogTitle>
          <DialogDescription className="text-base pt-2">
            Hand the device to {emoji} {displayName}. It's their turn.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}