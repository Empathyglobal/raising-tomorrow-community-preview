import React from 'react';

export const CAREER_EVENT_DECKS = {
  service: [
    { id:'srv_angry_customer', title:'Table 7 Meltdown', detail:"A furious customer unloads while you're texting the babysitter.", effects:{ career:{performance:2, careerRep:1}, stressDelta:0.5 } },
    { id:'srv_double_shift', title:'Double Shift SOS', detail:'Coworker calls out; you pick up hours during bedtime.', effects:{ career:{performance:3, burnout:4}, stressDelta:1 } },
    { id:'srv_manager_notice', title:'Manager Notices', detail:'You smoothed a rush without drama. Quiet nod from the boss.', effects:{ career:{careerRep:2, performance:2} } },
    { id:'srv_register_short', title:'Register Comes Up Short', detail:'You stay late to reconcile receipts; policy tweaks follow.', effects:{ career:{networking:1, careerRep:1}, stressDelta:0.3 } },
    { id:'srv_regulars_tip', title:'Regulars Tip Big', detail:'Kind words reach the district lead.', effects:{ career:{careerRep:2}, loveDelta:0.2 } },
    { id:'srv_schedule_shuffle', title:'Schedule Shuffle', detail:'Swaps to make pickup work; team appreciates flexibility.', effects:{ career:{networking:2}, loveDelta:0.2, stressDelta:0.2 } },
    { id:'srv_heatwave_rush', title:'Heatwave Rush', detail:'Nonstop orders—your system holds.', effects:{ career:{performance:3, burnout:3}, stressDelta:0.5 } },
    { id:'srv_training_helper', title:'New Hire Whisperer', detail:'You train a rookie and they actually stay.', effects:{ career:{careerRep:2, networking:2} } },
    { id:'srv_spill_save', title:'Spill and Save', detail:'You catch a slip, avoid an injury and comp.', effects:{ career:{performance:2}, publicRepDelta:1 } },
    { id:'srv_supply_fix', title:'Supply Fix', detail:'You find a backup vendor; manager remembers.', effects:{ career:{careerRep:2, networking:1} } },
    { id:'srv_customer_thanks', title:'Thank-You Note', detail:'A family writes in; small plaque by the counter.', effects:{ publicRepDelta:2, loveDelta:0.2 } },
    { id:'srv_close_cleanup', title:'Close-Out Cleanup', detail:'You stay late to reset; tomorrow runs smooth.', effects:{ career:{performance:2, burnout:2} } },
  ],
  corporate: [
    { id:'corp_scope_creep', title:'Scope Creep', detail:'Bedtime Slack. You push back kindly, then deliver.', effects:{ career:{performance:3, burnout:3, careerRep:1}, stressDelta:0.5 } },
    { id:'corp_ship', title:'Shipped On Time', detail:'Minimal surprises, maximum relief.', effects:{ career:{performance:4, careerRep:2} } },
    { id:'corp_allhands_shout', title:'All-Hands Shoutout', detail:'Your name on one slide. Kid sees and smiles.', effects:{ publicRepDelta:2, loveDelta:0.2 } },
    { id:'corp_doc_fix', title:'Documentation Hero', detail:'You untangle process spaghetti.', effects:{ career:{networking:2, careerRep:2} } },
    { id:'corp_bug_blast', title:'Bug Blast Night', detail:'You triage calmly and prevent pager snowball.', effects:{ career:{performance:3}, stressDelta:0.5, careerRep:1 } },
    { id:'corp_mentor', title:'Mentor Moments', detail:'You lift someone up; people notice.', effects:{ career:{networking:2, careerRep:2} } },
    { id:'corp_client_save', title:'Client Save', detail:'A blunt email becomes a renewal.', effects:{ career:{careerRep:3, networking:2} } },
    { id:'corp_debt_burn', title:'Tech Debt Burn', detail:'Invisible work, visible speed later.', effects:{ career:{performance:3} } },
    { id:'corp_hackday', title:'Hack Day Win', detail:'A small tool makes life better for everyone.', effects:{ career:{careerRep:2, networking:2} } },
    { id:'corp_eval_glow', title:'Glowing Review', detail:'Your manager notes composure under stress.', effects:{ career:{careerRep:3} } },
    { id:'corp_office_hours', title:'Office Hours', detail:'You host Q&A; relationships deepen.', effects:{ career:{networking:3} } },
    { id:'corp_boundary', title:'Boundary Held', detail:'You sign off at dinner; still ship tomorrow.', effects:{ loveDelta:0.3, stressDelta:-0.2 } },
  ],
  health: [
    { id:'hlth_double_oncall', title:'Double On-Call', detail:'Pagers at midnight, lunch at 4am.', effects:{ career:{burnout:6, careerRep:2}, stressDelta:1 } },
    { id:'hlth_family_update', title:'Family Update Wins Trust', detail:'You call promptly; relief on the other end.', effects:{ career:{careerRep:3}, publicRepDelta:2 } },
    { id:'hlth_team_cover', title:'Team Cover', detail:'You swap to help a colleague; the unit remembers.', effects:{ career:{networking:3, careerRep:1} } },
    { id:'hlth_chart_cleanup', title:'Chart Cleanup', detail:'You tame the backlog and everyone breaths easier.', effects:{ career:{performance:3} } },
    { id:'hlth_sim_drill', title:'Simulation Drill', detail:'You coordinate smoothly under pressure.', effects:{ career:{performance:3, careerRep:2} } },
    { id:'hlth_patient_thanks', title:'Patient Thanks', detail:'A note appears on the board.', effects:{ publicRepDelta:2, loveDelta:0.2 } },
    { id:'hlth_boundary', title:'Boundary Kept', detail:'You hand off cleanly and actually sleep.', effects:{ stressDelta:-0.5 } },
    { id:'hlth_peer_teach', title:'Peer Teaching', detail:'You teach a technique; minor local legend.', effects:{ career:{careerRep:2, networking:2} } },
    { id:'hlth_short_staffed', title:'Short-Staffed Shift', detail:'You hold the line. Barely.', effects:{ career:{performance:2, burnout:4} } },
    { id:'hlth_safety_report', title:'Safety Report Filed', detail:'System improves; quiet win.', effects:{ career:{careerRep:2} } },
    { id:'hlth_grief_room', title:'Grief Room', detail:'You sit with a family. Presence matters.', effects:{ loveDelta:0.3, stressDelta:0.5 } },
    { id:'hlth_process_fix', title:'Process Fix', detail:'You remove three clicks from every chart.', effects:{ career:{performance:2, networking:1} } },
  ],
  athletics: [
    { id:'ath_injury_scare', title:'Injury Scare', detail:'You tweak a knee; rest, rehab, recommit.', effects:{ career:{burnout:3}, stressDelta:0.5 } },
    { id:'ath_comeback', title:'Comeback Game', detail:'You light it up after a slump.', effects:{ career:{performance:6}, fameDelta:6 } },
    { id:'ath_endorse', title:'Endorsement Offer', detail:'Small brand calls; tastefully accepted.', effects:{ career:{careerRep:2, networking:2}, fameDelta:4 } },
    { id:'ath_trade_rumor', title:'Trade Rumors', detail:'Noise swirls; you focus on reps.', effects:{ stressDelta:0.5, fameDelta:2 } },
    { id:'ath_travel_grind', title:'Travel Grind', detail:'Red eyes, missed bedtime stories.', effects:{ career:{burnout:4}, stressDelta:0.7, loveDelta:-0.2 } },
    { id:'ath_locker_conflict', title:'Locker Room Conflict', detail:'You mediate; coach nods.', effects:{ career:{networking:3, careerRep:2} } },
    { id:'ath_win_streak', title:'Surprise Win Streak', detail:'Momentum builds; town buzzes.', effects:{ fameDelta:8, publicRepDelta:2 } },
    { id:'ath_public_crit', title:'Public Criticism', detail:'Talk radio roasts you; you respond with work.', effects:{ stressDelta:0.8, fameDelta:2 } },
  ],
  space: [
    {
      id: 'spc_sim_day_victory',
      title: '🚀 Sim Day Victory',
      detail: "The full-mission sim goes clean. People clap like it's casual (it isn't).",
      effects: { career: { performance: 3, careerRep: 2 }, stressDelta: 0.2 }
    },
    {
      id: 'spc_telemetry_ghost',
      title: '🛰️ Telemetry Ghost',
      detail: 'A sensor glitch sends you down a rabbit hole. It\'s "just noise" until it isn\'t.',
      effects: { career: { performance: -2, burnout: 4 }, stressDelta: 0.6 }
    },
    {
      id: 'spc_dust_in_lab',
      title: '🌕 Dust in the Lab',
      detail: 'Moon regolith gets everywhere — and your team still manages a breakthrough.',
      effects: { career: { performance: 2, careerRep: 3 }, stressDelta: 0.2 }
    },
    {
      id: 'spc_quietest_room',
      title: '📡 The Quietest Room',
      detail: 'A long SETI listen. The universe stays mostly silent. You learn patience anyway.',
      effects: { career: { careerRep: 1 }, stressDelta: 0.15 }
    },
    {
      id: 'spc_checklist_brain',
      title: '🧠 Checklist Brain',
      detail: "You start thinking in checklists. It's annoying. It's also how people survive.",
      effects: { career: { performance: 1, burnout: 1 }, stressDelta: 0.1 }
    },
    {
      id: 'spc_mentor_moment',
      title: '🧑‍🚀 Mentor Moment',
      detail: 'A veteran astronaut takes you seriously. That changes something.',
      effects: { career: { networking: 2, careerRep: 1 } }
    },
    {
      id: 'spc_unexpected_data',
      title: '🧪 Unexpected Data',
      detail: 'Microgravity changes the experiment outcome. Your notes become a draft.',
      effects: { career: { performance: 2, careerRep: 2 }, fameDelta: 4, stressDelta: 0.2 }
    },
    {
      id: 'spc_budget_hearing',
      title: '💸 Budget Hearing',
      detail: 'You defend the program to people who hate science and love microphones.',
      effects: { career: { careerRep: 1, burnout: 3 }, stressDelta: 0.8 }
    },
    {
      id: 'spc_launch_scrub',
      title: '🔥 Launch Scrub',
      detail: "Weather or valves or fate — the launch is scrubbed. Everyone pretends that's normal.",
      effects: { career: { performance: -1, burnout: 2 }, stressDelta: 0.6 }
    },
    {
      id: 'spc_commercial_buzz',
      title: '☄️ Commercial Buzz',
      detail: 'Asteroid mining stops sounding like a joke and starts sounding like a pitch deck.',
      effects: { career: { careerRep: 2, networking: 1 }, fameDelta: 3 }
    }
  ],
};

export const CAREER_GENERIC_EVENTS = [
  { id:'gen_carpool_saga', title:'Carpool Saga', detail:'Traffic, snacks, and a solid handoff before a presentation.', effects:{ career:{performance:1}, stressDelta:0.2 } },
  { id:'gen_child_sick_day', title:'Sick Day Juggle', detail:'You reschedule gracefully; team covers.', effects:{ career:{networking:1}, stressDelta:0.3, loveDelta:0.2 } },
  { id:'gen_neighbor_help', title:'Neighbor Save', detail:'They grab school pickup; you deliver at work.', effects:{ career:{performance:1}, loveDelta:0.2 } },
];