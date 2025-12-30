function ArticleSkeleton() {
   return (
      <div className="relative 4k:translate-x-[10.3%]! 2k:translate-x-[11.8%] translate-x-[16%] xl:translate-x-[6.5%] max-w-5xl flex flex-col gap-8 px-24 pt-4 [&_div]:rounded-full animate-skeleton transition-200">
         <span className="absolute inset-0 m-0 bg-gradient-to-t from-primary" />

         <div className="flex flex-col gap-6">
            <div className="h-16 bg-primary-400/25 dark:bg-primary-400/15 rounded-4xl! w-3/4 self-center" />
            <div className="h-6 bg-primary-200/70 dark:bg-primary-300/15 w-1/2 self-center" />
         </div>

         <div className="flex h-[29rem] justify-center bg-primary-300/80 dark:bg-primary-400/20 rounded-3xl!" />

         <div className="flex flex-col gap-3 mt-6 [&_div]:rounded-xl!">
            <div className="h-8 bg-primary-400 dark:bg-primary-300/80" />
            <div className="h-8 bg-primary-400 dark:bg-primary-300/80" />
            <div className="h-8 bg-primary-400 dark:bg-primary-300/80" />
            <div className="h-8 bg-primary-400 dark:bg-primary-400" />
         </div>
      </div>
   );
}

export default ArticleSkeleton;
