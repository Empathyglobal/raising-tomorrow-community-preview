import React, { useEffect, useRef } from 'react';
import { useTutorial } from './TutorialContext';

export default function TourAnchor({ id, className, style, children }) {
  const ref = useRef(null);
  const { registerAnchor, unregisterAnchor } = useTutorial();

  useEffect(() => {
    const el = ref.current;
    if (id && el) registerAnchor(id, el);
    return () => {
      if (id) unregisterAnchor(id, el);
    };
  }, [id, registerAnchor, unregisterAnchor]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}