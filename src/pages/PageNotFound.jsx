import { Link, useNavigate } from 'react-router-dom';
import { LuArrowLeft } from 'react-icons/lu';

function PageNotFound() {
   const navigate = useNavigate();

   function moveBack() {
      navigate(-1);
   }

   return (
      <main className="h-screen flex items-center justify-center bg-primary">
         <div className="bg-secondary px-20 py-12 flex flex-col gap-10 rounded-3xl border border-quaternary translate-y-[-20%]">
            <p className="text-4xl font-semibold">
               This page could not be found!
            </p>

            <Link
               onClick={moveBack}
               className="flex items-center gap-2 text-3xl w-max self-center text-primary-400 border-b-2 border-primary-400 hover:opacity-75 transition-all"
            >
               <LuArrowLeft />
               <span>Go back</span>
            </Link>
         </div>
      </main>
   );
}

export default PageNotFound;
