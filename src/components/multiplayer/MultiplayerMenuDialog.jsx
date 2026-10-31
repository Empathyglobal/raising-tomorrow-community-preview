import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function MultiplayerMenuDialog({
  open,
  onOpenChange,
  onLocalQuickStart,
  onLocalCustomize,
  onOnlineMultiplayer
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Multiplayer</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3">
          <Card className="p-4">
            <Button 
              onClick={onLocalQuickStart}
              className="w-full"
              variant="default"
            >
              🏠 Local Multiplayer (Quick Start)
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              Play locally with default characters
            </p>
          </Card>
          
          <Card className="p-4">
            <Button 
              onClick={onLocalCustomize}
              className="w-full"
              variant="default"
            >
              ✏️ Local Multiplayer (Customize Characters)
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              Choose names, genders, avatars, and starting role
            </p>
          </Card>
          
          <Card className="p-4">
            <Button 
              disabled
              className="w-full"
              variant="default"
            >
              🌐 Online Multiplayer
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              Unavailable in this local preview
            </p>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}