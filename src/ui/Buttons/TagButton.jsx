import { motion, AnimatePresence } from 'motion/react';
import { GiCheckMark } from 'react-icons/gi';
import { ImSpinner2 } from 'react-icons/im';

function TagButton({ input, isPending, handleSubmit, handleCategory, error }) {
   return (
      <AnimatePresence>
         {(input?.length > 2 && input?.length < 15) || isPending ? (
            <motion.button
               className={`${error && 'hidden'}`}
               onClick={handleSubmit(handleCategory)}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.1 }}
               whileTap={{ scale: 0.92 }}
            >
               {!isPending ? (
                  <GiCheckMark className="opacity-80 size-9 px-[0.5rem] pt-0.5 ml-4 rounded-full text-primary-500 dark:text-primary-500 hover:text-green-900/80 dark:hover:text-green-900 bg-white dark:bg-primary-300/40 hover:bg-green-200/60 transition-bg border border-primary-300/70 dark:border-quaternary hover:border-green-700/30 transition-bg_color_border cursor-pointer" />
               ) : (
                  <ImSpinner2 className="size-5 animate-spin opacity-80 ml-5.5 text-green-800/80" />
               )}
            </motion.button>
         ) : null}
      </AnimatePresence>
   );
}

export default TagButton;
