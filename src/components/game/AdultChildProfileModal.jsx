import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function AdultChildProfileModal({
  open,
  onOpenChange,
  kid,
  displayedAge,
  onCall,
  onVisit,
  onAdvice,
  onSendMoney,
  onOpenGrandkid
}) {
  if (!kid) return null;

  const name = kid?.childSlice?.childName || 'Your child';
  const love = Number.isFinite(Number(kid?.childSlice?.love)) ? Number(kid.childSlice.love) : 50;
  const adultLife = kid?.adultLife || null;
  const isDeceased = adultLife?.deathYear != null;

  const partner = adultLife?.relationship?.partnerName ? `${adultLife.relationship.partnerName}` : null;
  const relStatus = adultLife?.relationship?.status || 'single';
  const edu = adultLife?.education?.track || 'unknown';
  const career = adultLife?.career?.status || 'unknown';
  const distance = adultLife?.distance || 'unknown';
  const grandkidIds = Array.isArray(adultLife?.grandkidIds) ? adultLife.grandkidIds : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>🧑 Adult Child — {name} ({displayedAge})</DialogTitle>
        </DialogHeader>

        <div className="text-sm space-y-2">
          <div><b>Closeness (Love):</b> {Math.round(love)}</div>
          <div><b>Life:</b> {edu} • {career}</div>
          <div><b>Relationship:</b> {relStatus}{partner ? ` (${partner})` : ''}</div>
          <div><b>Distance:</b> {distance}</div>
          <div><b>Grandkids:</b> {grandkidIds.length}</div>
        </div>

        {isDeceased ? (
          <div className="mt-4 p-6 bg-slate-900 rounded-lg text-center space-y-3">
            <div className="text-3xl">🕯️</div>
            <p className="text-sm text-slate-300 font-medium">
              Deceased — you can't interact, but their memory remains.
            </p>
            <p className="text-xs text-slate-400 italic leading-relaxed">
              Some losses don't resolve. They become part of you.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button variant="secondary" onClick={onCall}>📞 Call</Button>
            <Button variant="secondary" onClick={onVisit}>🚗 Visit</Button>
            <Button variant="secondary" onClick={onAdvice}>🧠 Give Advice</Button>
            <Button variant="secondary" onClick={onSendMoney}>💸 Send $250</Button>
          </div>
        )}

        {grandkidIds.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-semibold mb-2">Grandkids</div>
            <div className="space-y-2">
              {grandkidIds.map((gid) => (
                <Button
                  key={gid}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => onOpenGrandkid(gid)}
                >
                  👶 Open grandkid profile
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs opacity-70 mt-4">
          Adult children are not shown in the top child menu and cannot be opened in DevelopmentDetails.
        </div>
      </DialogContent>
    </Dialog>
  );
}