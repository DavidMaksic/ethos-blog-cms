function PaginationButton({ type, handler, disabled, children }) {
   const prev = type === 'Previous' && 'Previous';
   const next = type === 'Next' && 'Next';

   return (
      <button
         className={`flex items-center gap-1 hover:bg-accent-400 dark:hover:bg-accent-300/60 hover:text-white hover:shadow-filter dark:hover:shadow-link-btn-dark rounded-full p-2 px-3 pr-4 transition disabled:pointer-events-none disabled:opacity-50 ${
            prev ? 'pr-4' : 'pl-4'
         }`}
         onClick={handler}
         disabled={disabled}
      >
         {next}
         {children}
         {prev}
      </button>
   );
}

export default PaginationButton;
