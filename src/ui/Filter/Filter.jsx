import { useSearchParams } from 'react-router-dom';
import { LuListFilter } from 'react-icons/lu';
import FilterButton from '../Filter/FilterButton';

export function Filter({ field, options }) {
   const [searchParams, setSearchParams] = useSearchParams();
   const currentFilter = searchParams.get(field) || options.at(0).value;

   function handleClick(value) {
      setSearchParams((prev) => {
         const params = new URLSearchParams(prev);
         params.set(field, value);
         params.delete('page');
         return params;
      });
   }

   return (
      <div className="flex items-center gap-4">
         <LuListFilter className="size-5 text-accent dark:text-accent-200" />

         <div className="flex gap-2 bg-white dark:bg-primary-200 py-2 px-3 border border-tertiary rounded-xl shadow-2xs transition-bg_color_border">
            {options.map((item) => (
               <FilterButton
                  handler={() => handleClick(item.value)}
                  active={item.value === currentFilter}
                  key={item.value}
               >
                  {item.label}
               </FilterButton>
            ))}
         </div>
      </div>
   );
}

export default Filter;
