import React from 'react';
export default function GemTestCheckout() {
  return <main className="min-h-screen p-8 bg-stone-50 text-slate-800">
    <h1 className="text-2xl font-bold mb-4">Purchases are unavailable in this demo</h1>
    <p>This private preview has no payment processor, checkout, paid balance, or purchase diagnostics.</p>
    <p className="mt-2">Any gems earned through gameplay are local game values with no monetary value.</p>
    <a className="inline-block mt-4 underline" href="/">Return to the game</a>
  </main>;
}
