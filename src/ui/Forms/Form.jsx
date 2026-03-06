import { motion } from 'motion/react';

function Form({ isDiv = false, isPending, onSubmit, children }) {
   const disableClick = isPending && 'pointer-events-none opacity-80';
   const Component = isDiv ? motion.div : motion.form;

   return (
      <Component
         className={`label self-center font-creator relative flex flex-col gap-8 bg-secondary dark:bg-primary-300/10 rounded-3xl text-lg text-primary-600 dark:text-slate-300/80 font-medium px-20 py-12 [&_input]:text-3xl box-shadow transition-200 ${isDiv ? 'w-full' : ''} ${disableClick}`}
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.3 }}
         {...(!isDiv && { onSubmit })}
      >
         {children}
      </Component>
   );
}

export default Form;
