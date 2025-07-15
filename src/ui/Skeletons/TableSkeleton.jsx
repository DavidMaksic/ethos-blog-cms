import TableRowSkeleton from './TableRowSkeleton';
import { motion } from 'motion/react';

function TableSkeleton() {
   const rowNumber = 6;
   const rows = Array.from({ length: rowNumber }, (_, i) => i);

   return (
      <motion.div
         className="relative max-w-full space-y-8 [&_div]:rounded-full animate-skeleton"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.4 }}
      >
         <span className="absolute inset-0 m-0 bg-gradient-to-t from-primary dark:from-primary-50 transition duration-150" />

         <div className="space-y-8">
            <div className="h-12 bg-primary-200 dark:bg-skeleton rounded-2xl!" />
            {rows.map((item) => (
               <TableRowSkeleton key={item} />
            ))}
         </div>
      </motion.div>
   );
}

export default TableSkeleton;
