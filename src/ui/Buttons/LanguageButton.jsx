import { AnimatePresence, motion } from 'motion/react';
import { DEFAULT_LANG, LANGUAGES } from '../../utils/constants';
import { useEffect, useState } from 'react';
import { useOutsideClick } from '../../hooks/useOutsideClick';

function LanguageButton({
   localArticle,
   setLocalArticle,
   isEdit = false,
   articleCode = null,
}) {
   const [open, setOpen] = useState(false);
   const ref = useOutsideClick(() => setOpen(false), false);

   const defaultFlag = LANGUAGES.find((item) => {
      if (isEdit) {
         return item.code === articleCode;
      } else {
         return item.code === DEFAULT_LANG;
      }
   })?.flag;

   const [flag, setFlag] = useState(defaultFlag);

   useEffect(() => {
      setLocalArticle((prev) => ({
         ...prev,
         flag,
      }));
   }, [setLocalArticle, flag]);

   return (
      <div className="absolute rounded-full right-6 top-5 border border-primary-300 cursor-pointer transition-200">
         <img
            className="size-11 opacity-80 dark:opacity-70 hover:opacity-100 dark:hover:opacity-85 transition-[opacity]"
            src={localArticle.flag ? localArticle.flag : flag}
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
                  {LANGUAGES.map((item) => (
                     <li
                        className="flex justify-between items-center relative font-normal rounded-xl py-2 pr-3 pl-5 hover:bg-primary-100 dark:text-primary-500 dark:hover:bg-primary-200 duration-75 [&_img]:opacity-80 dark:[&_img]:opacity-80 group"
                        key={item.code}
                        onClick={() => {
                           // setLangChanged(true);
                           setFlag(item.flag);

                           setLocalArticle((prev) => ({
                              ...prev,
                              language: item.lang,
                              code: item.code,
                           }));

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
