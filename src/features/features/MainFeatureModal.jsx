import { usePublishedArticles } from '../archive/usePublishedArticles';
import { useUpdateMainFeature } from './useUpdateMainFeature';
import { useEffect, useState } from 'react';
import { ImSpinner2 } from 'react-icons/im';

import ArticleItem from '../../ui/ArticleItem';
import SearchAlt from '../../ui/SearchAlt';
import toast from 'react-hot-toast';

function MainFeatureModal({ onClose }) {
   const { isPending, articles } = usePublishedArticles();

   const [selectedID, setSelectedID] = useState('');
   const { isEditing, isSuccess, updateMainFeature } = useUpdateMainFeature();

   const [openID, setOpenID] = useState('');
   const close = () => setOpenID('');
   const open = setOpenID;

   const boolean = true;

   const filteredArticles = articles?.filter(
      (item) => item.main_feature !== true
   );

   useEffect(() => {
      if (isSuccess) {
         toast.success('Article successfully featured');
         onClose();
      }
   }, [isSuccess, onClose]);

   return (
      <div className="flex flex-col items-center justify-between gap-2 min-h-[28rem]">
         <span className="pb-3">
            <SearchAlt />
         </span>

         <ul className="py-2 px-2 grid grid-cols-2 gap-x-6 gap-y-4 overflow-auto scrollbar max-h-[30rem]">
            {!isPending ? (
               filteredArticles?.length >= 1 ? (
                  filteredArticles?.map((item) => (
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
                  <span
                     className={`self-center col-span-2 text-primary-400 ${
                        !filteredArticles?.length && 'mt-33 mb-9'
                     }`}
                  >
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

         <div className="flex items-center pt-1.5 space-x-10 z-20">
            <button
               className={`relative text-[#ca6565] dark:text-[#e78989] hover:text-[#be6565] ${
                  !openID || isEditing ? 'pointer-events-none opacity-30' : ''
               }`}
               onClick={() => updateMainFeature({ selectedID, boolean })}
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
               className="text-primary-500 dark:text-primary-400 hover:text-primary-400 dark:hover:text-primary-500"
               onClick={onClose}
            >
               Cancel
            </button>
         </div>
      </div>
   );
}

export default MainFeatureModal;
