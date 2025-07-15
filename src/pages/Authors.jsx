import { HiOutlineUserPlus } from 'react-icons/hi2';
import { useFullscreen } from '../context/FullscreenContext';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import AuthorList from '../features/authentication/AuthorList';
import Heading from '../ui/Heading';
import Row from '../ui/Row';

function Authors() {
   const { setIsFullscreen } = useFullscreen();
   useEffect(() => setIsFullscreen(false), [setIsFullscreen]);

   return (
      <>
         <Row type="horizontal">
            <div className="flex gap-5 items-center">
               <Heading type="h1">Authors</Heading>
               <span className="text-primary-400">|</span>
               <Link
                  to="/authors/author-creator"
                  className="flex gap-2 items-center cursor-pointer  border-b-[2px] border-b-transparent hover:border-b-[#b0b5bf] dark:hover:border-b-[#8593a6] text-primary-400 transition duration-75"
               >
                  <span className="font-normal">create</span>
                  <HiOutlineUserPlus className="size-6 stroke-[1.7px]" />
               </Link>
            </div>
         </Row>

         <Row>
            <AuthorList />
         </Row>
      </>
   );
}

export default Authors;
