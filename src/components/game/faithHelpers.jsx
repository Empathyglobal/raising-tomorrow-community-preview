// Faith system standalone helpers (avoid circular dependencies)

export function maybeQueueFaithPopup(age, state, updateStateFn) {
  try {
    const faith = state.faith || {};
    if (!faith.tradition) return;
    
    const MILESTONE_AGES = [7, 12, 16];
    const processed = Array.isArray(faith.milestoneAgesProcessed) ? faith.milestoneAgesProcessed : [];
    
    if (!MILESTONE_AGES.includes(age)) return;
    if (processed.includes(age)) return;
    
    const love100 = Math.max(0, Math.min(100, Number(state.love || 50)));
    const discipline = Number(state.stats?.discipline || 0);
    const discipline100 = Math.max(0, Math.min(100, discipline * 5));
    const exposure = Math.max(0, Math.min(100, faith.exposure || 0));
    const devotion = Math.max(0, Math.min(100, faith.devotion || 0));
    const pressure = Math.max(0, Math.min(100, (discipline100 - love100) * 0.6));
    
    const decisionScore = Math.max(0, Math.min(100, 
      0.45 * exposure + 0.35 * love100 + 0.20 * devotion - 0.35 * pressure
    ));
    
    const commitW = Math.max(0, decisionScore - 45);
    const refuseW = Math.max(0, 55 - decisionScore);
    const questionW = 20;
    const driftW = 15;
    
    const total = commitW + refuseW + questionW + driftW;
    if (total <= 0) return;
    
    // Simple RNG (inline to avoid importing createSeededRng)
    const seedStr = `${state.runSeed || 'seed'}|faith_popup|age:${age}`;
    let h = 0;
    for (let i = 0; i < seedStr.length; i++) {
      h = ((h << 5) - h) + seedStr.charCodeAt(i);
      h |= 0;
    }
    let rngState = (h >>> 0) || 1;
    const nextFloat = () => {
      rngState = (Math.imul(1664525, rngState) + 1013904223) >>> 0;
      return rngState / 4294967296;
    };
    
    const roll = nextFloat() * total;
    
    let outcome = 'question';
    let acc = 0;
    
    acc += commitW;
    if (roll < acc) outcome = 'commit';
    else {
      acc += refuseW;
      if (roll < acc) outcome = 'refuse';
      else {
        acc += questionW;
        if (roll < acc) outcome = 'question';
        else outcome = 'drift';
      }
    }
    
    const COPY = {
      commit: {
        title: "A Commitment",
        body: "After months of routines, questions, and small conversations, your child decides to take {faithName} seriously. It becomes part of how they make sense of the world."
      },
      question: {
        title: "Big Questions",
        body: "Your child is curious about {faithName}, but they're not sure what they believe yet. They're watching, asking, and deciding what fits."
      },
      drift: {
        title: "Not Practicing",
        body: "Your child still thinks of {faithName} as part of their background, but they aren't motivated to practice right now."
      },
      refuse: {
        title: "A Clear No",
        body: "Your child pushes back on {faithName}. They don't want it to define them—and they want you to respect that."
      }
    };
    
    const copy = COPY[outcome] || COPY.question;
    
    updateStateFn(prev => ({
      faithPopupPending: {
        age,
        tradition: faith.tradition,
        outcome,
        title: copy.title,
        body: copy.body
      },
      faith: {
        ...(prev.faith || {}),
        milestoneAgesProcessed: [...processed, age]
      }
    }));
  } catch (e) {
    console.warn('[maybeQueueFaithPopup] failed:', e);
  }
}

export function resolveFaithPopup(state, updateStateFn, addLogFn, recordTimelineEntryFn) {
  try {
    const popup = state.faithPopupPending;
    if (!popup) return;
    
    const faith = state.faith || {};
    const outcome = popup.outcome || 'question';
    const tradition = popup.tradition || faith.tradition;
    
    let newStatus = faith.status;
    let newTradition = faith.tradition;
    
    if (outcome === 'commit') {
      newStatus = 'committed';
    } else if (outcome === 'question') {
      newStatus = 'questioning';
    } else if (outcome === 'drift') {
      newStatus = 'not_practicing';
    } else if (outcome === 'refuse') {
      newStatus = 'refused';
      newTradition = null;
    }
    
    const historyEntry = {
      age: popup.age,
      from: faith.status,
      to: newStatus,
      by: 'child',
      note: popup.title
    };
    
    updateStateFn(prev => ({
      faithPopupPending: null,
      faith: {
        ...(prev.faith || {}),
        tradition: newTradition,
        status: newStatus,
        lastDecisionAge: popup.age,
        history: [...(prev.faith?.history || []), historyEntry]
      }
    }));
    
    if (addLogFn) {
      addLogFn(`🙏 ${tradition}: ${newStatus === 'committed' ? 'They commit' : newStatus === 'questioning' ? 'Still questioning' : newStatus === 'not_practicing' ? 'Not practicing now' : 'They refuse'}`);
    }
    
    if (recordTimelineEntryFn) {
      recordTimelineEntryFn({
        kind: 'faith',
        title: `🙏 Faith Milestone: ${tradition}`,
        detail: popup.body || 'Child made a decision about faith.',
        deltas: null,
        moneyDelta: 0,
        loveDelta: 0,
        stressDelta: 0,
        age: popup.age
      });
    }
  } catch (e) {
    console.warn('[resolveFaithPopup] failed:', e);
  }
}