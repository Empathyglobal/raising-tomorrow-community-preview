import { toast } from "sonner";

export const ADULT_CRIMES = [
  // Petty
  { id: "return_scam", category: "Petty", title: "Dubious Refund", blurb: "You try a questionable store refund with the confidence of someone holding a receipt that’s… emotionally true.", emoji: "🧾", severity: 1, baseSuccess: 0.72, baseCaught: 0.18, payoutMin: 30, payoutMax: 120, heatGain: 2, evidenceTagsPool: ["cctv","witness","paperTrail"], text: mkText() },
  { id: "coupon_drama", category: "Petty", title: "Coupon Chaos", blurb: "You stack discounts until the register starts questioning reality.", emoji: "🏷️", severity: 1, baseSuccess: 0.68, baseCaught: 0.16, payoutMin: 20, payoutMax: 90, heatGain: 2, evidenceTagsPool: ["witness","paperTrail"], text: mkText() },
  { id: "office_supplies", category: "Petty", title: "Office Supply Siphon", blurb: "You ‘accidentally’ bring home office supplies that were clearly never invited.", emoji: "✏️", severity: 1, baseSuccess: 0.75, baseCaught: 0.12, payoutMin: 15, payoutMax: 70, heatGain: 1, evidenceTagsPool: ["witness"], text: mkText() },
  { id: "gift_card_glitch", category: "Petty", title: "Gift Card Glitch", blurb: "You lean on a gift card loophole that feels legal-ish in a very temporary way.", emoji: "🎫", severity: 2, baseSuccess: 0.6, baseCaught: 0.22, payoutMin: 50, payoutMax: 200, heatGain: 3, evidenceTagsPool: ["digitalTrail","paperTrail"], text: mkText() },

  // Work
  { id: "expense_padding", category: "Work", title: "Expense Padding", blurb: "You pad an expense report like it’s a pillow and hope nobody reads the footnotes.", emoji: "🧮", severity: 2, baseSuccess: 0.62, baseCaught: 0.25, payoutMin: 120, payoutMax: 600, heatGain: 4, evidenceTagsPool: ["paperTrail","witness"], text: mkText() },
  { id: "timecard_fiction", category: "Work", title: "Timecard Fiction", blurb: "You submit a timecard that’s more aspirational than chronological.", emoji: "⏱️", severity: 2, baseSuccess: 0.65, baseCaught: 0.24, payoutMin: 80, payoutMax: 400, heatGain: 4, evidenceTagsPool: ["digitalTrail","paperTrail"], text: mkText() },
  { id: "side_deal_samples", category: "Work", title: "Samples on the Side", blurb: "You let work ‘samples’ become a side hustle, wrapped in plausible deniability.", emoji: "📦", severity: 3, baseSuccess: 0.55, baseCaught: 0.3, payoutMin: 150, payoutMax: 900, heatGain: 5, evidenceTagsPool: ["cctv","witness","paperTrail"], text: mkText() },
  { id: "perk_abuse", category: "Work", title: "Perk Abuse", blurb: "You treat employee perks like a buffet and act shocked when HR notices.", emoji: "🎟️", severity: 2, baseSuccess: 0.58, baseCaught: 0.26, payoutMin: 60, payoutMax: 350, heatGain: 4, evidenceTagsPool: ["witness","paperTrail"], text: mkText() },

  // Paper
  { id: "tax_fable", category: "Paper", title: "Tax-Time Tall Tale", blurb: "You file a tax return that’s more storytelling than arithmetic.", emoji: "📄", severity: 3, baseSuccess: 0.54, baseCaught: 0.32, payoutMin: 200, payoutMax: 1500, heatGain: 6, evidenceTagsPool: ["paperTrail","digitalTrail"], text: mkText() },
  { id: "permit_pretend", category: "Paper", title: "Permit Pretend", blurb: "You act like the permit exists because you believed in it hard enough.", emoji: "📑", severity: 3, baseSuccess: 0.5, baseCaught: 0.35, payoutMin: 180, payoutMax: 1200, heatGain: 6, evidenceTagsPool: ["paperTrail","witness"], text: mkText() },
  { id: "insurance_fuss", category: "Paper", title: "Insurance Fuss", blurb: "You submit an insurance claim with… creative interpretation of events.", emoji: "🧷", severity: 3, baseSuccess: 0.52, baseCaught: 0.33, payoutMin: 150, payoutMax: 1000, heatGain: 6, evidenceTagsPool: ["paperTrail","witness","digitalTrail"], text: mkText() },
  { id: "grant_ghost", category: "Paper", title: "Grant Ghosting", blurb: "You write a grant application so polished it starts reflecting a different reality.", emoji: "🗂️", severity: 4, baseSuccess: 0.44, baseCaught: 0.38, payoutMin: 400, payoutMax: 2500, heatGain: 7, evidenceTagsPool: ["paperTrail","digitalTrail"], text: mkText() },

  // Online
  { id: "refund_button_madness", category: "Online", title: "Refund Button Madness", blurb: "You click ‘refund’ like it’s cardio and hope support never connects the dots.", emoji: "🖱️", severity: 2, baseSuccess: 0.6, baseCaught: 0.28, payoutMin: 40, payoutMax: 300, heatGain: 5, evidenceTagsPool: ["digitalTrail"], text: mkText() },
  { id: "marketplace_mixup", category: "Online", title: "Marketplace Mix-Up", blurb: "You sell something online with a description that’s optimistic at best.", emoji: "🛒", severity: 2, baseSuccess: 0.63, baseCaught: 0.27, payoutMin: 70, payoutMax: 420, heatGain: 5, evidenceTagsPool: ["digitalTrail","witness"], text: mkText() },
  { id: "subscription_spiral", category: "Online", title: "Subscription Spiral", blurb: "You juggle subscriptions until you’re trapped in a corporate maze with receipts.", emoji: "🔁", severity: 2, baseSuccess: 0.61, baseCaught: 0.26, payoutMin: 30, payoutMax: 260, heatGain: 4, evidenceTagsPool: ["digitalTrail","paperTrail"], text: mkText() },
  { id: "influencer_invoice", category: "Online", title: "Influencer Invoice", blurb: "You send an influencer-style invoice and pray the confidence carries the math.", emoji: "📢", severity: 3, baseSuccess: 0.52, baseCaught: 0.34, payoutMin: 200, payoutMax: 1600, heatGain: 6, evidenceTagsPool: ["digitalTrail","paperTrail","witness"], text: mkText() },

  // Big
  { id: "contract_confetti", category: "Big", title: "Contract Confetti", blurb: "You sprinkle questionable terms into a contract and hope everyone stops reading at page two.", emoji: "📝", severity: 4, baseSuccess: 0.42, baseCaught: 0.4, payoutMin: 800, payoutMax: 5000, heatGain: 8, evidenceTagsPool: ["paperTrail","digitalTrail","witness"], text: mkText() },
  { id: "sponsorship_swoon", category: "Big", title: "Sponsorship Swoon", blurb: "You oversell a sponsorship package with vibes, formatting, and selective specificity.", emoji: "🤝", severity: 4, baseSuccess: 0.45, baseCaught: 0.38, payoutMin: 600, payoutMax: 4000, heatGain: 7, evidenceTagsPool: ["paperTrail","witness","digitalTrail"], text: mkText() },
  { id: "charity_confusion", category: "Big", title: "Charity Confusion", blurb: "You blur the line between charity operations and your own budget and call it ‘administration.’", emoji: "🎗️", severity: 5, baseSuccess: 0.36, baseCaught: 0.46, payoutMin: 1000, payoutMax: 8000, heatGain: 9, evidenceTagsPool: ["paperTrail","witness","digitalTrail","snitchRisk"], text: mkText() },
  { id: "consulting_cloud", category: "Big", title: "Consulting Cloud", blurb: "You bill for consulting deliverables that exist mostly as meetings and slide decks.", emoji: "💼", severity: 4, baseSuccess: 0.48, baseCaught: 0.37, payoutMin: 700, payoutMax: 4500, heatGain: 7, evidenceTagsPool: ["paperTrail","digitalTrail"], text: mkText() },
];

