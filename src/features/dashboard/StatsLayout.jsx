import { HiOutlineUser, HiOutlineEye } from 'react-icons/hi2';
import { useUmamiSummary } from '../../hooks/useUmamiSummary';
import { TbBounceRight } from 'react-icons/tb';
import { SlClock } from 'react-icons/sl';
import Stats from './Stats';

function StatsLayout({ numDays }) {
   const { summary, isLoading } = useUmamiSummary(numDays);

   function getChange(current, previous) {
      if (!previous) return null;
      const change = ((current - previous) / previous) * 100;
      const rounded = Math.round(change);
      return rounded > 0 ? `+${rounded}%` : `${rounded}%`;
   }

   const visitors = summary?.visitors ?? 0;
   const visitorsChange = getChange(
      summary?.visitors,
      summary?.comparison?.visitors,
   );

   const pageviews = summary?.pageviews ?? 0;
   const pageviewsChange = getChange(
      summary?.pageviews,
      summary?.comparison?.pageviews,
   );

   const bounceRateValue = summary?.bounces / summary?.visitors;
   const bounceRatePrev =
      summary?.comparison?.bounces / summary?.comparison?.visitors;
   const bounceRate = bounceRateValue
      ? `${(bounceRateValue * 100).toFixed(0)}%`
      : '0%';
   const bounceRateChange = getChange(bounceRateValue, bounceRatePrev);

   const avgDurationValue = summary?.totaltime / summary?.visitors;
   const avgDurationPrev =
      summary?.comparison?.totaltime / summary?.comparison?.visitors;
   const avgDurationChange = getChange(avgDurationValue, avgDurationPrev);
   const avgDuration = avgDurationValue
      ? (() => {
           const secs = Math.round(avgDurationValue);
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
            change={visitorsChange}
            isLoading={isLoading}
            icon={<HiOutlineUser className="text-svg-users transition-color" />}
            color="bg-stat-users"
         />
         <Stats
            title="Page Views"
            value={pageviews}
            change={pageviewsChange}
            isLoading={isLoading}
            icon={<HiOutlineEye className="text-svg-likes transition-color" />}
            color="bg-stat-likes"
         />
         <Stats
            title="Bounce Rate"
            value={bounceRate}
            change={bounceRateChange}
            invertChange={true}
            isLoading={isLoading}
            icon={
               <TbBounceRight className="text-svg-comments transition-color stroke-[1.5px]" />
            }
            color="bg-stat-comments"
         />
         <Stats
            title="Visit Duration"
            value={avgDuration}
            change={avgDurationChange}
            isLoading={isLoading}
            icon={
               <SlClock className="text-svg-bookmarks transition-color p-px" />
            }
            color="bg-stat-bookmarks"
         />
      </>
   );
}

export default StatsLayout;
