import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Star, ArrowLeft, Globe2, Home, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { useGameState } from '@/components/game/GameStateContext';
import { CULTURAL_ROOTS } from '@/components/game/culturalRootsData';
import { TEACH_TEMPLATES } from '@/components/game/cultureCatalog';
import { CULTURE_EVENT_TEMPLATES } from '@/components/game/cultureEventTemplates';
import CulturePlanSetup from '@/components/game/CulturePlanSetup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

function normalizeSearch(s) {
  return String(s || '').toLowerCase().trim();
}

function normalizeCultureKey(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[\u2010-\u2015]/g, '-') // normalize fancy dashes
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function templateText(s, vars) {
  if (!s) return '';
  let out = String(s);
  Object.entries(vars || {}).forEach(([k, v]) => {
    out = out.replaceAll(`{${k}}`, String(v));
  });
  return out;
}

function ensureFocusDesc(desc) {
  const d = String(desc || '').trim();
  if (!d) return '';
  const low = d.toLowerCase();
  if (low.startsWith('spend 1 focus')) return d;
  return `Spend 1 Focus: ${d}`;
}

function buildCultureMatchers(culturalRoots) {
  const idSet = new Set();
  const labelById = {};
  const normToId = {};

  const add = (phrase, id) => {
    const key = normalizeCultureKey(phrase);
    if (!key) return;
    if (!normToId[key]) normToId[key] = id;
  };

  (Array.isArray(culturalRoots) ? culturalRoots : []).forEach(r => {
    if (!r?.id) return;
    idSet.add(r.id);
    labelById[r.id] = r.label || r.id;

    const label = r.label || r.id;
    add(label, r.id);

    // Before parentheses (e.g., "Arab" from "Arab (Middle East / North Africa)")
    const beforeParen = String(label).split('(')[0]?.trim();
    if (beforeParen) add(beforeParen, r.id);

    // Split on slashes for helpful partial matches ("British", "Irish", etc.)
    String(label).split('/').forEach(part => add(part, r.id));
  });

  // Friendly aliases for common user inputs (Culture Plan is free-text).
  const alias = {
    'us': 'AMERICAN_US',
    'u s': 'AMERICAN_US',
    'u s a': 'AMERICAN_US',
    'usa': 'AMERICAN_US',
    'u.s.': 'AMERICAN_US',
    'u.s': 'AMERICAN_US',
    'america': 'AMERICAN_US',
    'american': 'AMERICAN_US',

    'uk': 'BRITISH_IRISH',
    'u k': 'BRITISH_IRISH',
    'british': 'BRITISH_IRISH',
    'irish': 'BRITISH_IRISH',

    'australian': 'AUS_NZ',
    'new zealand': 'AUS_NZ',
    'new zealander': 'AUS_NZ',

    'iran': 'PERSIAN_IRANIAN',
    'iranian': 'PERSIAN_IRANIAN',
    'persian': 'PERSIAN_IRANIAN',

    'middle east': 'ARAB',
    'mena': 'ARAB',

    'ethiopia': 'ETHIOPIAN_ERITREAN',
    'ethiopian': 'ETHIOPIAN_ERITREAN',
    'eritrea': 'ETHIOPIAN_ERITREAN',
    'eritrean': 'ETHIOPIAN_ERITREAN',

    'kenya': 'SWAHILI_COAST',
    'kenyan': 'SWAHILI_COAST',
    'tanzania': 'SWAHILI_COAST',
    'tanzanian': 'SWAHILI_COAST',
    'swahili': 'SWAHILI_COAST',

    'west africa': 'NIGERIAN_WEST_AFRICAN',
    'west african': 'NIGERIAN_WEST_AFRICAN',
    'nigeria': 'NIGERIAN_WEST_AFRICAN',
    'nigerian': 'NIGERIAN_WEST_AFRICAN',

    'first nations': 'INDIGENOUS_FN',
    'indigenous': 'INDIGENOUS_FN',

    'jewish': 'JEWISH',
    'judaism': 'JEWISH',
  };

  Object.entries(alias).forEach(([k, id]) => add(k, id));

  return { idSet, labelById, normToId };
}

