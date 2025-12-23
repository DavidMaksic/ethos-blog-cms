import { Link, useNavigate } from 'react-router-dom';
import { useDeleteArticle } from './useDeleteArticle';
import { useCurrentAuthor } from '../authentication/useCurrentAuthor';
import { AnimatePresence } from 'motion/react';
import { PiArticleMedium } from 'react-icons/pi';
import { LuPencilLine } from 'react-icons/lu';
import { useAuthors } from '../authentication/useAuthors';
import { useState } from 'react';
import { CgClose } from 'react-icons/cg';
import { motion } from 'motion/react';
import { format } from 'date-fns';

import DeleteModal from '../../ui/DeleteModal';
import Menus from '../../ui/Menus';
import Modal from '../../ui/Modal';

function ArchiveRow({ article }) {
   const navigate = useNavigate();
   const { id, created_at, image, title, status } = article;

   const { authors } = useAuthors();
   const { user: currentAuthor } = useCurrentAuthor();
   const isAdmin = authors?.find(
      (item) => item.id === currentAuthor?.id
   )?.is_admin;

   const { isDeleting, deleteArticle } = useDeleteArticle();
   const [openDelete, setOpenDelete] = useState(false);

   const author = article?.authors;

   const draftedColor =
      'bg-blue-400/15 text-blue-900/75 dark:bg-blue-400/50 dark:text-blue-100';
   const publishedColor =
      'bg-green-100 text-green-900/75 dark:bg-green-300/50 dark:text-green-100';

   const draftedBorder = 'border-blue-800/5';
   const publishedBorder = 'border-green-800/5';

   return (
      <motion.div
         className="grid-table bg-white dark:bg-primary-200 odd:bg-primary-50 dark:odd:bg-primary-100 transition-bg last:rounded-b-2xl last:[&_img]:rounded-bl-2xl"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.3 }}
      >
         <img
            className="w-full 2k:h-28 h-24 2xl:h-23 xl:h-30 object-cover opacity-90 dark:opacity-75"
            src={image}
            alt={title}
         />

         <Link
            className="font-article font-semibold text-xl underlined-text"
            to={`${id}`}
         >
            {title.length > 48 ? `${title.slice(0, 49)}...` : title}
         </Link>

         <span>{format(new Date(created_at), 'MMM dd, yyyy')}</span>

         <span
            className={`${
               status === 'drafted' ? draftedColor : publishedColor
            } uppercase text-sm font-medium w-min px-3.5 pt-2 pb-1.5 2xl:py-1.5 xl:pt-1.5 xl:pb-2 rounded-full transition-200 border ${
               status === 'drafted' ? draftedBorder : publishedBorder
            }`}
         >
            {status}
         </span>

         <span className="italic text-primary-400">{author?.full_name}</span>

         {currentAuthor?.email === author?.email || isAdmin ? (
            <Menus.Menu>
               <Menus.Toggle id={id} />

               <Menus.List id={id}>
                  <Menus.Button
                     icon={<PiArticleMedium />}
                     handler={() => navigate(`${id}`)}
                  >
                     Preview
                  </Menus.Button>
                  <Menus.Button
                     icon={<LuPencilLine className="stroke-[1.7px]" />}
                     handler={() => navigate(`/archive/edit/:${id}`)}
                  >
                     Edit
                  </Menus.Button>
                  <Menus.Button
                     icon={
                        <CgClose className="text-red-600/70 dark:text-red-300" />
                     }
                     handler={() => setOpenDelete(true)}
                  >
                     <span className="">Delete</span>
                  </Menus.Button>
               </Menus.List>
            </Menus.Menu>
         ) : null}

         <AnimatePresence>
            {openDelete && (
               <Modal style="w-[32%]" closeModal={() => setOpenDelete(false)}>
                  <DeleteModal
                     isDeleting={isDeleting}
                     onClose={() => setOpenDelete(false)}
                     onDelete={() => deleteArticle(article)}
                  />
               </Modal>
            )}
         </AnimatePresence>
      </motion.div>
   );
}

export default ArchiveRow;
