import { LuArrowLeft } from 'react-icons/lu';

function ErrorFallback({ resetErrorBoundary }) {
   return (
      <div className="h-screen flex items-center justify-center bg-primary">
         <div className="bg-secondary dark:bg-primary-200 px-20 py-12 flex flex-col gap-10 rounded-3xl border border-quaternary translate-y-[-20%]">
            <p className="text-4xl font-semibold">Something went wrong...</p>

            <button
               onClick={resetErrorBoundary}
               className="flex items-center gap-2 text-3xl w-max self-center text-primary-400 border-b-2 border-primary-400 hover:opacity-75 transition-all"
            >
               <LuArrowLeft />
               <span>Go back</span>
            </button>
         </div>
      </div>
   );
}

export default ErrorFallback;
