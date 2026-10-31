// Random yearly dating invite (single-only flavor event)
//
// Design goals:
// - Light, funny, and short.
// - Parenting-adjacent "meet-cutes" that fit Raising Tomorrow.
// - Safe for all ages (no explicit content).

export const DATE_INVITE_MEET_CUTES = [
  // --- Early years (0–4) ---
  {
    minAge: 0,
    maxAge: 4,
    where: "the pediatrician waiting room",
    approach:
      "They offer you a sticker (like it's adult currency) and whisper: 'I have duplicates. Wanna trade?'"
  },
  {
    minAge: 0,
    maxAge: 4,
    where: "the stroller lane at the park",
    approach:
      "They nod at your snack pouch like it's a tactical masterpiece and say: 'Respect. Coffee sometime?'"
  },
  {
    minAge: 0,
    maxAge: 4,
    where: "toddler music class",
    approach:
      "They clap for your child's off‑beat maraca solo and grin: 'Your household has rhythm. Mine has… vibes.'"
  },

  // --- School years (5–12) ---
  {
    minAge: 5,
    maxAge: 12,
    where: "school pickup",
    approach:
      "They accidentally grab the wrong backpack, then recover with: 'So… I'm clearly a planner. Want to get coffee?'"
  },
  {
    minAge: 5,
    maxAge: 12,
    where: "a PTA meeting",
    approach:
      "They slide you a pen like it's a secret mission and say: 'If we survive this, dinner?'"
  },
  {
    minAge: 5,
    maxAge: 12,
    where: "the library",
    approach:
      "They see you holding three books and one emotionally spiraling child and say: 'I'm into literature *and* bravery.'"
  },

  // --- Teen years (13–18) ---
  {
    minAge: 13,
    maxAge: 18,
    where: "a school event with folding chairs",
    approach:
      "They point to the chair wobble and say: 'If we make it through this, we deserve nachos.'"
  },
  {
    minAge: 13,
    maxAge: 18,
    where: "the DMV line",
    approach:
      "They glance at your paperwork stack and say: 'That's the most attractive organization I've seen all week.'"
  },
  {
    minAge: 13,
    maxAge: 18,
    where: "a coffee shop after a teen activity",
    approach:
      "They raise an eyebrow at your 'I'm fine' face and go: 'You look like you deserve a pastry. Want company?'"
  },

  // --- Any age (fallbacks) ---
  {
    where: "the grocery store checkout",
    approach:
      "They see your cart full of snacks and say: 'That is either a party or a coping strategy. I respect both.'"
  },
  {
    where: "a friend's chaotic birthday party",
    approach:
      "They hand you a juice box like it's a peace offering and say: 'Hi. You seem… competent. Can I buy you coffee?'"
  },
  {
    where: "the 'just one thing' aisle that lies",
    approach:
      "They gesture at the basket and say: 'We both came for one item and left with twelve. Destiny?'"
  }
];

export const DATE_INVITE_ACCEPT_OUTCOMES = [
  "You laugh more than you expected. It feels like your shoulders drop two inches.",
  "It's surprisingly normal — in a good way. Like your brain took a tiny vacation.",
  "The conversation is easy, and for once you're not planning three steps ahead.",
  "You go home slightly happier… and mildly confused by it.",
  "You both agree: parenting is wild. Also: fries are healing."
];

export const DATE_INVITE_REJECT_OUTCOMES = [
  "You politely decline. Later, you reward yourself with a silent snack eaten over the sink.",
  "You smile and say not right now. They take it well — and you feel oddly proud of your boundaries.",
  "You dodge with 'maybe another time' and immediately remember you own zero 'another times.'",
  "You pass. Your calendar is already booked with: laundry, feelings, and mysterious sticky spots.",
  "You decline. The universe nods solemnly and hands you a new group text you didn't ask for."
];