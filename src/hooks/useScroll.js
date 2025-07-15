import { useEffect, useRef, useState } from 'react';

export function useScroll() {
   const [scroll, setScroll] = useState(false);
   const ref = useRef();

   useEffect(() => {
      if (scroll) {
         ref.current.scrollIntoView({
            behavior: 'smooth',
         });
         setScroll(false);
      }
   }, [scroll]);

   return { setScroll, ref };
}
