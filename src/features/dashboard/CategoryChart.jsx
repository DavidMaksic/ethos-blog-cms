import {
   ResponsiveContainer,
   PieChart,
   Tooltip,
   Legend,
   Cell,
   Pie,
} from 'recharts';
import { FaFileCircleXmark } from 'react-icons/fa6';
import { useGetCategories } from '../tags/useGetCategories';
import { useMediaQuery } from 'react-responsive';
import { useDarkMode } from '../../context/DarkModeContext';
import Heading from '../../ui/Heading';

function prepareData(articles, categories) {
   const data = categories
      ?.map((item) => {
         return {
            category: item.category,
            color: item.chart_color,
            count: articles.filter((article) => article.category_id === item.id)
               .length,
         };
      })
      .filter((item) => item.count);

   return data;
}

function CategoryChart({ articles, numDays }) {
   const { isDarkMode } = useDarkMode();
   const { categories } = useGetCategories();

   const data = prepareData(articles, categories);

   const colors = isDarkMode
      ? {
           background: 'rgba(46, 51, 61, 0.6)',
           shadow: 'rgba(0, 0, 0, 0.2)',
        }
      : {
           background: 'rgba(249, 250, 251, 0.2)',
           shadow: 'rgba(0, 0, 0, 0.1)',
        };

   const is4k = useMediaQuery({ maxWidth: 3840 });
   const is2k = useMediaQuery({ maxWidth: 2560 });
   const isFullHD = useMediaQuery({ maxWidth: 1920 });
   const is2xl = useMediaQuery({ maxWidth: 1580 });

   let size;
   let innerRadius;
   let outerRadius;

   if (is4k) {
      size = 540;
      innerRadius = 170;
      outerRadius = 220;
   }
   if (is2k) {
      size = 355;
      innerRadius = 115;
      outerRadius = 150;
   }
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

   return (
      <div className="categories col-start-3 col-span-2 space-y-4 text-base bg-white dark:bg-primary-300/10 rounded-2xl py-8 px-10 box-shadow transition-200 z-10">
         <Heading type="h2">Categories</Heading>

         {articles.length > 0 ? (
            <ResponsiveContainer width="100%" height={size}>
               <PieChart>
                  <Pie
                     data={data}
                     nameKey="category"
                     dataKey="count"
                     innerRadius={innerRadius}
                     outerRadius={outerRadius}
                     paddingAngle={3}
                  >
                     {data?.map((item) => (
                        <Cell
                           fill={item.color}
                           stroke={item.color}
                           key={item.category}
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
                     width="30%"
                     layout="vertical"
                     iconSize={15}
                     iconType="circle"
                  />
               </PieChart>
            </ResponsiveContainer>
         ) : (
            <div className="h-full flex flex-col items-center justify-center -translate-y-7 gap-3">
               <FaFileCircleXmark className="text-6xl text-primary-200 dark:text-primary-300 transition-color" />
               <span className="text-2xl italic text-primary-300 transition-color w-72 text-center">
                  No articles posted in the last {numDays} days...
               </span>
            </div>
         )}
      </div>
   );
}

export default CategoryChart;
