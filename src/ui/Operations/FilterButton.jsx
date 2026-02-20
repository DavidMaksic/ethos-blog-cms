function FilterButton({ handler, active, children }) {
   return (
      <button
         className={`relative z-10 py-0.5 px-2.5 rounded-xl transition-colors select-none ${
            active && 'text-white dark:text-accent-100'
         } `}
         onClick={handler}
      >
         {children}
      </button>
   );
}

export default FilterButton;
