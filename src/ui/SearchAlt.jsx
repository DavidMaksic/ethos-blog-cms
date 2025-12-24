import { useSearchParams } from 'react-router-dom';
import { CgSearch } from 'react-icons/cg';

function SearchAlt() {
   const [searchParams, setSearchParams] = useSearchParams();
   const query = searchParams.get('search') || '';

   function handleChange(value) {
      setSearchParams((prev) => {
         const params = new URLSearchParams(prev);

         if (value) params.set('search', value);
         else params.delete('search');

         params.delete('page');
         return params;
      });
   }

   return (
      <div className="flex items-center">
         <label htmlFor="search">
            <CgSearch className="size-11 text-accent-600/85 dark:text-accent-200/90 p-2 pt-2.5 pr-2.5 rounded-r-none border-r-transparent bg-white dark:bg-primary-200 border border-quaternary rounded-full transition-bg_border cursor-pointer" />
         </label>

         <input
            id="search"
            type="text"
            value={query}
            placeholder="Search..."
            autoComplete="one-time-code"
            onChange={(e) => handleChange(e.target.value)}
            className="h-11 py-4 px-1 w-[22rem] bg-white dark:bg-primary-200 border border-quaternary rounded-full text-xl font-medium font-creator outline-none transition-bg_border rounded-l-none border-l-transparent"
         />
      </div>
   );
}

export default SearchAlt;
