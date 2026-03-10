import { motion } from 'motion/react';

function RankingSkeleton() {
   return (
      <motion.div
         key="skeleton"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         transition={{ duration: 0.3 }}
         className="relative space-y-3"
      >
         <div className="flex items-center gap-6 px-0 mb-6 mt-0.5">
            <div className="w-4 h-3 rounded-full skeleton bg-primary-300/25 dark:bg-primary-300/15 shrink-0" />
            <div className="w-14 mr-auto h-3 rounded-full skeleton bg-primary-300/25 dark:bg-primary-300/15" />
            <div className="w-14 mr-8 2xl:mr-3 xl:w-12 h-3 rounded-full skeleton bg-primary-300/25 dark:bg-primary-300/15 shrink-0" />
            <div className="w-12 2xl:w-14 h-3 rounded-full skeleton bg-primary-300/25 dark:bg-primary-300/15 shrink-0" />
         </div>

         {Array.from({ length: 8 }).map((_, i) => (
            <div
               key={i}
               className="h-[4.38rem] rounded-2xl skeleton animate-skeleton transition-bg_border bg-primary-300/25 dark:bg-primary-300/15"
            />
         ))}

         <span className="absolute inset-0 m-0 bg-gradient-to-t from-white dark:from-[#182129]" />
      </motion.div>
   );
}

export default RankingSkeleton;
