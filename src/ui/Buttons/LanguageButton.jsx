import { AnimatePresence, motion } from 'motion/react';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { useState } from 'react';

import srbFlag from '../../../public/assets/srb-flag.png';
import enFlag from '../../../public/assets/en-flag.png';

const languages = [
   {
      lang: 'Српски',
      flag: srbFlag,
   },
   {
      lang: 'English',
      flag: enFlag,
   },
];

function LanguageButton({ localItem, setLocalItem }) {
   const [open, setOpen] = useState(false);
   const ref = useOutsideClick(() => setOpen((isOpen) => !isOpen), false);

   return (
      <div className="absolute rounded-full right-6 top-[21px] border border-primary-300 cursor-pointer transition-200">
         <img
            className="size-11 opacity-80 dark:opacity-70 hover:opacity-100 dark:hover:opacity-85 transition-[opacity]"
            src={localItem.flag ? localItem.flag : srbFlag}
            onClick={(e) => {
               e.stopPropagation();
               setOpen((isOpen) => !isOpen);
            }}
         />

         <AnimatePresence>
            {open && (
               <motion.ul
                  className="absolute z-10 mt-2 p-1 min-w-[10rem] text-2xl rounded-2xl bg-white dark:bg-primary-50 border border-quaternary shadow-lg overflow-auto cursor-pointer transition-bg_border"
                  ref={ref}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.06 }}
               >
                  {languages.map((item) => (
                     <li
                        className="flex justify-between items-center relative font-normal rounded-xl py-2 pr-3 pl-5 hover:bg-primary-100 dark:text-primary-500 dark:hover:bg-primary-200 duration-75 [&_img]:opacity-80 dark:[&_img]:opacity-80 group"
                        key={item.lang}
                        onClick={() => {
                           setLocalItem({
                              ...localItem,
                              language: item.lang,
                              flag: item.flag,
                           });
                           document.documentElement.setAttribute(
                              'data-lang',
                              item.lang
                           );
                        }}
                     >
                        {item.lang}
                        <img
                           className="size-7 border border-primary-300 dark:border-primary-200 rounded-full group-hover:opacity-100 dark:group-hover:opacity-95 transition-[opacity]"
                           src={item.flag}
                        />
                     </li>
                  ))}
               </motion.ul>
            )}
         </AnimatePresence>
      </div>
   );
}

export default LanguageButton;
