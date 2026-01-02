import { motion } from 'motion/react';

function Form({ isPending, children }) {
   const disableClick = isPending && 'pointer-events-none opacity-80';

   return (
      <motion.div
         className={`label font-creator relative flex flex-col gap-8 bg-secondary dark:bg-primary-300/10 rounded-3xl text-lg text-[#4d525c] dark:text-slate-300/80 font-medium px-20 py-12 [&_input]:text-3xl box-shadow transition-200 ${disableClick}`}
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.3 }}
      >
         {children}
      </motion.div>
   );
}

export default Form;
