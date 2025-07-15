import { motion } from 'motion/react';

function TagForm({ cols, isPending, children }) {
   const disableClick = isPending && 'pointer-events-none !opacity-70';

   return (
      <motion.div
         className={`relative grid grid-cols-[${cols}] items-center gap-30 py-10 xl:py-8.5 pb-12 px-6 xl:px-4 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-b-primary-100 ${disableClick}`}
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.3 }}
      >
         {children}
      </motion.div>
   );
}

export default TagForm;
