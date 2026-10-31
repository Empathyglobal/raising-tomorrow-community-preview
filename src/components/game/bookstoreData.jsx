// Bookstore Catalog
export const BOOKSTORE_CATALOG = [
  {
    id: "being-human-ai-era",
    title: "Being Human in an AI Era",
    author: "Eric GP",
    price: 20,
    oneTime: true,
    effects: { empathy: 0.5 },
    amazonUrl: "#demo-disabled"
  },
  {
    id: "whole-brain-child",
    title: "The Whole-Brain Child",
    author: "Daniel J. Siegel & Tina Payne Bryson",
    price: 18,
    oneTime: true,
    effects: { empathy: 0.6, intelligence: 0.2 },
    amazonUrl: "#demo-disabled"
  },
  {
    id: "no-drama-discipline",
    title: "No-Drama Discipline",
    author: "Daniel J. Siegel & Tina Payne Bryson",
    price: 17,
    oneTime: true,
    effects: { discipline: 0.6, empathy: 0.3 },
    amazonUrl: "#demo-disabled"
  },
  {
    id: "how-to-talk-so-kids",
    title: "How to Talk So Kids Will Listen & Listen So Kids Will Talk",
    author: "Adele Faber & Elaine Mazlish",
    price: 16,
    oneTime: true,
    effects: { empathy: 0.7, confidence: 0.2 },
    amazonUrl: "#demo-disabled"
  },
  {
    id: "positive-discipline",
    title: "Positive Discipline",
    author: "Jane Nelsen",
    price: 15,
    oneTime: true,
    effects: { discipline: 0.6, stress: -0.2 },
    amazonUrl: "#demo-disabled"
  },
  {
    id: "explosive-child",
    title: "The Explosive Child",
    author: "Ross W. Greene",
    price: 16,
    oneTime: true,
    effects: { empathy: 0.4, discipline: 0.3 },
    amazonUrl: "#demo-disabled"
  },
  {
    id: "parenting-inside-out",
    title: "Parenting from the Inside Out",
    author: "Daniel J. Siegel & Mary Hartzell",
    price: 18,
    oneTime: true,
    effects: { empathy: 0.6, stress: -0.2 },
    amazonUrl: "#demo-disabled"
  },
  {
    id: "simplicity-parenting",
    title: "Simplicity Parenting",
    author: "Kim John Payne & Lisa M. Ross",
    price: 15,
    oneTime: true,
    effects: { stress: -0.4, confidence: 0.2 },
    amazonUrl: "#demo-disabled"
  },
  {
    id: "raising-good-humans",
    title: "Raising Good Humans",
    author: "Hunter Clarke-Fields",
    price: 16,
    oneTime: true,
    effects: { empathy: 0.5, stress: -0.2 },
    amazonUrl: "#demo-disabled"
  },
  {
    id: "happiest-baby-block",
    title: "The Happiest Baby on the Block",
    author: "Harvey Karp",
    price: 14,
    oneTime: true,
    effects: { confidence: 0.3, stress: -0.3 },
    amazonUrl: "#demo-disabled"
  }
];

// Purchase flavor text (deterministic random pick)
export const BOOK_PURCHASE_FLAVOR = [
  "They ask a surprisingly deep question on page two.",
  "They repeat a new phrase all day like it's their new job.",
  "They get very serious and declare, \"This book is important.\"",
  "They want to 'read it again' five minutes after finishing.",
  "They point at a sentence and say, \"That's you.\"",
  "They get quiet, then hug you out of nowhere.",
  "They insist the book needs a bookmark with a dramatic name.",
  "They ask, \"Is kindness a superpower?\" and stare into your soul.",
  "They want to tell a friend about it immediately.",
  "They say, \"I like learning about people.\""
];