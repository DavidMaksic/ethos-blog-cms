import { useEffect } from 'react';

export function useThemeColor() {
   useEffect(() => {
      if (typeof window === 'undefined') return;

      const updateThemeColor = () => {
         const theme = document.documentElement.getAttribute('data-theme');
         const color = theme === 'dark' ? '#131C24' : '#fff';

         let meta = document.querySelector('meta[name="theme-color"]');
         if (meta) {
            meta.setAttribute('content', color);
         } else {
            meta = document.createElement('meta');
            meta.setAttribute('name', 'theme-color');
            meta.setAttribute('content', color);
            document.head.appendChild(meta);
         }
      };

      // Initial update
      updateThemeColor();

      // Optional: Observe changes to data-theme attribute
      const observer = new MutationObserver(() => {
         updateThemeColor();
      });

      observer.observe(document.documentElement, {
         attributes: true,
         attributeFilter: ['data-theme'],
      });

      return () => {
         observer.disconnect();
      };
   }, []);
}
