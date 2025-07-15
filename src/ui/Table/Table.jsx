import { motion } from 'motion/react';

function Table({ children }) {
   return (
      <motion.div
         className="text-base rounded-xl border border-quaternary dark:border-tertiary transition-[border] duration-200"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.4 }}
      >
         {children}
      </motion.div>
   );
}

export default Table;
