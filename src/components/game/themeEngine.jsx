// THEME & SOUNDTRACK ENGINE
// Hidden by default, accessible via isFeatureEnabled("themes")

export const THEMES = {
  default: {
    id: "default",
    name: "Default",
    colors: {
      primary: "#6366f1",
      secondary: "#ec4899",
      background: "#ffffff",
      text: "#0f172a"
    }
  },
  warm: {
    id: "warm",
    name: "Warm Tones",
    colors: {
      primary: "#f97316",
      secondary: "#fbbf24",
      background: "#fffbeb",
      text: "#431407"
    }
  },
  cool: {
    id: "cool",
    name: "Cool Breeze",
    colors: {
      primary: "#0ea5e9",
      secondary: "#06b6d4",
      background: "#f0f9ff",
      text: "#082f49"
    }
  },
  earth: {
    id: "earth",
    name: "Earth Tones",
    colors: {
      primary: "#84cc16",
      secondary: "#65a30d",
      background: "#f7fee7",
      text: "#1a2e05"
    }
  },
  midnight: {
    id: "midnight",
    name: "Midnight",
    colors: {
      primary: "#8b5cf6",
      secondary: "#a78bfa",
      background: "#1e1b4b",
      text: "#e0e7ff"
    }
  }
};

export const SOUNDTRACKS = {
  default: {
    id: "default",
    name: "Original",
    tracks: {
      main: "/audio/main_theme.mp3",
      tense: "/audio/tense_moment.mp3",
      warm: "/audio/warm_moment.mp3"
    }
  },
  minimal: {
    id: "minimal",
    name: "Minimal Piano",
    tracks: {
      main: "/audio/minimal_main.mp3",
      tense: "/audio/minimal_tense.mp3",
      warm: "/audio/minimal_warm.mp3"
    }
  },
  ambient: {
    id: "ambient",
    name: "Ambient Flow",
    tracks: {
      main: "/audio/ambient_main.mp3",
      tense: "/audio/ambient_tense.mp3",
      warm: "/audio/ambient_warm.mp3"
    }
  }
};

// Apply theme to document (CSS variables)
export function applyTheme(themeId) {
  const theme = THEMES[themeId] || THEMES.default;
  
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  root.style.setProperty('--color-primary', theme.colors.primary);
  root.style.setProperty('--color-secondary', theme.colors.secondary);
  root.style.setProperty('--color-background', theme.colors.background);
  root.style.setProperty('--color-text', theme.colors.text);
}

// Apply soundtrack (future audio system integration)
export function applySoundtrack(soundtrackId) {
  const soundtrack = SOUNDTRACKS[soundtrackId] || SOUNDTRACKS.default;
  
  // Placeholder for future audio system integration
  console.log(`[themeEngine] Soundtrack changed to: ${soundtrack.name}`);
  
  // When audio system is built, this will:
  // 1. Load new track files
  // 2. Cross-fade between current and new tracks
  // 3. Update AudioManager playlist
  
  return soundtrack;
}

// Get theme by ID
export function getTheme(themeId) {
  return THEMES[themeId] || THEMES.default;
}

// Get soundtrack by ID
export function getSoundtrack(soundtrackId) {
  return SOUNDTRACKS[soundtrackId] || SOUNDTRACKS.default;
}

// List all available themes
export function listThemes() {
  return Object.values(THEMES);
}

// List all available soundtracks
export function listSoundtracks() {
  return Object.values(SOUNDTRACKS);
}