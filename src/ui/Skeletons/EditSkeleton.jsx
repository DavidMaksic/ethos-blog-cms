import { motion } from 'motion/react';

function EditSkeleton() {
   return (
      <motion.div
         className="space-y-5 [&_div]:rounded-full animate-skeleton transition-200"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.1 }}
      >
         <div className="h-10 bg-primary-300 dark:bg-primary-200 w-1/4" />

         <div className="flex h-[46rem] justify-center bg-skeleton !rounded-3xl" />
      </motion.div>
   );
}

export default EditSkeleton;
