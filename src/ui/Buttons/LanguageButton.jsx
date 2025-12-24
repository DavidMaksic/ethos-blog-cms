import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useOutsideClick } from '../../hooks/useOutsideClick';

import srbFlag from '../../../public/srb-flag.png';
import enFlag from '../../../public/en-flag.png';

const languages = [
   {
      lang: 'English',
      code: 'en',
      flag: enFlag,
   },
   {
      lang: 'Српски',
      code: 'sr',
      flag: srbFlag,
   },
];

function LanguageButton({ localItem, setLocalItem, defaultLang = null }) {
   const [open, setOpen] = useState(false);
   const ref = useOutsideClick(() => setOpen(false), false);

   const flag = languages.find((item) => item.code === defaultLang)?.flag;
   const [currentFlag, setCurrentFlag] = useState(flag);
   const [langChanged, setLangChanged] = useState(false);

   useEffect(() => {
      if (localItem) setCurrentFlag(localItem.flag);
   }, [localItem]);

   useEffect(() => {
      if (langChanged) setCurrentFlag(localItem.flag);
   }, [localItem.flag, langChanged, localItem]);

   return (
      <div className="absolute rounded-full right-6 top-5 border border-primary-300 cursor-pointer transition-200">
         <img
            className="size-11 opacity-80 dark:opacity-70 hover:opacity-100 dark:hover:opacity-85 transition-[opacity]"
            src={currentFlag ? currentFlag : flag}
            alt="Flag"
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
                        key={item.code}
                        onClick={() => {
                           setLangChanged(true);

                           setLocalItem({
                              ...localItem,
                              language: item.lang,
                              code: item.code,
                              flag: item.flag,
                           });

                           document.documentElement.setAttribute(
                              'data-lang',
                              item.code
                           );
                        }}
                     >
                        {item.lang}
                        <img
                           className="size-7 border border-primary-300 dark:border-primary-200 rounded-full group-hover:opacity-100 dark:group-hover:opacity-95 transition-[opacity]"
                           src={item.flag}
                           alt="Flag"
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
