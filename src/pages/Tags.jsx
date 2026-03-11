import { useGetCategories } from '../features/tags/useGetCategories';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useFullscreen } from '../context/FullscreenContext';
import { useEffect } from 'react';

import UpdateSettings from '../features/settings/UpdateSettings';
import CategoryCreate from '../ui/Forms/CategoryCreate';
import CategoryUpdate from '../ui/Forms/CategoryUpdate';
import LangFilter from '../ui/Operations/LangFilter';
import Heading from '../ui/Heading';
import Row from '../ui/Row';

function Tags() {
   const { setIsFullscreen } = useFullscreen();
   useEffect(() => setIsFullscreen(false), [setIsFullscreen]);

   const { categories } = useGetCategories();
   const [localTag, setLocalTag] = useLocalStorage(
      { category: 'History', code: 'en' },
      'updateTag',
   );

   return (
      <>
         <div className="self-start flex flex-col space-y-4">
            <Row type="horizontal">
               <Heading type="h1">Tag creator</Heading>
               <LangFilter
                  localItem={localTag}
                  setLocalItem={setLocalTag}
                  categories={categories}
               />
            </Row>

            <Row>
               <UpdateSettings>
                  <CategoryCreate localTag={localTag} categories={categories} />
               </UpdateSettings>
            </Row>
         </div>

         <div className="mt-10">
            <Row type="horizontal">
               <Heading type="h1">Edit tag</Heading>
            </Row>
         </div>

         <div className="mb-40 2xl:mb-96 xl:mb-150">
            <Row>
               <UpdateSettings>
                  <CategoryUpdate
                     localTag={localTag}
                     setLocalTag={setLocalTag}
                     categories={categories}
                  />
               </UpdateSettings>
            </Row>
         </div>
      </>
   );
}

export default Tags;
