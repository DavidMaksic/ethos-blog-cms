import { useGetMainFeatureArticles } from './useGetMainFeatureArticles';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { Pagination } from 'swiper/modules';
import { CgMathPlus } from 'react-icons/cg';
import { useState } from 'react';
import { motion } from 'motion/react';

import MainFeatureModal from './MainFeatureModal';
import MainArticle from './MainArticle';
import TagForm from '../../ui/Forms/TagForm';
import Modal from '../../ui/Modal/Modal';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function MainFeatures() {
   const [openModal, setOpenModal] = useState(false);
   // eslint-disable-next-line
   const [searchParams, setSearchParams] = useSearchParams();
   const { isPending, articles, refetch } = useGetMainFeatureArticles();

   refetch();

   return (
      <TagForm>
         <div className="grid grid-cols-[0.5fr_2.3fr] gap-12 items-center pr-16">
            <span className="font-light text-primary-400 text-base uppercase ml-1">
               Choose articles:
            </span>

            {isPending ? (
               <motion.div
                  className="flex h-[22.75rem] bg-primary-100 dark:bg-primary-300/15 animate-skeleton rounded-[2.3rem]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
               />
            ) : articles?.length ? (
               <>
                  <Swiper
                     spaceBetween={100}
                     pagination={{
                        clickable: true,
                        dynamicBullets: true,
                     }}
                     modules={[Pagination]}
                     className="mySwiper size-full"
                  >
                     {articles?.map((item, i) => (
                        <SwiperSlide key={item.id}>
                           <MainArticle
                              article={item}
                              refetch={refetch}
                              index={i}
                           />
                        </SwiperSlide>
                     ))}
                  </Swiper>

                  <CgMathPlus
                     className="absolute right-1 self-center size-11! p-2 border border-primary-300 rounded-full text-primary-400/80! hover:border-accent-300 dark:hover:border-accent-300! hover:text-accent-300! dark:hover:text-accent-300! cursor-pointer transition"
                     onClick={() => setOpenModal((isOpen) => !isOpen)}
                  />
               </>
            ) : (
               <div
                  className="relative flex justify-center h-[22.7rem] w-full border rounded-[2.3rem] group transition px-5 py-5 bg-cover cursor-pointer hover:bg-accent-100/20 dark:hover:bg-transparent border-quaternary hover:border-accent-300 dark:hover:border-accent-400/80"
                  onClick={() => setOpenModal((isOpen) => !isOpen)}
               >
                  <CgMathPlus className="absolute icons self-center size-11! text-primary-400/80! group-hover:text-accent-400! dark:group-hover:text-accent-300/90!" />
               </div>
            )}

            <AnimatePresence>
               {openModal && (
                  <Modal
                     closeModal={() => {
                        setSearchParams('');
                        setOpenModal(false);
                     }}
                     style="w-[64rem]"
                  >
                     <MainFeatureModal
                        onClose={() => {
                           setSearchParams('');
                           setOpenModal(false);
                        }}
                     />
                  </Modal>
               )}
            </AnimatePresence>
         </div>
      </TagForm>
   );
}

export default MainFeatures;
