import { useRecentArticles } from './useRecentArticles';
import { motion } from 'motion/react';

import DashboardSkeleton from '../../ui/Skeletons/DashboardSkeleton';
import CategoryChart from './CategoryChart';
import StatsLayout from './StatsLayout';
import Drafts from './Drafts';
import Chart from './Chart';

function DashboardLayout() {
   const { isPending, articles, numDays } = useRecentArticles();

   if (isPending) return <DashboardSkeleton />;

   return (
      <motion.div
         className="grid grid-cols-4 grid-rows-[auto_23rem_auto] 2xl:grid-rows-[auto_23.5rem_auto] xl:grid-rows-[auto_26.5rem_auto] gap-6 mb-14"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.4 }}
      >
         <StatsLayout articles={articles} />
         <Drafts />
         <CategoryChart articles={articles} numDays={numDays} />
         <Chart articles={articles} numDays={numDays} />
      </motion.div>
   );
}

export default DashboardLayout;
