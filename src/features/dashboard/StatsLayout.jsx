import { HiOutlineUser, HiOutlineEye, HiOutlineClock } from 'react-icons/hi2';
import { TbBounceRight } from 'react-icons/tb';
import { useUmamiSummary } from '../../hooks/useUmamiSummary';
import Stats from './Stats';

function StatsLayout({ numDays }) {
   const { summary, isLoading } = useUmamiSummary(numDays);

   const visitors = summary?.visitors ?? 0;
   const pageviews = summary?.pageviews ?? 0;
   const bounceRate =
      summary?.bounces && summary?.visitors
         ? ((summary.bounces / summary.visitors) * 100).toFixed(0) + '%'
         : '0%';
   const avgDuration =
      summary?.totaltime && summary?.visitors
         ? (() => {
              const secs = Math.round(summary.totaltime / summary.visitors);
              const m = Math.floor(secs / 60);
              const s = secs % 60;
              return m > 0 ? `${m}m ${s}s` : `${s}s`;
           })()
         : '0s';

   return (
      <>
         <Stats
            title="Visitors"
            value={visitors}
            isLoading={isLoading}
            icon={<HiOutlineUser className="text-svg-users transition-color" />}
            color="bg-stat-users"
         />
         <Stats
            title="Page Views"
            value={pageviews}
            isLoading={isLoading}
            icon={<HiOutlineEye className="text-svg-likes transition-color" />}
            color="bg-stat-likes"
         />
         <Stats
            title="Bounce Rate"
            value={bounceRate}
            isLoading={isLoading}
            icon={
               <TbBounceRight className="text-svg-comments transition-color stroke-[1.5px]" />
            }
            color="bg-stat-comments"
         />
         <Stats
            title="Visit Duration"
            value={avgDuration}
            isLoading={isLoading}
            icon={
               <HiOutlineClock className="text-svg-bookmarks transition-color" />
            }
            color="bg-stat-bookmarks"
         />
      </>
   );
}

export default StatsLayout;
