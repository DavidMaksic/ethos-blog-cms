import { motion } from 'motion/react';

function Form({ isPending, hasMargin = true, children }) {
   const disableClick = isPending && 'pointer-events-none opacity-80';

   return (
      <motion.div
         className={`label font-creator relative flex flex-col gap-8 xl:gap-6 bg-secondary dark:bg-primary-200 rounded-3xl text-lg text-[#4d525c] dark:text-slate-300/80 font-medium px-20 xl:px-16 py-12 xl:py-10 xl:pb-8 [&_input]:text-3xl box-shadow transition-200 ${disableClick} ${
            hasMargin && 'mb-24'
         }`}
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.3 }}
      >
         {children}
      </motion.div>
   );
}

export default Form;
