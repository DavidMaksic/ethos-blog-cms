import { useCurrentAuthor } from './useCurrentAuthor';
import { useAuthors } from './useAuthors';
import { motion } from 'motion/react';

import AuthorSkeleton from '../../ui/Skeletons/AuthorSkeleton';
import Author from './Author';

function AuthorList() {
   const { user } = useCurrentAuthor();
   const { isPending, authors } = useAuthors();
   const theAuthor = authors?.find((item) => item.id === user.id);

   if (isPending) return <AuthorSkeleton />;

   return (
      <motion.ul
         className="grid grid-cols-2 gap-6 mb-14"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.3 }}
      >
         <Author author={theAuthor} />
         {authors
            .map((item) => (
               <Author author={item} key={item.id} activeUser={user} />
            ))
            .reverse()}
      </motion.ul>
   );
}
export default AuthorList;
