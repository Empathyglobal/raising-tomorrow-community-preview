import React, { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useGameState } from '@/components/game/GameStateContext';
import { mpGetSession, mpCommitSession } from './remoteMultiplayerClient';

const LS_KEY = 'rt_remote_mp_v1';

export default function RemoteMultiplayerSync() {
  const { gameState, patchRemoteMultiplayer, getRemoteCommitSnapshotJson, applyRemoteSnapshotFromSession, clearRemoteMultiplayer } = useGameState();
  const inFlightRef = useRef(false);
  const intervalRef = useRef(null);

  // On mount: restore from localStorage if needed
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved && !gameState.remoteMultiplayer?.enabled) {
        const { sessionId, joinCode, mySide } = JSON.parse(saved);
        if (sessionId && mySide) {
          patchRemoteMultiplayer({ enabled: true, sessionId, joinCode, mySide });
        }
      }
    } catch (err) {
      console.warn('[RemoteMultiplayerSync] Failed to restore from localStorage:', err);
    }
  }, []);

  // Poll loop
  useEffect(() => {
    const remote = gameState.remoteMultiplayer || {};
    if (!remote.enabled || !remote.sessionId) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const tick = async () => {
      if (inFlightRef.current) return;
      inFlightRef.current = true;

      try {
        const pendingCommit = remote.pendingCommit;
        const sessionId = remote.sessionId;

        // A) Commit if ready
        if (pendingCommit) {
          const ready = isCommitReady(gameState, pendingCommit);
          if (ready) {
            const snapshotJson = getRemoteCommitSnapshotJson();
            const session = await mpCommitSession({
              sessionId,
              expectedVersion: pendingCommit.expectedVersion ?? remote.stateVersion,
              nextActiveSide: pendingCommit.nextActiveSide,
              snapshotJson
            });

            patchRemoteMultiplayer({
              activeSide: session.activeSide,
              stateVersion: session.stateVersion,
              pendingCommit: null,
              lastSyncAt: Date.now(),
              lastError: null
            });

            // Persist
            persistToLS(remote.sessionId, remote.joinCode, remote.mySide);
          }
        } else {
          // B) Fetch session
          const session = await mpGetSession({ sessionId });

          if (session.stateVersion > (remote.stateVersion || 0)) {
            const snapshotObj = JSON.parse(session.snapshotJson);
            applyRemoteSnapshotFromSession(snapshotObj, session);
          } else {
            patchRemoteMultiplayer({
              activeSide: session.activeSide,
              stateVersion: session.stateVersion,
              lastSyncAt: Date.now()
            });
          }
        }
      } catch (err) {
        const msg = err.message || String(err);

        // Hard failures: 403/404 => disconnect
        if (msg.includes('403') || msg.includes('404') || msg.includes('Forbidden') || msg.includes('not found')) {
          toast.error('Remote session lost. Disconnecting.');
          clearRemoteMultiplayer();
          localStorage.removeItem(LS_KEY);
          return;
        }

        // 409 conflict => clear pendingCommit to refresh from server
        if (msg.includes('409') || msg.includes('conflict') || msg.includes('turn') || msg.includes('Version')) {
          toast.error('Turn conflict detected. Refreshing...');
          patchRemoteMultiplayer({ pendingCommit: null });
        } else {
          patchRemoteMultiplayer({ lastError: msg });
        }
      } finally {
        inFlightRef.current = false;
      }
    };

    // Initial tick
    tick();

    // Poll every 2s
    intervalRef.current = setInterval(tick, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [gameState.remoteMultiplayer?.enabled, gameState.remoteMultiplayer?.sessionId, gameState.remoteMultiplayer?.pendingCommit, gameState.currentYear, gameState.coop?.activeSide]);

  return null;
}

function isCommitReady(gameState, pendingCommit) {
  if (!pendingCommit) return false;

  if (pendingCommit.type === 'pass') {
    return gameState.coop?.activeSide === 'partner';
  }

  if (pendingCommit.type === 'endYear') {
    const yearChanged = gameState.currentYear !== pendingCommit.fromYear;
    const turnReset = gameState.coop?.activeSide === 'player';

    if (yearChanged && turnReset) return true;

    // Safety fallback: if 6s passed and year changed, allow commit
    const elapsed = Date.now() - (pendingCommit.createdAt || 0);
    if (elapsed > 6000 && yearChanged) return true;

    return false;
  }

  return false;
}

function persistToLS(sessionId, joinCode, mySide) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ sessionId, joinCode, mySide }));
  } catch (err) {
    console.warn('[RemoteMultiplayerSync] Failed to persist to localStorage:', err);
  }
}