import { useGetCategories } from '../tags/useGetCategories';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useEntry } from '../../context/EntryContext';
import { useEffect } from 'react';

import Categories from '../../ui/Categories';
import EmptyEntry from './EmptyEntry';
import TagEntry from './TagEntry';
import TagForm from '../../ui/Forms/TagForm';

function TagFeatures() {
   const { categories } = useGetCategories();
   const [localTag, setLocalTag] = useLocalStorage(
      {
         category: 'History',
      },
      'featureTag'
   );

   const { setContextTag, taggedArticles } = useEntry();

   useEffect(() => {
      setContextTag(localTag);
   }, [localTag, setContextTag]);

   const currentTag = categories?.find(
      (item) => item.category === localTag.category
   );

   return (
      <TagForm>
         <div className="flex flex-col items-center [&_label]:text-primary-400 [&_label]:font-extralight [&_label]:text-base [&_label]:uppercase">
            <section className="flex items-center self-start">
               <div className="flex flex-col gap-3 w-60 xl:w-54 self-start">
                  <label className="ml-1">Select tag</label>
                  <div className="font-creator">
                     <Categories
                        setLocalItem={setLocalTag}
                        localItem={localTag}
                     >
                        {!localTag.category
                           ? categories?.at(0).category
                           : localTag.category}
                     </Categories>
                  </div>
               </div>

               <ul className="flex gap-6">
                  {taggedArticles?.map((item) => (
                     <TagEntry
                        article={item}
                        currentTag={currentTag}
                        key={item.id}
                     />
                  ))}

                  {taggedArticles?.length === 0 && (
                     <>
                        <EmptyEntry currentTag={currentTag} />
                        <EmptyEntry currentTag={currentTag} />
                        <EmptyEntry currentTag={currentTag} />
                     </>
                  )}

                  {taggedArticles?.length === 1 && (
                     <>
                        <EmptyEntry currentTag={currentTag} />
                        <EmptyEntry currentTag={currentTag} />
                     </>
                  )}

                  {taggedArticles?.length === 2 && (
                     <EmptyEntry currentTag={currentTag} />
                  )}
               </ul>
            </section>
         </div>
      </TagForm>
   );
}

export default TagFeatures;
