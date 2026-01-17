import { motion, LayoutGroup } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LuListFilter } from 'react-icons/lu';
import FilterButton from './FilterButton';

export function Filter({ field, options }) {
   const [searchParams, setSearchParams] = useSearchParams();
   const [pendingActive, setPendingActive] = useState(null);

   const currentFilter = searchParams.get(field) || options.at(0).value;

   function handleClick(value) {
      if (value === currentFilter) return;
      setPendingActive(value);

      setSearchParams((prev) => {
         const params = new URLSearchParams(prev);
         params.set(field, value);
         params.delete('page');
         return params;
      });
   }

   const [mounted, setMounted] = useState(false);
   useEffect(() => setMounted(true), []);

   return (
      <div className="flex items-center gap-4">
         <LuListFilter className="size-5 text-accent dark:text-accent-200" />

         <LayoutGroup>
            <div className="relative flex gap-2 bg-white dark:bg-primary-300/15 py-2 px-3 border border-tertiary dark:border-primary-300/10 rounded-xl shadow-2xs">
               {options.map((item) => {
                  // Pill shows only on active item
                  const pillTarget = pendingActive || currentFilter;
                  const showPill = pillTarget === item.value;

                  return (
                     <div key={item.value} className="relative">
                        {/* Only one pill is rendered per active option */}
                        {mounted && showPill && (
                           <motion.div
                              layoutId="filter-pill"
                              initial={false}
                              className="absolute inset-0 bg-accent-400 dark:bg-accent-300/60 rounded-xl z-0 shadow-filter dark:shadow-link-btn-dark"
                              transition={{ duration: 0.12 }}
                           />
                        )}

                        <FilterButton
                           handler={() => handleClick(item.value)}
                           active={item.value === currentFilter}
                        >
                           {item.label}
                        </FilterButton>
                     </div>
                  );
               })}
            </div>
         </LayoutGroup>
      </div>
   );
}

export default Filter;
