import { useDraftedArticles } from './useDraftedArticles';
import { useCurrentAuthor } from '../authentication/useCurrentAuthor';
import { useAuthors } from '../authentication/useAuthors';
import { BsStack } from 'react-icons/bs';
import { motion } from 'motion/react';

import DraftSkeleton from '../../ui/Skeletons/DraftSkeleton';
import ArticleItem from '../../ui/ArticleItem';
import Heading from '../../ui/Heading';

function Drafts() {
   const { isPending, articles } = useDraftedArticles();

   const { user } = useCurrentAuthor();
   const { authors } = useAuthors();
   const currentAuthor = authors?.find((item) => item.id === user.id);

   const myArticles = articles?.filter(
      (item) => item.author_id === currentAuthor.id
   );

   return (
      <motion.div
         className="relative col-span-2 space-y-3 text-base border bg-white dark:bg-primary-200 rounded-xl py-8 px-10 box-shadow transition-200 overflow-auto remove-scrollbar [&_h1]:pb-4"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         transition={{ duration: 0.3 }}
      >
         <Heading type="h2">Continue writing</Heading>

         {!isPending ? (
            myArticles.length > 0 ? (
               <>
                  {myArticles.map((item) => (
                     <ArticleItem article={item} key={item.id} />
                  ))}
               </>
            ) : (
               <div className="flex flex-col items-center gap-1 justify-self-center 2k:mt-18 mt-16 2xl:mt-20 xl:mt-22">
                  <BsStack className="text-6xl text-primary-200 dark:text-primary-300 transition-color" />
                  <span className="text-2xl italic text-primary-300 transition-color">
                     No drafted articles...
                  </span>
               </div>
            )
         ) : (
            <DraftSkeleton />
         )}
      </motion.div>
   );
}

export default Drafts;
