import { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const FullscreenContext = createContext();

function FullscreenProvider({ children }) {
   const [localFullscreen, setLocalFullscreen] = useLocalStorage(
      false,
      'isFullscreen'
   );
   const [isFullscreen, setIsFullscreen] = useState(localFullscreen);

   useEffect(() => setIsFullscreen(false), [setIsFullscreen]);

   useEffect(() => {
      const headerEl = document.querySelector('.header');
      const sidebarEl = document.querySelector('.sidebar');
      const mainEl = document.querySelector('.main');

      const elementsExist = headerEl && sidebarEl && mainEl;

      if (!elementsExist) return;

      if (isFullscreen) {
         headerEl.style.transform = 'translate(0px, -70px)';
         sidebarEl.style.transform = 'translate(-270px, 0px)';
         mainEl.style.paddingLeft = '16rem';
         mainEl.style.paddingTop = '3rem';
      } else {
         headerEl.style.transform = 'translate(0px, 0px)';
         sidebarEl.style.transform = 'translate(0px, 0px)';
         mainEl.style.paddingLeft = '';
         mainEl.style.paddingTop = '';
      }
   }, [isFullscreen]);

   return (
      <FullscreenContext.Provider
         value={{
            localFullscreen,
            setLocalFullscreen,
            isFullscreen,
            setIsFullscreen,
         }}
      >
         {children}
      </FullscreenContext.Provider>
   );
}

function useFullscreen() {
   const context = useContext(FullscreenContext);

   if (context === undefined)
      throw new Error(
         'FullscreenContext was used outside of FullscreenProvider'
      );

   return context;
}

export { FullscreenProvider, useFullscreen }; // eslint-disable-line
