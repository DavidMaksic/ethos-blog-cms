import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useOutsideClick } from '../hooks/useOutsideClick';
import { useSearchParams } from 'react-router-dom';
import { TbArrowsSort } from 'react-icons/tb';
import { FaCaretDown } from 'react-icons/fa';
import { getDefaults } from '../utils/helpers';

function SortBy({ options }) {
   const [open, setOpen] = useState(false);
   const ref = useOutsideClick(() => setOpen((isOpen) => !isOpen), false);

   const [searchParams, setSearchParams] = useSearchParams();
   const { defaultLabel, defaultValue } = getDefaults(searchParams, options);

   const [currentLabel, setCurrentLabel] = useState(defaultLabel);
   const [currentValue, setCurrentValue] = useState(defaultValue);

   useEffect(() => {
      searchParams.set('sort-by', currentValue);
      setSearchParams(searchParams);
   }, [searchParams, setSearchParams, currentValue]);

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
                     onClick={() => setOpen((isOpen) => !isOpen)}
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     transition={{ duration: 0.06 }}
                  >
                     {options.map((item) => (
                        <li
                           key={item.value}
                           value={item.value}
                           onClick={() => {
                              setCurrentLabel(item.label);
                              setCurrentValue(item.value);
                           }}
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
