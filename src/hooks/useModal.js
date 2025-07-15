import { useEffect, useRef } from 'react';

export function useModal(handler) {
   const ref = useRef();

   useEffect(() => {
      function close(e) {
         if (!ref.current.contains(e.target)) handler();
      }

      const handleEscape = (e) => {
         if (!ref.current) return;
         if (e.key === 'Tab') e.preventDefault();
         if (e.key === 'Escape') handler();
      };

      document.addEventListener('click', close, true);
      document.addEventListener('keydown', handleEscape, true);

      return () => {
         document.removeEventListener('click', close, true);
         document.removeEventListener('keydown', handleEscape, true);
      };
   }, [handler]);

   return ref;
}
