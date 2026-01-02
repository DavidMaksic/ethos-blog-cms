import {
   AiFillCloseCircle,
   AiOutlineFullscreen,
   AiOutlineFullscreenExit,
} from 'react-icons/ai';
import { LuPencilLine, LuSunMedium } from 'react-icons/lu';
import { AnimatePresence, motion } from 'motion/react';
import { HiOutlineUserCircle } from 'react-icons/hi2';
import { useEffect, useState } from 'react';
import { useDeleteArticle } from '../features/archive/useDeleteArticle';
import { useCurrentAuthor } from '../features/authentication/useCurrentAuthor';
import { useFindArticle } from '../features/archive/useFindArticle';
import { useFullscreen } from '../context/FullscreenContext';
import { IoMoonOutline } from 'react-icons/io5';
import { useDarkMode } from '../context/DarkModeContext';
import { useAuthors } from '../features/authentication/useAuthors';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

import ArticleNotFound from '../ui/ArticleNotFound';
import ArticleSkeleton from '../ui/Skeletons/ArticleSkeleton';
import DeleteModal from '../ui/Modal/DeleteModal';
import BackButton from '../ui/Buttons/BackButton';
import Options from '../ui/Operations/Options';
import Modal from '../ui/Modal/Modal';

function Article() {
   const { isDeleting, isSuccess, deleteArticle } = useDeleteArticle();
   const [openDelete, setOpenDelete] = useState(false);

   // - Fullscreen
   const { setLocalFullscreen, isFullscreen, setIsFullscreen } =
      useFullscreen();

   // - Data fetching
   const { article, isPending } = useFindArticle();
   const { user: currentAuthor } = useCurrentAuthor();

   // - Two effects for sync
   useEffect(() => {
      if (!isPending && article) {
         setLocalFullscreen(true);
         setIsFullscreen(true);
      }
   }, [isPending]); // eslint-disable-line

   useEffect(() => {
      document.documentElement.setAttribute('data-lang', article?.code);
   }, [article]);

   // - Other data
   const category = article?.categories;
   const author = article?.authors;
   const date = format(new Date(article.created_at), 'MMM dd, yyyy');

   const { authors } = useAuthors();
   const isAdmin = authors?.find(
      (item) => item.id === currentAuthor?.id
   )?.is_admin;

   // - Dark mode logic
   const { isDarkMode, toggleDarkMode } = useDarkMode();
   const [bgColor, setBgColor] = useState('');
   const [textColor, setTextColor] = useState('');

   useEffect(() => {
      if (!category) return;
      if (isDarkMode) {
         setBgColor(category.bg_dark);
         setTextColor(category.text_dark);
      } else {
         setBgColor(category.bg_light);
         setTextColor(category.text_light);
      }
   }, [isDarkMode, category]);

   // - Loading and no data returns
   if (isPending) return <ArticleSkeleton />;
   if (!article)
      return (
         <ArticleNotFound to="/archive" prompt="Go back">
            Article you are looking for does not exist!
         </ArticleNotFound>
      );

   return (
      <motion.article
         className="relative max-w-5xl self-center font-article flex flex-col gap-6 py-4 px-24 pb-32 transition-200"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.3 }}
      >
         <div className="flex flex-col gap-2 text-center">
            <h2 className="relative styled_text font-medium text-6xl pb-2 bg-gradient-to-r from-gray-600 to-gray-500/90 dark:from-slate-300/90 dark:to-slate-300/70">
               {article.title}
            </h2>
            <h3 className="font-creator font-medium! text-2xl w-5/6 text-primary-500/85 dark:text-primary-500/80 self-center">
               {article.description}
            </h3>
         </div>

         <div className="flex flex-col border bg-white/50 dark:bg-primary-300/5 border-primary-300/70 dark:border-primary-300/15 rounded-3xl mt-3 shadow-dashboard dark:shadow-menu-dark transition-bg_border">
            <img
               className="rounded-3xl h-[24rem] object-cover opacity-95 dark:opacity-75"
               src={article.image}
               alt={article.title}
            />

            <div className="flex items-center justify-between gap-6 px-6 py-4">
               <div className="flex gap-4 items-center">
                  {author?.profile_image ? (
                     <img
                        className="block size-12 aspect-square object-cover object-center rounded-[50%] dark:opacity-90"
                        src={author.profile_image}
                        alt="Author profile image"
                     />
                  ) : (
                     <HiOutlineUserCircle className="size-12 stroke-[0.5px] text-primary-400 dark:text-primary-300" />
                  )}

                  <div className="font-text flex flex-col font-medium leading-6 self-center sm:gap-1">
                     <div className="space-x-1.5">
                        <span>By</span>
                        <span className="text-accent-500 dark:text-accent-200/90 font-semibold 2xl:text-[1.2rem] md:text-[1.3rem]">
                           {author?.full_name}
                        </span>
                     </div>

                     <span className="text-base 2xl:text-sm md:text-base md:mt-[-2px] sm:mt-[-3px] text-primary-400">
                        {date}
                     </span>
                  </div>
               </div>

               <span className="flex items-center gap-6">
                  <BackButton
                     setIsFullscreen={setIsFullscreen}
                     setLocalFullscreen={setLocalFullscreen}
                  />

                  <div
                     className={`text-primary-300 text-2xl pointer-events-none ${
                        currentAuthor?.email !== author?.email && !isAdmin
                           ? 'hidden'
                           : ''
                     }`}
                  >
                     |
                  </div>

                  {currentAuthor?.email === author?.email || isAdmin ? (
                     <div className="flex items-center gap-2.5">
                        <Link to={`/archive/edit/:${article.id}`}>
                           <LuPencilLine className="size-11 p-2.5 stroke-[1.6px] hover:bg-primary-200/30 dark:hover:bg-primary-300/30 text-primary-400 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-500 cursor-pointer rounded-xl transition-200" />
                        </Link>

                        <AiFillCloseCircle
                           className="size-11 p-2.5 hover:bg-red-200/20 dark:hover:bg-red-300/20 text-[#f98d8d]/80 hover:text-[#f98d8d] dark:text-red-300/70 dark:hover:text-red-300 rounded-xl transition-200 cursor-pointer"
                           onClick={() => setOpenDelete((isOpen) => !isOpen)}
                        />
                     </div>
                  ) : null}

                  <div
                     className={`text-primary-300 text-2xl pointer-events-none `}
                  >
                     |
                  </div>

                  <span
                     className="w-min px-4 py-1 rounded-full font-bold text-[1.3rem]"
                     style={{
                        backgroundColor: `${bgColor}`,
                        color: `${textColor}`,
                     }}
                  >
                     {category?.category}
                  </span>
               </span>
            </div>
         </div>

         <div
            className={`text-text my-3 [&_:is(h1,h2,h3)]:font-text [&_h1]:leading-[1.25]! [&_h2]:leading-[1.3]! [&_h3]:leading-[1.4]! ${
               article.code === 'en'
                  ? `font-latin text-2xl 2xl:text-[1.5rem] [&_p]:leading-[1.55]! [&_blockquote>*]:font-creator [&_blockquote>*]:font-semibold [&_blockquote>*]:text-[1.65rem] 2xl:[&_blockquote>*]:text-[1.6rem] [&_blockquote>*]:leading-[1.3]`
                  : `font-cyrillic text-[1.4rem] [&_p]:leading-[1.6]! [&_blockquote>*]:font-cyrillic [&_blockquote>*]:font-normal [&_blockquote]:text-[1.51rem] [&_blockquote>*]:leading-[1.3]!`
            }`}
            dangerouslySetInnerHTML={{ __html: article.content }}
         />

         <div className="w-fit flex flex-col items-center self-center gap-4 bg-secondary dark:bg-primary-300/13 rounded-3xl px-12 py-12 pb-14 mt-6 text-3xl box-shadow transition-bg_border">
            {author?.profile_image ? (
               <img
                  className="block size-28 aspect-square object-cover object-center rounded-full dark:opacity-90"
                  src={author.profile_image}
                  alt="User profile image"
               />
            ) : (
               <HiOutlineUserCircle className="size-28 stroke-[0.5px] text-primary-400/70 dark:text-primary-300" />
            )}

            <div className="flex flex-col gap-6 self-center text-center">
               <div className="flex flex-col">
                  <span className="font-logo text-accent-400 dark:text-accent text-[2.5rem] w-fit self-center">
                     {author?.full_name || article.author}
                  </span>
                  <span className="text-xl text-primary-400">{date}</span>
               </div>

               <p className="text-[1.35rem] leading-7.5 px-24 font-text opacity-90">
                  {article.code === 'en'
                     ? author?.description_en
                        ? author?.description_en
                        : 'Is an author writing for Ethos blog.'
                     : author?.description_srb
                     ? author?.description_srb
                     : 'Је аутор који пише за Етос блог.'}
               </p>
            </div>
         </div>

         <Options
            currentAuthor={currentAuthor}
            author={author}
            articleID={article.id}
         >
            <button
               className="hover:bg-primary-100/80 dark:hover:bg-primary-400/10 my-0.5 rounded-2xl transition"
               onClick={(e) => {
                  e.stopPropagation();
                  setLocalFullscreen((isOpen) => !isOpen);
                  setIsFullscreen((isOpen) => !isOpen);
               }}
            >
               {!isFullscreen ? (
                  <AiOutlineFullscreen className="py-1 px-3.5 size-13.5" />
               ) : (
                  <AiOutlineFullscreenExit className="py-1 px-3.5 size-13.5" />
               )}
            </button>

            <button
               className="hover:bg-primary-100/80 dark:hover:bg-primary-400/10 transition-bg mt-0.5 rounded-2xl"
               onClick={(e) => {
                  e.stopPropagation();
                  toggleDarkMode((isOpen) => !isOpen);
               }}
            >
               {isDarkMode ? (
                  <IoMoonOutline className="py-1 px-3.5 size-13.5" />
               ) : (
                  <LuSunMedium className="py-1 px-3.5 size-13.5" />
               )}
            </button>
         </Options>

         <AnimatePresence>
            {openDelete && (
               <Modal style="w-[28%]" closeModal={() => setOpenDelete(false)}>
                  <DeleteModal
                     returnPage={true}
                     isDeleting={isDeleting}
                     isSuccess={isSuccess}
                     onClose={() => setOpenDelete(false)}
                     onDelete={() => {
                        setLocalFullscreen(false);
                        setIsFullscreen(false);
                        deleteArticle(article);
                     }}
                  />
               </Modal>
            )}
         </AnimatePresence>
      </motion.article>
   );
}

export default Article;
