import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { deleteSlot, getActiveSlotId } from '@/components/game/saveManager';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} errorInfo={this.state.errorInfo} />;
    }

    return this.props.children;
  }
}

function ErrorFallback({ error, errorInfo }) {
  const navigate = useNavigate();

  const handleReset = () => {
    // Clear legacy single-save key (older builds)
    try { localStorage.removeItem('gameState'); } catch (e) {}
    
    // Clear the active multi-save slot (new builds). Otherwise the app can get stuck
    // reloading the same corrupted slot on refresh.
    try {
      const active = (typeof getActiveSlotId === 'function' ? getActiveSlotId() : null) || 'slot1';
      deleteSlot(active);
    } catch (e) {
      // Last resort: nuke the whole save manager
      try { localStorage.removeItem('RT_SAVE_MANAGER'); } catch (e2) {}
    }

    // Navigate to start
    navigate(createPageUrl('Start'));
    window.location.reload();
  };

  const handleCopyDebug = () => {
    const debugText = `Error: ${error?.message || 'Unknown error'}\n\nStack: ${error?.stack || 'No stack trace'}\n\nComponent Stack: ${errorInfo?.componentStack || 'No component stack'}`;
    navigator.clipboard.writeText(debugText);
  };

  const debugEnabled = true; // Always show debug info to help diagnose startup errors

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border-2 border-red-200">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Something went wrong</h1>
          <p className="text-slate-600">The game encountered an error and needs to restart.</p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleReset}
            className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold"
          >
            Reset Run
          </Button>

          {debugEnabled && (
            <Button
              onClick={handleCopyDebug}
              variant="outline"
              className="w-full"
            >
              Copy Debug Info
            </Button>
          )}
        </div>

        {debugEnabled && error && (
          <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-xs font-mono text-red-800 break-all">
              {error.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ErrorBoundary;