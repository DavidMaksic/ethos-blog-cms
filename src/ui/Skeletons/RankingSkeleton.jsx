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
