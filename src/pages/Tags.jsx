import { useFullscreen } from '../context/FullscreenContext';
import { useEffect } from 'react';

import UpdateSettings from '../features/settings/UpdateSettings';
import CategoryCreate from '../ui/Form/CategoryCreate';
import CategoryUpdate from '../ui/Form/CategoryUpdate';
import Heading from '../ui/Heading';
import Row from '../ui/Row';

function Tags() {
   const { setIsFullscreen } = useFullscreen();
   useEffect(() => setIsFullscreen(false), [setIsFullscreen]);

   return (
      <>
         <Row type="horizontal">
            <Heading type="h1">Tag creator</Heading>
         </Row>

         <Row>
            <UpdateSettings>
               <CategoryCreate />
            </UpdateSettings>
         </Row>

         <div className="mt-10">
            <Row type="horizontal">
               <Heading type="h1">Edit tag</Heading>
            </Row>
         </div>

         <div className="2k:mb-105 mb-40 2xl:mb-96 xl:mb-150">
            <Row>
               <UpdateSettings>
                  <CategoryUpdate />
               </UpdateSettings>
            </Row>
         </div>
      </>
   );
}

export default Tags;
