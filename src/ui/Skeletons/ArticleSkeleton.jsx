function ArticleSkeleton() {
   return (
      <div className="relative 4k:translate-x-[10.3%]! 2k:translate-x-[11.8%] translate-x-[16%] xl:translate-x-[6.5%] max-w-5xl flex flex-col gap-6 py-7 px-24 pb-32 [&_div]:rounded-full animate-skeleton transition-200">
         <span className="absolute inset-0 m-0 bg-gradient-to-t from-primary" />

         <div className="flex flex-col gap-6">
            <div className="h-30 bg-primary-400/15 dark:bg-primary-400/15 !rounded-4xl w-5/6 self-center" />
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
