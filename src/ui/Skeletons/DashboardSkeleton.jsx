import { motion } from 'motion/react';

function DashboardSkeleton() {
   const colNumber = 4;
   const columns = Array.from({ length: colNumber }, (_, i) => i);

   return (
      <motion.div
         className="relative grid grid-cols-4 grid-rows-[auto_23rem_auto] 2xl:grid-rows-[auto_23.5rem_auto] xl:grid-rows-[auto_26.5rem_auto] gap-6 mb-14 [&_div]:rounded-3xl [&_span]:rounded-3xl animate-skeleton"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.3 }}
      >
         <span className="absolute inset-0 m-[-1px] bg-gradient-to-t from-primary dark:from-primary-50 transition duration-150" />

         {columns.map((item) => (
            <span
               className="h-23 flex justify-start gap-4 bg-primary-200 dark:bg-skeleton py-4 px-5 transition-bg_border"
               key={item}
            />
         ))}

         <div className="col-span-2 bg-primary-200 dark:bg-skeleton transition-bg_border" />

         <div className="col-start-3 col-span-2 bg-primary-200 dark:bg-skeleton transition-bg_border" />

         <div className="col-span-full bg-primary-200 dark:bg-skeleton h-60 transition-bg_border" />
      </motion.div>
   );
}

export default DashboardSkeleton;
