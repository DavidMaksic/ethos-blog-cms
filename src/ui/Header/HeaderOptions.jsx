import { AiOutlineLogout } from 'react-icons/ai';
import { IoMoonOutline } from 'react-icons/io5';
import { useDarkMode } from '../../context/DarkModeContext';
import { LuSunMedium } from 'react-icons/lu';
import { ImSpinner2 } from 'react-icons/im';
import { useLogout } from '../../features/authentication/useLogout';
import { motion } from 'motion/react';
import HeaderButton from './HeaderButton';

function HeaderOptions() {
   const { isDarkMode, toggleDarkMode } = useDarkMode();
   const { isPending, logout } = useLogout();

   return (
      <div className="flex items-center gap-1 ml-1 rounded-md">
         <motion.span whileTap={{ scale: 0.85 }}>
            <HeaderButton handler={toggleDarkMode}>
               {isDarkMode ? (
                  <IoMoonOutline className="size-[1.73rem]! p-0.5" />
               ) : (
                  <LuSunMedium className="size-[1.73rem]! stroke-[1.7px]" />
               )}
            </HeaderButton>
         </motion.span>

         <motion.span whileTap={{ scale: 0.85 }}>
            <HeaderButton handler={logout} isPending={isPending}>
               {!isPending ? (
                  <AiOutlineLogout />
               ) : (
                  <ImSpinner2 className="size-5! animate-spin" />
               )}
            </HeaderButton>
         </motion.span>
      </div>
   );
}

export default HeaderOptions;
