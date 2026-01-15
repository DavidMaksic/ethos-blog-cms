import { LuPencilLine, LuTableOfContents } from 'react-icons/lu';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { useFullscreen } from '../../context/FullscreenContext';
import { useAuthors } from '../../features/authentication/useAuthors';
import { useScroll } from '../../hooks/useScroll';
import { IoOptions } from 'react-icons/io5';

function Options({ currentAuthor, theAuthor, articleID, editor, children }) {
   const [openMenu, setOpenMenu] = useState(false);
   const ref = useOutsideClick(() => setOpenMenu(false), true);

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
      if (!mounted) return;

      if (editor) {
         // BlockNote editor mode - work with blocks
         const blocks = editor.document;

         const headingBlocks = blocks
            .filter(
               (block) =>
                  block.type === 'heading' &&
                  (block.props.level === 2 || block.props.level === 3)
            )
            .map((block, index) => {
               // Get text content from block
               const text =
                  block.content?.map((c) => c.text || '').join('') || '';

               const slug = text
                  .toLowerCase()
                  .replace(/\s+/g, '-')
                  .replace(/[^\w-]+/g, '');

               const id = `${slug}-${index}`;

               // Store the block ID for scrolling later
               return {
                  id,
                  blockId: block.id,
                  innerText: text,
                  localName: `h${block.props.level}`,
               };
            });

         setHeadings(headingBlocks);

         // Set up listener for block changes to update TOC
         const unsubscribe = editor.onChange(() => {
            const updatedBlocks = editor.document;
            const updatedHeadings = updatedBlocks
               .filter(
                  (block) =>
                     block.type === 'heading' &&
                     (block.props.level === 2 || block.props.level === 3)
               )
               .map((block, index) => {
                  const text =
                     block.content?.map((c) => c.text || '').join('') || '';
                  const slug = text
                     .toLowerCase()
                     .replace(/\s+/g, '-')
                     .replace(/[^\w-]+/g, '');
                  const id = `${slug}-${index}`;

                  return {
                     id,
                     blockId: block.id,
                     innerText: text,
                     localName: `h${block.props.level}`,
                  };
               });

            setHeadings(updatedHeadings);
         });

         return () => unsubscribe();
      } else {
         // Preview mode - work with DOM
         const start = 2;
         const headingElementsRaw = Array.from(
            document.querySelectorAll('h2, h3')
         ).slice(start);

         const headingElements = headingElementsRaw.map((item, index) => {
            const slug = item.innerText
               .toLowerCase()
               .replace(/\s+/g, '-')
               .replace(/[^\w-]+/g, '');

            const id = `${slug}-${index}`;
            item.setAttribute('id', id);

            return {
               id,
               innerText: item.innerText,
               localName: item.localName,
            };
         });

         setHeadings(headingElements);
      }
   }, [mounted, editor]);

   // Intersection observer for both modes
   useEffect(() => {
      if (!headings.length) return;

      const observerOptions = {
         rootMargin: '0px 0px -66% 0px',
         threshold: 0,
      };

      const observer = new IntersectionObserver((entries) => {
         // Find all currently intersecting headings
         const intersectingHeadings = [];

         entries.forEach((entry) => {
            if (entry.isIntersecting) {
               const headingId = editor
                  ? headings.find(
                       (h) => h.blockId === entry.target.getAttribute('data-id')
                    )?.id
                  : entry.target.id;

               if (headingId) {
                  const headingIndex = headings.findIndex(
                     (h) => h.id === headingId
                  );
                  intersectingHeadings.push({
                     id: headingId,
                     index: headingIndex,
                  });
               }
            }
         });

         if (intersectingHeadings.length > 0) {
            // Set the first intersecting heading as active
            intersectingHeadings.sort((a, b) => a.index - b.index);
            setActiveId(intersectingHeadings[0].id);
         } else {
            // No headings intersecting - find the last heading above viewport
            const allHeadingElements = headings
               .map((h) => {
                  const el = editor
                     ? document.querySelector(`[data-id="${h.blockId}"]`)
                     : document.getElementById(h.id);
                  return { heading: h, element: el };
               })
               .filter((item) => item.element);

            const headingsAbove = allHeadingElements.filter((item) => {
               const rect = item.element.getBoundingClientRect();
               return rect.top < window.innerHeight * 0.34; // 34% from top (inverse of -66%)
            });

            if (headingsAbove.length > 0) {
               // Keep the last heading above viewport active
               setActiveId(headingsAbove[headingsAbove.length - 1].heading.id);
            } else {
               // All headings are below viewport - clear active
               setActiveId(null);
            }
         }
      }, observerOptions);

      if (editor) {
         // Observe BlockNote blocks
         headings.forEach((heading) => {
            const element = document.querySelector(
               `[data-id="${heading.blockId}"]`
            );
            if (element) observer.observe(element);
         });
      } else {
         // Observe preview headings
         headings.forEach((heading) => {
            const element = document.getElementById(heading.id);
            if (element) observer.observe(element);
         });
      }

      return () => {
         observer.disconnect();
      };
   }, [headings, editor]);

   const { authors } = useAuthors();
   const isAdmin = authors?.find(
      (item) => item.id === currentAuthor?.id
   )?.is_admin;

   const handleHeadingClick = (e, item) => {
      e.preventDefault();

      if (editor && item.blockId) {
         // BlockNote editor mode - scroll to block
         editor.setTextCursorPosition(item.blockId);

         // Optionally scroll the block into view
         setTimeout(() => {
            const blockEl = document.querySelector(
               `[data-id="${item.blockId}"]`
            );
            if (blockEl) {
               blockEl.scrollIntoView({ behavior: 'smooth' });
            }
         }, 50);
      } else {
         // Preview mode - standard DOM scroll
         document.getElementById(`${item.id}`)?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
         });
      }

      setOpenTable(false);
      setOpenMenu(false);
   };

   return (
      <>
         <div className="absolute top-[-12rem] left-0" ref={topRef} />
         <div className="absolute bottom-0 left-0" ref={bottomRef} />

         <IoOptions
            className="fixed bottom-13 right-20 2xl:right-10 size-16 bg-white dark:bg-transparent hover:bg-white/20 dark:hover:bg-primary-400/10 cursor-pointer border border-quaternary dark:border-primary-300/35 p-3.5 rounded-full shadow-dashboard dark:shadow-none transition"
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
                  className="fixed bottom-32 right-20 2xl:right-10 flex flex-col items-center bg-white dark:bg-transparent border border-quaternary dark:border-primary-300/35 rounded-3xl [&_svg]:cursor-pointer px-1 shadow-dashboard dark:shadow-none"
                  ref={ref}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 3 }}
                  transition={{ duration: 0.12 }}
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

                  {headings.length ? (
                     <LuTableOfContents
                        className={`py-1 px-3.5 size-13.5 hover:bg-primary-100/80 dark:hover:bg-primary-400/10 transition rounded-2xl ${
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
                           className="absolute bottom-0 font-text max-h-[32.5rem] right-[4.95rem] flex flex-col py-4 pb-2 px-2 border border-primary-300/50 dark:border-primary-300/35 rounded-2xl bg-white dark:bg-transparent backdrop-blur-3xl overflow-y-auto scrollbar shadow-dashboard dark:shadow-none"
                           ref={tableRef}
                           initial={{ opacity: 0, x: 3 }}
                           animate={{ opacity: 1, x: 0 }}
                           exit={{ opacity: 0, x: 3 }}
                           transition={{ duration: 0.12 }}
                        >
                           <span className="pb-3 mb-2 mx-6 border-b text-xl font-normal border-b-primary-400/25 text-primary-400 select-none">
                              Table of contents
                           </span>

                           {headings.map((item) => (
                              <a
                                 className={`w-[19rem] py-2 md:py-2.5 hover:text-accent! transition duration-75 px-6 mb-[3px] hover:bg-primary-300/10 dark:hover:bg-primary-300/8 leading-6.5 rounded-xl font-normal text-xl ${
                                    item.localName === 'h2' &&
                                    'text-primary-600 dark:text-slate-300/80'
                                 } ${
                                    item.localName === 'h3' &&
                                    'pl-12 text-primary-500/90 dark:text-primary-500/80'
                                 } ${item.localName} ${
                                    item.id === activeId &&
                                    'text-accent! bg-primary-300/10 dark:bg-primary-300/8'
                                 }`}
                                 href={editor ? '#' : `#${item.id}`}
                                 key={
                                    item.id ||
                                    `${item.localName}-${Math.random()}`
                                 }
                                 onClick={(e) => handleHeadingClick(e, item)}
                              >
                                 {item.innerText}
                              </a>
                           ))}
                        </motion.div>
                     )}
                  </AnimatePresence>

                  <FiChevronDown
                     className="py-3 size-13.5 stroke-[1.8px] hover:bg-primary-100/80 dark:hover:bg-primary-400/10 rounded-b-[20px] mb-1 mt-0.5 rounded-2xl transition order-1"
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
