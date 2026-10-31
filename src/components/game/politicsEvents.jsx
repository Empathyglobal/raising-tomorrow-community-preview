export const OFFICE_EVENTS = [
  {
    id: 'school_funding',
    title: 'School Funding Fight',
    body: 'A budget shortfall hits the schools. Parents are furious, and the teachers are exhausted.',
    options: [
      { id: 'increase', label: 'Increase funding.', effects: { approvalDelta: +6, reputationDelta: +3, fameDelta: +2, stressDelta: +1 } },
      { id: 'hold_line', label: 'Hold the line on spending.', effects: { approvalDelta: -4, reputationDelta: -2, fameDelta: +1, stressDelta: +0.5 } },
      { id: 'delay', label: 'Delay and study the numbers.', effects: { approvalDelta: -1, reputationDelta: +1, fameDelta: +0, stressDelta: +0.5 } },
    ],
  },
  {
    id: 'viral_clip',
    title: 'Viral Clip at Town Hall',
    body: 'A short clip of you answering a question spreads fast — faster than context.',
    options: [
      { id: 'post_full', label: 'Post the full video.', effects: { approvalDelta: +2, reputationDelta: +2, fameDelta: +5, stressDelta: +0.5 } },
      { id: 'clap_back', label: 'Clap back publicly.', effects: { approvalDelta: +1, reputationDelta: -3, fameDelta: +6, stressDelta: +1 }, scandal: { templateId: 'edited_video', severity: 2 } },
      { id: 'say_nothing', label: 'Say nothing.', effects: { approvalDelta: -2, reputationDelta: -1, fameDelta: +2, stressDelta: +0.5 }, scandal: { templateId: 'edited_video', severity: 2 } },
    ],
  },
  {
    id: 'donor_offer',
    title: 'A Donor Offer',
    body: 'A donor offers a “big” contribution — and insists on a private meeting first.',
    options: [
      { id: 'refuse', label: 'Refuse.', effects: { approvalDelta: +2, reputationDelta: +4, fameDelta: +0, stressDelta: +0.5 } },
      { id: 'meet_openly', label: 'Meet openly with staff present.', effects: { approvalDelta: +1, reputationDelta: +1, fameDelta: +1, stressDelta: +1 } },
      { id: 'meet_quietly', label: 'Take the meeting quietly.', effects: { approvalDelta: +3, reputationDelta: -6, fameDelta: +2, stressDelta: +1 }, scandal: { templateId: 'mystery_meeting', severity: 3 } },
    ],
  },
  {
    id: 'family_headline',
    title: 'Family in the Headlines',
    body: 'A tabloid runs a story about your home life. It’s personal, and it’s messy.',
    options: [
      { id: 'protect', label: 'Protect your family and step back for a week.', effects: { approvalDelta: -1, reputationDelta: +3, fameDelta: +0, stressDelta: -0.5 } },
      { id: 'human_moment', label: 'Turn it into a human moment.', effects: { approvalDelta: +2, reputationDelta: +1, fameDelta: +4, stressDelta: +0.5 } },
      { id: 'legal', label: 'Threaten legal action.', effects: { approvalDelta: +0, reputationDelta: -2, fameDelta: +2, stressDelta: +1 } },
    ],
  },
  {
    id: 'out_of_touch_meme',
    title: 'Out of Touch Meme',
    body: 'A meme paints you as “out of touch,” and it’s landing harder than it should.',
    options: [
      { id: 'listening_tour', label: 'Do a listening tour.', effects: { approvalDelta: +3, reputationDelta: +2, fameDelta: +2, stressDelta: +1 } },
      { id: 'laugh_off', label: 'Laugh it off.', effects: { approvalDelta: +1, reputationDelta: +0, fameDelta: +3, stressDelta: +0.5 } },
      { id: 'disrespectful', label: 'Call it disrespectful.', effects: { approvalDelta: -2, reputationDelta: -3, fameDelta: +2, stressDelta: +1 } },
    ],
  },
  {
    id: 'policy_tradeoff',
    title: 'A Policy Tradeoff',
    body: 'Two good options. One budget. Everyone wants to be the priority.',
    options: [
      { id: 'most_people', label: 'Choose what helps the most people.', effects: { approvalDelta: +2, reputationDelta: +2, fameDelta: +1, stressDelta: +1 } },
      { id: 'supporters', label: 'Choose what helps your strongest supporters.', effects: { approvalDelta: +4, reputationDelta: -2, fameDelta: +2, stressDelta: +1 } },
      { id: 'split', label: 'Split the difference.', effects: { approvalDelta: +0, reputationDelta: +1, fameDelta: +0, stressDelta: +0.5 } },
    ],
  },
];

export function pickOfficeEvent(rng, officeId) {
  // In a real implementation, we might filter events by office type (local, state, etc.)
  // For now, any event can happen in any office.
  if (!Array.isArray(OFFICE_EVENTS) || OFFICE_EVENTS.length === 0) return null;
  const index = Math.floor(rng() * OFFICE_EVENTS.length);
  return OFFICE_EVENTS[index];
}