import { motion } from 'motion/react';

function EditSkeleton({ isForm = false }) {
   return (
      <motion.div
         className="space-y-7 [&_div]:rounded-full animate-skeleton transition-200"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.1 }}
      >
         <span className="absolute inset-0 m-0 bg-gradient-to-t from-primary transition duration-150" />

         {!isForm && <div className="h-8 skeleton w-1/5" />}
         <div className="flex h-[80vh] justify-center skeleton rounded-3xl!" />
      </motion.div>
   );
}

export default EditSkeleton;
