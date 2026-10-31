import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, SkipForward } from 'lucide-react';

/**
 * MyFirstPlayCutscene (v9)
 * Mobile-first, ultra-reliable tutorial walkthrough designed for iOS/Android.
 *
 * Why this design:
 * - Mobile FTUE overlays are fragile when they try to "point at" real UI. Instead, this is a
 *   read-only cutscene with mock UI scenes.
 * - On MOBILE, tapping outside the card enters a "peek" mode (card hides) so the player can
 *   clearly see the screen. Tap again to advance to the next slide.
 * - On DESKTOP, a single click outside the card advances (no peek step).
 *
 * Non-negotiables implemented:
 * - Fully opaque UI (no transparent/ghost buttons).
 * - Mobile panel height limited (~45dvh, within 40–50%).
 * - No accidental advances from scroll/drag inside the panel.
 * - Click-to-advance (tap/click). No swipe/drag navigation.
 * - Final slide offers: Play fixed game / Create character / Quick Start.
 *
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - onPlayFixed: () => void
 * - onCreateCharacter: () => void
 * - onQuickStart: () => void
 */
export default function MyFirstPlayCutscene({
  open,
  onClose,
  onPlayFixed,
  onCreateCharacter,
  onQuickStart
}) {
  const slides = useMemo(
    () => [
      {
        id: 'welcome',
        chapter: 'Basics',
        title: 'Welcome to Raising Tomorrow',
        body:
          "This is a short story-style walkthrough.\n\nYou’ll SEE the kinds of screens and pop-ups you’ll use.\n\nTap outside the card to continue (or press Next).",
        scene: 'dashboard',
        callout: 'Core loop: choose a style → take actions → handle money → age up → consequences.',
        mobileDock: 'top',
        hud: { yearText: 'Year 0', childStage: 'Newborn', money: '$150,000', job: 'Resident Physician', focus: 3 }
      },
      {
        id: 'characters',
        chapter: 'Basics',
        title: 'Meet your tutorial family',
        body:
          "You are Dr. Maya Patel.\nYour child is Alex.\n\nYou start with $150,000 so you can learn systems fast.",
        scene: 'profile',
        callout: 'Money unlocks options (housing, investments, emergencies).',
        choice: 'You chose: start as a doctor with savings.',
        mobileDock: 'bottom',
        hud: { yearText: 'Year 0', childStage: 'Newborn', money: '$150,000', job: 'Resident Physician', focus: 3 }
      },
      {
        id: 'styles',
        chapter: 'Basics',
        title: 'Parenting Styles',
        body:
          "Parenting Style changes how events feel.\n\nFor the tutorial run, you’ll choose Authoritarian (strict rules, fast discipline).",
        scene: 'parenting',
        callout: 'Different styles shift tradeoffs. None are “perfect.”',
        choice: 'You chose: Authoritarian.',
        mobileDock: 'bottom',
        hud: { yearText: 'Year 0', childStage: 'Newborn', money: '$150,000', job: 'Resident Physician', focus: 3 }
      },
      {
        id: 'bond',
        chapter: 'Basics',
        title: 'Bonding',
        body:
          "Bond actions build your relationship and can boost stats.\n\nExample: Read Together is safe and trust-building.",
        scene: 'bond',
        callout: 'Actions spend Focus. Results appear instantly.',
        choice: 'You chose: Read together.',
        mobileDock: 'bottom',
        hud: { yearText: 'Year 0', childStage: 'Newborn', money: '$150,000', job: 'Resident Physician', focus: 2 }
      },
      {
        id: 'special_careers',
        chapter: 'Explore',
        title: 'Special Careers (big story paths)',
        body:
          "Some paths are special: Music, Politics, Aerospace, Police, Bounty Hunter, and more.\n\nThey’re designed to be “try it and see what happens.”",
        scene: 'specialCareers',
        callout: 'These are not random job listings — they’re story systems.',
        choice: 'You chose: try Aerospace later (optional).',
        mobileDock: 'top',
        hud: { yearText: 'Year 1', childStage: 'Baby', money: '$145,000', job: 'Resident Physician', focus: 3 }
      },
      {
        id: 'life_goals',
        chapter: 'Basics',
        title: 'Life Goals (sometimes pop up)',
        body:
          "Sometimes a modal like Life Goals appears.\n\nPick up to 3 goals… or pick none. You can change them later.",
        scene: 'lifeGoals',
        callout: 'This is a “forced” pop-up. Complete it and move on.',
        choice: 'You chose: Continue (goals optional).',
        mobileDock: 'top',
        hud: { yearText: 'Year 1', childStage: 'Baby', money: '$145,000', job: 'Resident Physician', focus: 3 }
      },
      {
        id: 'realestate',
        chapter: 'Money',
        title: 'Real Estate (Auctions)',
        body:
          "Auctions can be cheap… and risky.\n\nBuying property is powerful because you can live in it OR rent it out for income.",
        scene: 'realEstate',
        callout: 'In the tutorial run you’ll buy a safe starter home to learn the system.',
        choice: 'You chose: Buy the starter home.',
        mobileDock: 'top',
        hud: { yearText: 'Year 1', childStage: 'Baby', money: '$150,000', job: 'Resident Physician', focus: 3 }
      },
      {
        id: 'qol',
        chapter: 'Money',
        title: 'Quality of Life',
        body:
          "After buying a home, you can switch from renting to living in your owned home.\n\nQuality of Life affects costs and comfort.",
        scene: 'qol',
        callout: 'Housing choices change your monthly drain and options later.',
        choice: 'You chose: Owned Home.',
        mobileDock: 'bottom',
        hud: { yearText: 'Year 1', childStage: 'Baby', money: '$30,000', job: 'Resident Physician', focus: 3 }
      },

      /* Narrative time skip */
      {
        id: 'timeskip_school',
        chapter: 'Time Skip',
        title: 'School starts at Age 6',
        body:
          "At Age 6, school becomes a major decision.\n\nDifferent school types cost different amounts and affect outcomes.",
        scene: 'school',
        callout: 'Watch the tradeoffs: money vs outcomes.',
        choice: 'You chose: Private School (as an example).',
        mobileDock: 'bottom',
        hud: { yearText: 'Year 6', childStage: 'Age 6', money: '$45,000', job: 'Attending Physician', focus: 3 }
      },
      {
        id: 'timeskip_dating',
        chapter: 'Time Skip',
        title: 'You can date (optional)',
        body:
          "You’re a single doctor.\n\nIf you want, you can date and find a partner.\n\nA partner can increase household resources… but relationships add complexity.",
        scene: 'dating',
        callout: 'Love can be a resource — and a risk.',
        choice: 'You chose: Go on a date (example).',
        mobileDock: 'bottom',
        hud: { yearText: 'Year 7', childStage: 'Age 7', money: '$52,000', job: 'Attending Physician', focus: 2 }
      },
      {
        id: 'timeskip_marriage',
        chapter: 'Time Skip',
        title: 'Marriage (big consequences)',
        body:
          "Marriage can change your life.\n\nCombining households can feel like income “doubles.”\n\nBut divorce can hit money, stress, and stability.",
        scene: 'marriage',
        callout: 'High upside. High downside if it collapses.',
        choice: 'You chose: Get married (example).',
        mobileDock: 'bottom',
        hud: { yearText: 'Year 8', childStage: 'Age 8', money: '$70,000', job: 'Attending Physician', focus: 3 }
      },
      {
        id: 'timeskip_divorce_warning',
        chapter: 'Time Skip',
        title: 'Divorce (if it goes wrong)',
        body:
          "Divorce isn’t a game-over.\n\nBut it can hit money, stress, and stability.\n\n(And yes, your kid remembers.)",
        scene: 'divorce',
        callout: 'The game doesn’t end — it just gets real.',
        choice: 'You chose: Lawyer up (example).',
        mobileDock: 'bottom',
        hud: { yearText: 'Year 9', childStage: 'Age 9', money: '$38,000', job: 'Attending Physician', focus: 2 }
      },
      {
        id: 'disaster',
        chapter: 'Chaos',
        title: 'Disasters happen',
        body:
          "Sometimes something bad happens — a disaster, a crisis, a sudden expense.\n\nStress spikes and you must respond.",
        scene: 'disaster',
        callout: 'Bad years happen. Your decisions still matter.',
        choice: 'You chose: Continue (handle it).',
        mobileDock: 'top',
        hud: { yearText: 'Year 10', childStage: 'Age 10', money: '$34,000', job: 'Attending Physician', focus: 3 }
      },
      {
        id: 'coping',
        chapter: 'Chaos',
        title: 'Coping (tradeoffs)',
        body:
          "When stress hits, you choose how to cope.\n\nExample: alcohol can reduce stress short-term… but it can create long-term problems.\n\nSafer coping options exist too.",
        scene: 'coping',
        callout: 'Short-term relief can create long-term patterns.',
        choice: 'You chose: Drink alcohol (example).',
        mobileDock: 'bottom',
        hud: { yearText: 'Year 10', childStage: 'Age 10', money: '$34,000', job: 'Attending Physician', focus: 2 }
      },

      {
        id: 'loop',
        chapter: 'Loop',
        title: 'The core loop',
        body:
          "Pick a style → spend Focus on actions → Age Up → see consequences.\n\nThat’s Raising Tomorrow.",
        scene: 'ageUp',
        callout: 'Choices stack over years. Your family story is the point.',
        choice: 'You chose: Strict study routine (example).',
        mobileDock: 'bottom',
        hud: { yearText: 'Year 11', childStage: 'Age 11', money: '$36,000', job: 'Attending Physician', focus: 3 }
      },
      {
        id: 'choice',
        chapter: 'Start',
        title: 'Ready?',
        body: "Choose how you want to start.",
        scene: 'final',
        callout: null,
        mobileDock: 'bottom',
        hud: { yearText: 'Year 0', childStage: 'Newborn', money: '$150,000', job: 'Resident Physician', focus: 3 }
      }
    ],
    []
  );

  const finalIndex = slides.length - 1;
  const [i, setI] = useState(0);
  const isFinal = i === finalIndex;

  const [panelVisible, setPanelVisible] = useState(true);

  // Detect mobile reliably (iOS Safari friendly).
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia?.('(max-width: 639px)');
    if (!mql) return;

    const update = () => setIsMobile(Boolean(mql.matches));
    update();

    // Safari < 14 uses addListener/removeListener.
    if (mql.addEventListener) {
      mql.addEventListener('change', update);
      return () => mql.removeEventListener('change', update);
    }
    mql.addListener?.(update);
    return () => mql.removeListener?.(update);
  }, []);

  // Reset when opening
  useEffect(() => {
    if (!open) return;
    setI(0);
    setPanelVisible(true);
  }, [open]);

  // When slide changes, show the panel again (prevents “stuck in peek mode”).
  useEffect(() => {
    if (!open) return;
    setPanelVisible(true);
  }, [i, open]);

  const slide = slides[i];
  const mobileDock = slide?.mobileDock === 'top' ? 'top' : 'bottom';
  const effectivePanelVisible = isFinal ? true : panelVisible;

  const progressPct = Math.round(((i + 1) / slides.length) * 100);

  const goBack = () => setI((prev) => Math.max(0, prev - 1));
  const goNext = () => setI((prev) => Math.min(finalIndex, prev + 1));
  const skipToEnd = () => setI(finalIndex);

  // Tap / click logic. Mobile uses: panel -> peek -> next.
  const pointerStartRef = useRef(null);
  const highlightRef = useRef(null);

  const onRootPointerDown = (e) => {
    pointerStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      t: Date.now(),
      startedInBlock: Boolean(e?.target?.closest?.('[data-cutscene-block]'))
    };
  };

  const onRootPointerUp = (e) => {
    const start = pointerStartRef.current;
    pointerStartRef.current = null;
    if (!start) return;

    // Never advance on final slide via background taps.
    if (isFinal) return;

    // Ignore any gesture that started inside the panel/controls.
    if (start.startedInBlock) return;

    const dx = Math.abs(e.clientX - start.x);
    const dy = Math.abs(e.clientY - start.y);
    const dt = Date.now() - start.t;

    // Treat as scroll/drag/longpress if moved too much or held too long.
    if (dx > 10 || dy > 10) return;
    if (dt > 1500) return;

    if (!isMobile) {
      goNext();
      return;
    }

    // Mobile: first tap hides panel (peek). Second tap advances.
    if (effectivePanelVisible) {
      setPanelVisible(false);
      return;
    }

    goNext();
  };

  // Keyboard support (desktop): Esc closes, arrows navigate.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      // Don’t steal keys from focused buttons/inputs inside the panel.
      const ae = document.activeElement;
      const isTyping =
        ae &&
        (ae.tagName === 'INPUT' ||
          ae.tagName === 'TEXTAREA' ||
          ae.tagName === 'SELECT' ||
          ae.getAttribute?.('contenteditable') === 'true');

      if (isTyping) return;

      if (e.key === 'Escape') {
        onClose?.();
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goBack();
        return;
      }

      if (e.key === 'ArrowRight') {
        if (isFinal) return;
        e.preventDefault();
        goNext();
      }
    };

    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [open, isFinal, onClose]);

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? onClose?.() : null)}>
      {/* Hide the default shadcn/radix close button so it never overlaps our UI */}
      <DialogContent
        className="w-[100vw] max-w-none p-0 overflow-hidden bg-transparent border-0 [&>button]:hidden"
        style={{ height: '100dvh', minHeight: '100vh' }}
      >
        <div
          className="relative w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white"
          onPointerDown={onRootPointerDown}
          onPointerUp={onRootPointerUp}
        >
          {/* Background mock UI (non-interactive) */}
          <div className="absolute inset-0 pointer-events-none">
            <MockAppFrame hud={slide?.hud}>
              <MockScene scene={slide?.scene} highlightRef={highlightRef} />
            </MockAppFrame>
          </div>

          {/* Mobile “peek mode” hint (fully opaque) */}
          {isMobile && !isFinal && !effectivePanelVisible && (
            <div
              className="absolute inset-x-0 top-0 z-40 flex justify-center px-3"
              style={{ paddingTop: 'calc(env(safe-area-inset-top) + 10px)' }}
            >
              <div
                className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.65)]"
              >
                <button
                  type="button"
                  data-cutscene-block
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600 text-sm"
                  onClick={() => setPanelVisible(true)}
                >
                  Show text
                </button>
                <div className="text-sm text-slate-200">Tap anywhere to continue</div>
              </div>
            </div>
          )}

          {/* Foreground UI */}
          <div className="relative z-30 w-full h-full">
            {/* DESKTOP */}
            {!isMobile ? (
              <div className="w-full h-full flex flex-row items-stretch">
                <div className="w-[420px] md:w-[500px] p-6 flex flex-col justify-between pointer-events-auto">
                  <div
                    data-cutscene-block
                    className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-slate-700 shadow-[0_20px_70px_rgba(0,0,0,0.75)] p-6 flex flex-col"
                  >
                    <div className="flex items-start justify-between gap-3" data-cutscene-block>
                      <div className="flex flex-col gap-2">
                        <div className="text-xs uppercase tracking-wider text-slate-300">
                          {slide?.chapter} • {i + 1}/{slides.length}
                        </div>
                        <div className="w-[220px] max-w-full h-1.5 rounded-full bg-slate-700 overflow-hidden">
                          <div className="h-full bg-amber-400" style={{ width: `${progressPct}%` }} />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!isFinal && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={skipToEnd}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600"
                            title="Skip to the end"
                          >
                            <SkipForward className="w-4 h-4 mr-1" />
                            Skip
                          </Button>
                        )}
                        <button
                          onClick={onClose}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600"
                          aria-label="Close tutorial"
                          data-cutscene-block
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h2 className="mt-3 text-2xl font-bold">{slide?.title}</h2>

                    <div className="mt-3 text-slate-200 whitespace-pre-line leading-relaxed text-sm sm:text-base flex-1 overflow-y-auto pr-1">
                      {slide?.body}

                      {slide?.choice && (
                        <div className="mt-4 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-100">
                          <span className="font-semibold text-slate-100">Decision:</span> {slide.choice}
                        </div>
                      )}

                      {slide?.callout && !isFinal && (
                        <div className="mt-4 rounded-xl border border-amber-500 bg-slate-800 px-4 py-3 text-sm text-amber-100">
                          {slide.callout}
                        </div>
                      )}
                    </div>

                    {!isFinal && (
                      <div className="mt-4 text-sm text-slate-400" data-cutscene-block>
                        Tip: click anywhere outside this card to continue (scroll/drag won’t skip).
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3 pointer-events-auto" data-cutscene-block>
                    <Button
                      variant="secondary"
                      onClick={goBack}
                      disabled={i === 0}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Back
                    </Button>

                    {!isFinal ? (
                      <Button onClick={goNext} className="bg-amber-400 hover:bg-amber-500 text-slate-950">
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-2 w-full justify-end">
                        <Button onClick={onPlayFixed} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                          Play this game (Doctor + Baby)
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={onCreateCharacter}
                          className="bg-slate-200 hover:bg-slate-100 text-slate-950"
                        >
                          Create your own character
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={onQuickStart}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600"
                        >
                          Quick Start (random)
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1" />
              </div>
            ) : (
              /* MOBILE */
              <>
                {effectivePanelVisible && (
                  <div
                    className={`absolute left-0 right-0 ${mobileDock === 'top' ? 'top-0' : 'bottom-0'} px-3 z-40`}
                    style={{
                      paddingTop: mobileDock === 'top' ? 'calc(env(safe-area-inset-top) + 10px)' : '10px',
                      paddingBottom: mobileDock === 'bottom' ? 'calc(env(safe-area-inset-bottom) + 10px)' : '10px'
                    }}
                  >
                    <div
                      data-cutscene-block
                      className="rounded-2xl border border-slate-700 bg-slate-950 shadow-[0_18px_60px_rgba(0,0,0,0.75)] overflow-hidden max-h-[45dvh] flex flex-col"
                    >
                      {/* Header */}
                      <div className="px-4 pt-3 pb-2 border-b border-slate-700 bg-slate-950" data-cutscene-block>
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-[11px] uppercase tracking-wider text-slate-300">
                            {slide?.chapter} • {i + 1}/{slides.length}
                          </div>
                          <div className="flex items-center gap-2">
                            {!isFinal && (
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={skipToEnd}
                                className="h-8 px-3 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600"
                              >
                                <SkipForward className="w-4 h-4 mr-1" />
                                Skip
                              </Button>
                            )}
                            <button
                              onClick={onClose}
                              className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600"
                              aria-label="Close tutorial"
                              data-cutscene-block
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="mt-2 w-full h-1.5 rounded-full bg-slate-700 overflow-hidden">
                          <div className="h-full bg-amber-400" style={{ width: `${progressPct}%` }} />
                        </div>
                      </div>

                      {/* Body */}
                      <div className="px-4 py-3 flex-1 overflow-y-auto" data-cutscene-block>
                        <div className="text-lg font-bold text-slate-100">{slide?.title}</div>

                        <div className="mt-2 text-slate-200 whitespace-pre-line leading-relaxed text-sm">
                          {slide?.body}
                        </div>

                        {slide?.choice && (
                          <div className="mt-3 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100">
                            <span className="font-semibold text-slate-100">Decision:</span> {slide.choice}
                          </div>
                        )}

                        {slide?.callout && !isFinal && (
                          <div className="mt-3 rounded-xl border border-amber-500 bg-slate-900 px-4 py-3 text-sm text-amber-100">
                            {slide.callout}
                          </div>
                        )}

                        {!isFinal && (
                          <div className="mt-3 text-xs text-slate-300" data-cutscene-block>
                            Mobile tip: tap outside this card to <span className="font-semibold text-slate-100">view the screen</span>.
                            Tap again to continue (or press Next).
                          </div>
                        )}
                      </div>

                      {/* Footer controls */}
                      <div className="px-4 py-3 border-t border-slate-700 bg-slate-950 flex items-center justify-between gap-3" data-cutscene-block>
                        <Button
                          variant="secondary"
                          onClick={goBack}
                          disabled={i === 0}
                          className="h-9 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600"
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          Back
                        </Button>

                        {!isFinal ? (
                          <Button onClick={goNext} className="h-9 bg-amber-400 hover:bg-amber-500 text-slate-950">
                            Next
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        ) : (
                          <div className="flex flex-col gap-2 w-full items-stretch">
                            <Button onClick={onPlayFixed} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                              Play this game (Doctor + Baby)
                            </Button>
                            <Button
                              variant="secondary"
                              onClick={onCreateCharacter}
                              className="bg-slate-200 hover:bg-slate-100 text-slate-950"
                            >
                              Create your own character
                            </Button>
                            <Button
                              variant="secondary"
                              onClick={onQuickStart}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600"
                            >
                              Quick Start (random)
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ----------------------------- */
/* Mock UI primitives + scenes   */
/* ----------------------------- */

function MockAppFrame({ children, hud }) {
  const safe = hud || {};
  const focus = Number.isFinite(Number(safe.focus)) ? Number(safe.focus) : null;

  return (
    <div className="w-full h-full flex items-center justify-center p-4 sm:p-8">
      <div className="relative w-full h-full max-w-[1120px] max-h-[840px] rounded-3xl border border-slate-700 bg-slate-900 shadow-[0_20px_80px_rgba(0,0,0,0.55)] overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-700 bg-slate-950">
          <div className="flex items-center gap-3">
            <AvatarPill label="Dr. Maya" />
            <AvatarPill label="Alex" small />
            <span className="text-slate-400 text-xs sm:text-sm">
              {safe.yearText || 'Year 0'} • {safe.childStage || 'Baby'}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-slate-300 text-xs sm:text-sm">
            {focus !== null && (
              <span className="px-2 py-1 rounded-full bg-slate-800 border border-slate-600">
                ⚡ Focus: {focus}
              </span>
            )}
            <span className="hidden sm:inline">{safe.job || 'Resident Physician'}</span>
            <span className="px-2 py-1 rounded-full bg-slate-800 border border-slate-600">
              💵 {safe.money || '$0'}
            </span>
          </div>
        </div>

        {/* Main area */}
        <div className="relative h-[calc(100%-52px)]">{children}</div>

        {/* Bottom tabs (mock) */}
        <div className="absolute left-0 right-0 bottom-0 border-t border-slate-700 bg-slate-950 px-4 py-3 flex justify-between text-slate-400 text-xs">
          <span className="px-2 py-1 rounded-lg bg-slate-800">Dashboard</span>
          <span className="px-2 py-1 rounded-lg bg-slate-800">Actions</span>
          <span className="px-2 py-1 rounded-lg bg-slate-800">Relationships</span>
          <span className="px-2 py-1 rounded-lg bg-slate-800">Profile</span>
        </div>
      </div>
    </div>
  );
}

function AvatarPill({ label, small = false }) {
  return (
    <div className={`flex items-center gap-2 ${small ? 'text-xs' : 'text-sm'}`}>
      <div
        className={`rounded-full bg-slate-800 border border-slate-600 ${small ? 'w-7 h-7' : 'w-9 h-9'} flex items-center justify-center`}
      >
        <span className="text-slate-300">{label.slice(0, 1)}</span>
      </div>
      {!small && <span className="text-slate-100 font-medium">{label}</span>}
    </div>
  );
}

function MockModal({ title, children }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-950" />
      <div className="relative w-[92%] max-w-[600px] rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
          <div className="font-semibold">{title}</div>
          <div className="text-slate-400">✕</div>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

function MockScene({ scene, highlightRef }) {
  switch (scene) {
    case 'dashboard':
      return (
        <div className="absolute inset-0 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card title="Today" subtitle="A calm start">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-700">
                  You have <span className="font-semibold">3 Focus</span>.
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                  Safe tutorial run
                </div>
              </div>
              <div className="mt-3 h-20 rounded-xl bg-slate-100" />
            </Card>

            <Card title="Next" subtitle="What you’ll do">
              <ul className="text-sm text-slate-700 space-y-2">
                <li>• Choose a parenting style</li>
                <li>• Bond with Alex</li>
                <li>• Learn auctions & housing</li>
                <li>• Age up and see consequences</li>
              </ul>
            </Card>
          </div>

          <div
            ref={highlightRef}
            className="absolute bottom-10 right-10 px-4 py-3 rounded-2xl bg-white text-slate-900 shadow-xl border border-slate-200 ring-4 ring-amber-400 ring-offset-2 ring-offset-white"
          >
            <div className="font-semibold">Age Up</div>
            <div className="text-xs text-slate-500">Advance a year</div>
          </div>
        </div>
      );

    case 'profile':
      return (
        <div className="absolute inset-0 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card title="Job" subtitle="Income + stress">
              <div className="text-sm text-slate-700">
                <div className="font-semibold">Resident Physician</div>
                <div className="text-slate-500">City Hospital</div>
              </div>
              <div className="mt-3 flex gap-2">
                <Pill>💼 Stable</Pill>
                <Pill>🧠 High stress</Pill>
                <Pill>📈 Growth</Pill>
              </div>
            </Card>

            <Card title="Savings" subtitle="Start at $150,000">
              <div
                ref={highlightRef}
                className="text-2xl font-bold text-slate-900 inline-block ring-4 ring-amber-400 ring-offset-2 ring-offset-white rounded-md px-1"
              >
                $150,000
              </div>
              <div className="text-sm text-slate-600 mt-2">
                This lets you try systems early (housing, emergencies, investing).
              </div>
              <div className="mt-3 h-16 rounded-xl bg-amber-50 border border-amber-200" />
            </Card>
          </div>
        </div>
      );

    case 'parenting':
      return (
        <MockModal title="Parenting Style">
          <div className="space-y-2">
            <StyleRow label="Authoritative" desc="Warm + firm. Balanced." />
            <StyleRow
              label="Authoritarian"
              desc="Strict + consistent. Fast discipline."
              highlightRef={highlightRef}
              deltas={[{ k: 'Discipline', v: '+', tone: 'good' }, { k: 'Warmth', v: '−', tone: 'warn' }]}
            />
            <StyleRow label="Permissive" desc="Warm + flexible. Few rules." />
            <StyleRow label="Uninvolved" desc="Low attention. High risk." />
          </div>
          <div className="mt-3 text-xs text-slate-500">Tap ⓘ to read pros/cons (in the real game).</div>
        </MockModal>
      );

    case 'bond':
      return (
        <MockModal title="Bond">
          <div className="space-y-2">
            <OptionRow label="Play outside" meta="+Love" />
            <OptionRow label="Talk about feelings" meta="+Empathy" />
            <OptionRow
              label="Read together"
              meta="+Love +Smarts"
              highlightRef={highlightRef}
              deltas={[
                { k: 'Love', v: '+', tone: 'good' },
                { k: 'Smarts', v: '+', tone: 'good' },
                { k: 'Focus', v: '−', tone: 'warn' }
              ]}
            />
            <OptionRow label="Movie night" meta="+Love" />
          </div>
          <div className="mt-3 text-xs text-slate-500">Costs Focus. Results appear instantly.</div>
        </MockModal>
      );

    case 'specialCareers':
      return (
        <MockModal title="Actions • Special Careers">
          <div className="text-sm text-slate-700">Pick a big story path (always available to apply):</div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Tile label="Music" sub="fame path" />
            <Tile label="Politics" sub="power path" />
            <Tile label="Police" sub="danger path" />
            <Tile label="Bounty Hunter" sub="chaos path" />
            <Tile label="Small Business" sub="money path" />
            <Tile label="Aerospace" sub="science path" highlightRef={highlightRef} />
          </div>
          <div className="mt-3 text-xs text-slate-500">Special careers come with unique scenarios.</div>
        </MockModal>
      );

    case 'lifeGoals':
      return (
        <MockModal title="Life Goals">
          <div className="text-sm text-slate-700">Pick up to 3 goals (optional).</div>
          <div className="mt-3 grid grid-cols-1 gap-2">
            <CheckRow label="Raise a kind child" checked />
            <CheckRow label="Build wealth" checked />
            <CheckRow label="Stay healthy" />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <div className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm">No goals</div>
            <div
              ref={highlightRef}
              className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm ring-4 ring-amber-400 ring-offset-2 ring-offset-white"
            >
              Continue
            </div>
          </div>
        </MockModal>
      );

    case 'realEstate':
      return (
        <MockModal title="Real Estate • Auctions">
          <div className="space-y-3">
            <div className="text-sm text-slate-700">Featured listing (tutorial-safe)</div>

            <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">Sunny Starter Home</div>
                  <div className="text-xs text-slate-500">Quiet Block • Low Risk</div>
                </div>
                <div className="text-sm font-bold text-slate-900">$120,000</div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-slate-500">Potential rent: ~$1,800/mo</div>
                <div
                  ref={highlightRef}
                  className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold ring-4 ring-amber-400 ring-offset-2 ring-offset-white"
                >
                  Buy
                </div>
              </div>

              <div className="mt-3">
                <Deltas deltas={[{ k: 'Money', v: '−$120k', tone: 'warn' }, { k: 'Assets', v: '+Home', tone: 'good' }]} />
              </div>
            </div>
          </div>
        </MockModal>
      );

    case 'qol':
      return (
        <MockModal title="Quality of Life • Housing">
          <div className="space-y-2">
            <ChoiceRow label="Renting" desc="Higher monthly drain" />
            <ChoiceRow
              label="Owned Home"
              desc="Lower monthly drain (if you own one)"
              highlightRef={highlightRef}
              deltas={[{ k: 'Monthly cost', v: '↓', tone: 'good' }, { k: 'Stability', v: '↑', tone: 'good' }]}
            />
            <ChoiceRow label="Luxury" desc="Expensive comfort" />
          </div>
          <div className="mt-4 flex justify-end">
            <div className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold">Save Changes</div>
          </div>
        </MockModal>
      );

    case 'school':
      return (
        <MockModal title="School Enrollment • Age 6">
          <div className="text-sm text-slate-700">School starts at age 6. Choose a path:</div>
          <div className="mt-3 space-y-2">
            <OptionRow label="Public School" meta="$0/yr • balanced" />
            <OptionRow
              label="Private School"
              meta="$12,000/yr • boosts academics"
              highlightRef={highlightRef}
              deltas={[
                { k: 'Money', v: '−$12k/yr', tone: 'warn' },
                { k: 'Smarts', v: '+', tone: 'good' },
                { k: 'Stress', v: '+', tone: 'warn' }
              ]}
            />
            <OptionRow label="Homeschool" meta="time-heavy • flexible" />
          </div>
          <div className="mt-3 text-xs text-slate-500">Choices have tradeoffs. Sometimes “free” is correct. Sometimes not.</div>
        </MockModal>
      );

    case 'dating':
      return (
        <MockModal title="Dating">
          <div className="text-sm text-slate-700">You can date to find a partner (optional).</div>
          <div className="mt-3 space-y-2">
            <OptionRow label="Make a profile" meta="slow + steady" />
            <OptionRow
              label="Go on a date"
              meta="+Love? +Drama?"
              highlightRef={highlightRef}
              deltas={[{ k: 'Love', v: '+', tone: 'good' }, { k: 'Focus', v: '−', tone: 'warn' }, { k: 'Stress', v: '+/−', tone: 'warn' }]}
            />
            <OptionRow label="Take a break" meta="protect your peace" />
          </div>
          <div className="mt-3 text-xs text-slate-500">Partners can add resources — but they also add variables.</div>
        </MockModal>
      );

    case 'marriage':
      return (
        <MockModal title="Relationship Decision">
          <div className="text-sm text-slate-700">Things are getting serious. What do you do?</div>
          <div className="mt-3 space-y-2">
            <OptionRow label="Stay casual" meta="low commitment" />
            <OptionRow label="Move in together" meta="shared costs" />
            <OptionRow
              label="Get married"
              meta="combine households"
              highlightRef={highlightRef}
              deltas={[
                { k: 'Household income', v: '↑↑', tone: 'good' },
                { k: 'Stability', v: '↑', tone: 'good' },
                { k: 'Risk', v: 'divorce', tone: 'warn' }
              ]}
            />
          </div>
          <div className="mt-3 text-xs text-slate-500">Marriage can feel like “income doubles”… until it doesn’t.</div>
        </MockModal>
      );

    case 'divorce':
      return (
        <MockModal title="Divorce">
          <div className="text-sm text-slate-700">The relationship collapses. You must handle it.</div>
          <div className="mt-3 space-y-2">
            <OptionRow label="Agree peacefully" meta="best outcome" />
            <OptionRow
              label="Lawyer up"
              meta="expensive"
              highlightRef={highlightRef}
              deltas={[{ k: 'Money', v: '−', tone: 'warn' }, { k: 'Stress', v: '++', tone: 'warn' }, { k: 'Stability', v: '−', tone: 'warn' }]}
            />
            <OptionRow label="Fight for custody" meta="high stakes" />
          </div>
          <div className="mt-3 text-xs text-slate-500">The game doesn’t end — it just gets real.</div>
        </MockModal>
      );

    case 'disaster':
      return (
        <MockModal title="Disaster Event">
          <div className="text-sm text-slate-700">A disaster hits your city. Plans collapse.</div>
          <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="font-semibold text-slate-900">Wildfire Smoke Week</div>
            <div className="text-xs text-slate-500">School closed • Extra expenses • Sleep ruined</div>
            <div className="mt-3">
              <Deltas deltas={[{ k: 'Stress', v: '+++', tone: 'warn' }, { k: 'Money', v: '−', tone: 'warn' }, { k: 'Routine', v: 'broken', tone: 'warn' }]} />
            </div>
            <div className="mt-3 flex justify-end">
              <div
                ref={highlightRef}
                className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm ring-4 ring-amber-400 ring-offset-2 ring-offset-white"
              >
                Continue
              </div>
            </div>
          </div>
        </MockModal>
      );

    case 'coping':
      return (
        <MockModal title="Coping">
          <div className="text-sm text-slate-700">Stress is high. How do you cope?</div>
          <div className="mt-3 space-y-2">
            <OptionRow label="Go for a run" meta="healthy reset" />
            <OptionRow label="Talk to a friend" meta="support" />
            <OptionRow
              label="Drink alcohol"
              meta="short-term relief"
              highlightRef={highlightRef}
              deltas={[{ k: 'Stress', v: '− (now)', tone: 'good' }, { k: 'Health', v: '− (later)', tone: 'warn' }, { k: 'Risk', v: 'habit', tone: 'warn' }]}
            />
          </div>
          <div className="mt-3 text-xs text-slate-500">Some coping helps today but hurts tomorrow. The game tracks patterns.</div>
        </MockModal>
      );

    case 'ageUp':
      return (
        <MockModal title="Life Moment">
          <div className="text-sm text-slate-700">Alex is struggling with homework. What do you do?</div>
          <div className="mt-3 space-y-2">
            <OptionRow
              label="Set a strict study routine"
              meta="+Discipline"
              highlightRef={highlightRef}
              deltas={[{ k: 'Discipline', v: '+', tone: 'good' }, { k: 'Stress', v: '+', tone: 'warn' }]}
            />
            <OptionRow label="Hire a tutor" meta="$$ → +Smarts" />
            <OptionRow label="Let them figure it out" meta="+Independence?" />
          </div>
          <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600">
            Outcomes: stats shift, love changes, stress changes. Long-term consequences build over years.
          </div>
        </MockModal>
      );

    case 'final':
    default:
      return (
        <div className="absolute inset-0 p-6">
          <div className="w-full h-full flex items-center justify-center">
            <div className="rounded-3xl border border-slate-700 bg-slate-900 px-10 py-8 text-slate-200 text-center max-w-[640px]">
              <div className="text-2xl font-bold text-white">Ready to play.</div>
              <div className="mt-2 text-sm text-slate-400">Pick how you want to start on the final slide.</div>
            </div>
          </div>
        </div>
      );
  }
}

function Card({ title, subtitle, children }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4">
      <div className="text-slate-100 font-semibold">{title}</div>
      <div className="text-slate-400 text-xs">{subtitle}</div>
      <div className="mt-3 bg-white rounded-xl p-4">{children}</div>
    </div>
  );
}

function Pill({ children }) {
  return <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">{children}</span>;
}

function Deltas({ deltas }) {
  return (
    <div className="flex flex-wrap gap-2">
      {deltas.map((d, idx) => (
        <span
          key={idx}
          className={`px-2 py-1 rounded-full text-xs font-semibold border ${
            d.tone === 'good'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : d.tone === 'warn'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-slate-50 text-slate-700 border-slate-200'
          }`}
        >
          {d.k}: {d.v}
        </span>
      ))}
    </div>
  );
}

function StyleRow({ label, desc, highlightRef, deltas }) {
  const highlight = Boolean(highlightRef);
  return (
    <div
      ref={highlightRef || null}
      className={`rounded-xl border px-3 py-2 ${
        highlight ? 'border-amber-300 bg-amber-50 ring-4 ring-amber-400 ring-offset-2 ring-offset-white' : 'border-slate-200 bg-white'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold text-slate-900 text-sm">{label}</div>
          <div className="text-xs text-slate-500">{desc}</div>
        </div>
        <div className="text-slate-400 text-sm">ⓘ</div>
      </div>
      {highlight && deltas?.length ? <div className="mt-2"><Deltas deltas={deltas} /></div> : null}
    </div>
  );
}

function OptionRow({ label, meta, highlightRef, deltas }) {
  const highlight = Boolean(highlightRef);
  return (
    <div
      ref={highlightRef || null}
      className={`rounded-xl border px-3 py-2 ${
        highlight ? 'border-amber-300 bg-amber-50 ring-4 ring-amber-400 ring-offset-2 ring-offset-white' : 'border-slate-200 bg-white'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="font-semibold text-slate-900 text-sm">{label}</div>
        <div className="text-xs text-slate-500">{meta}</div>
      </div>
      {highlight && deltas?.length ? <div className="mt-2"><Deltas deltas={deltas} /></div> : null}
    </div>
  );
}

function ChoiceRow({ label, desc, highlightRef, deltas }) {
  const highlight = Boolean(highlightRef);
  return (
    <div
      ref={highlightRef || null}
      className={`rounded-xl border px-3 py-2 ${
        highlight ? 'border-amber-300 bg-amber-50 ring-4 ring-amber-400 ring-offset-2 ring-offset-white' : 'border-slate-200 bg-white'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold text-slate-900 text-sm">{label}</div>
          <div className="text-xs text-slate-500">{desc}</div>
        </div>
        <div className="text-slate-400 text-sm">›</div>
      </div>
      {highlight && deltas?.length ? <div className="mt-2"><Deltas deltas={deltas} /></div> : null}
    </div>
  );
}

function Tile({ label, sub, highlightRef }) {
  const highlight = Boolean(highlightRef);
  return (
    <div
      ref={highlightRef || null}
      className={`rounded-xl border px-3 py-3 ${
        highlight ? 'border-amber-300 bg-amber-50 ring-4 ring-amber-400 ring-offset-2 ring-offset-white' : 'border-slate-200 bg-white'
      }`}
    >
      <div className="font-semibold text-slate-900 text-sm">{label}</div>
      <div className="text-xs text-slate-500">{sub}</div>
    </div>
  );
}

function CheckRow({ label, checked }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
      <div className="text-sm text-slate-800">{label}</div>
      <div className="text-sm">{checked ? '✅' : '⬜️'}</div>
    </div>
  );
}