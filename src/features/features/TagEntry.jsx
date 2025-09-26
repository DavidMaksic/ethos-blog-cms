import { useUpdateTagFeature } from './useUpdateTagFeature';
import { IoRemoveCircle } from 'react-icons/io5';
import { useAuthors } from '../authentication/useAuthors';
import { CgMathPlus } from 'react-icons/cg';
import { ImSpinner2 } from 'react-icons/im';
import { useEffect } from 'react';
import { useEntry } from '../../context/EntryContext';
import { motion } from 'motion/react';
import { format } from 'date-fns';

function TagEntry({ article }) {
   const {
      isEditing: isDeleting,
      isSuccess,
      updateTagFeature,
   } = useUpdateTagFeature();

   const { authors } = useAuthors();
   const theAuthor = authors?.find((item) => item.id === article.author_id);

   const { refetch } = useEntry();
   const boolean = false;
   const category_id = article.category_id;

   function handleDelete() {
      const id = article.id;
      updateTagFeature({ selectedID: id, category_id, boolean });
   }

   useEffect(() => {
      if (isSuccess) refetch();
   }, [isSuccess, refetch]);

   return (
      <>
         {article ? (
            <motion.li
               className={`relative flex h-[24rem] 2xl:h-[23rem] xl:h-[22rem] 4k:w-[18.5rem] w-[19rem] 2xl:w-[17rem] xl:w-[16rem] border rounded-3xl group transition p-8 2xl:p-7 xl:p-6 bg-cover hover:bg-accent-100/10 dark:hover:bg-primary-200 border-primary-200 bg-center hover:border-primary-200 ${
                  isDeleting && 'opacity-80! pointer-events-none'
               }`}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.3 }}
               style={{ backgroundImage: `url(${article.image})` }}
            >
               <span className="absolute inset-0 m-0 bg-gradient-to-t from-primary-700 dark:from-primary-200/80 z-10 pointer-events-none rounded-[20px] xl:rounded-[16px] transition duration-300 group-hover:saturate-120" />

               <div className="z-20 self-end">
                  <div className="space-x-2 text-primary-300/80 dark:text-primary-600/60 font-creator text-base">
                     <span>
                        {article.created_at &&
                           format(new Date(article.created_at), 'MMM dd, yyyy')}
                     </span>
                     <span className="text-lg">•</span>
                     <span>{theAuthor?.full_name}</span>
                  </div>

                  <h2
                     className="text-primary dark:text-primary-600/95 text-2xl font-article font-medium leading-7.5"
                     style={{ textShadow: '2px 2px 12px rgba(0, 0, 0, 1)' }}
                  >
                     {article.title}
                  </h2>
               </div>

               {isDeleting ? (
                  <ImSpinner2 className="size-7 animate-spin absolute top-2.5 right-2.5 fill-white dark:fill-primary-600/90 z-10" />
               ) : (
                  <button onClick={handleDelete}>
                     <IoRemoveCircle className="absolute top-2 right-2 fill-white size-8 drop-shadow-xl opacity-80 hover:opacity-100 transition" />
                  </button>
               )}
            </motion.li>
         ) : (
            <li className="relative flex justify-center h-[20rem] w-[16rem] border rounded-3xl group transition px-5 py-5 bg-cover cursor-pointer border-quaternary">
               <CgMathPlus className="icons self-center size-11! text-primary-400/80!" />
            </li>
         )}
      </>
   );
}

export default TagEntry;
