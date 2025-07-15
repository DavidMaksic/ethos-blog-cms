function TableHeader({ children }) {
   return (
      <header className="grid-table xl:grid-cols-[1.8fr_4.6fr_1.4fr_0.1fr_1.6fr_1fr]! xl:gap-x-16! py-4 xl:p-3 uppercase text-base font-semibold bg-table transition-bg rounded-t-xl">
         {children}
      </header>
   );
}

export default TableHeader;
