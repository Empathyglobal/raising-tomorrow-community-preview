import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useTutorial } from './TutorialContext';

function Mask({ rect }) {
  if (!rect) return null;

  const { x, y, width, height } = rect;

  return (
    <div className="fixed inset-0 z-[500000] pointer-events-none">
      <svg className="w-full h-full">
        <defs>
          <mask id="tutorial-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <rect
              x={x}
              y={y}
              width={width}
              height={height}
              rx="8"
              ry="8"
              fill="black"
            />
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.6)"
          mask="url(#tutorial-mask)"
        />
      </svg>
    </div>
  );
}

import { TOURS } from './tours';

export default function TutorialOverlay() {
  const { active, tourId, stepIndex, stopTour, nextStep, getAnchorEl } = useTutorial();

  const steps = TOURS[tourId] || [];
  const currentStep = steps[stepIndex];

  const spotlightRect = React.useMemo(() => {
    const currentTarget = currentStep?.target;
    if (!currentTarget) return null;
    const el = typeof currentTarget === 'string' ? document.querySelector(currentTarget) : (getAnchorEl && getAnchorEl(currentTarget));
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
  }, [currentStep?.target, getAnchorEl, stepIndex]);

  if (!active || !tourId) return null;

  if (!currentStep) {
    stopTour({ markCompleted: true });
    return null;
  }

  const { title, content, placement = 'center', advanceOn, target } = currentStep;

  const endTour = () => stopTour({ markCompleted: false });

  return (
    <>
      <Mask rect={spotlightRect} />

      <motion.div
        className="fixed z-[500001] bg-white rounded-xl shadow-xl max-w-sm w-[320px] p-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        style={{
          top: placement === 'center' ? '50%' : undefined,
          left: placement === 'center' ? '50%' : undefined,
          transform: placement === 'center' ? 'translate(-50%, -50%)' : undefined,
        }}
      >
        <div className="flex justify-between items-start gap-2">
          <div className="font-semibold text-slate-800">{title}</div>
          <button
            onClick={endTour}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Close tutorial"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-2 text-sm text-slate-700 whitespace-pre-line">{content}</div>

        {!advanceOn && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={nextStep}
              className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800"
            >
              Next
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
}