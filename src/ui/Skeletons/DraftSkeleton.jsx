import { motion } from 'motion/react';

function DraftSkeleton() {
   return (
      <motion.div
         className="grid gap-y-3 mb-14 [&_div]:rounded-2xl animate-skeleton"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.1 }}
      >
         <div className="h-25 bg-primary-100 dark:bg-skeleton transition-bg_border" />
         <div className="h-25 bg-primary-100 dark:bg-skeleton transition-bg_border" />
      </motion.div>
   );
}

export default DraftSkeleton;
