import { AnimatePresence, motion } from 'motion/react';
import { useOutsideClick } from '../hooks/useOutsideClick';
import { useSearchParams } from 'react-router-dom';
import { TbArrowsSort } from 'react-icons/tb';
import { FaCaretDown } from 'react-icons/fa';
import { useState } from 'react';

function SortBy({ options }) {
   const [open, setOpen] = useState(false);
   const [searchParams, setSearchParams] = useSearchParams();
   const ref = useOutsideClick(() => setOpen(false), false);

   const sortValue = searchParams.get('sort-by') ?? options[0].value;
   const currentLabel =
      options.find((item) => item.value === sortValue)?.label ??
      options[0].label;

   function handleClick(item) {
      setSearchParams((prev) => {
         const params = new URLSearchParams(prev);
         params.set('sort-by', item.value);
         params.delete('page');
         return params;
      });
   }

   return (
      <div className="flex items-center gap-2.5 select-none">
         <TbArrowsSort className="size-5 text-accent/80 dark:text-accent-200/90" />

         <div className="relative w-32">
            <div
               className="relative px-3 py-[0.6rem] pl-5 cursor-pointer rounded-xl bg-white dark:bg-primary-200 dark:hover:bg-primary-200/50 text-primary-500 border border-tertiary shadow-2xs transition-200"
               onClick={(e) => {
                  e.stopPropagation();
                  setOpen((isOpen) => !isOpen);
               }}
            >
               {currentLabel}
               <FaCaretDown className="absolute top-3.5 right-4 text-md text-primary-400 mb-0.5" />
            </div>

            <AnimatePresence>
               {open && (
                  <motion.ul
                     className="absolute z-10 mt-2 p-1 max-h-52 w-full rounded-xl bg-white dark:bg-primary-200 border border-tertiary shadow-lg dark:shadow-2xl overflow-auto cursor-pointer transition-bg_border"
                     ref={ref}
                     onClick={() => setOpen(false)}
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
                     {options.map((item) => (
                        <li
                           key={item.value}
                           onClick={() => handleClick(item)}
                           className="relative rounded-xl font-normal py-2 pl-6 hover:bg-primary-50 dark:hover:bg-primary-300/12 transition duration-75"
                        >
                           {item.label}
                        </li>
                     ))}
                  </motion.ul>
               )}
            </AnimatePresence>
         </div>
      </div>
   );
}

export default SortBy;
