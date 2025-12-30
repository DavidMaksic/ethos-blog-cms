import { LuPencilLine, LuTableOfContents } from 'react-icons/lu';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { useFullscreen } from '../../context/FullscreenContext';
import { useAuthors } from '../../features/authentication/useAuthors';
import { useScroll } from '../../hooks/useScroll';
import { IoOptions } from 'react-icons/io5';

function Options({
   currentAuthor,
   theAuthor,
   articleID,
   isEdit = false,
   children,
}) {
   const [openMenu, setOpenMenu] = useState(false);
   const ref = useOutsideClick(() => setOpenMenu(false), false);

   const [mounted, setMounted] = useState(false);
   useEffect(() => setMounted(true), []);

   const [openTable, setOpenTable] = useState(false);
   const tableRef = useOutsideClick(() => setOpenTable(false), false);

   // - Scroll logic
   const { setScroll: setTopScroll, ref: topRef } = useScroll();
   const { setScroll: setBottomScroll, ref: bottomRef } = useScroll();

   const [headings, setHeadings] = useState([]);
   const [activeId, setActiveId] = useState();

   const location = useLocation();
   const isEditPage = location.pathname.includes('/edit');
   const isCreatorPage = location.pathname.includes('/new-post');

   const { setIsFullscreen } = useFullscreen();
   useEffect(() => setIsFullscreen(false), [setIsFullscreen]);

   useEffect(() => {
      if (mounted || location) {
         setTimeout(() => {
            const headingElementsRaw = Array.from(
               document.querySelectorAll('h1, h2, h3')
            );

            const headingElements = headingElementsRaw.map((item, i) => {
               item.id = i;
               return item;
            });

            const finalHeadings = headingElements.slice(2);

            setHeadings(finalHeadings);
         }, 500);
      }
   }, [mounted, location]);

   useIntersectionObserver(setActiveId, activeId);

   const { authors } = useAuthors();
   const isAdmin = authors?.find(
      (item) => item.id === currentAuthor?.id
   ).is_admin;

   return (
      <>
         <div className="absolute top-[-12rem] left-0" ref={topRef} />
         <div className="absolute bottom-0 left-0" ref={bottomRef} />

         <IoOptions
            className="fixed bottom-13 right-24 2xl:right-10 size-16 bg-white dark:bg-transparent hover:bg-white/20 dark:hover:bg-primary-400/10 cursor-pointer border border-quaternary dark:border-primary-300/35 p-3.5 rounded-full shadow-dashboard dark:shadow-none transition"
            onClick={(e) => {
               e.stopPropagation();
               setOpenMenu((isOpen) => {
                  if (isOpen) setOpenTable(false);
                  return !isOpen;
               });
            }}
         />

         <AnimatePresence>
            {openMenu && (
               <motion.ul
                  className="fixed bottom-32 right-24 2xl:right-10 flex flex-col items-center bg-white dark:bg-transparent border border-quaternary dark:border-primary-300/35 rounded-3xl transition [&_svg]:cursor-pointer px-1 shadow-dashboard dark:shadow-none"
                  ref={ref}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.05 }}
               >
                  <FiChevronUp
                     className="py-3 size-13.5 stroke-[1.8px] hover:bg-primary-100/80 dark:hover:bg-primary-400/10 rounded-t-[20px] mt-1 rounded-2xl transition"
                     onClick={() => {
                        setTopScroll(true);
                        setOpenTable(false);
                        setOpenMenu(false);
                     }}
                  />

                  {children}

                  {headings.length && !isEdit ? (
                     <LuTableOfContents
                        className={`py-1 px-3.5 size-13.5 hover:bg-primary-100/80 dark:hover:bg-primary-400/10 transition rounded-2xl  ${
                           currentAuthor?.email !== theAuthor?.email &&
                           'mb-1 mt-0.5'
                        }`}
                        onClick={(e) => {
                           e.stopPropagation();
                           setOpenTable((isOpen) => !isOpen);
                        }}
                     />
                  ) : null}

                  {(currentAuthor?.email === theAuthor?.email && articleID) ||
                  (isAdmin && !isEditPage && !isCreatorPage) ? (
                     <Link to={`/archive/edit/:${articleID}`}>
                        <LuPencilLine className="py-4 mt-1 size-13.5 hover:bg-primary-100/80 dark:hover:bg-primary-400/10 stroke-[1.7px] rounded-2xl transition" />
                     </Link>
                  ) : null}

                  <AnimatePresence>
                     {openTable && (
                        <motion.div
                           className="absolute bottom-0 font-text max-h-[32.5rem] left-[-21.5rem] flex flex-col py-4 pb-2 px-2 border border-primary-300/50 dark:border-tertiary rounded-2xl bg-white dark:bg-transparent backdrop-blur-3xl overflow-y-auto scrollbar shadow-dashboard dark:shadow-none"
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           exit={{ opacity: 0 }}
                           transition={{ duration: 0.05 }}
                           ref={tableRef}
                        >
                           <span className="pb-3 mb-2 mx-6 border-b border-b-primary-400/25 text-primary-400 select-none">
                              Table of contents
                           </span>

                           {headings.map((item) => (
                              <a
                                 className={`w-[19rem] leading-6 py-[8px]  hover:text-accent! transition duration-75 px-6 mb-[5px] hover:bg-primary-300/10 dark:hover:bg-primary-300/8 rounded-xl ${
                                    item.localName === 'h3' &&
                                    'font-normal! pl-12 text-primary-500/90 dark:text-primary-500/80'
                                 } ${item.localName} ${
                                    item.id === activeId &&
                                    'text-accent! bg-primary-300/10 dark:bg-primary-300/8'
                                 }`}
                                 href={`#${item.id}`}
                                 key={item.id}
                                 onClick={(e) => {
                                    e.preventDefault();
                                    document
                                       .getElementById(`${item.id}`)
                                       .scrollIntoView({
                                          behavior: 'smooth',
                                       });

                                    setOpenTable(false);
                                    setOpenMenu(false);
                                 }}
                              >
                                 {item.innerText}
                              </a>
                           ))}
                        </motion.div>
                     )}
                  </AnimatePresence>

                  <FiChevronDown
                     className="py-3 size-13.5 stroke-[1.8px] hover:bg-primary-100/80 dark:hover:bg-primary-400/10 rounded-b-[20px] mb-1 mt-0.5 rounded-2xl transition"
                     onClick={() => {
                        setBottomScroll(true);
                        setOpenTable(false);
                        setOpenMenu(false);
                     }}
                  />
               </motion.ul>
            )}
         </AnimatePresence>
      </>
   );
}

export default Options;
