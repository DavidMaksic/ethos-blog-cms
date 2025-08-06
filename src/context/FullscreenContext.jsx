import { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useMediaQuery } from 'react-responsive';

const FullscreenContext = createContext();

function FullscreenProvider({ children }) {
   const [localFullscreen, setLocalFullscreen] = useLocalStorage(
      false,
      'isFullscreen'
   );
   const [isFullscreen, setIsFullscreen] = useState(localFullscreen);
   const is4k = useMediaQuery({ maxWidth: 3840 });
   const is2k = useMediaQuery({ maxWidth: 2560 });
   const isFullHD = useMediaQuery({ maxWidth: 1920 });

   useEffect(() => setIsFullscreen(false), [setIsFullscreen]);

   useEffect(() => {
      const headerEl = document.querySelector('.header');
      const sidebarEl = document.querySelector('.sidebar');
      const mainEl = document.querySelector('.main');

      let header;
      let sideBar;

      if (is4k) {
         header = 'translate(0px, -140px)';
         sideBar = 'translate(-520px, 0px)';
      }
      if (is2k) {
         header = 'translate(0px, -90px)';
         sideBar = 'translate(-350px, 0px)';
      }
      if (isFullHD) {
         header = 'translate(0px, -70px)';
         sideBar = 'translate(-270px, 0px)';
      }

      const elementsExist = headerEl && sidebarEl && mainEl;

      if (!elementsExist) return;

      if (isFullscreen) {
         headerEl.style.transform = header;
         sidebarEl.style.transform = sideBar;
         mainEl.style.paddingLeft = '16rem';
         mainEl.style.paddingTop = '3rem';
      } else {
         headerEl.style.transform = 'translate(0px, 0px)';
         sidebarEl.style.transform = 'translate(0px, 0px)';
         mainEl.style.paddingLeft = '';
         mainEl.style.paddingTop = '';
      }
   }, [isFullscreen, is4k, is2k, isFullHD]);

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
