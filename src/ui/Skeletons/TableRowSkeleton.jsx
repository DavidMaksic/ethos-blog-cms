function TableRowSkeleton() {
   return (
      <div className="flex items-center justify-between border-b-2 border-primary-300 dark:border-primary-300/60 !rounded-none pb-3 w-[99.5%] justify-self-center">
         <div className="flex gap-14">
            <div className="h-10 w-32 bg-primary-200" />
            <div className="h-10 bg-skeleton w-60" />
         </div>
         <div className="h-6 mr-10 bg-primary-400 dark:bg-primary-400/60 w-2" />
      </div>
   );
}

export default TableRowSkeleton;
