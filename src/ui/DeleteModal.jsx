import { useNavigate } from 'react-router-dom';
import { ImSpinner2 } from 'react-icons/im';
import { useEffect } from 'react';

function DeleteModal({ returnPage, isDeleting, isSuccess, onClose, onDelete }) {
   const navigate = useNavigate();

   useEffect(() => {
      if (returnPage && isSuccess) navigate(-1);
   }, [returnPage, isSuccess, navigate]);

   return (
      <>
         <span className=" text-primary-600 dark:text-primary-500 text-center w-full pb-8 pt-2 border-b-1 border-b-quaternary">
            Delete this article?
         </span>

         <div className="pt-2 space-x-10">
            <button
               className={`relative text-[#ca6565] dark:text-[#e78989] hover:text-[#be6565] ${
                  isDeleting && 'pointer-events-none'
               }`}
               onClick={onDelete}
            >
               {isDeleting ? (
                  <>
                     <ImSpinner2 className="size-6 animate-spin absolute right-17 top-3.5" />
                     <span>Yes</span>
                  </>
               ) : (
                  <span>Yes</span>
               )}
            </button>

            <span className="text-3xl font-bold text-[#b7babe] dark:text-primary-300 pointer-events-none">
               /
            </span>
            <button
               className="text-primary-500 dark:text-primary-400 hover:text-primary-400 dark:hover:text-primary-500"
               onClick={onClose}
            >
               No
            </button>
         </div>
      </>
   );
}

export default DeleteModal;
