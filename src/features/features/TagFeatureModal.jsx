import { useEffect, useState } from 'react';
import { useUpdateTagFeature } from './useUpdateTagFeature';
import { usePublishedArticles } from '../archive/usePublishedArticles';
import { ImSpinner2 } from 'react-icons/im';
import { useEntry } from '../../context/EntryContext';

import ArticleItem from '../../ui/ArticleItem';
import SearchAlt from '../../ui/SearchAlt';

function TagFeatureModal({ currentTag, onClose }) {
   const { isPending, articles } = usePublishedArticles();

   const [selectedID, setSelectedID] = useState();
   const { isEditing, isSuccess, updateTagFeature } = useUpdateTagFeature();
   const { refetch } = useEntry();

   const [openID, setOpenID] = useState();
   const close = () => setOpenID();
   const open = setOpenID;

   const boolean = true;
   const category_id = currentTag.id;

   const filteredArticles = articles?.filter((item) => item.featured !== true);

   const taggedArticles = filteredArticles?.filter(
      (item) => item.category_id === currentTag.id
   );

   useEffect(() => {
      if (isSuccess) {
         refetch();
         onClose();
      }
   }, [isSuccess, refetch, onClose]);

   return (
      <div className="flex flex-col items-center justify-between gap-4 min-h-[28rem] mx-12">
         <span className="pb-3">
            <SearchAlt />
         </span>

         <ul className="py-2 px-2 grid grid-cols-2 gap-x-6 gap-y-4 overflow-auto scrollbar max-h-[30rem]">
            {!isPending ? (
               taggedArticles?.length >= 1 ? (
                  taggedArticles?.map((item) => (
                     <ArticleItem
                        open={open}
                        close={close}
                        openID={openID}
                        isLink={false}
                        article={item}
                        setSelectedID={setSelectedID}
                        key={item.id}
                     />
                  ))
               ) : (
                  <span className="self-center col-span-2 text-primary-400">
                     No articles to show...
                  </span>
               )
            ) : (
               <>
                  <li className="h-25.5 w-105 bg-primary-200 dark:bg-primary-300/30 rounded-2xl animate-skeleton" />
                  <li className="h-25.5 w-105 bg-primary-200 dark:bg-primary-300/30 rounded-2xl animate-skeleton" />
                  <li className="h-25.5 w-105 bg-primary-200/60 dark:bg-primary-300/15 rounded-2xl animate-skeleton" />
                  <li className="h-25.5 w-105 bg-primary-200/60 dark:bg-primary-300/15 rounded-2xl animate-skeleton" />
                  <li className="h-25.5 w-105 bg-primary-200/40 dark:bg-primary-300/5 rounded-2xl animate-skeleton" />
                  <li className="h-25.5 w-105 bg-primary-200/40 dark:bg-primary-300/5 rounded-2xl animate-skeleton" />
               </>
            )}
         </ul>

         <div className="flex items-center pt-1.5 mr-6 z-20">
            <button
               className={`relative rounded-full p-2 px-6 text-accent hover:bg-accent-400/80 dark:hover:bg-accent-300/55 hover:text-white dark:hover:text-accent-100 hover:shadow-edit-btn dark:hover:shadow-none transition mr-2 ${
                  !openID || isEditing ? 'pointer-events-none opacity-30' : ''
               }`}
               onClick={() =>
                  updateTagFeature({ selectedID, category_id, boolean })
               }
            >
               {isEditing ? (
                  <div className="flex items-center gap-4">
                     <ImSpinner2 className="size-5.5 animate-spin" />
                     <span>Confirming</span>
                  </div>
               ) : (
                  <span>Confirm</span>
               )}
            </button>

            <span className="text-3xl font-bold text-[#b7babe] dark:text-primary-300 pointer-events-none">
               /
            </span>

            <button
               className="text-primary-500 dark:text-primary-400 hover:text-primary-400 dark:hover:text-primary-500 transition ml-7"
               onClick={onClose}
            >
               Cancel
            </button>
         </div>
      </div>
   );
}

export default TagFeatureModal;
