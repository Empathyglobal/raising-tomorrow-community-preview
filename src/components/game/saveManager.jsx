// SAVE MANAGER - Multi-slot save system + timeline export
// Hidden by default, accessible via isFeatureEnabled("multiSaves")

const SAVE_MANAGER_KEY = "RT_SAVE_MANAGER";
const LEGACY_SAVE_KEY = "gameState"; // The original single-save key
const SAVE_MANAGER_BACKUP_KEY = "RT_SAVE_MANAGER_BACKUP";
const LAST_AUTOSAVE_TS_KEY = "RT_LAST_AUTOSAVE_TS";

function parseSaveManager(raw) {
  const manager = JSON.parse(raw);
  if (!manager || typeof manager !== 'object' || Array.isArray(manager)) {
    throw new Error('Invalid save manager');
  }
  if (!manager.activeSlotId) manager.activeSlotId = "slot1";
  if (!manager.slots) manager.slots = {};
  if (typeof manager.slots !== 'object' || Array.isArray(manager.slots)) {
    throw new Error('Invalid save slots');
  }
  for (let i = 1; i <= 5; i++) {
    const slotKey = `slot${i}`;
    if (!(slotKey in manager.slots)) manager.slots[slotKey] = null;
  }
  return manager;
}

// Get or initialize save manager
export function getSaveManager() {
  try {
    const stored = localStorage.getItem(SAVE_MANAGER_KEY);
    if (!stored) {
      const defaultManager = {
        activeSlotId: "slot1",
        slots: { slot1: null, slot2: null, slot3: null, slot4: null, slot5: null }
      };
      persistSaveManager(defaultManager);
      return defaultManager;
    }

    try {
      return parseSaveManager(stored);
    } catch (parseErr) {
      // Try backup
      try {
        const backupRaw = localStorage.getItem(SAVE_MANAGER_BACKUP_KEY);
        if (backupRaw) {
          const backup = parseSaveManager(backupRaw);
          // Keep recovered data usable even when storage cannot be repaired yet.
          persistSaveManager(backup);
          return backup;
        }
      } catch {}
      // Fall back to default and persist so we stop failing repeatedly
      const fallback = {
        activeSlotId: "slot1",
        slots: { slot1: null, slot2: null, slot3: null, slot4: null, slot5: null }
      };
      persistSaveManager(fallback);
      return fallback;
    }
  } catch (error) {
    console.error("Failed to load save manager:", error);
    const fallback = {
      activeSlotId: "slot1",
      slots: { slot1: null, slot2: null, slot3: null, slot4: null, slot5: null }
    };
    persistSaveManager(fallback);
    return fallback;
  }
}

// Save manager to storage
function persistSaveManager(manager) {
  try {
    localStorage.setItem(SAVE_MANAGER_KEY, JSON.stringify(manager));
    return true;
  } catch (error) {
    console.error("Failed to persist save manager:", error);
    return false;
  }
}

// Compute auto label from state
function computeAutoLabel(state, slotId) {
  if (!state) return `Slot ${slotId.replace('slot', '')}`;
  
  const parentName = state.parentName || 'Parent';
  const role = state.parentRole || 'mom';
  const roleLabel = role === 'mom' ? 'Mother' : role === 'dad' ? 'Father' : 'Parent';
  const childName = state.childName || 'Child';
  
  return `${parentName} (${roleLabel} of ${childName})`;
}

// Save state to a specific slot
export function saveToSlot(slotId, state, label = null) {
  try {
    // Recover first, then back up the validated state before changing any slot.
    // Copying the raw main key first could destroy the only valid backup.
    const manager = getSaveManager();
    const prevRaw = JSON.stringify(manager);
    try { localStorage.setItem(SAVE_MANAGER_BACKUP_KEY, prevRaw); } catch {}
    const existingSlot = manager?.slots?.[slotId];
    const existingLabel = existingSlot?.label;
    
    // Determine final label
    let finalLabel;
    if (label) {
      // Explicit label provided (e.g., manual rename)
      finalLabel = label;
    } else if (existingLabel && !existingLabel.match(/^(Family \d|Slot \d)$/)) {
      // Keep custom labels
      finalLabel = existingLabel;
    } else {
      // Generate auto label
      finalLabel = computeAutoLabel(state, slotId);
    }
    
    // Compute metadata for UI convenience
    const meta = {
      parentName: state.parentName || 'Parent',
      parentRole: state.parentRole || 'mom',
      childName: state.childName || 'Child',
      currentYear: state.currentYear || 0,
      specialStartId: state.specialStartId || null
    };

    const snapshot = {
      label: finalLabel,
      updatedAt: new Date().toISOString(),
      snapshot: state,
      meta
    };

    manager.slots[slotId] = snapshot;

    // Persist and verify
    const ok = persistSaveManager(manager);
    if (!ok) return false;

    try {
      const verifyRaw = localStorage.getItem(SAVE_MANAGER_KEY);
      JSON.parse(verifyRaw); // throws if corrupt
    } catch (verifyErr) {
      // Restore previous on failure
      try { if (prevRaw) localStorage.setItem(SAVE_MANAGER_KEY, prevRaw); } catch {}
      return false;
    }

    // Mark last autosave time
    try { localStorage.setItem(LAST_AUTOSAVE_TS_KEY, String(Date.now())); } catch {}

    return true;
  } catch (error) {
    console.error(`Failed to save to ${slotId}:`, error);
    return false;
  }
}

