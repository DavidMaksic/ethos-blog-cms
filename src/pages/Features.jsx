import { useFullscreen } from '../context/FullscreenContext';
import { useEffect } from 'react';

import UpdateSettings from '../features/settings/UpdateSettings';
import MainFeatures from '../features/features/MainFeatures';
import TagFeatures from '../features/features/TagFeatures';
import Heading from '../ui/Heading';
import Row from '../ui/Row';

function Features() {
   const { setIsFullscreen } = useFullscreen();
   useEffect(() => setIsFullscreen(false), [setIsFullscreen]);

   return (
      <>
         <Row type="horizontal">
            <Heading type="h1">Main Features</Heading>
         </Row>

         <Row>
            <UpdateSettings>
               <MainFeatures />
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
                  <TagFeatures />
               </UpdateSettings>
            </Row>
         </div>
      </>
   );
}

export default Features;
