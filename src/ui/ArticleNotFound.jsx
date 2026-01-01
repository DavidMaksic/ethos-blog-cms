import { LuArrowLeft } from 'react-icons/lu';
import { IoPencil } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

function ArticleNotFound({ to, prompt, children }) {
   return (
      <motion.div
         className={`flex justify-center -translate-y-10 ${
            to ? 'h-screen' : 'h-[70vh]'
         }`}
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.3 }}
      >
         <div
            className={`self-center box-shadow bg-secondary dark:bg-primary-300/10 px-20 py-12 flex flex-col rounded-3xl border border-quaternary dark:border-primary-300/15 ${
               !to ? 'gap-0!' : 'gap-10'
            }`}
         >
            <span className="text-3xl text-primary-500/70">{children}</span>
            <Link
               className="flex items-center gap-2 text-3xl w-max self-center text-primary-400 border-b-2 border-primary-400 hover:opacity-75 transition-all"
               to={to}
            >
               {to ? to === '/new-post' ? <IoPencil /> : <LuArrowLeft /> : null}
               <span>{prompt}</span>
            </Link>
         </div>
      </motion.div>
   );
}

export default ArticleNotFound;
