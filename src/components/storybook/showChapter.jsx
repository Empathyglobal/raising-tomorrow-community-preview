// Dispatch a Storybook-only chapter overlay request
// Usage: import { showChapter } from '@/components/storybook/showChapter';
// showChapter('birth') or showChapter('kindergarten')
export function showChapter(id) {
  try {
    if (typeof window === 'undefined') return;
    const detail = { id };
    window.dispatchEvent(new CustomEvent('storybook:showChapter', { detail }));
  } catch (_) {
    // no-op
  }
}

export default showChapter;