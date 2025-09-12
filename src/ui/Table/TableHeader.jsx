function TableHeader({ children }) {
   return (
      <header className="grid-table py-4 uppercase text-base font-semibold bg-primary-50 dark:bg-table transition-bg rounded-t-2xl">
         {children}
      </header>
   );
}

export default TableHeader;
