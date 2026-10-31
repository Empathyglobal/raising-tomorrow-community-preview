const KEY = '__rtViewportModal';

export function installModalDismissal({ session, win, doc, root, onClose, makeToken = () => crypto.randomUUID() }) {
  const owns = entry => win.history.state?.[KEY] === entry.token;
  const push = entry => {
    const previous = win.history.state;
    win.history.pushState({ ...(previous && typeof previous === 'object' ? previous : {}), [KEY]: entry.token }, '', entry.url);
  };
  let entry = session.current;
  if (!entry || (!entry.pending && !owns(entry))) {
    if (entry) win.removeEventListener('popstate', entry.pop);
    entry = { token: makeToken(), generation: 0, pending: false, retiring: false, popped: false, closing: false, focus: doc.activeElement, url: win.location.href, owner: null };
    session.current = entry;
    entry.finish = () => {
      win.removeEventListener('popstate', entry.pop);
      if (session.current !== entry) return;
      session.current = null;
      const dialog = doc.activeElement?.closest?.('[role="dialog"]');
      if (win.location.href === entry.url && (!dialog || dialog === entry.root) && entry.focus?.isConnected) entry.focus.focus({ preventScroll: true });
    };
    // One entry-owned dispatcher also handles Back after its React owner unmounts.
    entry.pop = () => {
      if (owns(entry)) return;
      entry.pending = false;
      if (entry.retiring && entry.owner && win.location.href === entry.url) {
        push(entry);
        entry.retiring = entry.closing = entry.popped = false;
        return;
      }
      entry.popped = true;
      entry.closing = true;
      const owner = entry.owner;
      if (owner && !owner.closed) { owner.closed = true; owner.onClose(); }
      else if (!owner) entry.finish();
    };
    push(entry);
    win.addEventListener('popstate', entry.pop);
  } else if (entry.pending) {
    // Reopening while a previous dismissal traverses history must wait for that
    // traversal. The dispatcher replaces the marker only after it has settled.
    entry.retiring = true;
  }
  const generation = ++entry.generation;
  const owner = { onClose, closed: false };
  entry.owner = owner;
  entry.root = root;
  let active = true;
  const close = () => {
    if (!active || owner.closed || entry.closing) return;
    entry.closing = true;
    if (owns(entry)) { entry.pending = true; win.history.back(); }
    else { entry.popped = true; owner.closed = true; onClose(); }
  };
  const focusable = () => [...root.querySelectorAll('button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex]:not([tabindex="-1"])')]
    .filter(el => el.getClientRects().length > 0);
  const keydown = event => {
    const otherDialog = doc.activeElement?.closest?.('[role="dialog"]');
    if (otherDialog && otherDialog !== root) return;
    if (event.key === 'Escape') {
      event.preventDefault(); event.stopPropagation(); close();
    } else if (event.key === 'Tab') {
      const elements = focusable(), first = elements[0], last = elements.at(-1);
      if (!first) { event.preventDefault(); root.focus(); }
      else if (event.shiftKey && (doc.activeElement === first || !root.contains(doc.activeElement))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (doc.activeElement === last || !root.contains(doc.activeElement))) {
        event.preventDefault(); first.focus();
      }
    }
  };
  doc.addEventListener('keydown', keydown, true);
  (focusable()[0] || root).focus({ preventScroll: true });
  return {
    close,
    cleanup() {
      active = false;
      if (entry.owner === owner) entry.owner = null;
      doc.removeEventListener('keydown', keydown, true);
      queueMicrotask(() => {
        if (session.current !== entry || entry.generation !== generation || entry.owner) return;
        if (entry.popped || (!entry.pending && !owns(entry))) { entry.finish(); return; }
        if (!entry.pending && owns(entry)) {
          entry.retiring = entry.pending = true;
          win.history.back();
        }
      });
    }
  };
}
