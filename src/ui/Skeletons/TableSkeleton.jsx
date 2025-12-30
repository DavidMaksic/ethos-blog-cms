import { PAGE_SIZE } from '../../utils/constants';
import { motion } from 'motion/react';
import TableRowSkeleton from './TableRowSkeleton';

function TableSkeleton() {
   const rows = Array.from({ length: PAGE_SIZE }, (_, i) => i);

   return (
      <motion.div
         className="relative max-w-full [&_div]:rounded-full animate-skeleton"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.4 }}
      >
         <span className="absolute inset-0 m-0 bg-gradient-to-t from-primary transition duration-150" />

         <div className="space-y-5">
            <div className="h-14 skeleton rounded-2xl!" />
            {rows.map((item) => (
               <TableRowSkeleton key={item} />
            ))}
         </div>
      </motion.div>
   );
}

export default TableSkeleton;
