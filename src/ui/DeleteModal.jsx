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

         <div className="pt-2 mr-5">
            <button
               className={`relative text-[#ca6565] dark:text-[#e78989] rounded-full px-6 cursor-pointer hover:shadow-delete-btn dark:hover:shadow-none transition hover:bg-red-300 dark:hover:bg-red-300/45 hover:text-white dark:hover:text-red-100 mr-5 ${
                  isDeleting && 'pointer-events-none'
               }`}
               onClick={onDelete}
            >
               {isDeleting ? (
                  <>
                     <ImSpinner2 className="size-6 animate-spin absolute right-23 top-3.5" />
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
               className="text-primary-500 dark:text-primary-400 hover:text-primary-400 dark:hover:text-primary-500 ml-10"
               onClick={onClose}
            >
               No
            </button>
         </div>
      </>
   );
}

export default DeleteModal;
