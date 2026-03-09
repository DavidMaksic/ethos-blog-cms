import {
   ResponsiveContainer,
   PieChart,
   Tooltip,
   Legend,
   Cell,
   Pie,
} from 'recharts';
import { useUmamiReferrers } from '../../hooks/useUmamiReferrers';
import { motion, AnimatePresence } from 'motion/react';
import { useMediaQuery } from 'react-responsive';
import { useDarkMode } from '../../context/DarkModeContext';
import Heading from '../../ui/Heading';

const COLORS = [
   '#f98585cc',
   '#f9cb85cc',
   '#def985cc',
   '#85f991cc',
   '#85f9f0cc',
   '#85a5f9cc',
   '#b885f9cc',
   '#f985e0cc',
];

function prepareData(referrers) {
   if (!referrers?.length) return [];

   return referrers.slice(0, 8).map((item, i) => ({
      source: item.x || 'Direct',
      count: item.y,
      color: COLORS[i % COLORS.length],
   }));
}

function CategoryChart({ numDays }) {
   const { isDarkMode } = useDarkMode();
   const { referrers, isLoading } = useUmamiReferrers(numDays);

   const data = prepareData(referrers);

   const colors = isDarkMode
      ? {
           background: 'rgba(46, 51, 61, 0.6)',
           shadow: 'rgba(0, 0, 0, 0.2)',
           text: '#d1d5db',
        }
      : {
           background: 'rgba(249, 250, 251, 0.2)',
           shadow: 'rgba(0, 0, 0, 0.1)',
           text: '#6b7280',
        };

   const isFullHD = useMediaQuery({ maxWidth: 1920 });
   const is2xl = useMediaQuery({ maxWidth: 1580 });
   const isXl = useMediaQuery({ maxWidth: 1290 });

   let size, innerRadius, outerRadius;
   if (isFullHD) {
      size = 240;
      innerRadius = 85;
      outerRadius = 110;
   }
   if (is2xl) {
      size = 220;
      innerRadius = 80;
      outerRadius = 100;
   }
   if (isXl) {
      size = 200;
      innerRadius = 63;
      outerRadius = 80;
   }

   return (
      <div className="categories col-start-3 col-span-2 space-y-6 text-base bg-white dark:bg-primary-300/10 rounded-2xl py-8 px-10 box-shadow transition-200 z-10">
         <Heading type="h2">Traffic Sources</Heading>

         <AnimatePresence mode="wait">
            {isLoading ? (
               <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
               >
                  <div className="h-65 rounded-3xl skeleton animate-skeleton transition-bg_border bg-primary-300/25 dark:bg-primary-300/15" />
               </motion.div>
            ) : data.length > 0 ? (
               <motion.div
                  key="chart"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="mt-7"
               >
                  <ResponsiveContainer width="100%" height={size}>
                     <PieChart>
                        <Pie
                           data={data}
                           nameKey="source"
                           dataKey="count"
                           innerRadius={innerRadius}
                           outerRadius={outerRadius}
                           paddingAngle={3}
                        >
                           {data.map((item) => (
                              <Cell
                                 fill={item.color}
                                 stroke={item.color}
                                 key={item.source}
                              />
                           ))}
                        </Pie>

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
                           verticalAlign="middle"
                           align="right"
                           width={isXl ? '45%' : '35%'}
                           layout="vertical"
                           iconSize={8}
                           iconType="circle"
                           formatter={(value, entry) => (
                              <span
                                 style={{
                                    fontSize: is2xl ? '12px' : '14px',
                                    color: entry.color,
                                 }}
                              >
                                 {value}
                              </span>
                           )}
                        />
                     </PieChart>
                  </ResponsiveContainer>
               </motion.div>
            ) : (
               <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
               >
                  <div className="h-full flex flex-col items-center justify-center -translate-y-7 gap-3">
                     <span className="text-2xl italic text-primary-300 transition-color w-72 text-center">
                        No traffic data for the last {numDays} days...
                     </span>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
}

export default CategoryChart;
