import {
   ResponsiveContainer,
   CartesianGrid,
   AreaChart,
   Tooltip,
   XAxis,
   YAxis,
   Area,
} from 'recharts';
import { eachDayOfInterval, format, isSameDay, subDays } from 'date-fns';
import { useUmamiStats } from '../../hooks/useUmamiStats';
import { useMediaQuery } from 'react-responsive';
import { useDarkMode } from '../../context/DarkModeContext';

import Heading from '../../ui/Heading';
import Spinner from '../../ui/Spinner';

function Chart({ articles, numDays }) {
   const { isDarkMode } = useDarkMode();
   const { visitors, isLoading } = useUmamiStats(numDays);

   const allDates = eachDayOfInterval({
      start: subDays(new Date(), numDays - 1),
      end: new Date(),
   });

   const data = allDates.map((date) => {
      // Match Umami's {x: timestamp, y: count} format to your dates
      const umamiDay = visitors?.pageviews?.find((d) =>
         isSameDay(new Date(d.x), date),
      );
      const sessionDay = visitors?.sessions?.find((d) =>
         isSameDay(new Date(d.x), date),
      );

      return {
         label: format(date, 'MMM dd'),
         numPublished: articles
            .filter((item) => item.status === 'published')
            .filter((item) => isSameDay(date, new Date(item.created_at)))
            .length,
         numDrafted: articles
            .filter((item) => item.status === 'drafted')
            .filter((item) => isSameDay(date, new Date(item.created_at)))
            .length,
         pageviews: umamiDay?.y ?? 0,
         sessions: sessionDay?.y ?? 0,
      };
   });

   const colors = isDarkMode
      ? {
           numPublished: { stroke: '#86efac', fill: '#34d399cb' },
           numDrafted: { stroke: '#7dd3fc', fill: '#60a5fa' },
           text: '#d1d5db',
           background: 'rgba(46, 51, 61, 0.6)',
           shadow: 'rgba(0, 0, 0, 0.2)',
           border: '#475569',
        }
      : {
           numPublished: { stroke: '#16a34a', fill: '#dcfce7' },
           numDrafted: { stroke: '#075985', fill: '#e0f2fe' },
           text: '#6b7280',
           background: 'rgba(249, 250, 251, 0.2)',
           shadow: 'rgba(0, 0, 0, 0.1)',
           border: '#e5e7eb',
        };

   const isFullHD = useMediaQuery({ maxWidth: 1920 });
   const isXl = useMediaQuery({ maxWidth: 1290 });

   let size;

   if (isFullHD) {
      size = 300;
   }
   if (isXl) {
      size = 260;
   }

   if (isLoading) return <Spinner />;

   return (
      <div className="col-span-full space-y-6 bg-white dark:bg-primary-300/10 rounded-2xl py-8 px-2 pr-12 box-shadow transition-200 [&_h1]:pl-12">
         <Heading type="h2">
            <div className="flex justify-between items-center">
               Articles statistics
               <span className="bg-primary-300/20 py-1 px-3 rounded-full text-base font-medium border border-quaternary transition-bg_border">
                  {format(allDates.at(0), 'MMM dd, yyyy')} &mdash;{' '}
                  {format(allDates.at(-1), 'MMM dd, yyyy')}{' '}
               </span>
            </div>
         </Heading>

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
               <Area
                  dataKey="numPublished"
                  type="monotone"
                  stroke={colors.numPublished.stroke}
                  fill={colors.numPublished.fill}
                  strokeWidth={2}
                  name="Published"
               />
               <Area
                  dataKey="numDrafted"
                  type="monotone"
                  stroke={colors.numDrafted.stroke}
                  fill={colors.numDrafted.fill}
                  strokeWidth={2}
                  name="Drafted"
               />
               <Area
                  dataKey="pageviews"
                  type="monotone"
                  stroke="#a78bfa"
                  fill="#ede9fe"
                  strokeWidth={2}
                  name="Pageviews"
               />
               <Area
                  dataKey="sessions"
                  type="monotone"
                  stroke="#f472b6"
                  fill="#fce7f3"
                  strokeWidth={2}
                  name="Unique Visitors"
               />
            </AreaChart>
         </ResponsiveContainer>
      </div>
   );
}

export default Chart;
