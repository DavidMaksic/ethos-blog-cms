function ArticleSkeleton() {
   return (
      <div className="relative flex flex-col justify-self-center w-[64.5rem] space-y-9 py-8 [&_div]:rounded-full animate-skeleton transition-200 pl-50">
         <span className="absolute inset-0 m-0 bg-gradient-to-t from-primary-100 dark:from-primary-50" />

         <div className="flex flex-col gap-6">
            <div className="h-26 bg-primary-400/15 dark:bg-primary-400/15 !rounded-4xl w-5/6 self-center" />
            <div className="h-6 bg-skeleton dark:bg-primary-300/15 w-2/3 self-center" />
         </div>

         <div className="flex h-[29rem] justify-center bg-primary-300/80 dark:bg-primary-400/20 rounded-3xl!" />

         <div className="flex flex-col gap-3 mt-6 [&_div]:rounded-xl!">
            <div className="h-8 bg-primary-300 dark:bg-primary-400/35" />
            <div className="h-8 bg-primary-300 dark:bg-primary-400/35" />
            <div className="h-8 bg-primary-300 dark:bg-primary-400/35" />

            <div className="h-8 bg-transparent" />

            <div className="h-8 bg-primary-300 dark:bg-primary-400/35" />
            <div className="h-8 bg-primary-300 dark:bg-primary-400/35" />
            <div className="h-8 bg-primary-300 dark:bg-primary-400/35" />
            <div className="h-8 bg-primary-300 dark:bg-primary-400/35" />
         </div>
      </div>
   );
}

export default ArticleSkeleton;
