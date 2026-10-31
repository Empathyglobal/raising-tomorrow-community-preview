// Inheritance Chaos System (modular, optional, safe)
// Exports:
// - ensureFamilyTree(state)
// - maybeTriggerInheritanceEvent(state, updateState, currentAge, currentYear)
// - generateEstate(wealthTier, decedentType)
// - generateWillStatus(conflictLevel)
// - pickSiblingActors(siblings, conflictLevel)

// Utilities
function rng(seedStr) {
  let h = 2166136261;
  const s = String(seedStr || "seed");
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return () => {
    h += 0x6D2B79F5; let t = Math.imul(h ^ (h >>> 15), 1 | h); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
function pick(arr, r) { return arr[Math.floor(r() * arr.length)]; }

export function ensureFamilyTree(state, mutate = false) {
  const ft = state?.familyTree;
  if (ft && Array.isArray(ft.parents) && Array.isArray(ft.grandparents)) return ft;
  // Only create defaults if mutate=true; otherwise return a non-crashing default
  const defaults = {
    parents: [
      { id: 'p1', name: 'Parent A', alive: true, relationship: 50, wealthTier: 'middle' },
      { id: 'p2', name: 'Parent B', alive: true, relationship: 50, wealthTier: 'middle' }
    ],
    grandparents: [
      { id: 'g1', name: 'Grandparent A', alive: true, relationship: 50, wealthTier: 'middle' },
      { id: 'g2', name: 'Grandparent B', alive: true, relationship: 50, wealthTier: 'middle' }
    ]
  };
  if (mutate) {
    return defaults; // caller should put into state
  }
  return ft || defaults;
}

export function generateEstate(wealthTier = 'middle', decedentType = 'parent', r = Math.random) {
  const rt = typeof r === 'function' ? r : Math.random;
  const span = (min, max) => Math.round(min + (max - min) * rt());
  const estate = { cash: 0, debt: 0, heirloom: null, propertyShare: null };

  if (wealthTier === 'low') {
    estate.cash = span(0, 2000);
    estate.debt = span(0, 5000);
    estate.heirloom = { name: 'Old Photo Album', note: 'Memories inside', effect: null };
  } else if (wealthTier === 'middle') {
    estate.cash = span(1000, 20000);
    estate.debt = span(0, 20000);
    estate.heirloom = { name: 'Vintage Watch', note: 'Sentimental value', effect: null };
    if (rt() < 0.5) estate.propertyShare = { type: 'home', description: 'Primary residence share', estimatedValue: span(20000, 120000) };
  } else { // high
    estate.cash = span(10000, 200000);
    estate.debt = span(0, 80000);
    estate.heirloom = { name: 'Art Piece', note: 'Potentially valuable', effect: null };
    if (rt() < 0.8) estate.propertyShare = { type: 'home', description: 'Primary residence share', estimatedValue: span(80000, 400000) };
  }

  // Slightly different flavor for grandparents
  if (decedentType === 'grandparent' && estate.heirloom && estate.heirloom.name === 'Vintage Watch') {
    estate.heirloom.name = 'Antique Brooch';
  }
  return estate;
}

export function generateWillStatus(conflictLevel = 0.3, r = Math.random) {
  const rt = typeof r === 'function' ? r : Math.random;
  const roll = rt();
  if (roll < 0.55 - conflictLevel * 0.2) return 'clear';
  if (roll < 0.8 + conflictLevel * 0.1) return 'contested';
  return 'missing';
}

export function pickSiblingActors(siblings = [], conflictLevel = 0.3, r = Math.random) {
  if (!Array.isArray(siblings) || siblings.length === 0) return [];
  const rt = typeof r === 'function' ? r : Math.random;
  const maxActors = conflictLevel > 0.6 ? 2 : 1;
  const count = Math.min(maxActors, siblings.length);
  const shuffled = [...siblings].sort(() => rt() - 0.5);
  return shuffled.slice(0, count).map(s => s.id ?? s.name ?? String(s));
}

// ===== Twist Helpers & Registry =====
export function tierCash(wealthTier, lowRange = [200, 1200], midRange = [1500, 12000], highRange = [8000, 80000], r = Math.random) {
  const rt = typeof r === 'function' ? r : Math.random;
  const span = (min, max) => Math.round(min + (max - min) * rt());
  if (wealthTier === 'low') return span(lowRange[0], lowRange[1]);
  if (wealthTier === 'middle') return span(midRange[0], midRange[1]);
  return span(highRange[0], highRange[1]);
}
export function tierDebt(wealthTier, lowRange = [200, 2000], midRange = [1000, 15000], highRange = [5000, 60000], r = Math.random) {
  const rt = typeof r === 'function' ? r : Math.random;
  const span = (min, max) => Math.round(min + (max - min) * rt());
  if (wealthTier === 'low') return span(lowRange[0], lowRange[1]);
  if (wealthTier === 'middle') return span(midRange[0], midRange[1]);
  return span(highRange[0], highRange[1]);
}
function wpick(items, r = Math.random) {
  const rt = typeof r === 'function' ? r : Math.random;
  const total = items.reduce((s, it) => s + (it.weight || 1), 0);
  let x = rt() * total;
  for (const it of items) { x -= (it.weight || 1); if (x <= 0) return it.value; }
  return items[items.length - 1]?.value;
}
function hasSiblings(state) {
  return Array.isArray(state?.startingFamily?.siblings) && state.startingFamily.siblings.length > 0;
}
function wealthOfCase(c) {
  const cash = Number(c?.estate?.cash || 0);
  if (cash >= 40000) return 'high';
  if (cash >= 8000) return 'middle';
  return 'low';
}

// Build twist registry (T1..T14)
const TWISTS = [
  {
    id: 'T1_HIDDEN_SECOND_FAMILY',
    title: 'A Hidden Family',
    reveal: 'A lawyer reveals a long-term partner and child now have a legal claim.',
    eligibility: (state, c) => true,
    weight: (state, c) => hasSiblings(state) ? 1.3 : 1,
    applyImmediateEffects: (state, c) => ({
      conflictLevel: clamp((c.conflictLevel || 0) + 0.25, 0, 1),
      stressDelta: 0.15,
      mutateEstate: (e) => e
    }),
    optionalFollowUp: false,
    getChoices: (step, state, c) => [
      {
        label: 'Split it fairly',
        apply: ({ updateState, applyLove }) => {
          updateState(prev => ({
            inheritance: {
              ...(prev.inheritance||{cases:[]}),
              cases: prev.inheritance.cases.map(cc => cc.id===c.id? {...cc, estate: { ...cc.estate, cash: Math.round((cc.estate.cash||0)*0.85) }}: cc)
            }
          }));
          applyLove(0.10, 'Inheritance Twist');
        },
        resolveNow: true
      },
      {
        label: 'Fight the claim',
        apply: ({ updateState, applyMoneyDelta, applyStress }) => {
          const tier = wealthOfCase(c);
          const fee = tier === 'high' ? tierCash('high', [5000,25000],[5000,25000],[5000,25000]) : tier === 'middle' ? tierCash('middle',[1000,5000],[1000,5000],[1000,5000]) : tierCash('low',[200,800],[200,800],[200,800]);
          applyMoneyDelta(-fee, 'Twist Lawyer');
          applyStress(0.20, 'Inheritance Twist');
          const win = Math.random() < 0.55;
          updateState(prev => ({
            inheritance: {
              ...(prev.inheritance||{cases:[]}),
              cases: prev.inheritance.cases.map(cc => cc.id===c.id? {...cc, estate: { ...cc.estate, cash: Math.max(0, Math.round((cc.estate.cash||0) * (win?1.10:0.85))) }}: cc)
            }
          }));
        },
        resolveNow: true
      },
      {
        label: 'Meet them privately',
        apply: ({ updateState, applyStress, applyLove }) => {
          const good = Math.random() < 0.6;
          updateState(prev => ({
            inheritance: {
              ...(prev.inheritance||{cases:[]}),
              cases: prev.inheritance.cases.map(cc => cc.id===c.id? {...cc, conflictLevel: clamp((cc.conflictLevel||0) + (good?-0.15:+0.10), 0, 1)}: cc)
            }
          }));
          applyLove(0.10, 'Inheritance Twist');
        },
        resolveNow: false
      }
    ]
  },
  {
    id: 'T2_WILL_FOUND_LATE',
    title: 'The Will Was Found… Late',
    reveal: 'A sealed will appears after the first meeting, rewriting distribution.',
    eligibility: (state, c) => (c.willStatus !== 'clear') || (Math.random()<0.25),
    weight: (state,c)=> (c.willStatus!=='clear'?1.2:0.6),
    applyImmediateEffects: (state,c)=>({
      stressDelta: 0.10,
      mutateCase: (cc)=> ({
        ...cc,
        willStatus: Math.random()<0.5?'clear':'contested',
        estate: { ...cc.estate, cash: Math.max(0, (cc.estate.cash||0) + (Math.random()<0.5? -tierCash(wealthOfCase(cc), [50,200],[100,500],[300,1500]) : tierCash(wealthOfCase(cc), [50,200],[100,500],[300,1500]))) }
      })
    }),
    optionalFollowUp: true,
    getChoices: (step,state,c)=>[
      { label:'Honor it', apply:({applyLove})=>{applyLove(0.05,'Inheritance Twist');}, resolveNow: step>0 },
      { label:'Challenge it', apply:({applyMoneyDelta, applyStress, updateState})=>{ const tier=wealthOfCase(c); const cost=tier==='high'?12000:tier==='middle'?2500:500; applyMoneyDelta(-cost,'Twist Lawyer'); applyStress(0.15,'Inheritance Twist'); const up=Math.random()<0.5; updateState(prev=>({inheritance:{...(prev.inheritance||{cases:[]}), cases: prev.inheritance.cases.map(cc=>cc.id===c.id?{...cc, estate:{...cc.estate, cash: Math.max(0, Math.round((cc.estate.cash||0)*(up?1.1:0.9)))}}:cc)}}));}, resolveNow: step>0 },
      { label:'Let siblings decide', apply:({updateState})=>{ const drift=(Math.random()<0.5?-1:1)*tierCash(wealthOfCase(c),[50,250],[100,1200],[500,4000]); updateState(prev=>({inheritance:{...(prev.inheritance||{cases:[]}), cases: prev.inheritance.cases.map(cc=>cc.id===c.id?{...cc, estate:{...cc.estate, cash: Math.max(0, (cc.estate.cash||0)+drift)}}:cc)}})); }, resolveNow: false }
    ]
  },
  {
    id:'T3_CRYPTO_NOTEBOOK',
    title:'The Notebook',
    reveal:'A battered notebook may contain a crypto seed phrase. Treasure or trap?',
    eligibility:(s,c)=>true,
    weight:()=>1,
    applyImmediateEffects:(s,c)=>({ curiosityDelta: 0.1 }),
    optionalFollowUp:true,
    getChoices:(step,s,c)=>[
      { label:'Hire an expert', apply:({applyMoneyDelta, updateState})=>{ const fee= tierCash(wealthOfCase(c),[150,400],[400,1200],[1000,4000]); applyMoneyDelta(-fee,'Expert'); const win = Math.random()<0.75; if(win){ const gain = tierCash(wealthOfCase(c),[600,1500],[4000,18000],[12000,90000]); updateState(prev=>({inheritance:{...(prev.inheritance||{cases:[]}), cases: prev.inheritance.cases.map(cc=>cc.id===c.id?{...cc, estate:{...cc.estate, cash:(cc.estate.cash||0)+gain}}:cc)}})); } }, resolveNow: step>0 },
      { label:'Try it yourself', apply:({applyStress, updateState})=>{ applyStress(0.15,'Twist'); const ok=Math.random()<0.55; if(ok){ const gain=tierCash(wealthOfCase(c),[300,1200],[2000,12000],[8000,60000]); updateState(prev=>({inheritance:{...(prev.inheritance||{cases:[]}), cases: prev.inheritance.cases.map(cc=>cc.id===c.id?{...cc, estate:{...cc.estate, cash:(cc.estate.cash||0)+gain}}:cc)}})); } else { const addDebt=tierDebt(wealthOfCase(c),[100,600],[600,4000],[3000,20000]); updateState(prev=>({inheritance:{...(prev.inheritance||{cases:[]}), cases: prev.inheritance.cases.map(cc=>cc.id===c.id?{...cc, estate:{...cc.estate, debt:(cc.estate.debt||0)+addDebt}}:cc)}})); } }, resolveNow: false },
      { label:'Ignore it', apply:({applyStress})=>{ applyStress(-0.05,'Twist'); }, resolveNow: true }
    ]
  },
  {
    id:'T4_HIDDEN_LAND_TITLE',
    title:'A Quiet Piece of Land',
    reveal:'A land certificate surfaces. Might be valuable… or messy.',
    eligibility:(s,c)=> wealthOfCase(c)!=='low' || Math.random()<0.3,
    weight:(s,c)=> wealthOfCase(c)==='low'?0.5:1,
    applyImmediateEffects:(s,c)=>({ confidenceDelta:0.1, mutateCase:(cc)=>({...cc, estate: { ...cc.estate, propertyShare: cc.estate.propertyShare || { type:'land', description:'Rural lot', estimatedValue: tierCash(wealthOfCase(cc),[2000,8000],[10000,60000],[50000,250000]) }}}) }),
    optionalFollowUp:false,
    getChoices:(step,s,c)=>[
      { label:'Sell immediately', apply:({updateState})=>{ const base=tierCash(wealthOfCase(c),[2000,8000],[12000,60000],[50000,250000]); const penalty=Math.random()<0.3?0.9:1; const cash=Math.round(base*penalty); updateState(prev=>({inheritance:{...(prev.inheritance||{cases:[]}),cases: prev.inheritance.cases.map(cc=>cc.id===c.id?{...cc, estate:{...cc.estate, cash:(cc.estate.cash||0)+cash}}:cc)}})); }, resolveNow:true },
      { label:'Verify ownership', apply:({applyMoneyDelta, updateState})=>{ const cost=tierCash(wealthOfCase(c),[200,600],[800,2500],[3000,9000]); applyMoneyDelta(-cost,'Title'); const bump=tierCash(wealthOfCase(c),[500,2000],[3000,12000],[8000,30000]); updateState(prev=>({inheritance:{...(prev.inheritance||{cases:[]}),cases: prev.inheritance.cases.map(cc=>cc.id===c.id?{...cc, estate:{...cc.estate, cash:(cc.estate.cash||0)+bump}}:cc)}})); }, resolveNow:true },
      { label:'Keep it', apply:({applyStress})=>{ applyStress(0.05,'Twist'); }, resolveNow:false }
    ]
  },
  {
    id:'T5_PARENTAGE_PAPERS',
    title:'Old Papers',
    reveal:'Documents suggest a parentage detail that changes rights.',
    eligibility:(s,c)=>true,
    weight:(s,c)=> hasSiblings(s)?1.2:1,
    applyImmediateEffects:(s,c)=>({ stressDelta:0.15, conflictDelta:0.10 }),
    optionalFollowUp:true,
    getChoices:(step,s,c)=>[
      { label:'Talk to family calmly', apply:({applyLove, updateState})=>{ applyLove(0.15,'Twist'); updateState(prev=>({inheritance:{...(prev.inheritance||{cases:[]}), cases: prev.inheritance.cases.map(cc=>cc.id===c.id?{...cc, conflictLevel: clamp((cc.conflictLevel||0)-0.10,0,1)}:cc)}})); }, resolveNow: step>0 },
      { label:'Lawyer up', apply:({applyMoneyDelta, applyStress})=>{ const cost=tierCash(wealthOfCase(c),[400,1000],[1500,5000],[8000,20000]); applyMoneyDelta(-cost,'Lawyer'); applyStress(0.10,'Twist'); }, resolveNow:false },
      { label:'Do nothing', apply:({applyStress, updateState})=>{ applyStress(0.05,'Twist'); if(Math.random()<0.5){ updateState(prev=>({inheritance:{...(prev.inheritance||{cases:[]}), cases: prev.inheritance.cases.map(cc=>cc.id===c.id?{...cc, estate:{...cc.estate, cash: Math.max(0, Math.round((cc.estate.cash||0)*0.9))}}:cc)}})); } }, resolveNow:false }
    ]
  },
  {
    id:'T6_CHARITY_PLEDGE',
    title:'The Promise',
    reveal:'A large charitable pledge may be binding.',
    eligibility:(s,c)=> wealthOfCase(c)!=='low',
    weight:(s,c)=> wealthOfCase(c)==='high'?1.3:1,
    applyImmediateEffects:(s,c)=>({ mutateCase:(cc)=> ({...cc, estate:{...cc.estate, cash: Math.max(0, Math.round((cc.estate.cash||0) * (0.70 + Math.random()*0.20)))}}) }),
    optionalFollowUp:false,
    getChoices:(step,s,c)=>[
      { label:'Honor the pledge', apply:({applyLove})=>{ applyLove(0.10,'Twist'); }, resolveNow:true },
      { label:'Negotiate smaller', apply:({applyStress, updateState})=>{ applyStress(0.05,'Twist'); const recover=tierCash(wealthOfCase(c),[100,500],[800,4000],[5000,20000]); updateState(prev=>({inheritance:{...(prev.inheritance||{cases:[]}), cases: prev.inheritance.cases.map(cc=>cc.id===c.id?{...cc, estate:{...cc.estate, cash:(cc.estate.cash||0)+recover}}:cc)}})); }, resolveNow:true },
      { label:'Refuse', apply:({applyLove, updateState})=>{ applyLove(-0.10,'Twist'); if(hasSiblings(s)){ /* implicit rel down */ } }, resolveNow:true }
    ]
  },
  {
    id:'T7_HEIRLOOM_TURNS_VALUABLE',
    title:'The “Junk” Heirloom',
    reveal:'The ignored item might be valuable. A cousin wants it.',
    eligibility:(s,c)=> true,
    weight:()=>1,
    applyImmediateEffects:(s,c)=>({ curiosityDelta:0.05, mutateCase:(cc)=> ({...cc, estate:{...cc.estate, heirloom: cc.estate.heirloom || { name:'Old Painting', note:'Dusty but intriguing', effect:null }}}) }),
    optionalFollowUp:true,
    getChoices:(step,s,c)=>[
      { label:'Get it appraised', apply:({applyMoneyDelta, updateState})=>{ const fee=tierCash(wealthOfCase(c),[80,200],[200,800],[800,3000]); applyMoneyDelta(-fee,'Appraisal'); const high=Math.random()<0.6; const gain= high? tierCash(wealthOfCase(c),[500,2000],[4000,20000],[15000,90000]) : tierCash(wealthOfCase(c),[200,600],[800,4000],[3000,12000]); updateState(prev=>({inheritance:{...(prev.inheritance||{cases:[]}), cases: prev.inheritance.cases.map(cc=>cc.id===c.id?{...cc, estate:{...cc.estate, cash:(cc.estate.cash||0)+gain}}:cc)}})); }, resolveNow:true },
      { label:'Give it away', apply:({applyLove})=>{ applyLove(0.10,'Twist'); }, resolveNow:true },
      { label:'Keep it quietly', apply:({updateState})=>{ updateState(prev=>prev); }, resolveNow:false }
    ]
  },
  {
    id:'T8_IDENTITY_FREEZE',
    title:'Wrong Name, Right Disaster',
    reveal:'Paperwork lists a similar name. Everything freezes.',
    eligibility:(s,c)=>true,
    weight:()=>1,
    applyImmediateEffects:(s,c)=>({ stressDelta:0.10, delay:true }),
    optionalFollowUp:true,
    getChoices:(step,s,c)=>[
      { label:'Provide documents', apply:({applyMoneyDelta})=>{ const cost= tierCash(wealthOfCase(c),[50,150],[150,600],[600,2500]); applyMoneyDelta(-cost,'Docs'); }, resolveNow: step>0 },
      { label:'Hire lawyer', apply:({applyMoneyDelta})=>{ const cost= tierCash(wealthOfCase(c),[300,800],[1000,4000],[5000,20000]); applyMoneyDelta(-cost,'Lawyer'); }, resolveNow: true },
      { label:'Wait it out', apply:({applyStress, updateState})=>{ applyStress(0.05,'Twist'); const drift = (Math.random()<0.5? -1:1)* tierCash(wealthOfCase(c),[50,200],[100,800],[500,4000]); updateState(prev=>({inheritance:{...(prev.inheritance||{cases:[]}),cases: prev.inheritance.cases.map(cc=>cc.id===c.id?{...cc, estate:{...cc.estate, cash: Math.max(0,(cc.estate.cash||0)+drift)}}:cc)}})); }, resolveNow:false }
    ]
  },
  {
    id:'T9_LIFE_INSURANCE_SHOCK',
    title:'The Beneficiary',
    reveal:'A life insurance payout exists… but beneficiary changed.',
    eligibility:(s,c)=> c.decedentType==='parent',
    weight:()=>1,
    applyImmediateEffects:(s,c)=>({ potentialCash:true }),
    optionalFollowUp:false,
    getChoices:(step,s,c)=>[
      { label:'Accept the change', apply:({applyLove})=>{ applyLove(0.05,'Twist'); }, resolveNow:true },
      { label:'Challenge it', apply:({applyMoneyDelta, applyStress, updateState})=>{ const fee= tierCash(wealthOfCase(c),[300,900],[1200,5000],[6000,25000]); applyMoneyDelta(-fee,'Lawyer'); applyStress(0.15,'Twist'); const win=Math.random()<0.4; if(win){ const gain = tierCash(wealthOfCase(c),[500,3000],[5000,30000],[25000,250000]); updateState(prev=>({inheritance:{...(prev.inheritance||{cases:[]}),cases: prev.inheritance.cases.map(cc=>cc.id===c.id?{...cc, estate:{...cc.estate, cash:(cc.estate.cash||0)+gain}}:cc)}})); } }, resolveNow:true },
      { label:'Ask siblings what they know', apply:({updateState})=>{ if(hasSiblings(s)){ const good=Math.random()<0.5; updateState(prev=>({inheritance:{...(prev.inheritance||{cases:[]}),cases: prev.inheritance.cases.map(cc=>cc.id===c.id?{...cc, conflictLevel: clamp((cc.conflictLevel||0)+(good?-0.1:0.1),0,1)}:cc)}})); } }, resolveNow:false }
    ]
  },
  {
    id:'T10_TAX_LIEN_SURPRISE',
    title:'The Tax Lien',
    reveal:'A tax lien surfaces. The estate owes more.',
    eligibility:(s,c)=>true,
    weight:(s,c)=> wealthOfCase(c)==='low'?1.2:1,
    applyImmediateEffects:(s,c)=>({ stressDelta:0.15, mutateCase:(cc)=>({...cc, estate:{...cc.estate, debt:(cc.estate.debt||0)+ tierDebt(wealthOfCase(cc),[200,2000],[1000,8000],[4000,30000])}}) }),
    optionalFollowUp:true,
    getChoices:(step,s,c)=>[
      { label:'Pay it and close', apply:({applyMoneyDelta, applyStress, updateState})=>{ const amt=(c.estate.debt||0); applyMoneyDelta(-amt,'Tax'); applyStress(-0.05,'Twist'); updateState(prev=>({inheritance:{...(prev.inheritance||{cases:[]}), cases: prev.inheritance.cases.map(cc=>cc.id===c.id?{...cc, estate:{...cc.estate, debt:0}}:cc)}})); }, resolveNow:true },
      { label:'Negotiate payment plan', apply:({applyStress, updateState})=>{ applyStress(0.05,'Twist'); const now = Math.round((c.estate.debt||0)*0.4); updateState(prev=>({inheritance:{...(prev.inheritance||{cases:[]} ), cases: prev.inheritance.cases.map(cc=>cc.id===c.id?{...cc, estate:{...cc.estate, debt: Math.max(0, (cc.estate.debt||0)-now)}}:cc)}})); }, resolveNow:false },
      { label:'Let siblings handle it', apply:({updateState})=>{ if(hasSiblings(s)){ const good=Math.random()<0.5; if(good){ updateState(prev=>({inheritance:{...(prev.inheritance||{cases:[]}), cases: prev.inheritance.cases.map(cc=>cc.id===c.id?{...cc, estate:{...cc.estate, debt: Math.max(0, Math.round((cc.estate.debt||0)*0.7))}}:cc)}})); } else { updateState(prev=>({inheritance:{...(prev.inheritance||{cases:[]}), cases: prev.inheritance.cases.map(cc=>cc.id===c.id?{...cc, conflictLevel: clamp((cc.conflictLevel||0)+0.15,0,1)}:cc)}})); } } }, resolveNow:false }
    ]
  },
  {
    id:'T11_SAFE_DEPOSIT_BOX',
    title:'The Box',
    reveal:'A storage key is found. Contents unknown.',
    eligibility:(s,c)=>true,
    weight:()=>1,
    applyImmediateEffects:(s,c)=>({ curiosityDelta:0.10 }),
    optionalFollowUp:true,
    getChoices:(step,s,c)=>[
      { label:'Open it properly', apply:({applyMoneyDelta, updateState})=>{ const fee=tierCash(wealthOfCase(c),[60,180],[180,600],[500,2500]); applyMoneyDelta(-fee,'Open Box'); const win=Math.random()<0.7; if(win){ const gain=tierCash(wealthOfCase(c),[200,1200],[1500,12000],[8000,60000]); updateState(prev=>({inheritance:{...(prev.inheritance||{cases:[]}),cases: prev.inheritance.cases.map(cc=>cc.id===c.id?{...cc, estate:{...cc.estate, cash:(cc.estate.cash||0)+gain}}:cc)}})); } }, resolveNow: step>0 },
      { label:'Split with siblings', apply:({updateState})=>{ if(hasSiblings(s)){ const gain=tierCash(wealthOfCase(c),[150,600],[800,6000],[4000,20000]); updateState(prev=>({inheritance:{...(prev.inheritance||{cases:[]}),cases: prev.inheritance.cases.map(cc=>cc.id===c.id?{...cc, estate:{...cc.estate, cash:(cc.estate.cash||0)+Math.round(gain*0.6)}}:cc)}})); } }, resolveNow:true },
      { label:'Leave it alone', apply:({})=>{}, resolveNow:true }
    ]
  },
  {
    id:'T12_EXECUTOR_SKIMMING',
    title:'The Executor Problem',
    reveal:'The executor is misplacing items and delaying paperwork.',
    eligibility:(s,c)=> (c.conflictLevel||0)>=0.35 || Math.random()<0.3,
    weight:()=>1,
    applyImmediateEffects:(s,c)=>({ stressDelta:0.10, mutateCase:(cc)=> ({...cc, estate:{...cc.estate, cash: Math.max(0, (cc.estate.cash||0)- tierCash(wealthOfCase(cc),[50,250],[200,1200],[800,6000]))}}) }),
    optionalFollowUp:false,
    getChoices:(step,s,c)=>[
      { label:'Confront politely', apply:({applyLove, updateState, applyStress})=>{ const ok=Math.random()<0.6; if(ok){ applyLove(0.05,'Twist'); } else { applyStress(0.05,'Twist'); updateState(prev=>({inheritance:{...(prev.inheritance||{cases:[]}), cases: prev.inheritance.cases.map(cc=>cc.id===c.id?{...cc, step: Math.min((cc.step||0)+1,2)}:cc)}})); } }, resolveNow:true },
      { label:'Report formally', apply:({applyMoneyDelta})=>{ const cost=tierCash(wealthOfCase(c),[200,600],[1200,4000],[6000,20000]); applyMoneyDelta(-cost,'Report'); }, resolveNow:true },
      { label:'Do nothing', apply:({updateState})=>{ updateState(prev=>({inheritance:{...(prev.inheritance||{cases:[]}),cases: prev.inheritance.cases.map(cc=>cc.id===c.id?{...cc, estate:{...cc.estate, cash: Math.max(0, Math.round((cc.estate.cash||0)*0.95))}}:cc)}})); }, resolveNow:false }
    ]
  },
  {
    id:'T13_PROPERTY_ALREADY_SOLD',
    title:'It Was Already Sold',
    reveal:'A sibling claims the property share was sold before probate.',
    eligibility:(s,c)=> hasSiblings(s) && Boolean(c?.estate?.propertyShare),
    weight:()=>1.2,
    applyImmediateEffects:(s,c)=>({ conflictDelta:0.20 }),
    optionalFollowUp:false,
    getChoices:(step,s,c)=>[
      { label:'Let it go', apply:({applyStress})=>{ applyStress(-0.05,'Twist'); }, resolveNow:true },
      { label:'Demand receipts', apply:({applyStress, updateState})=>{ applyStress(0.15,'Twist'); const good=Math.random()<0.5; updateState(prev=>({inheritance:{...(prev.inheritance||{cases:[]}),cases: prev.inheritance.cases.map(cc=>cc.id===c.id?{...cc, estate:{...cc.estate, cash: Math.max(0,(cc.estate.cash||0) + (good? Math.round((cc.estate.propertyShare?.estimatedValue||0)*0.15) : -Math.round((cc.estate.cash||0)*0.1)))}}:cc)}})); }, resolveNow:true },
      { label:'Lawyer', apply:({applyMoneyDelta, updateState})=>{ const cost=tierCash(wealthOfCase(c),[400,1000],[2000,7000],[9000,25000]); applyMoneyDelta(-cost,'Lawyer'); const rec=Math.round((c.estate.propertyShare?.estimatedValue||0) * 0.3); updateState(prev=>({inheritance:{...(prev.inheritance||{cases:[]}),cases: prev.inheritance.cases.map(cc=>cc.id===c.id?{...cc, estate:{...cc.estate, cash:(cc.estate.cash||0)+rec}}:cc)}})); }, resolveNow:true }
    ]
  },
  {
    id:'T14_TRUST_WITH_CONDITIONS',
    title:'The Trust Conditions',
    reveal:'A portion is locked in a trust with conditions.',
    eligibility:(s,c)=> wealthOfCase(c)!=='low',
    weight:(s,c)=> wealthOfCase(c)==='high'?1.2:1,
    applyImmediateEffects:(s,c)=>({ mutateCase:(cc)=> ({...cc, lockedFunds: tierCash(wealthOfCase(cc),[500,2000],[5000,20000],[20000,120000])}) }),
    optionalFollowUp:true,
    getChoices:(step,s,c)=>[
      { label:'Accept the conditions', apply:({updateState, applyLove})=>{ applyLove(0.10,'Twist'); updateState(prev=>prev); }, resolveNow:false },
      { label:'Challenge it', apply:({applyMoneyDelta, updateState})=>{ const cost=tierCash(wealthOfCase(c),[300,800],[1200,5000],[6000,20000]); applyMoneyDelta(-cost,'Challenge'); const win=Math.random()<0.35; if(win){ updateState(prev=>({inheritance:{...(prev.inheritance||{cases:[]}),cases: prev.inheritance.cases.map(cc=>cc.id===c.id?{...cc, estate:{...cc.estate, cash:(cc.estate.cash||0)+ Math.round((cc.lockedFunds||0)*0.5)}, lockedFunds: Math.round((cc.lockedFunds||0)*0.5)}:cc)}})); } }, resolveNow:false },
      { label:'Walk away', apply:({applyLove, applyStress})=>{ applyLove(0.05,'Twist'); applyStress(-0.05,'Twist'); }, resolveNow:true }
    ]
  }
];

export function getTwistById(id){ return TWISTS.find(t=>t.id===id) || null; }

function eligibleTwists(state, c) {
  const wealth = wealthOfCase(c);
  const base = TWISTS.map(t => ({ t, allowed: t.eligibility(state, c), w: typeof t.weight==='function'? t.weight(state,c): (t.weight||1) }));
  const filtered = base.filter(x => x.allowed && x.w > 0).map(x => ({ value: x.t, weight: x.w }));
  return filtered;
}

function computeTwistChance(c, twistState, r = Math.random) {
  const rt = typeof r === 'function' ? r : Math.random;
  const base = 0.12;
  const bonus = (c.conflictLevel || 0) * 0.10;
  const pity = clamp((twistState?.pityBonus || 0), 0, 0.25);
  return Math.min(0.45, base + bonus + pity);
}

function withDefaultTwistState(obj){
  const base = { used:false, usedTwistId:null, yearUsed:null, pityBonus:0 };
  return { ...base, ...(obj||{}) };
}

function tryRollTwistOnCase(prev, c, mode, currentYear, r = Math.random){
  const twistState = withDefaultTwistState(prev.inheritanceTwist);
  if (twistState.used) return { nextPrev: prev, nextCase: c, triggered:false };
  if (c.twist || c.twistRolled) return { nextPrev: prev, nextCase: c, triggered:false };
  if (!(mode==='creation' || (mode==='followup' && ((c.step||0)===0)))) return { nextPrev: prev, nextCase: c, triggered:false };

  const chance = computeTwistChance(c, twistState, r);
  const hit = (typeof r==='function'?r():Math.random()) < chance;
  if (!hit) {
    const next = { ...prev, inheritanceTwist: { ...twistState, pityBonus: Math.min(0.25, (twistState.pityBonus||0)+0.08) } };
    return { nextPrev: next, nextCase: c, triggered:false };
  }
  const pool = eligibleTwists(prev, c);
  if (!pool || pool.length===0) {
    const next = { ...prev, inheritanceTwist: { ...twistState, pityBonus: Math.min(0.25, (twistState.pityBonus||0)+0.08) } };
    return { nextPrev: next, nextCase: c, triggered:false };
  }
  const picked = wpick(pool, r);

  // Apply immediate effects into case and prev
  let cc = { ...c, twistRolled: true, twist: { id:picked.id, title:picked.title, reveal:picked.reveal, step:0, history:[], effectsApplied:true, optionalFollowUp: !!picked.optionalFollowUp } };
  let nextPrev = { ...prev, inheritanceTwist: { used:true, usedTwistId: picked.id, yearUsed: currentYear, pityBonus: 0 } };

  // Mutations defined by twist
  const eff = picked.applyImmediateEffects?.(prev, cc) || {};
  if (typeof eff.conflictDelta === 'number') cc.conflictLevel = clamp((cc.conflictLevel||0) + eff.conflictDelta, 0, 1);
  if (typeof eff.conflictLevel === 'number') cc.conflictLevel = eff.conflictLevel;
  if (eff.delay) cc.step = Math.min((cc.step||0)+1, 2);
  if (eff.mutateEstate) cc.estate = eff.mutateEstate(cc.estate);
  if (eff.mutateCase) cc = eff.mutateCase(cc);
  if (typeof eff.stressDelta === 'number') nextPrev = { ...nextPrev, stress: (Number(prev.stress||0) + eff.stressDelta) };
  if (typeof eff.curiosityDelta === 'number') nextPrev = { ...nextPrev, stats: { ...(prev.stats||{}), curiosity: Number(prev.stats?.curiosity||0) + eff.curiosityDelta } };
  if (typeof eff.confidenceDelta === 'number') nextPrev = { ...nextPrev, stats: { ...(prev.stats||{}), confidence: Number(prev.stats?.confidence||0) + eff.confidenceDelta } };

  return { nextPrev, nextCase: cc, triggered:true };
}

export function buildTwistChoices(twistId, step, ctx){
  const t = getTwistById(twistId);
  if (!t) return [];
  const arr = t.getChoices?.(step, ctx.gameState, ctx.activeCase) || [];
  // Bind apply into buttons that also record twist history and step handling
  return arr.map(choice => ({
    label: choice.label,
    onClick: () => {
      // Log into history
      ctx.updateState(prev => ({
        inheritance: {
          ...(prev.inheritance||{cases:[]}),
          cases: (prev.inheritance?.cases||[]).map(c => c.id===ctx.activeCase.id ? {
            ...c,
            playerChoiceHistory: [ ...(c.playerChoiceHistory||[]), `${prev.currentYear}: [TWIST] ${choice.label}` ],
            twist: c.twist ? { ...c.twist, history: [ ...(c.twist.history||[]), `${prev.currentYear}: ${choice.label}` ] } : c.twist
          } : c)
        }
      }));

      // Apply effects
      choice.apply?.(ctx);

      // Resolve or keep open
      if (choice.resolveNow) {
        const net = Math.round((ctx.activeCase.estate.cash||0) - (ctx.activeCase.estate.debt||0));
        ctx.resolveCase(net);
      } else {
        // only allow one extra twist follow-up; afterwards resolve via normal flow
        const allowFollow = !!(ctx.activeCase.twist?.optionalFollowUp) && (ctx.activeCase.twist?.step||0) < 1;
        if (allowFollow) {
          ctx.updateState(prev => ({
            inheritance: {
              ...(prev.inheritance||{cases:[]}),
              cases: (prev.inheritance?.cases||[]).map(c => c.id===ctx.activeCase.id ? {
                ...c,
                step: Math.min((c.step||0)+1, 2),
                twist: c.twist ? { ...c.twist, step: (c.twist.step||0)+1 } : c.twist,
                lastShownYear: prev.currentYear
              } : c)
            },
            inheritancePopupPending: null
          }));
          ctx.onClose();
        } else {
          const net = Math.round((ctx.activeCase.estate.cash||0) - (ctx.activeCase.estate.debt||0));
          ctx.resolveCase(net);
        }
      }
    }
  }));
}

function baseConflictFromSiblings(siblings) {
  if (!Array.isArray(siblings)) return 0.2;
  const n = siblings.length;
  if (n <= 0) return 0.2;
  if (n === 1) return 0.3;
  if (n === 2) return 0.35;
  if (n >= 3) return 0.4;
  return 0.3;
}

function ageProbability(age) {
  if (age < 18) return 0;
  if (age <= 25) return 0.02;
  if (age <= 35) return 0.04;
  if (age <= 50) return 0.06;
  return 0.08;
}

export function maybeTriggerInheritanceEvent(state, updateState, currentAge, currentYear) {
  try {
    if (!updateState || typeof updateState !== 'function') return false;
    if (Number(currentAge || 0) < 18) return false;

    const runSeed = state?.runSeed || 'seed';
    const r = rng(`${runSeed}|inheritance|age:${currentAge}|year:${currentYear}`);

    // Ensure container structures exist (optional fields)
    const family = ensureFamilyTree(state) || {};
    const siblings = state?.startingFamily?.siblings || [];

    const inheritance = state?.inheritance || { cases: [] };

    // Prevent multiple openings within the same year
    if (inheritance?.cases?.some(c => c.status === 'open' && c.lastShownYear === currentYear)) {
      return false;
    }

    // If there is an open case, schedule follow-up (max 2 follow-ups, total 3 popups)
    const openCase = (inheritance?.cases || []).find(c => c.status === 'open');
    if (openCase) {
      // Show at most once per year
      if (openCase.lastShownYear !== currentYear && (openCase.step ?? 0) < 2) {
        updateState(prev => {
          // Try twist roll on first follow-up only
          const oc = (prev.inheritance?.cases||[]).find(c=>c.id===openCase.id) || openCase;
          const { nextPrev, nextCase } = tryRollTwistOnCase(prev, oc, 'followup', currentYear, r);
          return {
            ...nextPrev,
            inheritance: {
              ...(nextPrev.inheritance || { cases: [] }),
              cases: (nextPrev.inheritance?.cases || []).map(c => c.id === oc.id ? { ...nextCase, lastShownYear: currentYear } : c)
            },
            inheritancePopupPending: { caseId: oc.id, mode: 'followup' }
          };
        });
        return true;
      }
      return false;
    }

    // No open case -> probabilistic trigger
    const p = ageProbability(Number(currentAge || 0));
    if (r() >= p) return false;

    // Decide decedent
    const aliveParents = (family.parents || []).filter(p => p.alive !== false);
    const aliveGrands = (family.grandparents || []).filter(g => g.alive !== false);
    let decedentType = 'parent';
    if (aliveParents.length === 0 && aliveGrands.length > 0) decedentType = 'grandparent';
    else if (aliveParents.length > 0 && aliveGrands.length > 0) {
      decedentType = r() < 0.7 ? 'parent' : 'grandparent';
    } else if (aliveParents.length === 0 && aliveGrands.length === 0) {
      // No one to pass -> do not trigger
      return false;
    }

    const pool = decedentType === 'parent' ? aliveParents : aliveGrands;
    const picked = pool.length ? pick(pool, r) : null;
    const decedentName = picked?.name || (decedentType === 'parent' ? 'A Parent' : 'A Grandparent');
    const wealthTier = picked?.wealthTier || 'middle';

    // Helper to mark the decedent as deceased on whichever family tree is present
    const markDead = (src) => {
      const base = ensureFamilyTree({ familyTree: src }) || { parents: [], grandparents: [] };
      const byIdOrName = (x) => (picked?.id && x.id === picked.id) || (!picked?.id && picked?.name && x.name === picked.name);
      return {
        parents: (base.parents || []).map(p => (decedentType === 'parent' && byIdOrName(p)) ? { ...p, alive: false } : p),
        grandparents: (base.grandparents || []).map(g => (decedentType === 'grandparent' && byIdOrName(g)) ? { ...g, alive: false } : g)
      };
    };

    // Build case
    const conflictBase = baseConflictFromSiblings(siblings);
    const conflictLevel = clamp(conflictBase + (r() * 0.3 - 0.15), 0, 1);
    const estate = generateEstate(wealthTier, decedentType, r);
    const willStatus = generateWillStatus(conflictLevel, r);
    const actorIds = pickSiblingActors(siblings, conflictLevel, r);

    const id = `ic_${String(currentYear)}_${Math.floor(r() * 1e6)}`;
    const baseCase = {
      id,
      decedentType,
      decedentName,
      yearOpened: currentYear,
      status: 'open',
      willStatus,
      estate,
      conflictLevel,
      siblingActors: actorIds,
      playerChoiceHistory: [],
      step: 0,
      lastShownYear: currentYear
    };

    updateState(prev => {
      const fam = prev.familyTree ? markDead(prev.familyTree) : markDead(family);
      const { nextPrev, nextCase } = tryRollTwistOnCase(prev, baseCase, 'creation', currentYear, r);
      return {
        ...nextPrev,
        familyTree: fam,
        inheritance: {
          ...(nextPrev.inheritance || { cases: [] }),
          cases: [ ...(nextPrev.inheritance?.cases || []), nextCase ]
        },
        inheritancePopupPending: { caseId: id, mode: 'new' }
      };
    });

    return true;
  } catch (e) {
    // Fail safe – never block year
    return false;
  }
}