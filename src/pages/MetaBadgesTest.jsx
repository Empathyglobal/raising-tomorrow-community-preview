import React from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { computeRunMetrics, evaluateBadge } from '@/components/game/metaBadges/evaluator';

export default function MetaBadgesTest() {
  const [result, setResult] = React.useState(null);
  const [awardRes, setAwardRes] = React.useState(null);

  // Tiny fake run for testing
  const fakeRun = React.useMemo(() => ({
    runId: 'demo-run-1',
    completedAge: 19,
    years: Array.from({ length: 10 }).map((_, i) => ({ love: 70 - i * 1, stress: 50 - i * 0.5 })),
    timeline: [
      { roleType: 'connect', intensity: 1, choiceLetter: 'A' },
      { roleType: 'teach', intensity: 2, choiceLetter: 'B' },
      { roleType: 'boundary', intensity: 3, choiceLetter: 'C', tags: ['repair_opportunity', 'repair_taken'] },
    ],
    endStats: { confidence: 80, discipline: 72, money: 1500 },
    endRelationships: { teacherTrust: 65, peerCircle: 60 },
    flags: { chaosMode: false },
  }), []);

  const metrics = computeRunMetrics(fakeRun);

  const handleAward = async () => {
    const { data } = await base44.functions.invoke('metaBadges', { runId: fakeRun.runId, runSnapshot: fakeRun });
    setAwardRes(data);
  };

  const handlePreview = async () => {
    // Load definitions to preview evaluation
    const defs = await base44.entities.BadgeDefinition.list();
    const out = defs.map((d) => ({ id: d.id, name: d.name, eval: evaluateBadge(d, metrics) }));
    setResult(out);
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Meta Badges Test</h1>
      <div className="text-sm text-slate-600">Computed Metrics:</div>
      <pre className="bg-slate-50 p-3 rounded border text-xs overflow-auto">{JSON.stringify(metrics, null, 2)}</pre>
      <div className="flex gap-2">
        <Button onClick={handlePreview}>Preview Evaluation</Button>
        <Button variant="secondary" onClick={handleAward}>Award For This Run</Button>
      </div>
      {result && (
        <pre className="bg-slate-50 p-3 rounded border text-xs overflow-auto">{JSON.stringify(result, null, 2)}</pre>
      )}
      {awardRes && (
        <div className="text-sm">Awarded: {JSON.stringify(awardRes)}</div>
      )}
    </div>
  );
}