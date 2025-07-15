import { useEffect, useRef } from 'react';

export function useOutsideClick(handler, listenCapturing = true) {
   const ref = useRef(null);

   useEffect(() => {
      function close(e) {
         if (ref.current && !ref.current?.contains(e.target)) handler();
      }
      document.addEventListener('click', close, listenCapturing);

      return () =>
         document.removeEventListener('click', close, listenCapturing);
   }, [handler, listenCapturing]);

   return ref;
}
