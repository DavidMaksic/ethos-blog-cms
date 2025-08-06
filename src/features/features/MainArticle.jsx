import { useUpdateMainFeature } from './useUpdateMainFeature';
import { IoRemoveCircle } from 'react-icons/io5';
import { useSetIndex } from '../features/useSetIndex';
import { ImSpinner2 } from 'react-icons/im';
import { useEffect } from 'react';

function MainArticle({ article, refetch, index }) {
   const { isEditing, isSuccess, updateMainFeature } = useUpdateMainFeature();
   const boolean = false;
   const id = article.id;
   const { setIndex } = useSetIndex();

   useEffect(() => {
      if (isSuccess) refetch();
   }, [isSuccess, refetch]);

   useEffect(() => {
      setIndex({ selectedID: id, index });
   }, [setIndex, index, id]);

   function handleDelete() {
      updateMainFeature({ selectedID: id, boolean });
   }

   return (
      <div
         className={`relative grid! grid-cols-[1fr_1.2fr]! gap-10 pl-2 mt-7 mb-2 ${
            isEditing && 'opacity-80! pointer-events-none'
         }`}
      >
         <div className="space-y-2 self-center flex flex-col">
            <h2 className="relative styled_text text-4xl bg-gradient-to-r from-gray-600 to-gray-500/90 dark:from-slate-300 dark:to-slate-300/80 cursor-default! font-article">
               {article.title}
            </h2>
            <h3 className="text-lg text-primary-400 cursor-default! font-creator">
               {article.description}
            </h3>

            <div className="self-start mt-4 rounded-full bg-gradient-to-r from-accent-300/80 to-accent-600/70 border-2 border-transparent shadow-btn dark:shadow-none transition-[box-shadow,border] duration-300 bg-origin-border">
               <button className="flex articles-center gap-5 text-2xl px-5 pr-5 py-2 text-white transition-[color] duration-300 cursor-pointer font-logo pointer-events-none">
                  Read more
               </button>
            </div>
         </div>

         <img
            src={article.image}
            alt={article.title}
            className="rounded-3xl h-[18rem] w-full object-cover opacity-90 dark:opacity-75 border border-primary-200"
         />

         {isEditing ? (
            <button>
               <ImSpinner2 className="size-7 animate-spin absolute top-3 right-3.5 fill-white dark:fill-primary-600/90 z-10" />
            </button>
         ) : (
            <button onClick={handleDelete}>
               <IoRemoveCircle className="absolute top-2.5 right-3 fill-white size-8 drop-shadow-xl opacity-80 hover:opacity-100 transition" />
            </button>
         )}
      </div>
   );
}

export default MainArticle;
