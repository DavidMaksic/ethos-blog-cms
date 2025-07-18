import { LuArrowLeft } from 'react-icons/lu';
import { IoPencil } from 'react-icons/io5';
import { Link } from 'react-router-dom';

function ArticleNotFound({ to, prompt, children }) {
   return (
      <div className="max-h-screen flex justify-center">
         <div
            className={`self-center bg-secondary dark:bg-primary-200 px-20 py-12 flex flex-col gap-10 rounded-3xl border border-quaternary translate-y-50 ${
               !to && 'gap-0!'
            }`}
         >
            <span className="text-3xl font-semibold">{children}</span>
            <Link
               className="flex items-center gap-2 text-3xl w-max self-center text-primary-400 border-b-3 border-primary-400 hover:border-transparent dark:hover:border-transparent transition-all"
               to={to}
            >
               {to ? to === '/new-post' ? <IoPencil /> : <LuArrowLeft /> : null}
               <span>{prompt}</span>
            </Link>
         </div>
      </div>
   );
}

export default ArticleNotFound;
