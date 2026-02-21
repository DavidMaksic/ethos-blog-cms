import { AnimatePresence, motion } from 'motion/react';

function Error({ error }) {
   return (
      <AnimatePresence mode="wait">
         {error && (
            <motion.p
               key={`${error}-error`}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.075 }}
               className="text-red-600/50 dark:text-red-300/80 text-lg font-bold dark:font-medium select-none pointer-events-none font-text"
            >
               {error === '*' ? error : `*${error}`}
            </motion.p>
         )}
      </AnimatePresence>
   );
}

export default Error;
