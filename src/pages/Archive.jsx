import { useFullscreen } from '../context/FullscreenContext';
import { useEffect } from 'react';

import ArchiveTable from '../features/archive/ArchiveTable';
import ArchiveOps from '../features/archive/ArchiveOps';
import Heading from '../ui/Heading';
import Search from '../ui/Search';
import Row from '../ui/Row';

function Archive() {
   const { setIsFullscreen } = useFullscreen();
   useEffect(() => setIsFullscreen(false), [setIsFullscreen]);

   return (
      <>
         <Row type="horizontal">
            <Heading type="h1">
               <div className="flex items-center gap-5">
                  All articles
                  <Search />
               </div>
            </Heading>
            <ArchiveOps />
         </Row>

         <div className="xl:mb-22">
            <Row>
               <ArchiveTable />
            </Row>
         </div>
      </>
   );
}

export default Archive;
