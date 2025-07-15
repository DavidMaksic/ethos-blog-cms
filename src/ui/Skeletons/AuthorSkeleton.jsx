function AuthorSkeleton() {
   const rowNumber = 4;
   const rows = Array.from({ length: rowNumber }, (_, i) => i);

   return (
      <div className="relative grid grid-cols-2 gap-6 [&_div]:rounded-2xl animate-skeleton">
         <span className="absolute inset-0 m-0 bg-gradient-to-t from-primary dark:from-primary-50 from-0% transition duration-150" />

         {rows.map((item) => (
            <div
               className="h-127 bg-primary-200 dark:bg-skeleton transition-bg_border"
               key={item}
            />
         ))}
      </div>
   );
}

export default AuthorSkeleton;
