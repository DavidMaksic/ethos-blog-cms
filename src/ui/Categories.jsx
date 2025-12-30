import { AnimatePresence, motion } from 'motion/react';
import { useGetCategories } from '../features/tags/useGetCategories';
import { useOutsideClick } from '../hooks/useOutsideClick';
import { FaCaretDown } from 'react-icons/fa';
import { GiCheckMark } from 'react-icons/gi';
import { useState } from 'react';

function Categories({
   setLocalItem,
   setIsDefault,
   article,
   localItem,
   children,
}) {
   const [open, setOpen] = useState(false);
   const { categories } = useGetCategories();
   const ref = useOutsideClick(() => setOpen(false), false);

   return (
      <div className="relative w-max select-none">
         <div
            className="px-2 py-2 pl-5 pr-10 text-2xl cursor-pointer font-medium rounded-full bg-primary dark:bg-primary-300/15 hover:bg-primary-100 dark:hover:bg-primary-300/5 text-primary-500 dark:text-primary-500/90 border border-quaternary dark:border-primary-300/30 transition-200"
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
                  className="absolute z-10 mt-2 p-1 max-h-[15.3rem] min-w-[11.4rem] text-2xl rounded-3xl will-change-transform bg-primary dark:bg-primary-300/20 backdrop-blur-3xl border border-quaternary dark:border-primary-300/10 shadow-lg overflow-auto cursor-pointer scrollbar"
                  ref={ref}
                  onClick={() => setOpen((isOpen) => !isOpen)}
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{
                     type: 'spring',
                     stiffness: 500,
                     damping: 30,
                     duration: 0.12,
                  }}
               >
                  {categories.map((item) => (
                     <li
                        key={item.category}
                        value={item.category}
                        className="relative font-normal first:rounded-t-[20px]! last:rounded-b-[20px]! rounded-2xl py-2 pl-5 hover:bg-primary-100 dark:text-primary-500 dark:hover:bg-primary-300/20 duration-75"
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

export default Categories;
