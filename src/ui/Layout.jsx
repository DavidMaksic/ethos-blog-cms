import { useFullscreen } from '../context/FullscreenContext';
import { Outlet } from 'react-router-dom';
import { motion } from 'motion/react';

import Sidebar from './Sidebar';
import Header from './Header/Header';

function Layout() {
   const { isFullscreen } = useFullscreen();

   return (
      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.3 }}
      >
         <Header />
         <Sidebar />
         <motion.main
            className={`main px-59 pt-29 xl:pt-26 py-12 flex flex-col gap-8 xl:gap-6 transition-200 bg-primary overflow-auto remove-scrollbar h-screen ${
               isFullscreen
                  ? 'px-[21.5rem]! xl:px-[13.5rem]!'
                  : 'pl-[28rem] xl:pl-[20rem] xl:pr-[7rem]'
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
