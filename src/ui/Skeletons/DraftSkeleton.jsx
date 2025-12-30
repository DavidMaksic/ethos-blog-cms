import { motion } from 'motion/react';

function DraftSkeleton() {
   return (
      <motion.div
         className="grid gap-y-3.5 mb-14 [&_div]:rounded-2xl animate-skeleton"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         transition={{ duration: 0.3 }}
      >
         <div className="h-25 bg-primary-200/50 dark:bg-primary-300/15 transition-bg_border" />
         <div className="h-25 bg-primary-200/50 dark:bg-primary-300/15 transition-bg_border" />
      </motion.div>
   );
}

export default DraftSkeleton;
