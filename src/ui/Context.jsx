import { AnimatePresence, motion } from 'motion/react';
import { useGetCategories } from '../features/tags/useGetCategories';
import { useOutsideClick } from '../hooks/useOutsideClick';
import { FaCaretDown } from 'react-icons/fa';
import { GiCheckMark } from 'react-icons/gi';
import { useState } from 'react';

function Context({ setLocalItem, setIsDefault, article, localItem, children }) {
   const [open, setOpen] = useState(false);
   const { categories } = useGetCategories();
   const ref = useOutsideClick(() => setOpen(false), false);

   return (
      <div className="relative w-max select-none">
         <div
            className="px-2 py-2 pl-5 pr-10 text-2xl cursor-pointer rounded-full bg-primary dark:bg-primary-50 hover:bg-primary-100 dark:hover:bg-primary-200 text-primary-500 dark:text-primary-500 border border-quaternary transition-200"
            onClick={(e) => {
               e.stopPropagation();
               setOpen((isOpen) => !isOpen);
            }}
         >
            {children}
            <FaCaretDown className="absolute top-4 right-3 text-primary-400 text-lg" />
         </div>

         <AnimatePresence>
            {open && (
               <motion.ul
                  className="absolute z-10 mt-2 p-1 max-h-[15.3rem] min-w-[11.4rem] text-2xl rounded-3xl bg-primary dark:bg-primary-50 border border-quaternary dark:border-tertiary shadow-lg overflow-auto cursor-pointer transition-bg_border scrollbar"
                  ref={ref}
                  onClick={() => setOpen((isOpen) => !isOpen)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.06 }}
               >
                  {categories.map((item) => (
                     <li
                        key={item.category}
                        value={item.category}
                        className="relative font-normal first:rounded-t-[20px]! last:rounded-b-[20px]! rounded-2xl py-2 pl-5 hover:bg-primary-100 dark:text-primary-500 dark:hover:bg-primary-200 duration-75"
                        onClick={() => {
                           setIsDefault?.(false);
                           setLocalItem({
                              ...localItem,
                              category: item.category,
                           });
                        }}
                     >
                        {item.category}

                        {item.category === localItem?.category ||
                        (!localItem && item.category === article?.category) ? (
                           <GiCheckMark className="absolute inset-y-3.5 right-3 flex items-center text-accent-400 dark:text-accent size-5 rotate-3" />
                        ) : null}
                     </li>
                  ))}
               </motion.ul>
            )}
         </AnimatePresence>
      </div>
   );
}

export default Context;
