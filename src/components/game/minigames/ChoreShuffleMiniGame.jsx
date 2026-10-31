import React from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Shuffle, Timer } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// Rule/Task bank (>=25 sets)
const RULE_SETS = [
  { rule: 'Do the loud tasks before quiet time.', tasks: ['Vacuum living room', 'Fold laundry', 'Wipe counters', 'Sort books', 'Start dishwasher'], before: ['Vacuum living room|Fold laundry','Vacuum living room|Wipe counters','Vacuum living room|Sort books','Vacuum living room|Start dishwasher'] },
  { rule: 'Cold food last, hot food first.', tasks: ['Warm soup', 'Toast bread', 'Plate salad', 'Chop herbs', 'Serve ice cream'], groups: { hot:['Warm soup','Toast bread'], cold:['Plate salad','Serve ice cream'] } },
  { rule: 'Clean from top to bottom.', tasks: ['Dust shelves', 'Wipe table', 'Sweep floor', 'Mop floor', 'Take out trash'], before: ['Dust shelves|Wipe table','Dust shelves|Sweep floor','Dust shelves|Mop floor','Wipe table|Sweep floor','Wipe table|Mop floor'] },
  { rule: 'Wet tasks after dry tasks.', tasks: ['Sort toys', 'Fold blankets', 'Mop floor', 'Rinse sink', 'Dry handles'], groups: { dry:['Sort toys','Fold blankets'], wet:['Mop floor','Rinse sink','Dry handles'] } },
  { rule: 'Fragile items first, heavy items last.', tasks: ['Place glassware', 'Stack books', 'Move toolbox', 'Roll rug', 'Hang picture'], before: ['Place glassware|Stack books','Place glassware|Move toolbox','Place glassware|Roll rug','Place glassware|Hang picture','Stack books|Move toolbox','Stack books|Roll rug','Stack books|Hang picture'] },
  { rule: 'Hot to cold, then serve.', tasks: ['Boil pasta', 'Warm sauce', 'Toss salad', 'Fill water', 'Serve plates'], groups: { hot:['Boil pasta','Warm sauce'], cold:['Toss salad','Fill water'], end:['Serve plates'] } },
  { rule: 'Declutter before surface cleaning.', tasks: ['Pick up toys', 'Clear table', 'Wipe table', 'Sweep area', 'Mop area'], before: ['Pick up toys|Wipe table','Pick up toys|Sweep area','Pick up toys|Mop area','Clear table|Wipe table','Clear table|Sweep area','Clear table|Mop area'] },
  { rule: 'Laundry order: sort → wash → dry → fold → store.', tasks: ['Sort clothes','Start washer','Move to dryer','Fold clothes','Put away'], exact: ['Sort clothes','Start washer','Move to dryer','Fold clothes','Put away'] },
  { rule: 'Pack heavy first, delicate on top.', tasks: ['Pack books','Pack shoes','Pack clothes','Pack toiletries','Pack mug'], before: ['Pack books|Pack clothes','Pack books|Pack toiletries','Pack books|Pack mug','Pack shoes|Pack clothes','Pack shoes|Pack toiletries','Pack shoes|Pack mug'] },
  { rule: 'No crumbs before wiping: sweep then wipe.', tasks: ['Sweep crumbs','Wipe counters','Clean sink','Dry sink','Arrange fruit'], before: ['Sweep crumbs|Wipe counters'] },
  { rule: 'Wet bathroom last.', tasks: ['Collect towels','Replace tissues','Refill soap','Wipe mirror','Mop bathroom'], before: ['Collect towels|Mop bathroom','Replace tissues|Mop bathroom','Refill soap|Mop bathroom','Wipe mirror|Mop bathroom'] },
  { rule: 'Bedrooms first, kitchen last.', tasks: ['Make bed','Organize desk','Empty trash','Wipe counters','Sweep kitchen'], before: ['Make bed|Wipe counters','Make bed|Sweep kitchen','Organize desk|Wipe counters','Organize desk|Sweep kitchen','Empty trash|Wipe counters','Empty trash|Sweep kitchen'] },
  { rule: 'Top shelves then lower drawers.', tasks: ['Sort top shelf','Dust top shelf','Arrange middle shelf','Tidy lower drawer','Wipe baseboard'], before: ['Sort top shelf|Tidy lower drawer','Dust top shelf|Tidy lower drawer','Arrange middle shelf|Tidy lower drawer'] },
  { rule: 'Preheat before bake.', tasks: ['Preheat oven','Mix batter','Grease pan','Pour batter','Bake cake'], before: ['Preheat oven|Bake cake'] },
  { rule: 'Clean sink before drying.', tasks: ['Rinse sink','Scrub sink','Rinse again','Dry sink','Polish faucet'], exact: ['Rinse sink','Scrub sink','Rinse again','Dry sink','Polish faucet'] },
  { rule: 'Backpack prep: papers → books → snacks → water → zip.', tasks: ['Papers in','Books in','Snacks in','Water bottle','Zip up'], exact: ['Papers in','Books in','Snacks in','Water bottle','Zip up'] },
  { rule: 'Quiet tasks after bedtime.', tasks: ['Lay clothes','Pack lunch','Run laundry','Load dishwasher','Write note'], before: ['Run laundry|Lay clothes','Run laundry|Pack lunch','Run laundry|Write note','Load dishwasher|Lay clothes','Load dishwasher|Pack lunch','Load dishwasher|Write note'] },
  { rule: 'Entrance to interior: entry first, bedroom last.', tasks: ['Tidy entry','Clear hallway','Wipe living table','Make bed','Water plants'], before: ['Tidy entry|Make bed','Clear hallway|Make bed'] },
  { rule: 'Warm tasks before cold tasks.', tasks: ['Heat soup','Toast bread','Plate yogurt','Fill water','Cut fruit'], groups: { hot:['Heat soup','Toast bread'], cold:['Plate yogurt','Fill water','Cut fruit'] } },
  { rule: 'Sweep before mop, always.', tasks: ['Pick up toys','Sweep floor','Spot sticky','Mop floor','Dry mat'], before: ['Sweep floor|Mop floor'] },
  { rule: 'Sort, then store; labels last.', tasks: ['Sort items','Group similar','Place in bin','Label bin','Put on shelf'], exact: ['Sort items','Group similar','Place in bin','Label bin','Put on shelf'] },
  { rule: 'Outdoor first, indoor last (mud!).', tasks: ['Shake doormat','Clean shoes','Hang coat','Wipe floor','Store umbrella'], before: ['Shake doormat|Wipe floor','Clean shoes|Wipe floor'] },
  { rule: 'Trash before fresh linens.', tasks: ['Strip bed','Empty trash','Wipe nightstand','Put new sheets','Fluff pillows'], before: ['Empty trash|Put new sheets','Empty trash|Fluff pillows'] },
  { rule: 'Desk reset: papers → dust → arrange → wipe → admire.', tasks: ['Stack papers','Dust desk','Arrange pens','Wipe surface','Place plant'], exact: ['Stack papers','Dust desk','Arrange pens','Wipe surface','Place plant'] },
  { rule: 'Fridge: remove → wipe → sort → restock → label.', tasks: ['Remove items','Wipe shelves','Sort keep/discard','Restock','Label leftovers'], exact: ['Remove items','Wipe shelves','Sort keep/discard','Restock','Label leftovers'] },
];

