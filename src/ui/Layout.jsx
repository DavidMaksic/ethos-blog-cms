import { useEffect, useRef } from 'react';
import { useFullscreen } from '../context/FullscreenContext';
import { useThemeColor } from '../hooks/useThemeColor';
import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { motion } from 'motion/react';

import Sidebar from './Sidebar';
import Header from './Header/Header';

function Layout() {
   const { isFullscreen } = useFullscreen();
   const { pathname } = useLocation();
   const mainRef = useRef(null);
   useThemeColor();

   // - Reset scroll whenever the path changes
   useEffect(() => {
      if (mainRef.current) {
         mainRef.current.scrollTop = 0;
      }
   }, [pathname]);

   return (
      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.3 }}
      >
         <Header />
         <Sidebar />
         <motion.main
            ref={mainRef}
            className={`main px-59 pt-29 py-12 flex flex-col gap-8 transition-200 bg-primary overflow-auto remove-scrollbar h-screen ${
               isFullscreen
                  ? 'px-[21.5rem]! 2xl:px-[16.5rem]!'
                  : 'pl-[28rem] 2xl:pl-[24.5rem] 2xl:pr-[8.5rem]'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
         >
            <Outlet />
         </motion.main>
      </motion.div>
   );
}

export default Layout;
