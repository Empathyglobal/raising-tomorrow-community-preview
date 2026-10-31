import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const TutorialContext = createContext(null);

export const TutorialProvider = ({ children }) => {
  const [state, setState] = useState({
    active: false,
    tourId: null,
    stepIndex: 0,
    completed: {}, // Map of tourId -> boolean
    version: 3
  });

  const [actions, setActions] = useState({});

  // Anchor registry (id -> HTMLElement)
  const anchorsRef = useRef(new Map());
  const registerAnchor = useCallback((id, el) => {
    if (!id || !el) return;
    anchorsRef.current.set(id, el);
  }, []);
  const unregisterAnchor = useCallback((id, el) => {
    if (!id) return;
    const cur = anchorsRef.current.get(id);
    if (!el || cur === el) anchorsRef.current.delete(id);
  }, []);
  const getAnchorEl = useCallback((id) => anchorsRef.current.get(id) || null, []);

  // Simple event bus: lastEvent { name, tick, ts }
  const [lastEvent, setLastEvent] = useState(null);
  const emit = useCallback((name) => {
    if (!name) return;
    setLastEvent({ name, tick: Date.now(), ts: Date.now() });
  }, []);

  // Load completion state
  useEffect(() => {
    try {
      const stored = localStorage.getItem('rt:tutorial');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.version === 3) {
          setState(prev => ({ ...prev, completed: parsed.completed || {} }));
        }
      }
    } catch (e) {
      console.error("Failed to load tutorial state", e);
    }
  }, []);

  const saveCompletion = (completed) => {
    try {
      localStorage.setItem('rt:tutorial', JSON.stringify({ completed, version: 3 }));
    } catch (e) {
      console.error("Failed to save tutorial state", e);
    }
  };

  const startTour = useCallback((tourId, { force = false, fromStep = 0 } = {}) => {
    setState(prev => {
      if (!force && prev.completed[tourId]) return prev;
      return {
        ...prev,
        active: true,
        tourId,
        stepIndex: fromStep
      };
    });
  }, []);

  const stopTour = useCallback(({ markCompleted = false } = {}) => {
    setState(prev => {
      const nextCompleted = markCompleted && prev.tourId 
        ? { ...prev.completed, [prev.tourId]: true } 
        : prev.completed;
      
      if (markCompleted) saveCompletion(nextCompleted);

      return {
        ...prev,
        active: false,
        tourId: null,
        stepIndex: 0,
        completed: nextCompleted
      };
    });
  }, []);

  const nextStep = useCallback(() => {
    setState(prev => ({ ...prev, stepIndex: prev.stepIndex + 1 }));
  }, []);

  const prevStep = useCallback(() => {
    setState(prev => ({ ...prev, stepIndex: Math.max(0, prev.stepIndex - 1) }));
  }, []);

  const goToStep = useCallback((index) => {
    setState(prev => ({ ...prev, stepIndex: index }));
  }, []);

  const registerAction = useCallback((name, fn) => {
    setActions(prev => ({ ...prev, [name]: fn }));
  }, []);

  const runAction = useCallback((name) => {
    if (actions[name]) {
      actions[name]();
    } else {
      console.warn(`Tutorial action "${name}" not found`);
    }
  }, [actions]);

  return (
    <TutorialContext.Provider value={{
      ...state,
      startTour,
      stopTour,
      nextStep,
      prevStep,
      goToStep,
      registerAction,
      runAction,
      // Anchors + Events
      registerAnchor,
      unregisterAnchor,
      getAnchorEl,
      emit,
      lastEvent
    }}>
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};