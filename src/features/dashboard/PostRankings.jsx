import { HiArrowUp, HiArrowDown, HiMinus } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'motion/react';
import { useUmamiTopPages } from '../../hooks/useUmamiTopPages';
import { useAllArticles } from './useAllArticles';
import { PiRankingFill } from 'react-icons/pi';
import { Link } from 'react-router-dom';

import RankingSkeleton from '../../ui/skeletons/RankingSkeleton';
import RankingImage from '../../ui/Images/RankingImage';
import Heading from '../../ui/Heading';

// TODO: Filter bots using Cloudinary
// TODO: Revalidate doesn't fire for article draft -> publish

function PostRankings({ numDays }) {
   const { pages, isLoading } = useUmamiTopPages(numDays);
   const { articles } = useAllArticles();

   // Match Umami URL slugs to article data
   function getArticle(slug, lang) {
      return articles?.find((a) => a.slug === slug && a.code === lang) ?? null;
   }

   return (
      <div className="col-span-2 row-span-2 flex flex-col space-y-6 bg-white dark:bg-primary-300/10 rounded-2xl py-8 px-10 box-shadow transition-200 min-h-196">
         <Heading type="h2">Post Rankings</Heading>

         <AnimatePresence mode="wait">
            {isLoading ? (
               <RankingSkeleton />
            ) : (
               <>
                  <div className="flex items-center gap-6 px-0 text-xs font-medium text-primary-300 uppercase tracking-wider mb-4">
                     <div className="w-4 ml-2 shrink-0">#</div>
                     <div className="flex-1">Title</div>
                     <div className="w-18 2xl:w-15 xl:w-12 shrink-0">Views</div>
                     <div className="w-14 flex justify-end shrink-0">
                        Change
                     </div>
                  </div>
                  <motion.div
                     key="list"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     transition={{ duration: 0.3, ease: 'easeOut' }}
                     className="flex-1 flex flex-col"
                  >
                     {!pages.length ? (
                        <div className="flex-1 flex flex-col items-center justify-center gap-3 -translate-y-10 w-[50%] self-center text-center">
                           <PiRankingFill className="text-6xl text-primary-200 dark:text-primary-300 transition-color" />
                           <span className="text-2xl italic text-primary-300 transition-color">
                              No ranking data for the last {numDays} days...
                           </span>
                        </div>
                     ) : (
                        pages.map((page, i) => {
                           const article = getArticle(page.slug, page.lang);
                           const isLast = i === pages.length - 1;

                           return (
                              <div key={page.url}>
                                 <div className="flex items-center gap-6 py-1">
                                    {/* Rank */}
                                    <div className="flex flex-col items-center w-6 shrink-0">
                                       <span className="text-sm font-semibold text-primary-400 dark:text-primary-400 transition-color tabular-nums">
                                          {page.rank}
                                       </span>
                                    </div>

                                    {/* Article */}
                                    <div className="flex items-center gap-3 flex-1 min-w-0 ">
                                       <RankingImage
                                          src={article?.image}
                                          blurSrc={article?.image_blur}
                                          alt={article?.title}
                                       />
                                       <Link
                                          className={`text-base font-medium truncate text-primary-500 dark:text-primary-500/70 transition-color underlined-text ${article?.code === 'sr' && 'font-cyrillic text-lg'}`}
                                          to={`/archive/${article?.id}`}
                                       >
                                          {article?.title ?? page.url}
                                       </Link>
                                       {page.lang && (
                                          <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-primary-300/20 dark:bg-primary-300/20 text-primary-400/80 dark:text-primary-300 shrink-0 uppercase">
                                             {page.lang}
                                          </span>
                                       )}
                                    </div>

                                    {/* Views */}
                                    <span className="w-26 2xl:w-20 xl:w-14 text-base flex justify-center tabular-nums text-primary-500/80 dark:text-primary-500/70 transition-color shrink-0 font-stats">
                                       {page.views.toLocaleString()}
                                    </span>

                                    {/* Position change */}
                                    <div className="w-14 flex justify-center shrink-0 font-stats">
                                       <ChangeIndicator change={page.change} />
                                    </div>
                                 </div>

                                 {/* Connecting dots */}
                                 {!isLast && (
                                    <div className="pl-[8.5px] text-primary-400 dark:text-primary-300">
                                       <RankDots />
                                    </div>
                                 )}
                              </div>
                           );
                        })
                     )}
                  </motion.div>
               </>
            )}
         </AnimatePresence>
      </div>
   );
}

export default PostRankings;

function RankDots() {
   return (
      <div className="flex flex-col gap-1 py-1">
         <span className="size-1 rounded-full bg-current opacity-25 dark:opacity-30" />
         <span className="size-1 rounded-full bg-current opacity-25 dark:opacity-30" />
         <span className="size-1 rounded-full bg-current opacity-25 dark:opacity-30" />
      </div>
   );
}

function ChangeIndicator({ change }) {
   if (change === null || change === 0)
      return (
         <span className="flex items-center gap-1 text-base text-primary-500 dark:text-primary-500/70 opacity-50">
            <HiMinus className="text-base stroke-2 font-bold" />
         </span>
      );
   if (change > 0)
      return (
         <div className="flex items-center gap-1 text-base rounded-lg pl-2 pr-[9px] py-0.5 text-green-600/90 dark:text-green-300/90 bg-green-300/20 dark:bg-green-300/15">
            <HiArrowUp className="text-base stroke-[1.2px] font-bold" />{' '}
            <span className="pt-px">{change}</span>
         </div>
      );
   return (
      <div className="flex items-center gap-1 text-base rounded-lg pl-2 pr-[9px] py-0.5 text-red-400/90 dark:text-red-300 bg-red-300/17 dark:bg-red-300/15">
         <HiArrowDown className="text-base stroke-[1.2px] font-bold" />{' '}
         <span className="pt-px">{Math.abs(change)}</span>
      </div>
   );
}
