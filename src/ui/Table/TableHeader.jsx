function TableHeader({ children }) {
   return (
      <header className="grid-table py-4 uppercase text-base font-semibold bg-table transition-bg rounded-t-xl">
         {children}
      </header>
   );
}

export default TableHeader;
