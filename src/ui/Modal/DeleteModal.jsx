import { useNavigate } from 'react-router-dom';
import { ImSpinner2 } from 'react-icons/im';
import { useEffect } from 'react';

function DeleteModal({ returnPage, isDeleting, isSuccess, onClose, onDelete }) {
   const navigate = useNavigate();

   useEffect(() => {
      if (returnPage && isSuccess) navigate(-1);
   }, [returnPage, isSuccess, navigate]);

   return (
      <div className="flex flex-col items-center gap-8">
         <span className="text-primary-600 dark:text-primary-500 w-4/5 text-center text-[2.2rem] leading-11 border-b border-b-quaternary pb-10">
            Are you sure you want to delete this article?
         </span>

         <div className="pt-2 mr-7 text-3xl font-semibold tracking-wide">
            <button
               className={`relative text-[#ca6565] dark:text-[#e78989] rounded-full px-6 p-2 cursor-pointer hover:shadow-delete-btn dark:hover:shadow-none transition hover:bg-red-400/70 dark:hover:bg-red-400/45 hover:text-white dark:hover:text-red-100 mr-2 ${
                  isDeleting && 'pointer-events-none'
               }`}
               onClick={onDelete}
            >
               {isDeleting ? (
                  <>
                     <ImSpinner2 className="size-6 animate-spin absolute right-36 top-3.5" />
                     <span>Deleting</span>
                  </>
               ) : (
                  <span>Delete</span>
               )}
            </button>

            <span className="text-3xl font-bold text-[#b7babe] dark:text-primary-300 pointer-events-none">
               /
            </span>

            <button
               className="text-primary-500 dark:text-primary-400 hover:text-primary-400 dark:hover:text-primary-500 ml-7 transition"
               onClick={onClose}
            >
               Cancel
            </button>
         </div>
      </div>
   );
}

export default DeleteModal;
