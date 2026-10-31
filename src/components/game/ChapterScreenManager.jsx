import React from 'react';
import { useGameState } from '@/components/game/GameStateContext';
import ChapterScreen from '@/components/game/ChapterScreen';
import { CHAPTERS } from '@/components/storybook/chapters';
import { STORYBOOK_CHAPTERS } from '@/components/storybook/storybookAssets';
import { getChapterImageFilename } from '@/components/storybook/imageMap';

const AGE_TO_CHAPTER = [
  { age: 0, id: 'birth' },
  { age: 5, id: 'kindergarten' },
  { age: 11, id: 'middle_school' },
  { age: 14, id: 'high_school' },
  { age: 18, id: 'graduation' },
  { age: 19, id: 'moving_out' },
];

export default function ChapterScreenManager() {
  const { gameState, updateState } = useGameState();
  const isStorybook = (typeof document !== 'undefined' && document.documentElement?.dataset?.uiTheme === 'storybook') || gameState.settings?.uiTheme === 'storybook';
  const age = Number(gameState.currentYear || 0);

  const chapterId = React.useMemo(() => {
    const found = AGE_TO_CHAPTER.find(e => e.age === age);
    return found?.id || null;
  }, [age]);

  const shownMap = gameState.shownChapters || {};
  const shouldShow = isStorybook && chapterId && !shownMap[chapterId];

  const [open, setOpen] = React.useState(false);
  const [manualChapterId, setManualChapterId] = React.useState(null);

  React.useEffect(() => {
    if (shouldShow) {
      setOpen(true);
      updateState(prev => ({ shownChapters: { ...(prev.shownChapters || {}), [chapterId]: true } }));
    } else if (!manualChapterId) {
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldShow, chapterId]);

  // Storybook-safe manual trigger
  React.useEffect(() => {
    const handler = (e) => {
      if (!isStorybook) return;
      const id = e?.detail?.id;
      if (id === 'birth' || id === 'kindergarten') {
        setManualChapterId(id);
        setOpen(true);
      }
    };
    window.addEventListener('storybook:showChapter', handler);
    return () => window.removeEventListener('storybook:showChapter', handler);
  }, [isStorybook]);

  if (!open) return null;

  const activeId = manualChapterId || chapterId;
  const chapter = CHAPTERS.find(c => c.id === activeId) || { id: activeId, title: 'New Chapter', subtitle: '', image: '' };
  const filename = isStorybook && activeId ? (getChapterImageFilename(activeId) || STORYBOOK_CHAPTERS[activeId] || null) : null;

  return (
    <ChapterScreen
      open={open}
      image={filename}
      title={chapter.title}
      subtitle={chapter.subtitle}
      onContinue={() => { setOpen(false); setManualChapterId(null); }}
    />
  );
}