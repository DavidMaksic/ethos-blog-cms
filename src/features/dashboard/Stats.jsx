import { AnimatePresence, motion } from 'motion/react';

function Stats({ title, value, change, invertChange, isLoading, icon, color }) {
   const isPositive = invertChange
      ? !change?.startsWith('+')
      : change?.startsWith('+');

   return (
      <div className="flex justify-start gap-4 bg-white dark:bg-primary-300/10 rounded-2xl py-4 px-5 box-shadow transition-200">
         <span
            className={`${color} self-center text-3xl rounded-full p-3.5 transition-bg`}
         >
            {icon}
         </span>

         <div className="flex flex-col self-center gap-1 w-full">
            <span className="text-xs uppercase font-semibold text-primary-400 tracking-wider">
               {title}
            </span>

            <AnimatePresence mode="wait">
               {isLoading ? (
                  <motion.div
                     key="skeleton"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     transition={{ duration: 0.3 }}
                  >
                     <div className="h-8 w-30 mt-1 rounded-xl skeleton animate-skeleton transition-bg_border bg-primary-300/25 dark:bg-primary-300/15" />
                  </motion.div>
               ) : value === null || value === undefined ? (
                  <span className="h-8 mt-1 ml-2 text-primary-600 dark:text-primary-600/90">
                     --
                  </span>
               ) : (
                  <motion.div
                     key="statistic"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                     <span className="flex gap-4 text-3xl text-primary-600 dark:text-primary-600/90 font-stats dark:font-light transition-color">
                        {value || '-'}

                        {change && (
                           <span
                              className={`self-end text-base rounded-lg px-2 py-px ${isPositive ? 'text-green-600/90 dark:text-green-300/90 bg-green-300/18 dark:bg-green-300/15' : 'text-red-400/90 dark:text-red-300 bg-red-300/17 dark:bg-red-300/15'}`}
                           >
                              {change}
                           </span>
                        )}
                     </span>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </div>
   );
}

export default Stats;
