import { useEffect, useState } from 'react';
import { useUpdateTagFeature } from './useUpdateTagFeature';
import { usePublishedArticles } from '../archive/usePublishedArticles';
import { ImSpinner2 } from 'react-icons/im';
import { useEntry } from '../../context/EntryContext';

import ArticleItem from '../../ui/ArticleItem';
import SearchAlt from '../../ui/SearchAlt';

function TagFeatureModal({ currentTag, onClose }) {
   const { isPending, articles } = usePublishedArticles();
   const [selectedID, setSelectedID] = useState('');
   const { isEditing, isSuccess, updateTagFeature } = useUpdateTagFeature();
   const { refetch } = useEntry();

   const [openID, setOpenID] = useState('');
   const close = () => setOpenID('');
   const open = setOpenID;

   const boolean = true;
   const categoryID = currentTag.id;

   const filteredArticles = articles?.filter((item) => item.featured !== true);

   const taggedArticles = filteredArticles?.filter(
      (item) => item.categoryID === currentTag.id
   );

   useEffect(() => {
      if (isSuccess) {
         refetch();
         onClose();
      }
   }, [isSuccess, refetch, onClose]);

   return (
      <div className="flex flex-col items-center gap-2">
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
                  <span
                     className={`self-center col-span-2 text-primary-400 ${
                        !taggedArticles?.length && 'mt-33 mb-9'
                     }`}
                  >
                     No articles to show...
                  </span>
               )
            ) : (
               <>
                  <span className="absolute inset-0 m-0 bg-gradient-to-t from-primary dark:from-primary-50 from-30% transition duration-150 z-10" />
                  <li className="h-25.5 w-100 bg-primary-200 rounded-3xl animate-skeleton" />
                  <li className="bg-primary-200 rounded-3xl animate-skeleton" />
                  <li className="h-25.5 w-100 bg-primary-200 rounded-3xl animate-skeleton" />
                  <li className="bg-primary-200 rounded-3xl animate-skeleton" />
               </>
            )}
         </ul>

         <div
            className={`flex items-center pt-1.5 space-x-10 z-20 ${
               taggedArticles?.length === 3 || taggedArticles?.length === 4
                  ? 'mt-31'
                  : ''
            } ${taggedArticles?.length === 2 && 'mt-60.5'} ${
               taggedArticles?.length === 0 || !taggedArticles
                  ? 'mt-[123px]'
                  : ''
            } ${taggedArticles?.length === 1 && 'mt-[242px]'} ${
               taggedArticles?.length === 5 || taggedArticles?.length === 6
                  ? 'mt-[5px]'
                  : ''
            }`}
         >
            <button
               className={`relative text-[#ca6565] dark:text-[#e78989] hover:text-[#be6565] ${
                  !openID || isEditing ? 'pointer-events-none opacity-30' : ''
               }`}
               onClick={() =>
                  updateTagFeature({ selectedID, categoryID, boolean })
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
               className="text-primary-500 dark:text-primary-400 hover:text-primary-400 dark:hover:text-primary-500"
               onClick={onClose}
            >
               Cancel
            </button>
         </div>
      </div>
   );
}

export default TagFeatureModal;
