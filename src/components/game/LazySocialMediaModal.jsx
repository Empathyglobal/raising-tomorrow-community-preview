import React, { useEffect, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function LazySocialMediaModal({ open, onClose, ...props }) {
  const [LoadedComp, setLoadedComp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const mod = await import("@/components/game/SocialMediaModal");
      setLoadedComp(() => mod.default);
    } catch (e) {
      console.error("Failed to load SocialMediaModal:", e);
      setErr(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    if (LoadedComp) return;
    if (loading) return;
    if (err) return;
    load();
  }, [open, LoadedComp, loading, err, load]);

  // closed: render nothing
  if (!open) return null;

  // error state: show retry UI and allow closing without crashing the app
  if (err) {
    return (
      <Dialog open={open} onOpenChange={(v) => { if (!v) onClose?.(); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Social Media unavailable</DialogTitle>
          </DialogHeader>

          <div className="text-sm text-slate-600">
            We couldn't load the Social Media screen (usually a network or preview cache issue).
            You can retry or close and keep playing.
          </div>

          <div className="flex justify-end gap-2 pt-4 pb-[calc(12px+env(safe-area-inset-bottom,0px))]">
            <Button variant="outline" onClick={() => onClose?.()}>
              Close
            </Button>
            <Button onClick={load} disabled={loading}>
              {loading ? "Retrying…" : "Retry"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // loading state: show lightweight modal
  if (!LoadedComp) {
    return (
      <Dialog open={open} onOpenChange={(v) => { if (!v) onClose?.(); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Loading Social Media…</DialogTitle>
          </DialogHeader>

          <div className="text-sm text-slate-600">One moment.</div>

          <div className="flex justify-end pt-4 pb-[calc(12px+env(safe-area-inset-bottom,0px))]">
            <Button variant="outline" onClick={() => onClose?.()}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const Comp = LoadedComp;
  return <Comp open={open} onClose={onClose} {...props} />;
}