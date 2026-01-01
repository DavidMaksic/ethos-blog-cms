function FilterButton({ handler, active, children }) {
   return (
      <button
         className={`hover:bg-accent-400 dark:hover:bg-accent-300/60 hover:text-white dark:hover:text-accent-50 hover:shadow-filter dark:hover:shadow-link-btn-dark py-0.5 px-2.5 rounded-xl transition-bg_color select-none ${
            active &&
            'bg-accent-400 dark:bg-accent-300/60 text-white dark:text-accent-50 shadow-filter dark:shadow-link-btn-dark'
         }`}
         onClick={handler}
      >
         {children}
      </button>
   );
}

export default FilterButton;
