import React from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import { GameStateProvider } from '@/components/game/GameStateContext';
import { TutorialProvider } from '@/components/tutorial/TutorialContext';
import { ConfirmProvider } from '@/components/game/ConfirmProvider';


export default function Layout({ children }) {
  return (
    <ErrorBoundary>
      <GameStateProvider>
        <TutorialProvider>
          <ConfirmProvider>{children}</ConfirmProvider>
        </TutorialProvider>
      </GameStateProvider>
    </ErrorBoundary>
  );
}