function TableRowSkeleton() {
   return (
      <div className="flex items-center justify-between border-b-2 border-primary-300 dark:border-primary-300/25 !rounded-none pb-5 w-[99.5%] justify-self-center">
         <div className="flex gap-14">
            <div className="h-14 w-47 bg-primary-200 rounded-2xl!" />
            <div className="h-8 w-80 xl:w-60 self-center bg-skeleton" />
         </div>

         <div className="h-6 mr-10 bg-primary-400 dark:bg-primary-400/60 w-2" />
      </div>
   );
}

export default TableRowSkeleton;
