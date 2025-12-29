import { useEffect, useRef } from 'react';

export function useOutsideClick(handler, listenCapturing = true) {
   const ref = useRef(null);
   const handlerRef = useRef(handler);

   useEffect(() => {
      handlerRef.current = handler;
   }, [handler]);

   useEffect(() => {
      function handleClick(e) {
         if (ref.current && !ref.current.contains(e.target)) {
            handlerRef.current();
         }
      }

      document.addEventListener('click', handleClick, listenCapturing);

      return () =>
         document.removeEventListener('click', handleClick, listenCapturing);
   }, [listenCapturing]);

   return ref;
}
