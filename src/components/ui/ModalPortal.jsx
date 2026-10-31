import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function ModalPortal({ children, open }) {
  useEffect(() => {
    if (open && typeof document !== 'undefined') {
      // Lock body scroll when modal is open
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  if (!open || typeof document === 'undefined') {
    return null;
  }

  return createPortal(children, document.body);
}