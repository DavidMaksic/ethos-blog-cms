import { motion } from 'motion/react';

function TagForm({ isPending, onSubmit, children }) {
   const disableClick = isPending && 'pointer-events-none !opacity-70';

   return (
      <motion.form
         className={`relative py-10 pb-12 px-6 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-b-primary-100 min-w-260 xl:min-w-235 ${disableClick}`}
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.3 }}
         onSubmit={onSubmit}
      >
         {children}
      </motion.form>
   );
}

export default TagForm;