function resolveCultureStringToRootId(input, matchers) {
  const raw = String(input || '').trim();
  if (!raw) return null;

  const { idSet, normToId, labelById } = matchers || {};
  if (!idSet || !normToId) return null;

  // Exact root id match
  const upper = raw.toUpperCase().replaceAll(' ', '_');
  if (idSet.has(upper)) return upper;

  // Exact label/alias match
  const norm = normalizeCultureKey(raw);
  if (normToId[norm]) return normToId[norm];

  // Soft contains match (useful for "Spanish (Spain)" vs "Spanish")
  if (norm.length >= 4) {
    const keys = Object.keys(normToId);
    for (const k of keys) {
      if (k.includes(norm) || norm.includes(k)) return normToId[k];
    }
  }

  // If they typed a label exactly as displayed somewhere, catch it
  const labelKeys = Object.entries(labelById || {});
  for (const [id, label] of labelKeys) {
    if (normalizeCultureKey(label) === norm) return id;
  }

  return null;
}

export default function TeachCultureModal({ open, onClose }) {
  const { gameState, logCultureMoment, consumeAction } = useGameState();

  const childName = gameState.childName || 'your child';

  const matchers = useMemo(() => buildCultureMatchers(CULTURAL_ROOTS), []);

  // Mode: "my" = teach within your selected roots, "world" = pick any culture
  const [mode, setMode] = useState('my'); // 'my' | 'world'
  const [cultureSearch, setCultureSearch] = useState('');
  const [selectedCultureId, setSelectedCultureId] = useState(null);
  const [selectedCultureLabel, setSelectedCultureLabel] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [logOpen, setLogOpen] = useState(false);
  const [planSetupOpen, setPlanSetupOpen] = useState(false);
  const [showEveryday, setShowEveryday] = useState(false);

  // If they pick a custom culture name, we route them into OTHER_CUSTOM templates but label it as their culture.
  const [customCultureName, setCustomCultureName] = useState(null);

  // Log Form State
  const [logData, setLogData] = useState({
    date: new Date().toISOString().split('T')[0],
    participants: { Parent: true, Child: true, Sibling: false, Grandparent: false },
    reaction: 'Likely',
    notes: '',
    next: ''
  });

  const culturePlanCultures = useMemo(() => {
    const arr = gameState?.culturePlan?.cultures;
    return Array.isArray(arr) ? arr.filter(Boolean) : [];
  }, [gameState?.culturePlan?.cultures]);

  const myCultureIds = useMemo(() => {
    const ids = Array.isArray(gameState.playerCultures) ? gameState.playerCultures : [];
    return ids.filter(Boolean);
  }, [gameState.playerCultures]);

  const cultureLabelById = useMemo(() => matchers.labelById || {}, [matchers.labelById]);

  useEffect(() => {
    if (!open) return;

    // Reset modal state each time it opens (keeps the UX predictable)
    setMode('my');
    setCultureSearch('');
    setSelectedCultureId(null);
    setSelectedCultureLabel(null);
    setSelectedTemplate(null);
    setLogOpen(false);
    setPlanSetupOpen(false);
    setShowEveryday(false);
    setCustomCultureName(null);
    setLogData({
      date: new Date().toISOString().split('T')[0],
      participants: { Parent: true, Child: true, Sibling: false, Grandparent: false },
      reaction: 'Likely',
      notes: '',
      next: ''
    });
  }, [open]);

  const myCultures = useMemo(() => {
    const items = [];
    const seenBuiltin = new Set();
    const seenCustom = new Set();

    // A) Selected Cultural Roots (IDs)
    for (const id of myCultureIds) {
      if (!matchers.idSet.has(id)) continue;
      if (seenBuiltin.has(id)) continue;
      items.push({ kind: 'builtin', id, label: cultureLabelById[id] || id });
      seenBuiltin.add(id);
    }

    // B) Culture Plan (free text): map to built-ins when possible, else treat as custom
    for (const name of culturePlanCultures) {
      const resolved = resolveCultureStringToRootId(name, matchers);
      if (resolved && matchers.idSet.has(resolved)) {
        if (!seenBuiltin.has(resolved)) {
          items.push({ kind: 'builtin', id: resolved, label: cultureLabelById[resolved] || name });
          seenBuiltin.add(resolved);
        }
      } else {
        const key = normalizeCultureKey(name);
        if (!key || seenCustom.has(key)) continue;
        items.push({ kind: 'custom', id: `CUSTOM_${key}`, label: name, customName: name });
        seenCustom.add(key);
      }
    }

    return items;
  }, [myCultureIds, culturePlanCultures, matchers, cultureLabelById]);

  const worldCultures = useMemo(() => {
    const list = (Array.isArray(CULTURAL_ROOTS) ? CULTURAL_ROOTS : [])
      .filter(c => c?.id && c.id !== 'OTHER_CUSTOM')
      .map(c => ({ kind: 'builtin', id: c.id, label: c.label || c.id }));

    const q = normalizeSearch(cultureSearch);
    if (!q) return list;
    return list.filter(c => normalizeSearch(c.label).includes(q));
  }, [cultureSearch]);

  const cultureList = mode === 'my' ? myCultures : worldCultures;

  const cultureLabel = selectedCultureLabel || customCultureName || (selectedCultureId ? (cultureLabelById[selectedCultureId] || selectedCultureId) : null);

  const holidayTemplates = useMemo(() => {
    if (!selectedCultureId) return [];
    const t = CULTURE_EVENT_TEMPLATES?.[selectedCultureId];
    return Array.isArray(t) ? t : [];
  }, [selectedCultureId]);

  const everydayTemplates = useMemo(() => {
    return Array.isArray(TEACH_TEMPLATES) ? TEACH_TEMPLATES : [];
  }, []);

  const vars = useMemo(
    () => ({ CHILD_NAME: childName, CULTURE_NAME: cultureLabel || '' }),
    [childName, cultureLabel]
  );

  const handlePickCulture = (item) => {
    if (!item) return;

    if (item.kind === 'custom') {
      const name = item.customName || item.label || 'Custom Culture';
      setCustomCultureName(name);
      setSelectedCultureId('OTHER_CUSTOM');
      setSelectedCultureLabel(name);
    } else {
      setCustomCultureName(null);
      setSelectedCultureId(item.id);
      setSelectedCultureLabel(item.label || cultureLabelById[item.id] || item.id);
    }

    setSelectedTemplate(null);
    setLogOpen(false);
    setShowEveryday(false);
  };

  const handleStart = (t) => {
    setSelectedTemplate(t);
    setLogOpen(false);
  };

  const handleComplete = () => {
    // Spend Focus on completion (avoids "I clicked it by accident" punishment).
    if (typeof consumeAction === 'function') {
      const ok = consumeAction('teachCulture');
      if (!ok) return;
    }

    const bonus = logData.notes ? 5 : 0;
    const earned = (Number(selectedTemplate?.points || 0) || 0) + bonus;

    const baseTitle = templateText(selectedTemplate?.title || 'Teach Culture', vars);
    const culturePrefix = cultureLabel || 'Culture';
    const fullTitle = `${culturePrefix} — ${baseTitle}`;

    logCultureMoment({
      id: Date.now(),
      logType: "Teach",
      title: fullTitle,
      date: logData.date,
      rootsPointsEarned: earned,
      childReaction: logData.reaction,
      notes: logData.notes,
      createdAt: Date.now()
    });

    toast.success(`Roots earned. You spent 1 Focus on culture today. (+${earned} pts)`);
    setLogOpen(false);
    setSelectedTemplate(null);
    setSelectedCultureId(null);
    setSelectedCultureLabel(null);
    setCustomCultureName(null);
    onClose();
  };

  const handleBack = () => {
    if (planSetupOpen) {
      setPlanSetupOpen(false);
      return;
    }
    if (logOpen) {
      setLogOpen(false);
      return;
    }
    if (selectedTemplate) {
      setSelectedTemplate(null);
      return;
    }
    if (selectedCultureId) {
      setSelectedCultureId(null);
      setSelectedCultureLabel(null);
      setCustomCultureName(null);
      return;
    }
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-[110] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 50, opacity: 0 }}
          className="bg-slate-50 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh]"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-white p-4 border-b border-slate-200 flex items-center gap-3">
            <button onClick={handleBack} className="p-1 hover:bg-slate-100 rounded-full">
              <ArrowLeft className="w-5 h-5 text-slate-500" />
            </button>

            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-800">
                {logOpen
                  ? `Log: ${templateText(selectedTemplate?.title || 'Teach Culture', vars)}`
                  : selectedTemplate
                    ? templateText(selectedTemplate.title, vars)
                    : selectedCultureId
                      ? `Teach ${cultureLabel}`
                      : "Teach Culture"}
              </h2>

              {!selectedTemplate && !selectedCultureId && !logOpen && (
                <p className="text-xs text-slate-500">
                  Pick a culture. Teach your roots—or explore the world—with respect. (Focus cost: 1 when you complete.)
                </p>
              )}

              {selectedCultureId && !selectedTemplate && !logOpen && (
                <p className="text-xs text-slate-500">
                  Pick a moment. You'll spend 1 Focus when you log completion.
                </p>
              )}
            </div>

            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {/* Culture picker */}
            {!selectedCultureId && !selectedTemplate && !logOpen && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => { setMode('my'); setCultureSearch(''); }}
                    className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold flex items-center justify-center gap-2 ${
                      mode === 'my' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-800 border-slate-200'
                    }`}
                  >
                    <Home className="w-4 h-4" /> Teach your culture
                  </button>
                  <button
                    onClick={() => setMode('world')}
                    className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold flex items-center justify-center gap-2 ${
                      mode === 'world' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-800 border-slate-200'
                    }`}
                  >
                    <Globe2 className="w-4 h-4" /> Teach a world culture
                  </button>
                </div>

                {mode === 'my' && !myCultures.length && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                    You don't have any cultures set yet (or we couldn't match your Culture Plan to our built-in list).
                    <div className="mt-2 flex gap-2 flex-wrap">
                      <Button size="sm" className="bg-indigo-600 text-white" onClick={() => setMode('world')}>
                        Explore world cultures
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setPlanSetupOpen(true)}>
                        Add a custom culture
                      </Button>
                    </div>
                  </div>
                )}

                {mode === 'world' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Search cultures</label>
                    <Input
                      value={cultureSearch}
                      onChange={(e) => setCultureSearch(e.target.value)}
                      placeholder="Type a culture name…"
                    />
                    <div className="text-xs text-slate-500">
                      Reminder: learn with respect. Avoid "costume culture"; aim for stories, values, food, music, and crediting sources.
                    </div>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-2 pt-2">
                  {cultureList.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handlePickCulture(item)}
                      className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all text-left"
                    >
                      <div className="font-bold text-slate-800">{item.label}</div>
                      <div className="text-xs text-slate-500">
                        {item.kind === 'custom' ? 'Your custom culture' : 'Holiday moments + everyday moments'}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setPlanSetupOpen(true)}
                    className="w-full bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all text-left flex items-center gap-2"
                  >
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700">
                      <Plus className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="font-bold text-slate-800">Add / edit a custom culture</div>
                      <div className="text-xs text-slate-500">Keep your own traditions in the game.</div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Event list (chosen culture) */}
            {selectedCultureId && !selectedTemplate && !logOpen && (
              <div className="space-y-6">
                {/* Holiday / tradition lessons */}
                <div>
                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-slate-800">Holiday & tradition lessons</h3>
                      <p className="text-xs text-slate-500">Two default moments per culture. Funny, respectful, and doable.</p>
                    </div>
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full" title="Focus is spent when you log completion.">Focus: 1</span>
                  </div>

                  {!holidayTemplates.length ? (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                      No default holiday/tradition lessons found for {cultureLabel}. (Yet.)
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {holidayTemplates.map(t => (
                        <div key={t.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all">
                          <div className="flex justify-between items-start mb-2 gap-3">
                            <h4 className="font-bold text-slate-800">{templateText(t.title, vars)}</h4>
                            <div className="flex gap-2 shrink-0">
                              <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">{t.time}m</span>
                              <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">{t.points} pts</span>
                            </div>
                          </div>

                          <p className="text-sm text-slate-600 mb-4">{ensureFocusDesc(templateText(t.description, vars))}</p>

                          <div className="flex justify-end gap-2">
                            <Button size="sm" onClick={() => handleStart(t)} className="bg-indigo-600 text-white">Start</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Everyday culture moments */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <button
                    onClick={() => setShowEveryday(v => !v)}
                    className="w-full p-4 flex items-center justify-between hover:bg-slate-50"
                  >
                    <div className="text-left">
                      <div className="font-bold text-slate-800">Everyday culture moments</div>
                      <div className="text-xs text-slate-500">Works with any culture: language, stories, values, food, music.</div>
                    </div>
                    {showEveryday ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </button>

                  {showEveryday && (
                    <div className="p-4 pt-0 grid gap-3">
                      {everydayTemplates.map(t => (
                        <div key={t.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-indigo-300 transition-all">
                          <div className="flex justify-between items-start mb-2 gap-3">
                            <h4 className="font-bold text-slate-800">{templateText(t.title, vars)}</h4>
                            <div className="flex gap-2 shrink-0">
                              <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">{t.time}m</span>
                              <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">{t.points} pts</span>
                            </div>
                          </div>

                          <p className="text-sm text-slate-600 mb-4">{ensureFocusDesc(templateText(t.description, vars))}</p>

                          <div className="flex justify-end gap-2">
                            <Button size="sm" onClick={() => handleStart(t)} className="bg-indigo-600 text-white">Start</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Detail view */}
            {selectedTemplate && !logOpen && (
              <div className="space-y-6 max-w-lg mx-auto">
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {selectedTemplate.time} min</span>
                  <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400" /> {selectedTemplate.points} Roots Points</span>
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full" title="Focus is spent when you log completion.">Focus: 1</span>
                </div>

                <section className="bg-white p-4 rounded-xl border border-slate-200">
                  <div className="text-sm text-slate-700 whitespace-pre-wrap">
                    {ensureFocusDesc(templateText(selectedTemplate.description, vars))}
                  </div>
                </section>

                <div className="space-y-6">
                  <section>
                    <h4 className="font-bold text-slate-900 mb-2">What you'll do</h4>
                    <ul className="list-disc pl-5 text-slate-700 space-y-1">
                      {(selectedTemplate.whatYoullDo || []).map((item, i) => <li key={i}>{templateText(item, vars)}</li>)}
                    </ul>
                  </section>

                  {selectedTemplate.whatToSay && (
                    <section className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                      <h4 className="font-bold text-indigo-900 mb-1">What to say</h4>
                      <p className="text-indigo-800 italic">"{templateText(selectedTemplate.whatToSay, vars)}"</p>
                    </section>
                  )}

                  <section>
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-slate-900">Make it yours</h4>
                      <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500" title="The goal isn't perfect culture. The goal is warm connection.">ℹ️</span>
                    </div>
                    <p className="text-slate-700">{templateText(selectedTemplate.makeItYours, vars)}</p>
                  </section>

                  <section className="bg-green-50 p-4 rounded-xl border border-green-100">
                    <h4 className="font-bold text-green-900 mb-1">Quick win version</h4>
                    <p className="text-green-800 text-sm">{templateText(selectedTemplate.quickWin, vars)}</p>
                  </section>
                </div>

                <div className="pt-6">
                  <Button onClick={() => setLogOpen(true)} className="w-full bg-indigo-600 text-white py-6 text-lg">Log your moment</Button>
                </div>
              </div>
            )}

            {/* Log view */}
            {selectedTemplate && logOpen && (
              <div className="space-y-4 max-w-lg mx-auto">
                <h3 className="font-bold text-lg text-slate-800">{templateText(selectedTemplate.title, vars)}</h3>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Date</label>
                  <Input type="date" value={logData.date} onChange={e => setLogData({ ...logData, date: e.target.value })} />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">Who participated?</label>
                  <div className="flex gap-2 flex-wrap">
                    {['Parent', 'Child', 'Sibling', 'Grandparent'].map(p => (
                      <button
                        key={p}
                        onClick={() => setLogData(prev => ({ ...prev, participants: { ...prev.participants, [p]: !prev.participants[p] } }))}
                        className={`px-3 py-1 rounded-full text-sm border ${logData.participants[p] ? 'bg-indigo-100 border-indigo-300 text-indigo-800' : 'bg-white border-slate-200'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">Child reaction</label>
                  <select
                    className="w-full h-10 px-3 border rounded-md"
                    value={logData.reaction}
                    onChange={e => setLogData({ ...logData, reaction: e.target.value })}
                  >
                    {['Loved it', 'Liked it', 'Neutral', 'Resisted', 'Not sure yet'].map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">Notes</label>
                  <p className="text-xs text-slate-400 mb-2">A 10‑second note makes this moment easier to repeat.</p>
                  <textarea
                    className="w-full p-3 border rounded-md h-24 text-sm"
                    value={logData.notes}
                    onChange={e => setLogData({ ...logData, notes: e.target.value })}
                    placeholder="What happened?"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">What to try next</label>
                  <Input value={logData.next} onChange={e => setLogData({ ...logData, next: e.target.value })} />
                </div>

                <div className="pt-4">
                  <Button onClick={handleComplete} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6">
                    Complete & Earn {selectedTemplate.points} Pts
                  </Button>
                  <div className="text-xs text-slate-500 mt-2">
                    Completing spends 1 Focus. (+5 bonus pts if you write notes.)
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Custom Culture Plan modal (separate overlay) */}
        <CulturePlanSetup open={planSetupOpen} onClose={() => setPlanSetupOpen(false)} />
      </motion.div>
    </AnimatePresence>
  );
}