function shuffle(arr) { const a=[...arr]; for (let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
function pairwiseAccuracy(order, beforePairs=[]) { if (!beforePairs || !beforePairs.length) return 1; const index=Object.fromEntries(order.map((t,i)=>[t,i])); let ok=0; beforePairs.forEach(p=>{const [a,b]=p.split('|'); if(index[a]<index[b]) ok++;}); return ok/ beforePairs.length; }
function exactAccuracy(order, exact) { if (!exact) return 0; let ok=0; exact.forEach((t,i)=>{ if(order[i]===t) ok++; }); return ok/exact.length; }
function groupsAccuracy(order, groups) {
  if (!groups) return 0;
  // Enforce all items of earlier groups appear before later groups
  const phases = [];
  if (groups.hot) phases.push(groups.hot);
  if (groups.dry) phases.push(groups.dry);
  if (groups.cold) phases.push(groups.cold);
  if (groups.wet) phases.push(groups.wet);
  if (groups.end) phases.push(groups.end);
  let total=0, ok=0;
  for (let i=0;i<phases.length;i++){
    for (let j=i+1;j<phases.length;j++){
      const A=phases[i], B=phases[j];
      A.forEach(a=>{ B.forEach(b=>{ total++; if(order.indexOf(a) < order.indexOf(b)) ok++; }); });
    }
  }
  return total? ok/total : 1;
}

export default function ChoreShuffleMiniGame({ open, onClose, onComplete, onSkip }) {
  const [ruleSet, setRuleSet] = React.useState(null);
  const [items, setItems] = React.useState([]);
  const [selected, setSelected] = React.useState(null); // for tap-to-swap
  const [startTs, setStartTs] = React.useState(null);
  const [remaining, setRemaining] = React.useState(15);
  
  // Detect touch/mobile for fallback mode
  const [useDnd, setUseDnd] = React.useState(true);
  
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const isTouchDevice = 'ontouchstart' in window || 
                           window.matchMedia?.('(pointer: coarse)').matches;
      setUseDnd(!isTouchDevice);
    }
  }, []);

  React.useEffect(() => {
    if (open) {
      const rs = RULE_SETS[Math.floor(Math.random()*RULE_SETS.length)];
      setRuleSet(rs);
      const shuffled = shuffle(rs.tasks);
      setItems(shuffled);
      setSelected(null);
      const now = Date.now();
      setStartTs(now);
      setRemaining(15);
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    if (remaining <= 0) { handleFinish(); return; }
    const t = setTimeout(()=> setRemaining(r=> r-1), 1000);
    return ()=> clearTimeout(t);
  }, [open, remaining]);

  if (!open || !ruleSet) return null;

  const handleSwap = (idx) => {
    if (selected === null) { setSelected(idx); return; }
    if (selected === idx) { setSelected(null); return; }
    const a = Math.min(selected, idx), b = Math.max(selected, idx);
    const next = [...items];
    [next[a], next[b]] = [next[b], next[a]];
    setItems(next);
    setSelected(null);
  };

  function scoreOrder(order) {
    const rs = ruleSet;
    let scores = [];
    if (rs.before) scores.push(pairwiseAccuracy(order, rs.before));
    if (rs.exact) scores.push(exactAccuracy(order, rs.exact));
    if (rs.groups) scores.push(groupsAccuracy(order, rs.groups));
    const accuracy = scores.length ? (scores.reduce((a,b)=>a+b,0)/scores.length) : 1;
    let rating = 'Chaotic';
    if (accuracy >= 0.8) rating = 'Organized';
    else if (accuracy >= 0.5) rating = 'Mostly Fine';
    const effects = rating === 'Organized' ? { discipline: 1, stress: -1 } : { discipline: 0, stress: 0 };
    return { accuracy, rating, effects };
  }

  function handleFinish() {
    const res = scoreOrder(items);
    onComplete?.(res);
  }

  // DnD Handlers
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const src = result.source.index;
    const dst = result.destination.index;
    const next = [...items];
    const [moved] = next.splice(src,1);
    next.splice(dst,0,moved);
    setItems(next);
  };

  const content = (
    <div className="fixed inset-0 z-[210010] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div initial={{opacity:0,scale:0.96}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.96}} className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
          <div className="flex items-center gap-2 text-slate-700 font-semibold"><Shuffle className="w-4 h-4"/> Chore Shuffle</div>
          <div className="flex items-center gap-3 text-sm text-slate-600"><Timer className="w-4 h-4"/>{remaining}s</div>
          <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center"><X className="w-4 h-4 text-slate-500"/></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="p-3 rounded-xl border-2 border-amber-200 bg-amber-50 text-sm text-amber-900">Rule: {ruleSet.rule}</div>

          {useDnd ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="chore-list">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                    {items.map((t, idx) => (
                      <Draggable draggableId={t} index={idx} key={t}>
                        {(prov, snapshot) => (
                          <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} className={`p-3 rounded-xl border-2 ${snapshot.isDragging? 'border-indigo-300 bg-indigo-50':'border-slate-200 bg-white'} text-slate-800 flex items-center gap-2 touch-none`}>
                            <span className="text-xs text-slate-500 w-5">{idx+1}.</span>
                            <span className="flex-1">{t}</span>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <div className="space-y-2">
              {items.map((t, idx) => (
                <button key={t} onClick={()=>handleSwap(idx)} className={`w-full text-left p-3 rounded-xl border-2 ${selected===idx? 'border-indigo-300 bg-indigo-50':'border-slate-200 bg-white'} text-slate-800 flex items-center gap-2`}>
                  <span className="text-xs text-slate-500 w-5">{idx+1}.</span>
                  <span className="flex-1">{t}</span>
                  {selected===idx && <span className="text-[11px] text-indigo-600">Selected</span>}
                </button>
              ))}
              <div className="text-[11px] text-slate-500">Tap one item, then another to swap.</div>
            </div>
          )}

          <div className="flex justify-between gap-2 pt-2">
            <button onClick={()=>{ onSkip?.(); onClose?.(); }} className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm">Skip</button>
            <button onClick={handleFinish} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm">Done</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
  
  return typeof document !== 'undefined' ? createPortal(content, document.body) : null;
}