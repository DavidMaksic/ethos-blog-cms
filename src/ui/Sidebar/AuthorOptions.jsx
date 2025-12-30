import { LuSunMedium, LuUserRoundPen } from 'react-icons/lu';
import { useCurrentAuthor } from '../../features/authentication/useCurrentAuthor';
import { AiOutlineLogout } from 'react-icons/ai';
import { IoMoonOutline } from 'react-icons/io5';
import { useDarkMode } from '../../context/DarkModeContext';
import { useNavigate } from 'react-router-dom';
import { ImSpinner2 } from 'react-icons/im';
import { useLogout } from '../../features/authentication/useLogout';
import { motion } from 'motion/react';
import AuthorButton from './AuthorButton';

function AuthorOptions() {
   const { isDarkMode, toggleDarkMode } = useDarkMode();
   const { isPending, logout } = useLogout();
   const { user: currentAuthor } = useCurrentAuthor();
   const navigate = useNavigate();

   return (
      <div className="flex items-center gap-2.5 ml-1 rounded-md py-2 pb-1">
         <motion.span whileTap={{ scale: 0.85 }}>
            <AuthorButton handler={toggleDarkMode}>
               {isDarkMode ? (
                  <IoMoonOutline className="size-[1.73rem]! p-0.5" />
               ) : (
                  <LuSunMedium className="size-[1.73rem]! stroke-[1.7px]" />
               )}
            </AuthorButton>
         </motion.span>

         <motion.span whileTap={{ scale: 0.85 }}>
            <AuthorButton
               handler={() => navigate(`authors/${currentAuthor.id}`)}
            >
               <LuUserRoundPen className="size-[1.73rem]! stroke-[1.6px] p-0.5" />
            </AuthorButton>
         </motion.span>

         <motion.span whileTap={{ scale: 0.85 }}>
            <AuthorButton handler={logout} isPending={isPending}>
               {!isPending ? (
                  <AiOutlineLogout className="size-7! p-0.5!" />
               ) : (
                  <ImSpinner2 className="size-7! p-[3px]! animate-spin" />
               )}
            </AuthorButton>
         </motion.span>
      </div>
   );
}

export default AuthorOptions;