// Load state from a specific slot
export function loadFromSlot(slotId) {
  try {
    const manager = getSaveManager();
    const slotData = manager.slots[slotId];
    
    if (!slotData || !slotData.snapshot) {
      return null;
    }
    
    return slotData.snapshot;
  } catch (error) {
    console.error(`Failed to load from ${slotId}:`, error);
    return null;
  }
}

// List all save slots with metadata
export function listSlots() {
  try {
    const manager = getSaveManager();
    
    return Object.entries(manager.slots).map(([slotId, data]) => {
      const meta = data?.meta || {};
      const snapshot = data?.snapshot || {};
      
      const money = Number.isFinite(Number(snapshot.money)) ? Number(snapshot.money) : 0;
      
      return {
        slotId,
        label: data?.label || `Slot ${slotId.replace('slot', '')}`,
        updatedAt: data?.updatedAt || null,
        exists: !!data,
        started: Boolean(snapshot.childAvatarPicked) || 
                 Boolean(snapshot.childAvatarGender) || 
                 Number(snapshot.currentYear ?? 0) > 0,
        finished: Boolean(snapshot.finished),
        childName: meta.childName || snapshot.childName || null,
        parentName: meta.parentName || snapshot.parentName || null,
        parentRole: meta.parentRole || snapshot.parentRole || null,
        currentYear: meta.currentYear ?? snapshot.currentYear ?? 0,
        money
      };
    });
  } catch (error) {
    console.error("Failed to list slots:", error);
    return [];
  }
}

// Delete a save slot
export function deleteSlot(slotId) {
  try {
    const manager = getSaveManager();
    manager.slots[slotId] = null;
    return persistSaveManager(manager);
  } catch (error) {
    console.error(`Failed to delete ${slotId}:`, error);
    return false;
  }
}

// Rename a save slot
export function renameSlot(slotId, newLabel) {
  try {
    const manager = getSaveManager();
    const slotData = manager.slots[slotId];
    
    if (!slotData) {
      return false;
    }
    
    slotData.label = newLabel;
    return persistSaveManager(manager);
  } catch (error) {
    console.error(`Failed to rename ${slotId}:`, error);
    return false;
  }
}

// Get active slot ID
export function getActiveSlotId() {
  const manager = getSaveManager();
  return manager.activeSlotId || "slot1";
}

// Set active slot ID
export function setActiveSlotId(slotId) {
  try {
    const manager = getSaveManager();
    manager.activeSlotId = slotId;
    return persistSaveManager(manager);
  } catch (error) {
    console.error("Failed to set active slot:", error);
    return false;
  }
}

// TIMELINE EXPORT
export function exportTimelineText(state) {
  try {
    const { childName, currentYear, timelineEntries } = state;
    
    const lines = [];
    
    // Header
    lines.push(`=== ${childName}'s Journey ===`);
    lines.push(`Ages 0-${currentYear}`);
    lines.push(`Generated: ${new Date().toLocaleDateString()}`);
    lines.push("");
    
    // Group entries by age
    const byAge = {};
    timelineEntries.forEach(entry => {
      const age = entry.age || 0;
      if (!byAge[age]) byAge[age] = [];
      byAge[age].push(entry);
    });
    
    // Sort ages
    const ages = Object.keys(byAge).sort((a, b) => Number(a) - Number(b));
    
    // Format each age group
    ages.forEach(age => {
      lines.push(`--- Age ${age} ---`);
      
      byAge[age].forEach(entry => {
        let line = `${entry.title}`;
        
        if (entry.detail) {
          line += ` — ${entry.detail}`;
        }
        
        // Add compact deltas/money/focus info
        const parts = [];
        
        if (entry.deltas) {
          const deltaStr = Object.entries(entry.deltas)
            .filter(([_, v]) => v !== 0)
            .map(([k, v]) => `${k.substring(0, 3).toUpperCase()}${v > 0 ? '+' : ''}${v}`)
            .join(', ');
          if (deltaStr) parts.push(`Δ: ${deltaStr}`);
        }
        
        if (entry.moneyDelta && entry.moneyDelta !== 0) {
          parts.push(`$${entry.moneyDelta > 0 ? '+' : ''}${entry.moneyDelta}`);
        }
        
        if (entry.loveDelta && entry.loveDelta !== 0) {
          parts.push(`LOVE${entry.loveDelta > 0 ? '+' : ''}${entry.loveDelta}`);
        }
        
        if (entry.stressDelta && entry.stressDelta !== 0) {
          parts.push(`STRESS${entry.stressDelta > 0 ? '+' : ''}${entry.stressDelta}`);
        }
        
        if (parts.length > 0) {
          line += ` [${parts.join(' • ')}]`;
        }
        
        lines.push(line);
      });
      
      lines.push(""); // blank line between ages
    });
    
    return lines.join("\n");
  } catch (error) {
    console.error("Failed to export timeline:", error);
    return "Timeline export failed.";
  }
}

// Export timeline as downloadable file
export function downloadTimelineExport(state) {
  try {
    const text = exportTimelineText(state);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.childName}_Timeline_Age${state.currentYear}.txt`;
    document.body.appendChild(a);
    a.click();
    
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    return true;
  } catch (error) {
    console.error("Failed to download timeline:", error);
    return false;
  }
}