function mkText() {
  const line = (t) => t;
  const lines = (arr) => arr;
  return {
    intros: lines([
      line("You talk yourself into a plan that sounds better the less you explain it out loud."),
      line("Motivation: high. Scruples: taking a nap. What could possibly go mildly wrong?"),
      line("You rehearse a speech in your head. It's mostly adjectives and confidence."),
      line("You promise yourself this is a one-time thing. Your future self side-eyes you."),
    ]),
    success: lines([
      line("It works. You nod like this was inevitable and definitely part of the budget."),
      line("Victory tastes like convenience store coffee and plausible deniability."),
      line("You act normal. Which, suspiciously, is the hardest part."),
      line("Receipts: optional. Swagger: compulsory. You walk away richer and none the wiser."),
    ]),
    fail: lines([
      line("You overthink, then underperform. The universe shrugs politely."),
      line("Turns out vibes are not a plan. Who knew."),
      line("Your timing is impeccable—just not for this."),
      line("You leave with an anecdote and exactly zero {payout}."),
    ]),
    caught: lines([
      line("A door opens. Not the good kind. Someone says, ‘Can we talk?’"),
      line("You freeze, then melt, then wish you'd picked a different hobby."),
      line("Apparently there are forms for this. Several. They all have boxes."),
      line("You learn the phrase ‘ongoing investigation’ the loud way."),
    ]),
    quotes: lines([
      "I am a professional amateur.",
      "It looked legal from far away.",
      "I panicked with confidence.",
      "If vibes were evidence, I’d be acquitted.",
      "This was a group project with only me.",
      "I would like to unsubscribe from consequences.",
      "Is there a polite version of oops?",
      "I regret my timing, not my jokes.",
      "In my defense, the spreadsheet started it.",
      "I did it for the plot.",
    ]),
    court: {
      plea: lines([
        line("You whisper ‘lesson learned’ and take the deal shaped like homework."),
        line("You opt for certainty over drama. The judge appreciates your new taste."),
        line("You sign papers that sigh back at you."),
      ]),
      fightWin: lines([
        line("You thread the needle of technicalities. The room begrudgingly agrees."),
        line("A small miracle: reasonable doubt with a side of relief."),
        line("You leave pretending you knew it would go this way."),
      ]),
      fightLose: lines([
        line("You discover the floor has a lower floor."),
        line("You appeal to logic; logic appeals to the bailiff."),
        line("Apparently ‘vibes’ is not a legal defense."),
      ]),
      lawyer: lines([
        line("Your lawyer speaks fluent Judge. Worth the invoice."),
        line("You rent an adult to handle your adult problem."),
        line("They say ‘therefore’ a lot and it helps."),
      ]),
      charm: lines([
        line("You aim for ‘likable human.’ You mostly land on ‘earnest raccoon.’"),
        line("You apologize with personality. It has a surprising exchange rate."),
        line("You bring sincerity. The court brings policy."),
      ]),
      judge: lines([
        "Actions have paperwork.",
        "This is not a sitcom.",
        "You are not the main character here.",
        "We prefer decisions over excuses.",
        "Consider this an expensive lesson.",
        "I recommend quiet hobbies for a while.",
        "Thank you for your honesty. Now the consequences.",
        "Probation is just consequences with homework.",
      ])
    },
    prison: lines([
      line("Time passes the way a vending machine dispenses snacks: reluctantly."),
      line("You learn patience, mostly against your will."),
      line("You collect stories you won't tell at parties."),
    ]),
    viral: lines([
      line("A clip of this circulates with the caption: ‘choices were made.’"),
      line("Your situation trends briefly under #AllegedlyAdjacent."),
      line("Someone edits dramatic music over your worst angle."),
    ])
  };
}

export function validateAdultCrimeData() {
  const required = [
    "id","category","title","emoji","blurb","severity","baseSuccess","baseCaught","payoutMin","payoutMax","heatGain","evidenceTagsPool","text"
  ];
  const errors = [];
  const valid = [];
  for (const c of ADULT_CRIMES) {
    let ok = true;
    for (const k of required) {
      if (c[k] === undefined || c[k] === null) { ok = false; errors.push(`${c?.id||'unknown'} missing ${k}`); }
    }
    if (!Array.isArray(c.evidenceTagsPool)) { ok = false; errors.push(`${c?.id}: evidenceTagsPool not array`); }
    if (!c.text || typeof c.text !== 'object') { ok = false; }
    if (ok) valid.push(c);
  }
  return { ok: errors.length === 0, errors, crimes: valid };
}