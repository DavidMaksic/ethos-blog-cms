import { motion } from 'motion/react';

function Stats({ title, value, isLoading, icon, color }) {
   return (
      <div className="flex justify-start gap-4 bg-white dark:bg-primary-300/10 rounded-2xl py-4 px-5 box-shadow transition-200">
         <span
            className={`${color} self-center text-3xl rounded-full p-3.5 transition-bg`}
         >
            {icon}
         </span>
         <div className="flex flex-col self-center gap-1">
            <span className="text-xs uppercase font-semibold text-primary-400 tracking-wider">
               {title}
            </span>

            {isLoading ? (
               <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
               >
                  <div className="h-8 w-16 mt-1 rounded-2xl skeleton animate-skeleton transition-bg_border" />
               </motion.div>
            ) : (
               <motion.div
                  key="statistic"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
               >
                  <span className="text-3xl text-primary-600 dark:text-primary-600/90 font-stats dark:font-light transition-color">
                     {value || '-'}
                  </span>
               </motion.div>
            )}
         </div>
      </div>
   );
}

export default Stats;
