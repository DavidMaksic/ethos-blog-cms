import { useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { CgMathPlus } from 'react-icons/cg';
import { useState } from 'react';

import TagFeatureModal from './TagFeatureModal';
import Modal from '../../ui/Modal/Modal';

function EmptyEntry({ currentTag }) {
   const [openModal, setOpenModal] = useState(false);
   // eslint-disable-next-line
   const [searchParams, setSearchParams] = useSearchParams();

   return (
      <>
         <li
            className="relative flex justify-center h-[24rem] 2xl:h-[23rem] xl:h-[22rem] w-[19rem] 2xl:w-[17rem] xl:w-[16rem] border rounded-3xl group transition px-5 py-5 bg-cover cursor-pointer hover:bg-accent-100/10 dark:hover:bg-primary-200 border-quaternary hover:border-accent-300 dark:hover:border-accent-400/80"
            onClick={() => setOpenModal((isOpen) => !isOpen)}
         >
            <CgMathPlus className="icons self-center size-11! text-primary-400/80! group-hover:text-accent-300! dark:group-hover:text-accent-400/80!" />
         </li>

         <AnimatePresence>
            {openModal && (
               <Modal
                  style="w-[64rem]"
                  closeModal={() => {
                     setSearchParams('');
                     setOpenModal(false);
                  }}
               >
                  <TagFeatureModal
                     currentTag={currentTag}
                     onClose={() => {
                        setSearchParams('');
                        setOpenModal(false);
                     }}
                  />
               </Modal>
            )}
         </AnimatePresence>
      </>
   );
}

export default EmptyEntry;
