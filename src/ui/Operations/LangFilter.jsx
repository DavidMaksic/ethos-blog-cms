import { motion, LayoutGroup } from 'motion/react';
import { IoLanguageOutline } from 'react-icons/io5';
import { LANGUAGES } from '../../utils/constants';

function LangFilter({ localItem, setLocalItem, categories }) {
   const activeCode = localItem?.code ?? LANGUAGES.at(0).code;

   function handleClick(item) {
      if (item.code === activeCode) return;

      const firstCategory = categories?.find((c) => c.code === item.code);
      setLocalItem((prev) => ({
         ...prev,
         code: item.code,
         ...(firstCategory && { category: firstCategory.category }),
      }));
   }

   return (
      <div className="flex items-center gap-4">
         <IoLanguageOutline className="size-6 text-accent dark:text-accent-200" />

         <LayoutGroup>
            <div className="relative flex gap-2 bg-white dark:bg-primary-300/15 py-2 px-3 border border-tertiary dark:border-primary-300/10 rounded-xl shadow-2xs">
               {LANGUAGES.map((item) => {
                  const isActive = item.code === activeCode;

                  return (
                     <div key={item.code} className="relative">
                        {isActive && (
                           <motion.div
                              layoutId="lang-filter-pill"
                              initial={false}
                              className="absolute inset-0 bg-accent-400 dark:bg-accent-300/60 rounded-xl z-0 shadow-filter dark:shadow-link-btn-dark"
                              transition={{ duration: 0.12 }}
                           />
                        )}
                        <button
                           className="relative z-10 flex items-center gap-2 py-0.5 px-2.5 rounded-xl cursor-pointer"
                           onClick={() => handleClick(item)}
                        >
                           <span
                              className={`text-base ${isActive && 'text-white dark:text-accent-100'}`}
                           >
                              {item.lang}
                           </span>
                        </button>
                     </div>
                  );
               })}
            </div>
         </LayoutGroup>
      </div>
   );
}

export default LangFilter;
