import { motion } from 'motion/react';

function Row({ type, children }) {
   const defaultStyles = !type && 'flex-col gap-4';
   const verticalStyles = type === 'vertical' && 'justify-center items-center';
   const horizontalStyles =
      type === 'horizontal' && 'justify-between items-center';

   return (
      <motion.div
         className={`flex ${defaultStyles} ${verticalStyles} ${horizontalStyles}`}
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.3 }}
      >
         {children}
      </motion.div>
   );
}

export default Row;
