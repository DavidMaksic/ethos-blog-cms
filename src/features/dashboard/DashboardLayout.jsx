import { useRecentArticles } from './useRecentArticles';
import { motion } from 'motion/react';

import DashboardSkeleton from '../../ui/Skeletons/DashboardSkeleton';
import ReferrerChart from './ReferrerChart';
import TrafficChart from './TrafficChart';
import PostRankings from './PostRankings';
import StatsLayout from './StatsLayout';
import Drafts from './Drafts';

function DashboardLayout() {
   const { isPending, articles, numDays } = useRecentArticles();

   if (isPending) return <DashboardSkeleton />;

   return (
      <motion.div
         className="grid grid-cols-4 grid-rows-[auto_30.3rem_24rem_24rem] gap-6 mb-15 2xl:mb-20 xl:mb-40"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.4 }}
      >
         <StatsLayout numDays={numDays} />
         <TrafficChart numDays={numDays} />
         <PostRankings numDays={numDays} />
         <ReferrerChart articles={articles} numDays={numDays} />
         <Drafts />
      </motion.div>
   );
}

export default DashboardLayout;
