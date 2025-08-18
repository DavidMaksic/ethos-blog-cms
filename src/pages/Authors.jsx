import { HiOutlineUserPlus } from 'react-icons/hi2';
import { useCurrentAuthor } from '../features/authentication/useCurrentAuthor';
import { useFullscreen } from '../context/FullscreenContext';
import { useAuthors } from '../features/authentication/useAuthors';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import AuthorList from '../features/authentication/AuthorList';
import Heading from '../ui/Heading';
import Row from '../ui/Row';

function Authors() {
   const { setIsFullscreen } = useFullscreen();
   useEffect(() => setIsFullscreen(false), [setIsFullscreen]);

   const { user } = useCurrentAuthor();
   const { authors } = useAuthors();
   const currentAuthor = authors?.find((item) => item.id === user.id);

   return (
      <>
         <Row type="horizontal">
            <div className="flex gap-5 items-center">
               <Heading type="h1">Authors</Heading>
               <span
                  className={`text-primary-400 ${
                     !currentAuthor?.is_admin && 'hidden'
                  }`}
               >
                  |
               </span>
               <Link
                  to="/authors/author-creator"
                  className={`flex gap-2 items-center cursor-pointer  border-b-[2px] border-b-transparent hover:border-b-[#b0b5bf] dark:hover:border-b-primary-400 text-primary-400 transition duration-75 ${
                     !currentAuthor?.is_admin && 'hidden'
                  }`}
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
