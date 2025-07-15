import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { FaCaretDown } from 'react-icons/fa';
import { GiCheckMark } from 'react-icons/gi';

function FormStatus({
   currentStatus,
   children,
   setCurrentStatus,
   setIsDefault,
   isDefault,
   article,
}) {
   const [open, setOpen] = useState(false);
   const ref = useOutsideClick(() => setOpen((isOpen) => !isOpen), false);
   const statusOptions = ['Published', 'Drafted'];

   const articleStatus =
      article.status.charAt(0).toUpperCase() + article.status.slice(1);
   const [status, setStatus] = useState(articleStatus);

   useEffect(() => {
      if (isDefault) {
         setStatus(articleStatus);
         setIsDefault?.(false);
      }
   }, [isDefault, articleStatus, status, setIsDefault]);

   return (
      <div className="flex justify-center items-center gap-12 select-none">
         <div className="relative w-max pr-10 border-r border-r-primary-300">
            <div
               className="flex items-center text-4xl cursor-pointer rounded-full bg-white dark:bg-primary-200 border-2 border-primary-300 hover:border-primary-400 transition-200 font-logo dark:shadow-none group"
               onClick={(e) => {
                  e.stopPropagation();
                  setOpen((isOpen) => !isOpen);
               }}
            >
               <p className="absolute left-[-88px] font-creator uppercase text-xl text-primary-400">
                  Status
               </p>
               <span className="py-3 w-38 pb-2 pl-7 mr-16 text-primary-400 group-hover:text-primary-500 transition-200">
                  {currentStatus}
               </span>
               <FaCaretDown className="absolute top-5.5 right-14 text-primary-400 text-xl group-hover:text-primary-500 transition-200" />
            </div>

            <AnimatePresence>
               {open && (
                  <motion.ul
                     className="absolute bottom-18 z-10 right-10 text-2xl rounded-3xl bg-white dark:bg-primary-300/10 backdrop-blur-3xl border border-quaternary dark:border-tertiary shadow-lg overflow-auto cursor-pointer transition-bg_border [&>*:first-child]:border-b [&>*:first-child]:border-b-primary-200 [&>*:first-child]:dark:border-b-primary-200/80 [&>*:last-child]:pb-6"
                     ref={ref}
                     onClick={() => setOpen((isOpen) => !isOpen)}
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     transition={{ duration: 0.06 }}
                  >
                     {statusOptions.map((item) => (
                        <li
                           key={item}
                           value={item}
                           className="relative pl-6 w-[25rem] pr-12 pt-6 pb-4 hover:bg-primary-50 dark:hover:bg-primary-300/10 group transition duration-100"
                           onClick={() => {
                              setCurrentStatus(item);
                              setStatus(item);
                           }}
                        >
                           <span className="font-normal font-logo text-3xl bg-primary-100 dark:bg-primary-500/20 px-4 pr-4.5 pt-0.5 rounded-3xl group-hover:bg-primary-200 dark:group-hover:bg-primary-500/30 transition duration-100">
                              {item}
                           </span>

                           {item === 'Published' ? (
                              <p className="text-primary-400 text-xl mt-2 ml-0.5 leading-6.5">
                                 This article can be viewed by anyone on the
                                 main page of the blog.
                              </p>
                           ) : (
                              <p className="text-primary-400 text-xl mt-2 ml-0.5 leading-6.5">
                                 Only you can see this article.
                              </p>
                           )}

                           {item === status || isDefault ? (
                              <GiCheckMark className="absolute inset-y-6 right-6 flex items-center text-primary-400 dark:text-primary-400 size-5 rotate-3 transition-200" />
                           ) : null}
                        </li>
                     ))}
                  </motion.ul>
               )}
            </AnimatePresence>
         </div>

         {children}
      </div>
   );
}

export default FormStatus;
