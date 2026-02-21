import { motion } from 'motion/react';

function FeaturesWrapper({ isPending, children }) {
   const disableClick = isPending && 'pointer-events-none !opacity-70';

   return (
      <motion.div
         className={`relative py-10 pb-12 px-6 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-b-primary-100 ${disableClick}`}
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.3 }}
      >
         {children}
      </motion.div>
   );
}

export default FeaturesWrapper;
