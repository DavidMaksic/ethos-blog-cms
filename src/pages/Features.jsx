import { useLocalStorage } from '../hooks/useLocalStorage';
import { useFullscreen } from '../context/FullscreenContext';
import { useEffect } from 'react';

import UpdateSettings from '../features/settings/UpdateSettings';
import MainFeatures from '../features/features/MainFeatures';
import TagFeatures from '../features/features/TagFeatures';
import LangFilter from '../ui/Operations/LangFilter';
import Heading from '../ui/Heading';
import Row from '../ui/Row';

function Features() {
   const { setIsFullscreen } = useFullscreen();
   useEffect(() => setIsFullscreen(false), [setIsFullscreen]);

   const [localFilter, setLocalFilter] = useLocalStorage(
      { code: 'en' },
      'featureFilter',
   );

   return (
      <>
         <Row type="horizontal">
            <Heading type="h1">Main Features</Heading>
            <LangFilter localItem={localFilter} setLocalItem={setLocalFilter} />
         </Row>

         <Row>
            <UpdateSettings>
               <MainFeatures code={localFilter.code} />
            </UpdateSettings>
         </Row>

         <div className="mt-10">
            <Row type="horizontal">
               <Heading type="h1">Tag Features</Heading>
            </Row>
         </div>

         <div className="mb-34 2xl:mb-96 xl:mb-150">
            <Row>
               <UpdateSettings>
                  <TagFeatures code={localFilter.code} />
               </UpdateSettings>
            </Row>
         </div>
      </>
   );
}

export default Features;
