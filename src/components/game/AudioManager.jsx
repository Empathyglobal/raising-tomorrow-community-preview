// src/components/game/AudioManager.jsx
// Procedural AudioManager (no MP3/WAV assets required)
// 3 calm loopable themes + optional override selection.

class AudioManager {
  constructor() {
    // Public settings
    this.musicEnabled = false;
    this.sfxEnabled = true;
    this.musicVolume = 0.5;
    this.sfxVolume = 0.7;

    // Status flags used by UI
    this.hasUserGesture = false;
    this.initialized = false;
    this.unlocked = false;

    // WebAudio
    this.ctx = null;
    this.masterGain = null;

    // Music bus
    this.musicGain = null;
    this.musicFadeGain = null;
    this.musicHighpass = null;
    this.musicLowpass = null;

    // SFX bus
    this.sfxGain = null;

    // Music state
    this._musicPlaying = false;
    this._musicThemeKey = null; // effective theme currently scheduled
    this.childAge = 0;

    // NEW: optional user override (null = auto)
    this.musicThemeOverride = null; // '0_5' | '6_12' | '13_18' | null

    // Scheduler
    this._musicTimer = null;
    this._musicTheme = null;
    this._nextBarTime = 0;
    this._barIndex = 0;

    // Track nodes so stop() can hard-silence safely
    this._activeMusicNodes = new Set();

    // Noise buffer (for ultra-soft shaker)
    this._noiseBuffer = null;

    // Legacy compatibility (not used)
    this.musicAudio = null;

    // Seeded randomness (only tiny humanization; never spooky pitch chaos)
    this._seed = Math.floor(Math.random() * 1e9);
    this._seedBase = this._seed;

    // Load saved prefs if available
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const m = localStorage.getItem('rt_music_enabled');
        const s = localStorage.getItem('rt_sfx_enabled');
        const mv = localStorage.getItem('rt_music_volume');
        const sv = localStorage.getItem('rt_sfx_volume');
        const mo = localStorage.getItem('rt_music_theme_override');

        if (m !== null) this.musicEnabled = m === 'true';
        if (s !== null) this.sfxEnabled = s === 'true';

        const mvNum = mv !== null ? parseFloat(mv) : null;
        const svNum = sv !== null ? parseFloat(sv) : null;
        if (Number.isFinite(mvNum)) this.musicVolume = Math.max(0, Math.min(1, mvNum));
        if (Number.isFinite(svNum)) this.sfxVolume = Math.max(0, Math.min(1, svNum));

        if (mo && mo !== 'auto' && this._isValidThemeKey(mo)) {
          this.musicThemeOverride = mo;
        }
      }
    } catch {
      // ignore
    }
  }

  // Public: Themes list for UI
  getAvailableMusicThemes() {
    return [
      {
        id: '0_5',
        label: 'Tiny Steps Lullaby (0–5)',
        name: 'Tiny Steps Lullaby',
        description: '6/8 lullaby • major pentatonic • music-box warmth'
      },
      {
        id: '6_12',
        label: 'After-School Breeze (6–12)',
        name: 'After-School Breeze',
        description: '4/4 easy groove • light plucks • ultra-soft shaker'
      },
      {
        id: '13_18',
        label: 'Evening Porch Talk (13–18)',
        name: 'Evening Porch Talk',
        description: '4/4 reflective • warm e‑piano • hopeful'
      },
      {
        id: '0_5_blanket',
        label: 'Blanket Fort Glow (0–5 alt)',
        name: 'Blanket Fort Glow',
        description: '3/4 waltz lullaby • pentatonic • warm rocking'
      },
      {
        id: '6_12_sketch',
        label: 'Quiet Sketchbook (6–12 alt)',
        name: 'Quiet Sketchbook',
        description: '12/8 rolling feel • gentle plucks • calm focus'
      },
      {
        id: '13_18_window',
        label: 'Open Window Night (13–18 alt)',
        name: 'Open Window Night',
        description: '5/4 reflective • arpeggiated e‑piano • airy night'
      },
      {
        id: '0_5_fast',
        label: 'Tiny Steps Lullaby (0–5) — FAST',
        name: 'Tiny Steps Lullaby (Fast)',
        description: '6/8 lullaby • pentatonic • higher BPM'
      },
      {
        id: '6_12_fast',
        label: 'After-School Breeze (6–12) — FAST',
        name: 'After-School Breeze (Fast)',
        description: '4/4 gentle groove • higher BPM'
      },
      {
        id: '13_18_fast',
        label: 'Evening Porch Talk (13–18) — FAST',
        name: 'Evening Porch Talk (Fast)',
        description: '4/4 reflective • higher BPM'
      },
      {
        id: '0_5_blanket_fast',
        label: 'Blanket Fort Glow (0–5 alt) — FAST',
        name: 'Blanket Fort Glow (Fast)',
        description: '3/4 waltz lullaby • higher BPM'
      },
      {
        id: '6_12_sketch_fast',
        label: 'Quiet Sketchbook (6–12 alt) — FAST',
        name: 'Quiet Sketchbook (Fast)',
        description: '12/8 rolling feel • higher BPM'
      },
      {
        id: '13_18_window_fast',
        label: 'Open Window Night (13–18 alt) — FAST',
        name: 'Open Window Night (Fast)',
        description: '5/4 reflective • higher BPM'
      }
    ];
  }

  getMusicThemeOverride() {
    return this.musicThemeOverride; // null means auto
  }

  setMusicThemeOverride(themeKeyOrNull) {
    const normalized = (themeKeyOrNull == null || themeKeyOrNull === 'auto')
      ? null
      : String(themeKeyOrNull);

    const nextOverride = (normalized && this._isValidThemeKey(normalized)) ? normalized : null;
    const changed = nextOverride !== this.musicThemeOverride;
    this.musicThemeOverride = nextOverride;

    // Persist (UI also persists, but keep this safe if called elsewhere)
    try {
      localStorage.setItem('rt_music_theme_override', this.musicThemeOverride ?? 'auto');
    } catch {}

    // If the effective theme changes while music is playing, restart gently
    const nextKey = this.getEffectiveMusicThemeKey(this.childAge);
    if (changed && nextKey !== this._musicThemeKey) {
      this._musicThemeKey = nextKey;
      if (this._musicPlaying && this.musicEnabled) {
        this.stopMusic({ restart: true });
      }
    }
  }

  getEffectiveMusicThemeKey(age = 0) {
    if (this.musicThemeOverride && this._isValidThemeKey(this.musicThemeOverride)) {
      return this.musicThemeOverride;
    }
    return this._computeThemeKey(age);
  }

  _isValidThemeKey(k) {
    return (
      k === '0_5' || k === '6_12' || k === '13_18' ||
      k === '0_5_blanket' || k === '6_12_sketch' || k === '13_18_window' ||
      k === '0_5_fast' || k === '6_12_fast' || k === '13_18_fast' ||
      k === '0_5_blanket_fast' || k === '6_12_sketch_fast' || k === '13_18_window_fast'
    );
  }

  _rand() {
    // LCG
    this._seed = (this._seed * 1664525 + 1013904223) % 4294967296;
    return this._seed / 4294967296;
  }

  _hashU32(str) {
    // FNV-1a 32-bit
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  _pickFrom(pool, salt) {
    const idx = (this._seedBase + this._hashU32(String(salt))) % pool.length;
    return pool[idx];
  }

  _ensureContext() {
    if (this.ctx) return;
    if (typeof window === 'undefined') return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    this.ctx = new AudioContext();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 1;
    this.masterGain.connect(this.ctx.destination);

    // Music bus: user volume -> fade -> gentle HP/LP -> master
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = this.musicVolume;

    this.musicFadeGain = this.ctx.createGain();
    this.musicFadeGain.gain.value = 1;

    this.musicHighpass = this.ctx.createBiquadFilter();
    this.musicHighpass.type = 'highpass';
    this.musicHighpass.frequency.value = 45;
    this.musicHighpass.Q.value = 0.7;

    this.musicLowpass = this.ctx.createBiquadFilter();
    this.musicLowpass.type = 'lowpass';
    this.musicLowpass.frequency.value = 4200;
    this.musicLowpass.Q.value = 0.5;

    this.musicGain.connect(this.musicFadeGain);
    this.musicFadeGain.connect(this.musicHighpass);
    this.musicHighpass.connect(this.musicLowpass);
    this.musicLowpass.connect(this.masterGain);

    // SFX bus
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = this.sfxVolume;
    this.sfxGain.connect(this.masterGain);

    this.initialized = true;
  }

  _resume() {
    if (!this.ctx) return;
    if (this.ctx.state !== 'running') {
      this.ctx.resume().catch(() => {});
    }
  }

  _unlock() {
    this.hasUserGesture = true;
    this._ensureContext();
    this._resume();
    this.unlocked = true;
  }

  audioUnlockOnce() {
    if (!this.unlocked) this._unlock();
    else this._resume();

    if (this.musicEnabled) this.startMusic();
  }

  init() {
    this._ensureContext();
  }

  setUserGesture(hasGesture) {
    this.hasUserGesture = hasGesture;
    if (hasGesture) {
      this._unlock();
      if (this.musicEnabled) this.startMusic();
    }
  }

  isUnlocked() {
    return this.unlocked;
  }

  setChildAge(age) {
    const a = Number(age);
    if (!Number.isFinite(a)) return;
    const nextAge = Math.max(0, Math.floor(a));
    this.childAge = nextAge;

    const nextKey = this.getEffectiveMusicThemeKey(nextAge);
    if (nextKey !== this._musicThemeKey) {
      this._musicThemeKey = nextKey;
      if (this._musicPlaying && this.musicEnabled) {
        this.stopMusic({ restart: true });
      }
    }
  }

  setMusicEnabled(enabled) {
    this.musicEnabled = !!enabled;
    try { localStorage.setItem('rt_music_enabled', String(this.musicEnabled)); } catch {}
    if (this.musicEnabled) this.startMusic();
    else this.stopMusic();
  }

  setSfxEnabled(enabled) {
    this.sfxEnabled = !!enabled;
    try { localStorage.setItem('rt_sfx_enabled', String(this.sfxEnabled)); } catch {}
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, Number(volume)));
    if (this.musicGain) this.musicGain.gain.value = this.musicVolume;
    try { localStorage.setItem('rt_music_volume', String(this.musicVolume)); } catch {}
  }

  setSfxVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, Number(volume)));
    if (this.sfxGain) this.sfxGain.gain.value = this.sfxVolume;
    try { localStorage.setItem('rt_sfx_volume', String(this.sfxVolume)); } catch {}
  }

  _midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  _getNoiseBuffer() {
    this._ensureContext();
    if (!this.ctx) return null;
    if (this._noiseBuffer) return this._noiseBuffer;

    const sr = this.ctx.sampleRate;
    const length = sr; // 1s
    const buffer = this.ctx.createBuffer(1, length, sr);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * 0.6;
    this._noiseBuffer = buffer;
    return buffer;
  }

  _trackMusicNode(entry) {
    if (entry) this._activeMusicNodes.add(entry);
  }

  _untrackMusicNode(entry) {
    if (entry) this._activeMusicNodes.delete(entry);
  }

  _stopAllActiveMusicNodes() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    for (const entry of Array.from(this._activeMusicNodes)) {
      const { osc, src, filter, g } = entry || {};
      try {
        if (g) {
          g.gain.cancelScheduledValues(now);
          g.gain.setValueAtTime(0.0001, now);
        }
      } catch {}
      try { if (osc) osc.stop(now + 0.01); } catch {}
      try { if (src) src.stop(now + 0.01); } catch {}
      try { if (osc) osc.disconnect(); } catch {}
      try { if (src) src.disconnect(); } catch {}
      try { if (filter) filter.disconnect(); } catch {}
      try { if (g) g.disconnect(); } catch {}
      this._activeMusicNodes.delete(entry);
    }
  }

  _playTone({
    bus = 'sfx',
    type = 'sine',
    freq = 440,
    freqEnd = null,
    when = null,
    duration = 0.12,
    attack = 0.006,
    volume = 0.12,
    filterType = null,
    filterFreq = null,
    filterQ = null
  }) {
    this._ensureContext();
    if (!this.ctx) return;
    this._resume();

    const ctx = this.ctx;
    const t0 = when ?? ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);

    if (freqEnd && freqEnd !== freq) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), t0 + duration);
    }

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(volume, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

    let node = osc;
    let filter = null;

    if (filterType && filterFreq) {
      filter = ctx.createBiquadFilter();
      filter.type = filterType;
      filter.frequency.setValueAtTime(filterFreq, t0);
      if (filterQ != null) filter.Q.setValueAtTime(filterQ, t0);
      node.connect(filter);
      node = filter;
    }

    node.connect(g);

    const dest = bus === 'music' ? this.musicGain : this.sfxGain;
    g.connect(dest);

    osc.start(t0);
    osc.stop(t0 + duration + 0.02);

    const entry = bus === 'music' ? { osc, filter, g } : null;
    if (entry) this._trackMusicNode(entry);

    osc.onended = () => {
      if (entry) this._untrackMusicNode(entry);
      try { osc.disconnect(); } catch {}
      try { if (filter) filter.disconnect(); } catch {}
      try { g.disconnect(); } catch {}
    };
  }

  _playNoise({
    when,
    duration = 0.06,
    volume = 0.01,
    filterType = 'highpass',
    filterFreq = 2200,
    filterQ = 0.7
  }) {
    this._ensureContext();
    if (!this.ctx) return;
    this._resume();

    const ctx = this.ctx;
    const t0 = when ?? ctx.currentTime;
    const buffer = this._getNoiseBuffer();
    if (!buffer) return;

    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = false;

    const filter = ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.setValueAtTime(filterFreq, t0);
    filter.Q.setValueAtTime(filterQ, t0);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(volume, t0 + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

    src.connect(filter);
    filter.connect(g);
    g.connect(this.musicGain);

    src.start(t0);
    src.stop(t0 + duration + 0.02);

    const entry = { src, filter, g };
    this._trackMusicNode(entry);

    src.onended = () => {
      this._untrackMusicNode(entry);
      try { src.disconnect(); } catch {}
      try { filter.disconnect(); } catch {}
      try { g.disconnect(); } catch {}
    };
  }

  _computeThemeKey(age) {
    if (age <= 5) return '0_5';
    if (age <= 12) return '6_12';
    return '13_18';
  }

  _getTheme(themeKey) {
    const MAJOR = [0, 2, 4, 5, 7, 9, 11];
    const PENT = [0, 2, 4, 7, 9];

    const degreeToSemitone = (deg, scale) => {
      const i = Math.max(0, Math.min(scale.length - 1, (deg | 0) - 1));
      return scale[i];
    };

    const buildChord = (rootMidi, intervals) => intervals.map(iv => rootMidi + iv);

    if (themeKey === '0_5_fast') {
      const tonic = this._pickFrom([60, 62, 65, 67], 'key_0_5_fast'); // C/D/F/G
      const chordBase = tonic - 12;

      const I = chordBase + 0;
      const IV = chordBase + 5;
      const V = chordBase + 7;
      const vi = chordBase + 9;

      const chords = [
        { name: 'Imaj7', root: I,  tones: buildChord(I,  [0, 4, 7, 11]), holdBars: 2 },
        { name: 'vi7',   root: vi, tones: buildChord(vi, [0, 3, 7, 10]), holdBars: 2 },
        { name: 'IVmaj7',root: IV, tones: buildChord(IV, [0, 4, 7, 11]), holdBars: 2 },
        { name: 'Vsus4(add9)', root: V, tones: buildChord(V, [0, 5, 7, 14]), holdBars: 2 }
      ];

      const chordsByBar = [chords[0], chords[0], chords[1], chords[1], chords[2], chords[2], chords[3], chords[3]];

      const melodyDegrees = [
        [3, 2, 1, 2, 3, 5],
        [5, 3, 2, 1, 2, 3],
        [6, 5, 3, 2, 3, 5],
        [5, 3, 2, 1, 2, 1],
        [3, 2, 1, 2, 3, 6],
        [6, 5, 3, 2, 3, 2],
        [2, 3, 5, 3, 2, 1],
        [1, 2, 3, 2, 1, 1]
      ];

      const bpm = 92; // FAST
      const secPerEighth = (60 / bpm) / 3; // 6/8 dotted-quarter feel
      const stepsPerBar = 6;
      const barSeconds = stepsPerBar * secPerEighth;

      return {
        key: '0_5',
        name: 'Tiny Steps Lullaby (Fast)',
        timeSig: '6/8',
        bpm,
        secPerEighth,
        stepsPerBar,
        barSeconds,
        loopBars: 8,
        tonicMidi: tonic,
        scale: PENT,
        degreeToMidi: (deg, octaveOffset = 0) => tonic + degreeToSemitone(deg, PENT) + octaveOffset,
        chordsByBar,
        melodyDegrees,
        levels: { pad: 0.016, arp: 0.030, melody: 0.030, bass: 0.014 }
      };
    }

    if (themeKey === '6_12_fast') {
      const tonic = this._pickFrom([67, 62, 69, 60], 'key_6_12_fast'); // G/D/A/C
      const chordBase = tonic - 12;

      const I = chordBase + 0;
      const IV = chordBase + 5;
      const V = chordBase + 7;
      const vi = chordBase + 9;

      const chords = [
        { name: 'Iadd9',  root: I,  tones: buildChord(I,  [0, 4, 7, 14]), holdBars: 1 },
        { name: 'Vsus4',  root: V,  tones: buildChord(V,  [0, 5, 7, 12]), holdBars: 1 },
        { name: 'vi7',    root: vi, tones: buildChord(vi, [0, 3, 7, 10]), holdBars: 1 },
        { name: 'IVmaj7', root: IV, tones: buildChord(IV, [0, 4, 7, 11]), holdBars: 1 }
      ];

      const chordsByBar = [chords[0], chords[1], chords[2], chords[3], chords[0], chords[1], chords[2], chords[3]];

      const melodyDegrees = [
        [2, 3, 5, 3],
        [2, 1, 2, null],
        [3, 5, 6, 5],
        [3, 2, 1, null],
        [2, 3, 5, 6],
        [5, 3, 2, null],
        [6, 5, 3, 2],
        [1, 2, 3, null]
      ];

      const bpm = 112; // FAST
      const secPerEighth = (60 / bpm) / 2; // 4/4
      const stepsPerBar = 8;
      const barSeconds = stepsPerBar * secPerEighth;

      return {
        key: '6_12',
        name: 'After-School Breeze (Fast)',
        timeSig: '4/4',
        bpm,
        secPerEighth,
        stepsPerBar,
        barSeconds,
        loopBars: 8,
        tonicMidi: tonic,
        scale: MAJOR,
        degreeToMidi: (deg, octaveOffset = 0) => tonic + degreeToSemitone(deg, MAJOR) + octaveOffset,
        chordsByBar,
        melodyDegrees,
        levels: { pad: 0.014, pluck: 0.032, melody: 0.030, bass: 0.016, shaker: 0.008 }
      };
    }

    if (themeKey === '13_18_fast') {
      const tonic = this._pickFrom([62, 57, 64], 'key_13_18_fast'); // D/A/E
      const chordBase = tonic - 12;

      const I = chordBase + 0;
      const IV = chordBase + 5;
      const V = chordBase + 7;
      const vi = chordBase + 9;

      const chordVi7   = { name: 'vi7',   root: vi, tones: buildChord(vi, [0, 3, 7, 10]), holdBars: 2 };
      const chordIVmaj7= { name: 'IVmaj7',root: IV, tones: buildChord(IV,[0, 4, 7, 11]), holdBars: 2 };
      const chordIadd9 = { name: 'Iadd9', root: I,  tones: buildChord(I, [0, 4, 7, 14]), holdBars: 2 };
      const chordV69   = { name: 'V6/9',  root: V,  tones: buildChord(V, [0, 4, 7, 9, 14]), holdBars: 2 };

      const chordsByBar = [chordVi7, chordVi7, chordIVmaj7, chordIVmaj7, chordIadd9, chordIadd9, chordV69, chordV69];

      const melodyDegrees = [
        [5, 6],
        [5, 3],
        [2, 3],
        [5, null],
        [6, 5],
        [3, null],
        [2, 1],
        [1, null]
      ];

      const bpm = 102; // FAST
      const secPerEighth = (60 / bpm) / 2; // 4/4
      const stepsPerBar = 8;
      const barSeconds = stepsPerBar * secPerEighth;

      return {
        key: '13_18',
        name: 'Evening Porch Talk (Fast)',
        timeSig: '4/4',
        bpm,
        secPerEighth,
        stepsPerBar,
        barSeconds,
        loopBars: 8,
        tonicMidi: tonic,
        scale: MAJOR,
        degreeToMidi: (deg, octaveOffset = 0) => tonic + degreeToSemitone(deg, MAJOR) + octaveOffset,
        chordsByBar,
        melodyDegrees,
        levels: { pad: 0.015, epiano: 0.028, melody: 0.030, bass: 0.020 }
      };
    }

    if (themeKey === '0_5_blanket_fast') {
      const tonic = this._pickFrom([60, 62, 65, 67], 'key_0_5_blanket_fast');
      const chordBase = tonic - 12;

      const I = chordBase + 0;
      const IV = chordBase + 5;
      const V = chordBase + 7;

      const chordI69 = { name: 'I6/9', root: I, tones: buildChord(I, [0, 4, 7, 9, 14]), holdBars: 2 };
      const chordIVadd9 = { name: 'IVadd9', root: IV, tones: buildChord(IV, [0, 4, 7, 14]), holdBars: 2 };
      const chordVsus2add9 = { name: 'Vsus2(add9)', root: V, tones: buildChord(V, [0, 2, 7, 14]), holdBars: 2 };

      const chordsByBar = [chordI69, chordI69, chordIVadd9, chordIVadd9, chordI69, chordI69, chordVsus2add9, chordVsus2add9];

      const melodyDegrees = [
        [3, null, 5, null, 3, null],
        [2, null, 1, null, null, null],
        [4, null, 3, null, 2, null],
        [3, null, null, null, 1, null],
        [5, null, 3, null, 2, null],
        [null, null, 1, null, null, null],
        [2, null, 3, null, 4, null],
        [3, null, 2, null, 1, null]
      ];

      const bpm = 96; // FAST
      const secPerEighth = (60 / bpm) / 2;
      const stepsPerBar = 6;
      const barSeconds = stepsPerBar * secPerEighth;

      return {
        key: '0_5',
        name: 'Blanket Fort Glow (Fast)',
        timeSig: '3/4',
        bpm,
        secPerEighth,
        stepsPerBar,
        barSeconds,
        loopBars: 8,
        tonicMidi: tonic,
        scale: PENT,
        degreeToMidi: (deg, octaveOffset = 0) => tonic + degreeToSemitone(deg, PENT) + octaveOffset,
        chordsByBar,
        melodyDegrees,
        patternId: 'blanket',
        levels: { pad: 0.016, arp: 0.030, melody: 0.030, bass: 0.014 }
      };
    }

    if (themeKey === '6_12_sketch_fast') {
      const tonic = this._pickFrom([67, 62, 60, 69], 'key_6_12_sketch_fast');
      const chordBase = tonic - 12;

      const I = chordBase + 0;
      const ii = chordBase + 2;
      const IV = chordBase + 5;
      const V = chordBase + 7;

      const chordI69 = { name: 'I6/9', root: I, tones: buildChord(I, [0, 4, 7, 9, 14]), holdBars: 1 };
      const chordIVmaj7 = { name: 'IVmaj7', root: IV, tones: buildChord(IV, [0, 4, 7, 11]), holdBars: 1 };
      const chordIi7 = { name: 'ii7', root: ii, tones: buildChord(ii, [0, 3, 7, 10]), holdBars: 1 };
      const chordV69 = { name: 'V6/9', root: V, tones: buildChord(V, [0, 4, 7, 9, 14]), holdBars: 1 };

      const chordsByBar = [chordI69, chordIVmaj7, chordIi7, chordV69, chordI69, chordIVmaj7, chordIi7, chordV69];

      const melodyDegrees = [
        [3, null, null, 5, null, null, 3, null, null, 2, null, null],
        [6, null, null, 5, null, null, 3, null, null, 2, null, null],
        [2, null, null, 3, null, null, 5, null, null, 6, null, null],
        [5, null, null, 3, null, null, 2, null, null, 1, null, null],
        [2, null, null, 3, null, null, 5, null, null, 3, null, null],
        [6, null, null, 5, null, null, 3, null, null, 2, null, null],
        [3, null, null, 2, null, null, 1, null, null, 2, null, null],
        [5, null, null, 3, null, null, 2, null, null, null, null, null]
      ];

      const bpm = 112; // FAST
      const secPerEighth = (60 / bpm) / 3;
      const stepsPerBar = 12;
      const barSeconds = stepsPerBar * secPerEighth;

      return {
        key: '6_12',
        name: 'Quiet Sketchbook (Fast)',
        timeSig: '12/8',
        bpm,
        secPerEighth,
        stepsPerBar,
        barSeconds,
        loopBars: 8,
        tonicMidi: tonic,
        scale: MAJOR,
        degreeToMidi: (deg, octaveOffset = 0) => tonic + degreeToSemitone(deg, MAJOR) + octaveOffset,
        chordsByBar,
        melodyDegrees,
        patternId: 'sketch',
        levels: { pad: 0.014, pluck: 0.032, melody: 0.030, bass: 0.016, shaker: 0.008 }
      };
    }

    if (themeKey === '13_18_window_fast') {
      const tonic = this._pickFrom([62, 57, 64], 'key_13_18_window_fast');
      const chordBase = tonic - 12;

      const I = chordBase + 0;
      const ii = chordBase + 2;
      const IV = chordBase + 5;
      const V = chordBase + 7;
      const vi = chordBase + 9;

      const chordIi7 = { name: 'ii7', root: ii, tones: buildChord(ii, [0, 3, 7, 10]), holdBars: 1 };
      const chordV69 = { name: 'V6/9', root: V, tones: buildChord(V, [0, 4, 7, 9, 14]), holdBars: 1 };
      const chordImaj7 = { name: 'Imaj7', root: I, tones: buildChord(I, [0, 4, 7, 11]), holdBars: 1 };
      const chordIVmaj7 = { name: 'IVmaj7', root: IV, tones: buildChord(IV, [0, 4, 7, 11]), holdBars: 1 };
      const chordVi7 = { name: 'vi7', root: vi, tones: buildChord(vi, [0, 3, 7, 10]), holdBars: 1 };
      const chordIadd9 = { name: 'Iadd9', root: I, tones: buildChord(I, [0, 4, 7, 14]), holdBars: 1 };

      const chordsByBar = [chordIi7, chordV69, chordImaj7, chordIVmaj7, chordVi7, chordIVmaj7, chordIadd9, chordV69];

      const melodyDegrees = [
        [4, null, null, null, null, 3, null, null, null, null],
        [2, null, null, null, null, 1, null, null, null, null],
        [3, null, null, null, null, 5, null, null, null, null],
        [6, null, null, null, null, 5, null, null, null, null],
        [3, null, null, null, null, 2, null, null, null, null],
        [4, null, null, null, null, 3, null, null, null, null],
        [2, null, null, null, null, 1, null, null, null, null],
        [2, null, null, null, null, null, null, null, null, null]
      ];

      const bpm = 96; // FAST
      const secPerEighth = (60 / bpm) / 2;
      const stepsPerBar = 10;
      const barSeconds = stepsPerBar * secPerEighth;

      return {
        key: '13_18',
        name: 'Open Window Night (Fast)',
        timeSig: '5/4',
        bpm,
        secPerEighth,
        stepsPerBar,
        barSeconds,
        loopBars: 8,
        tonicMidi: tonic,
        scale: MAJOR,
        degreeToMidi: (deg, octaveOffset = 0) => tonic + degreeToSemitone(deg, MAJOR) + octaveOffset,
        chordsByBar,
        melodyDegrees,
        patternId: 'window',
        levels: { pad: 0.015, epiano: 0.028, melody: 0.030, bass: 0.020 }
      };
    }

    if (themeKey === '0_5_blanket') {
      const tonic = this._pickFrom([60, 62, 65, 67], 'key_0_5_blanket');
      const chordBase = tonic - 12;

      const I = chordBase + 0;
      const IV = chordBase + 5;
      const V = chordBase + 7;

      const chordI69 = { name: 'I6/9', root: I, tones: buildChord(I, [0, 4, 7, 9, 14]), holdBars: 2 };
      const chordIVadd9 = { name: 'IVadd9', root: IV, tones: buildChord(IV, [0, 4, 7, 14]), holdBars: 2 };
      const chordVsus2add9 = { name: 'Vsus2(add9)', root: V, tones: buildChord(V, [0, 2, 7, 14]), holdBars: 2 };

      const chordsByBar = [chordI69, chordI69, chordIVadd9, chordIVadd9, chordI69, chordI69, chordVsus2add9, chordVsus2add9];

      const melodyDegrees = [
        [3, null, 5, null, 3, null],
        [2, null, 1, null, null, null],
        [4, null, 3, null, 2, null],
        [3, null, null, null, 1, null],
        [5, null, 3, null, 2, null],
        [null, null, 1, null, null, null],
        [2, null, 3, null, 4, null],
        [3, null, 2, null, 1, null]
      ];

      const bpm = 66;
      const secPerEighth = (60 / bpm) / 2;
      const stepsPerBar = 6;
      const barSeconds = stepsPerBar * secPerEighth;

      return {
        key: '0_5',
        name: 'Blanket Fort Glow',
        timeSig: '3/4',
        bpm,
        secPerEighth,
        stepsPerBar,
        barSeconds,
        loopBars: 8,
        tonicMidi: tonic,
        scale: PENT,
        degreeToMidi: (deg, octaveOffset = 0) => tonic + degreeToSemitone(deg, PENT) + octaveOffset,
        chordsByBar,
        melodyDegrees,
        patternId: 'blanket',
        levels: { pad: 0.016, arp: 0.030, melody: 0.030, bass: 0.014 }
      };
    }

    if (themeKey === '6_12_sketch') {
      const tonic = this._pickFrom([67, 62, 60, 69], 'key_6_12_sketch');
      const chordBase = tonic - 12;

      const I = chordBase + 0;
      const ii = chordBase + 2;
      const IV = chordBase + 5;
      const V = chordBase + 7;

      const chordI69 = { name: 'I6/9', root: I, tones: buildChord(I, [0, 4, 7, 9, 14]), holdBars: 1 };
      const chordIVmaj7 = { name: 'IVmaj7', root: IV, tones: buildChord(IV, [0, 4, 7, 11]), holdBars: 1 };
      const chordIi7 = { name: 'ii7', root: ii, tones: buildChord(ii, [0, 3, 7, 10]), holdBars: 1 };
      const chordV69 = { name: 'V6/9', root: V, tones: buildChord(V, [0, 4, 7, 9, 14]), holdBars: 1 };

      const chordsByBar = [chordI69, chordIVmaj7, chordIi7, chordV69, chordI69, chordIVmaj7, chordIi7, chordV69];

      const melodyDegrees = [
        [3, null, null, 5, null, null, 3, null, null, 2, null, null],
        [6, null, null, 5, null, null, 3, null, null, 2, null, null],
        [2, null, null, 3, null, null, 5, null, null, 6, null, null],
        [5, null, null, 3, null, null, 2, null, null, 1, null, null],
        [2, null, null, 3, null, null, 5, null, null, 3, null, null],
        [6, null, null, 5, null, null, 3, null, null, 2, null, null],
        [3, null, null, 2, null, null, 1, null, null, 2, null, null],
        [5, null, null, 3, null, null, 2, null, null, null, null, null]
      ];

      const bpm = 76;
      const secPerEighth = (60 / bpm) / 3;
      const stepsPerBar = 12;
      const barSeconds = stepsPerBar * secPerEighth;

      return {
        key: '6_12',
        name: 'Quiet Sketchbook',
        timeSig: '12/8',
        bpm,
        secPerEighth,
        stepsPerBar,
        barSeconds,
        loopBars: 8,
        tonicMidi: tonic,
        scale: MAJOR,
        degreeToMidi: (deg, octaveOffset = 0) => tonic + degreeToSemitone(deg, MAJOR) + octaveOffset,
        chordsByBar,
        melodyDegrees,
        patternId: 'sketch',
        levels: { pad: 0.014, pluck: 0.032, melody: 0.030, bass: 0.016, shaker: 0.008 }
      };
    }

    if (themeKey === '13_18_window') {
      const tonic = this._pickFrom([62, 57, 64], 'key_13_18_window');
      const chordBase = tonic - 12;

      const I = chordBase + 0;
      const ii = chordBase + 2;
      const IV = chordBase + 5;
      const V = chordBase + 7;
      const vi = chordBase + 9;

      const chordIi7 = { name: 'ii7', root: ii, tones: buildChord(ii, [0, 3, 7, 10]), holdBars: 1 };
      const chordV69 = { name: 'V6/9', root: V, tones: buildChord(V, [0, 4, 7, 9, 14]), holdBars: 1 };
      const chordImaj7 = { name: 'Imaj7', root: I, tones: buildChord(I, [0, 4, 7, 11]), holdBars: 1 };
      const chordIVmaj7 = { name: 'IVmaj7', root: IV, tones: buildChord(IV, [0, 4, 7, 11]), holdBars: 1 };
      const chordVi7 = { name: 'vi7', root: vi, tones: buildChord(vi, [0, 3, 7, 10]), holdBars: 1 };
      const chordIadd9 = { name: 'Iadd9', root: I, tones: buildChord(I, [0, 4, 7, 14]), holdBars: 1 };

      const chordsByBar = [chordIi7, chordV69, chordImaj7, chordIVmaj7, chordVi7, chordIVmaj7, chordIadd9, chordV69];

      const melodyDegrees = [
        [4, null, null, null, null, 3, null, null, null, null],
        [2, null, null, null, null, 1, null, null, null, null],
        [3, null, null, null, null, 5, null, null, null, null],
        [6, null, null, null, null, 5, null, null, null, null],
        [3, null, null, null, null, 2, null, null, null, null],
        [4, null, null, null, null, 3, null, null, null, null],
        [2, null, null, null, null, 1, null, null, null, null],
        [2, null, null, null, null, null, null, null, null, null]
      ];

      const bpm = 70;
      const secPerEighth = (60 / bpm) / 2;
      const stepsPerBar = 10;
      const barSeconds = stepsPerBar * secPerEighth;

      return {
        key: '13_18',
        name: 'Open Window Night',
        timeSig: '5/4',
        bpm,
        secPerEighth,
        stepsPerBar,
        barSeconds,
        loopBars: 8,
        tonicMidi: tonic,
        scale: MAJOR,
        degreeToMidi: (deg, octaveOffset = 0) => tonic + degreeToSemitone(deg, MAJOR) + octaveOffset,
        chordsByBar,
        melodyDegrees,
        patternId: 'window',
        levels: { pad: 0.015, epiano: 0.028, melody: 0.030, bass: 0.020 }
      };
    }

    if (themeKey === '0_5') {
      const tonic = this._pickFrom([60, 62, 65, 67], 'key_0_5'); // C/D/F/G
      const chordBase = tonic - 12;

      const I = chordBase + 0;
      const IV = chordBase + 5;
      const V = chordBase + 7;
      const vi = chordBase + 9;

      const chords = [
        { name: 'Imaj7', root: I, tones: buildChord(I, [0, 4, 7, 11]), holdBars: 2 },
        { name: 'vi7', root: vi, tones: buildChord(vi, [0, 3, 7, 10]), holdBars: 2 },
        { name: 'IVmaj7', root: IV, tones: buildChord(IV, [0, 4, 7, 11]), holdBars: 2 },
        { name: 'Vsus4(add9)', root: V, tones: buildChord(V, [0, 5, 7, 14]), holdBars: 2 }
      ];

      const chordsByBar = [chords[0], chords[0], chords[1], chords[1], chords[2], chords[2], chords[3], chords[3]];

      const melodyDegrees = [
        [3, 2, 1, 2, 3, 5],
        [5, 3, 2, 1, 2, 3],
        [6, 5, 3, 2, 3, 5],
        [5, 3, 2, 1, 2, 1],
        [3, 2, 1, 2, 3, 6],
        [6, 5, 3, 2, 3, 2],
        [2, 3, 5, 3, 2, 1],
        [1, 2, 3, 2, 1, 1]
      ];

      const bpm = 72; // dotted-quarter
      const secPerEighth = (60 / bpm) / 3;
      const stepsPerBar = 6;
      const barSeconds = stepsPerBar * secPerEighth;

      return {
        key: '0_5',
        name: 'Tiny Steps Lullaby',
        timeSig: '6/8',
        bpm,
        secPerEighth,
        stepsPerBar,
        barSeconds,
        loopBars: 8,
        tonicMidi: tonic,
        scale: PENT,
        degreeToMidi: (deg, octaveOffset = 0) => tonic + degreeToSemitone(deg, PENT) + octaveOffset,
        chordsByBar,
        melodyDegrees,
        levels: { pad: 0.016, arp: 0.030, melody: 0.030, bass: 0.014 }
      };
    }

    if (themeKey === '6_12') {
      const tonic = this._pickFrom([67, 62, 69, 60], 'key_6_12'); // G/D/A/C
      const chordBase = tonic - 12;

      const I = chordBase + 0;
      const IV = chordBase + 5;
      const V = chordBase + 7;
      const vi = chordBase + 9;

      const chords = [
        { name: 'Iadd9', root: I, tones: buildChord(I, [0, 4, 7, 14]), holdBars: 1 },
        { name: 'Vsus4', root: V, tones: buildChord(V, [0, 5, 7, 12]), holdBars: 1 },
        { name: 'vi7', root: vi, tones: buildChord(vi, [0, 3, 7, 10]), holdBars: 1 },
        { name: 'IVmaj7', root: IV, tones: buildChord(IV, [0, 4, 7, 11]), holdBars: 1 }
      ];

      const chordsByBar = [chords[0], chords[1], chords[2], chords[3], chords[0], chords[1], chords[2], chords[3]];

      const melodyDegrees = [
        [2, 3, 5, 3],
        [2, 1, 2, null],
        [3, 5, 6, 5],
        [3, 2, 1, null],
        [2, 3, 5, 6],
        [5, 3, 2, null],
        [6, 5, 3, 2],
        [1, 2, 3, null]
      ];

      const bpm = 92;
      const secPerEighth = (60 / bpm) / 2;
      const stepsPerBar = 8;
      const barSeconds = stepsPerBar * secPerEighth;

      return {
        key: '6_12',
        name: 'After-School Breeze',
        timeSig: '4/4',
        bpm,
        secPerEighth,
        stepsPerBar,
        barSeconds,
        loopBars: 8,
        tonicMidi: tonic,
        scale: MAJOR,
        degreeToMidi: (deg, octaveOffset = 0) => tonic + degreeToSemitone(deg, MAJOR) + octaveOffset,
        chordsByBar,
        melodyDegrees,
        levels: { pad: 0.014, pluck: 0.032, melody: 0.030, bass: 0.016, shaker: 0.008 }
      };
    }

    // 13–18
    {
      const tonic = this._pickFrom([62, 57, 64], 'key_13_18'); // D/A/E
      const chordBase = tonic - 12;

      const I = chordBase + 0;
      const IV = chordBase + 5;
      const V = chordBase + 7;
      const vi = chordBase + 9;

      const chordVi7 = { name: 'vi7', root: vi, tones: buildChord(vi, [0, 3, 7, 10]), holdBars: 2 };
      const chordIVmaj7 = { name: 'IVmaj7', root: IV, tones: buildChord(IV, [0, 4, 7, 11]), holdBars: 2 };
      const chordIadd9 = { name: 'Iadd9', root: I, tones: buildChord(I, [0, 4, 7, 14]), holdBars: 2 };
      const chordV69 = { name: 'V6/9', root: V, tones: buildChord(V, [0, 4, 7, 9, 14]), holdBars: 2 };

      const chordsByBar = [chordVi7, chordVi7, chordIVmaj7, chordIVmaj7, chordIadd9, chordIadd9, chordV69, chordV69];

      const melodyDegrees = [
        [5, 6],
        [5, 3],
        [2, 3],
        [5, null],
        [6, 5],
        [3, null],
        [2, 1],
        [1, null]
      ];

      const bpm = 78;
      const secPerEighth = (60 / bpm) / 2;
      const stepsPerBar = 8;
      const barSeconds = stepsPerBar * secPerEighth;

      return {
        key: '13_18',
        name: 'Evening Porch Talk',
        timeSig: '4/4',
        bpm,
        secPerEighth,
        stepsPerBar,
        barSeconds,
        loopBars: 8,
        tonicMidi: tonic,
        scale: MAJOR,
        degreeToMidi: (deg, octaveOffset = 0) => tonic + degreeToSemitone(deg, MAJOR) + octaveOffset,
        chordsByBar,
        melodyDegrees,
        levels: { pad: 0.015, epiano: 0.028, melody: 0.030, bass: 0.020 }
      };
    }
  }

  _startScheduler(theme) {
    if (!this.ctx) return;
    this._musicTheme = theme;
    this._barIndex = 0;
    this._nextBarTime = this.ctx.currentTime + 0.05;

    if (this._musicTimer) {
      clearInterval(this._musicTimer);
      this._musicTimer = null;
    }

    this._musicTimer = window.setInterval(() => this._schedulerTick(), 120);
  }

  _stopScheduler() {
    if (this._musicTimer) {
      clearInterval(this._musicTimer);
      this._musicTimer = null;
    }
    this._musicTheme = null;
  }

  _schedulerTick() {
    if (!this._musicPlaying || !this.musicEnabled || !this.ctx || !this._musicTheme) return;

    const ctx = this.ctx;
    const theme = this._musicTheme;
    const scheduleAhead = 0.8;
    const now = ctx.currentTime;

    while (this._nextBarTime < now + scheduleAhead) {
      const barIdx = this._barIndex % theme.loopBars;
      this._scheduleBar(theme, barIdx, this._nextBarTime);

      this._nextBarTime += theme.barSeconds;
      this._barIndex = (this._barIndex + 1) % theme.loopBars;
    }
  }

  _scheduleBar(theme, barIndex, tBar) {
    const chord = theme.chordsByBar[barIndex];
    const secPerEighth = theme.secPerEighth;
    const barSeconds = theme.barSeconds;

    const jitter = () => (this._rand() - 0.5) * 0.012;
    const vel = (base) => base * (0.92 + this._rand() * 0.16);

    const playChordPad = (holdBars = 1) => {
      const holdSeconds = barSeconds * holdBars * 0.98;
      const tones = (chord.tones || []).slice(0, 3);
      for (const m of tones) {
        this._playTone({
          bus: 'music',
          type: 'sine',
          freq: this._midiToFreq(m),
          when: tBar + jitter(),
          duration: holdSeconds,
          attack: 0.12,
          volume: vel(theme.levels.pad),
          filterType: 'lowpass',
          filterFreq: 2500,
          filterQ: 0.5
        });
      }
    };

    const playBass = (midi, holdBars = 1) => {
      const holdSeconds = barSeconds * holdBars * 0.96;
      const bassMidi = midi - 12 >= 40 ? midi - 12 : midi;
      this._playTone({
        bus: 'music',
        type: 'sine',
        freq: this._midiToFreq(bassMidi),
        when: tBar + jitter(),
        duration: holdSeconds,
        attack: 0.04,
        volume: vel(theme.levels.bass),
        filterType: 'lowpass',
        filterFreq: 240,
        filterQ: 0.7
      });
    };

    const isChordStart = barIndex === 0 || chord !== theme.chordsByBar[barIndex - 1];
    const holdBars = chord.holdBars || 1;

    if (isChordStart) {
      playChordPad(holdBars);
      playBass(chord.root, holdBars);
    }

    if (theme.key === '0_5') {
      // Alt pattern for 'blanket': waltz arp on steps 0,2,4
      if (theme.patternId === 'blanket') {
        const tones = chord.tones;
        const root = tones?.[0] ?? chord.root;
        const third = tones?.[1] ?? chord.root + 4;
        const fifth = tones?.[2] ?? chord.root + 7;

        const arpNotes = [
          { step: 0, midi: root + 12 },
          { step: 2, midi: fifth + 12 },
          { step: 4, midi: third + 12 }
        ];

        for (const n of arpNotes) {
          this._playTone({
            bus: 'music',
            type: 'triangle',
            freq: this._midiToFreq(n.midi),
            when: tBar + n.step * secPerEighth + jitter(),
            duration: secPerEighth * 1.8,
            attack: 0.01,
            volume: vel(theme.levels.arp),
            filterType: 'highpass',
            filterFreq: 180,
            filterQ: 0.6
          });
        }

        const degrees = theme.melodyDegrees[barIndex] || [];
        for (let i = 0; i < degrees.length; i++) {
          const deg = degrees[i];
          if (!deg) continue;
          const midi = theme.degreeToMidi(deg, 0);
          this._playTone({
            bus: 'music',
            type: 'triangle',
            freq: this._midiToFreq(midi),
            when: tBar + i * secPerEighth + jitter(),
            duration: secPerEighth * 0.92,
            attack: 0.012,
            volume: vel(theme.levels.melody),
            filterType: 'highpass',
            filterFreq: 240,
            filterQ: 0.7
          });
        }
        return;
      }

      // Base '0_5' pattern
      const tones = chord.tones;
      const root = tones?.[0] ?? chord.root;
      const third = tones?.[1] ?? chord.root + 4;
      const fifth = tones?.[2] ?? chord.root + 7;

      const arpNotes = [
        { step: 0, midi: root + 12, lenSteps: 3 },
        { step: 3, midi: fifth + 12, lenSteps: 1 },
        { step: 4, midi: third + 12, lenSteps: 2 }
      ];

      for (const n of arpNotes) {
        this._playTone({
          bus: 'music',
          type: 'triangle',
          freq: this._midiToFreq(n.midi),
          when: tBar + n.step * secPerEighth + jitter(),
          duration: n.lenSteps * secPerEighth * 0.98,
          attack: 0.01,
          volume: vel(theme.levels.arp),
          filterType: 'highpass',
          filterFreq: 180,
          filterQ: 0.6
        });
      }

      const degrees = theme.melodyDegrees[barIndex] || [];
      for (let i = 0; i < degrees.length; i++) {
        const deg = degrees[i];
        if (!deg) continue;
        const midi = theme.degreeToMidi(deg, 0);
        this._playTone({
          bus: 'music',
          type: 'triangle',
          freq: this._midiToFreq(midi),
          when: tBar + i * secPerEighth + jitter(),
          duration: secPerEighth * 0.92,
          attack: 0.012,
          volume: vel(theme.levels.melody),
          filterType: 'highpass',
          filterFreq: 240,
          filterQ: 0.7
        });
      }
      return;
    }

    if (theme.key === '6_12') {
      // Alt pattern for 'sketch': rolling plucks on steps 0,3,6,9
      if (theme.patternId === 'sketch') {
        const tones = chord.tones;
        const root = tones?.[0] ?? chord.root;
        const third = tones?.[1] ?? chord.root + 4;
        const fifth = tones?.[2] ?? chord.root + 7;

        const pluckSeq = [root + 12, null, null, fifth + 12, null, null, third + 12, null, null, fifth + 12, null, null];
        for (let s = 0; s < pluckSeq.length; s++) {
          const m = pluckSeq[s];
          if (m == null) continue;
          this._playTone({
            bus: 'music',
            type: 'triangle',
            freq: this._midiToFreq(m),
            when: tBar + s * secPerEighth + jitter(),
            duration: secPerEighth * 2.2,
            attack: 0.006,
            volume: vel(theme.levels.pluck),
            filterType: 'bandpass',
            filterFreq: 1200,
            filterQ: 0.8
          });
        }

        const degrees = theme.melodyDegrees[barIndex] || [];
        for (let s = 0; s < 12; s += 3) {
          const deg = degrees[s];
          if (!deg) continue;
          const midi = theme.degreeToMidi(deg, 0);
          this._playTone({
            bus: 'music',
            type: 'sine',
            freq: this._midiToFreq(midi),
            when: tBar + s * secPerEighth + jitter(),
            duration: (3 * secPerEighth) * 0.92,
            attack: 0.01,
            volume: vel(theme.levels.melody),
            filterType: 'lowpass',
            filterFreq: 2600,
            filterQ: 0.7
          });
        }
        return;
      }

      // Base '6_12' pattern
      const tones = chord.tones;
      const root = tones?.[0] ?? chord.root;
      const third = tones?.[1] ?? chord.root + 4;
      const fifth = tones?.[2] ?? chord.root + 7;

      const pluckSeq = [root + 12, null, fifth + 12, null, third + 12, null, fifth + 12, null];
      for (let s = 0; s < pluckSeq.length; s++) {
        const m = pluckSeq[s];
        if (m == null) continue;
        this._playTone({
          bus: 'music',
          type: 'triangle',
          freq: this._midiToFreq(m),
          when: tBar + s * secPerEighth + jitter(),
          duration: secPerEighth * 0.55,
          attack: 0.006,
          volume: vel(theme.levels.pluck),
          filterType: 'bandpass',
          filterFreq: 1200,
          filterQ: 0.8
        });
      }

      for (const s of [1, 3, 5, 7]) {
        if (this._rand() < 0.12) continue;
        this._playNoise({
          when: tBar + s * secPerEighth + jitter(),
          duration: 0.05,
          volume: vel(theme.levels.shaker),
          filterType: 'highpass',
          filterFreq: 2400,
          filterQ: 0.7
        });
      }

      const degrees = theme.melodyDegrees[barIndex] || [];
      for (let q = 0; q < 4; q++) {
        const deg = degrees[q];
        if (!deg) continue;
        const midi = theme.degreeToMidi(deg, 0);
        this._playTone({
          bus: 'music',
          type: 'sine',
          freq: this._midiToFreq(midi),
          when: tBar + (q * 2) * secPerEighth + jitter(),
          duration: (2 * secPerEighth) * 0.92,
          attack: 0.01,
          volume: vel(theme.levels.melody),
          filterType: 'lowpass',
          filterFreq: 2600,
          filterQ: 0.7
        });
      }
      return;
    }

    // 13–18
    {
      // Alt pattern for 'window': arpeggiated spread on steps 0,2,4,6,8 and melody on steps 0 and 5
      if (theme.patternId === 'window') {
        const tones = chord.tones || [];
        const arpSteps = [0, 2, 4, 6, 8];
        for (let i = 0; i < Math.min(arpSteps.length, tones.length); i++) {
          const m = tones[i] + 12;
          const step = arpSteps[i];
          this._playTone({
            bus: 'music',
            type: 'triangle',
            freq: this._midiToFreq(m),
            when: tBar + step * secPerEighth + jitter(),
            duration: secPerEighth * 1.8,
            attack: 0.012,
            volume: vel(theme.levels.epiano) * 0.75,
            filterType: 'lowpass',
            filterFreq: 2200,
            filterQ: 0.6
          });
        }

        const degrees = theme.melodyDegrees[barIndex] || [];
        for (const step of [0, 5]) {
          const deg = degrees[step];
          if (!deg) continue;
          const midi = theme.degreeToMidi(deg, 0);
          this._playTone({
            bus: 'music',
            type: 'sine',
            freq: this._midiToFreq(midi),
            when: tBar + step * secPerEighth + jitter(),
            duration: (5 * secPerEighth) * 0.95,
            attack: 0.02,
            volume: vel(theme.levels.melody),
            filterType: 'lowpass',
            filterFreq: 2400,
            filterQ: 0.7
          });
        }
        return;
      }

      // Base '13_18' pattern
      const hitTones = (chord.tones || []).slice(0, 3).map(m => m + 12);
      for (const m of hitTones) {
        const freq = this._midiToFreq(m);
        this._playTone({
          bus: 'music',
          type: 'triangle',
          freq,
          when: tBar + jitter(),
          duration: barSeconds * 0.65,
          attack: 0.012,
          volume: vel(theme.levels.epiano) * 0.8,
          filterType: 'lowpass',
          filterFreq: 2200,
          filterQ: 0.6
        });
        this._playTone({
          bus: 'music',
          type: 'sine',
          freq,
          when: tBar + jitter() + 0.002,
          duration: barSeconds * 0.55,
          attack: 0.01,
          volume: vel(theme.levels.epiano) * 0.35,
          filterType: 'lowpass',
          filterFreq: 2000,
          filterQ: 0.6
        });
      }

      const degrees = theme.melodyDegrees[barIndex] || [];
      for (let h = 0; h < 2; h++) {
        const deg = degrees[h];
        if (!deg) continue;
        const midi = theme.degreeToMidi(deg, 0);
        this._playTone({
          bus: 'music',
          type: 'sine',
          freq: this._midiToFreq(midi),
          when: tBar + (h * 4) * secPerEighth + jitter(),
          duration: (4 * secPerEighth) * 0.95,
          attack: 0.02,
          volume: vel(theme.levels.melody),
          filterType: 'lowpass',
          filterFreq: 2400,
          filterQ: 0.7
        });
      }
    }
  }

  startMusic() {
    if (!this.musicEnabled) return;
    this._unlock();
    if (!this.ctx || this._musicPlaying) return;

    const themeKey = this.getEffectiveMusicThemeKey(this.childAge);
    this._musicThemeKey = themeKey;
    const theme = this._getTheme(themeKey);

    const now = this.ctx.currentTime;
    try {
      this.musicFadeGain.gain.cancelScheduledValues(now);
      this.musicFadeGain.gain.setValueAtTime(0.0001, now);
      this.musicFadeGain.gain.linearRampToValueAtTime(1.0, now + 1.2);
    } catch {}

    this._musicPlaying = true;
    this._startScheduler(theme);
  }

  stopMusic(opts = {}) {
    const { restart = false } = opts;

    if (this._musicTimer) {
      clearInterval(this._musicTimer);
      this._musicTimer = null;
    }

    if (!this._musicPlaying || !this.ctx) {
      this._musicPlaying = false;
      this._musicTheme = null;
      return;
    }

    const now = this.ctx.currentTime;
    try {
      this.musicFadeGain.gain.cancelScheduledValues(now);
      this.musicFadeGain.gain.setValueAtTime(this.musicFadeGain.gain.value, now);
      this.musicFadeGain.gain.linearRampToValueAtTime(0.0001, now + 0.35);
    } catch {}

    this._stopScheduler();
    this._musicPlaying = false;

    setTimeout(() => {
      this._stopAllActiveMusicNodes();
      if (restart && this.musicEnabled) this.startMusic();
    }, 420);
  }

  playSfx(name) {
    if (!this.sfxEnabled) return;

    this._unlock();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    switch (name) {

      // Soft UI Pop — light minimal click (used for normal UI clicks)
      case 'click': {
        // A short "pop" made from a quick pitch sweep + a tiny rounded body.
        this._playTone({
          bus: 'sfx',
          type: 'triangle',
          freq: 1400,
          freqEnd: 650,
          duration: 0.045,
          attack: 0.0015,
          volume: 0.10,
          filterType: 'lowpass',
          filterFreq: 2200,
          when: now
        });
        // Add a tiny low "thump" to feel more like a UX pop than a beep
        this._playTone({
          bus: 'sfx',
          type: 'sine',
          freq: 220,
          freqEnd: 140,
          duration: 0.040,
          attack: 0.001,
          volume: 0.028,
          filterType: 'lowpass',
          filterFreq: 520,
          when: now
        });
        break;
      }

      // Purchase Success — tiny fast "ding" confirmation (used on purchases)
      case 'success': {
        // Two-layer tiny ping: body + shimmer
        this._playTone({
          bus: 'sfx',
          type: 'sine',
          freq: 1040,
          freqEnd: 1320,
          duration: 0.11,
          attack: 0.004,
          volume: 0.10,
          filterType: 'lowpass',
          filterFreq: 3600,
          when: now
        });
        this._playTone({
          bus: 'sfx',
          type: 'triangle',
          freq: 1560,
          freqEnd: 1860,
          duration: 0.10,
          attack: 0.004,
          volume: 0.045,
          filterType: 'lowpass',
          filterFreq: 4200,
          when: now + 0.01
        });
        break;
      }

      // Error — classic notification error tone (gentle, not harsh)
      case 'bad': {
        // Two short descending beeps; rounded so it isn't a harsh buzzer
        this._playTone({
          bus: 'sfx',
          type: 'triangle',
          freq: 520,
          freqEnd: 390,
          duration: 0.09,
          attack: 0.002,
          volume: 0.10,
          filterType: 'lowpass',
          filterFreq: 1800,
          when: now
        });
        this._playTone({
          bus: 'sfx',
          type: 'triangle',
          freq: 390,
          freqEnd: 290,
          duration: 0.11,
          attack: 0.002,
          volume: 0.095,
          filterType: 'lowpass',
          filterFreq: 1700,
          when: now + 0.10
        });
        break;
      }

      // Game Level Complete — warm "progress achieved" chime (milestones only)
      case 'ageup': {
        // Warm major arpeggio: root -> 3rd -> 5th -> octave
        const base = 392.0; // G4 (warm & not too bright)
        const n1 = base;           // root
        const n2 = base * (5/4);   // maj 3rd
        const n3 = base * (3/2);   // 5th
        const n4 = base * 2;       // octave

        const step = 0.11;

        // Body layer
        this._playTone({ bus:'sfx', type:'triangle', freq:n1, duration:0.38, attack:0.01, volume:0.085, filterType:'lowpass', filterFreq:2600, when: now });
        this._playTone({ bus:'sfx', type:'triangle', freq:n2, duration:0.34, attack:0.01, volume:0.080, filterType:'lowpass', filterFreq:2600, when: now + step });
        this._playTone({ bus:'sfx', type:'triangle', freq:n3, duration:0.32, attack:0.01, volume:0.078, filterType:'lowpass', filterFreq:2600, when: now + step*2 });
        this._playTone({ bus:'sfx', type:'triangle', freq:n4, duration:0.40, attack:0.01, volume:0.082, filterType:'lowpass', filterFreq:2800, when: now + step*3 });

        // A soft shimmer (very quiet)
        this._playTone({ bus:'sfx', type:'sine', freq:n4*1.5, duration:0.36, attack:0.01, volume:0.030, filterType:'lowpass', filterFreq:4200, when: now + step*3 + 0.02 });

        break;
      }

      default: {
        // fallback = click
        this.playSfx('click');
      }
    }

    if (this.musicEnabled && !this._musicPlaying) this.startMusic();
  }
}

export const audioManager = new AudioManager();