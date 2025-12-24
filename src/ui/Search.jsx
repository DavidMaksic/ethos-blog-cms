import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CgSearch } from 'react-icons/cg';

function Search() {
   const [searchParams, setSearchParams] = useSearchParams();
   const [open, setOpen] = useState(false);
   const query = searchParams.get('search') || '';
   const ref = useRef(null);

   function handleChange(value) {
      setSearchParams((prev) => {
         const params = new URLSearchParams(prev);

         if (value) params.set('search', value);
         else params.delete('search');

         params.delete('page');
         return params;
      });
   }

   useEffect(() => {
      if (query) setOpen(true);
   }, []); // eslint-disable-line

   useEffect(() => {
      if (open && ref.current) ref.current.focus();

      const handleEnter = ({ key }) => {
         if (key === 'Enter') {
            setOpen((isOpen) => !isOpen);
         }
      };
      document.addEventListener('keydown', handleEnter, true);

      return () => {
         document.removeEventListener('keydown', handleEnter, true);
      };
   }, [open]);

   return (
      <div className="flex items-center">
         <label htmlFor="search">
            <CgSearch
               className={`size-11 text-accent-600/85 dark:text-accent-200/90 p-2 pt-2.5 pr-2.5 bg-white dark:bg-primary-200 border border-tertiary shadow-2xs rounded-full transition-bg_border cursor-pointer ${
                  open && 'rounded-r-none border-r-transparent'
               }`}
               onClick={() => setOpen((isOpen) => !isOpen)}
            />
         </label>

         <AnimatePresence>
            {open && (
               <motion.input
                  ref={ref}
                  id="search"
                  type="text"
                  value={query}
                  placeholder="Search..."
                  autoComplete="new-password"
                  onChange={(e) => handleChange(e.target.value)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className={`h-11 py-4 px-1 w-[22rem] bg-white dark:bg-primary-200 border border-tertiary shadow-2xs rounded-full text-xl font-medium font-creator outline-none transition-bg_border ${
                     open && 'rounded-l-none border-l-transparent'
                  }`}
               />
            )}
         </AnimatePresence>
      </div>
   );
}

export default Search;
