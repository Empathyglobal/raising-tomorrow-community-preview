import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

/** Local scratchpad. No telemetry, game history, user agent or URL is collected. */
export default function BugReportModal({ open, onClose, sourcePage = 'Unknown' }) {
  const [title, setTitle] = React.useState('');
  const [details, setDetails] = React.useState('');
  const [status, setStatus] = React.useState('');
  React.useEffect(() => {
    if (!open) { setTitle(''); setDetails(''); setStatus(''); }
  }, [open]);
  const localNote = () => JSON.stringify({ demo: true, title: title.trim(), details: details.trim(), page: sourcePage }, null, 2);
  const copyNote = async () => {
    try {
      await navigator.clipboard.writeText(localNote());
      setStatus('Copied to your clipboard. Nothing was sent.');
    } catch { setStatus('Clipboard unavailable. Use Download note instead.'); }
  };
  const downloadNote = () => {
    const url = URL.createObjectURL(new Blob([localNote()], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'raising-tomorrow-demo-note.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    setStatus('Local note downloaded. Nothing was sent.');
  };
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[1200] bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <section role="dialog" aria-modal="true" aria-labelledby="demo-note-title" className="w-full max-w-md bg-white rounded-2xl p-5 text-slate-800" onClick={e => e.stopPropagation()}>
        <h2 id="demo-note-title" className="text-lg font-semibold">Local demo bug note</h2>
        <p className="text-sm my-3">This preview has no bug inbox. Notes stay in this dialog until you copy or download them, and are cleared when you close it. Use fictional details only.</p>
        <label className="block text-sm mb-2">Title<Input value={title} onChange={e => setTitle(e.target.value)} /></label>
        <label className="block text-sm mb-2">Details<Textarea value={details} onChange={e => setDetails(e.target.value)} className="min-h-[120px]" /></label>
        <p role="status" className="text-sm my-2">{status}</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={copyNote} disabled={!title.trim() || !details.trim()}>Copy note</Button>
          <Button variant="outline" onClick={downloadNote} disabled={!title.trim() || !details.trim()}>Download note</Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      </section>
    </div>
  );
}
