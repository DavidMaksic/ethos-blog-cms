import {
   ResponsiveContainer,
   CartesianGrid,
   AreaChart,
   Tooltip,
   XAxis,
   YAxis,
   Area,
   Legend,
} from 'recharts';
import { eachDayOfInterval, format, isSameDay, subDays } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { TbChartAreaLineFilled } from 'react-icons/tb';
import { useUmamiStats } from '../../hooks/useUmamiStats';
import { useMediaQuery } from 'react-responsive';
import { useDarkMode } from '../../context/DarkModeContext';
import Heading from '../../ui/Heading';

function TrafficChart({ numDays }) {
   const { isDarkMode } = useDarkMode();
   const { visitors, isLoading } = useUmamiStats(numDays);

   const allDates = eachDayOfInterval({
      start: subDays(new Date(), numDays - 1),
      end: new Date(),
   });

   const data = allDates.map((date) => {
      const umamiDay = visitors?.pageviews?.find((d) =>
         isSameDay(new Date(d.x), date),
      );
      const sessionDay = visitors?.sessions?.find((d) =>
         isSameDay(new Date(d.x), date),
      );

      return {
         label: format(date, 'MMM dd'),
         pageviews: umamiDay?.y ?? 0,
         sessions: sessionDay?.y ?? 0,
      };
   });

   const colors = isDarkMode
      ? {
           numViews: { stroke: '#86efac', fill: '#34d399cb' },
           numVisitors: { stroke: '#7dd3fc', fill: '#60a5fa' },
           text: '#d1d5db',
           background: 'rgba(46, 51, 61, 0.6)',
           shadow: 'rgba(0, 0, 0, 0.2)',
           border: '#475569',
           legendOpacity: 0.8,
        }
      : {
           numViews: { stroke: '#16a34a', fill: '#dcfce7' },
           numVisitors: { stroke: '#075985', fill: '#e0f2fe' },
           text: '#6b7280',
           background: 'rgba(249, 250, 251, 0.2)',
           shadow: 'rgba(0, 0, 0, 0.1)',
           border: '#e5e7eb',
           legendOpacity: 0.7,
        };

   const isFullHD = useMediaQuery({ maxWidth: 1920 });
   const isXl = useMediaQuery({ maxWidth: 1290 });

   let size;
   if (isFullHD) size = 340;
   if (isXl) size = 260;

   return (
      <div className="col-span-full space-y-6 bg-white dark:bg-primary-300/10 rounded-2xl pt-8 pb-7 px-2 pr-12 box-shadow transition-200 [&_h1]:pl-12">
         <Heading type="h2">
            <div className="flex justify-between items-center">
               Traffic Overview
               <span className="bg-primary-300/15 dark:bg-primary-300/20 py-1 pt-1.5 px-3 rounded-full text-base font-medium border border-quaternary transition-bg_border">
                  {format(allDates.at(0), 'MMMM d')} &mdash;{' '}
                  {format(allDates.at(-1), 'MMMM d')}
               </span>
            </div>
         </Heading>

         <AnimatePresence mode="wait">
            {isLoading ? (
               <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
               >
                  <div className="h-85 ml-10 rounded-3xl skeleton animate-skeleton transition-bg_border bg-primary-300/25 dark:bg-primary-300/15" />
               </motion.div>
            ) : data.every((d) => d.pageviews === 0 && d.sessions === 0) ? (
               <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center gap-3 py-16 text-center translate-y-8"
               >
                  <TbChartAreaLineFilled className="text-6xl text-primary-200 dark:text-primary-300 transition-color" />
                  <span className="text-2xl italic text-primary-300 transition-color">
                     No traffic data for the last {numDays} days...
                  </span>
               </motion.div>
            ) : (
               <motion.div
                  key="chart"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
               >
                  <ResponsiveContainer height={size} width="100%">
                     <AreaChart data={data}>
                        <XAxis
                           dataKey="label"
                           tick={{ fill: colors.text }}
                           tickLine={{ stroke: colors.text }}
                        />
                        <YAxis
                           tick={{ fill: colors.text }}
                           tickLine={{ stroke: colors.text }}
                        />
                        <CartesianGrid strokeDasharray="4" />
                        <Tooltip
                           contentStyle={{
                              backgroundColor: colors.background,
                              backdropFilter: 'blur(15px)',
                              padding: '12px 24px',
                              border: 'none',
                              borderRadius: '14px',
                              boxShadow: `0 8px 32px ${colors.shadow}`,
                           }}
                        />
                        <Legend
                           verticalAlign="bottom"
                           align="center"
                           iconType="circle"
                           iconSize={10}
                           formatter={(value) => (
                              <span
                                 style={{
                                    fontSize: '14px',
                                    marginRight: '16px',
                                 }}
                              >
                                 {value}
                              </span>
                           )}
                           wrapperStyle={{
                              paddingTop: '16px',
                              color: colors.text,
                              opacity: colors.legendOpacity,
                              transform: 'translateX(16px)',
                           }}
                        />
                        <Area
                           dataKey="pageviews"
                           type="monotone"
                           stroke={colors.numViews.stroke}
                           fill={colors.numViews.fill}
                           strokeWidth={2}
                           name="Page views"
                        />
                        <Area
                           dataKey="sessions"
                           type="monotone"
                           stroke={colors.numVisitors.stroke}
                           fill={colors.numVisitors.fill}
                           strokeWidth={2}
                           name="Visits"
                        />
                     </AreaChart>
                  </ResponsiveContainer>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
}

export default TrafficChart;
