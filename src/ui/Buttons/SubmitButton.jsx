import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImSpinner2 } from 'react-icons/im';

function SubmitButton({
   to,
   handler,
   isPending,
   isSuccess,
   loadingText,
   children,
}) {
   const navigate = useNavigate();
   const [btnClicked, setBtnClicked] = useState(false);

   const loadingStyle =
      isPending && btnClicked
         ? 'from-white dark:from-primary-200 to-white dark:to-primary-200 !border-accent/80 dark:border-accent/80 shadow-none'
         : '';
   const loadingTextStyle =
      isPending && btnClicked ? '!text-accent dark:text-accent/90' : '';

   useEffect(() => {
      if (to && isSuccess) navigate(to);
      else if (!to && isSuccess) navigate(-1);
   }, [to, isSuccess, navigate]);

   return (
      <div
         className={`rounded-full bg-gradient-to-r from-accent-300/80 to-accent-600/70 hover:from-white dark:hover:from-primary-200 hover:to-white dark:hover:to-primary-200 border-2 border-transparent hover:border-accent/80 dark:hover:border-accent/80 shadow-btn hover:shadow-none dark:shadow-none transition-[box-shadow,border,--tw-gradient-from,--tw-gradient-to] duration-300 bg-origin-border ${loadingStyle}`}
      >
         <button
            className={`flex items-center gap-5 text-5xl px-10 pr-11 py-4 pt-5 text-white font-logo hover:text-accent hover:drop-shadow-xs dark:hover:text-accent/90 transition-[color] duration-300 disabled:!cursor-default ${loadingTextStyle}`}
            type="submit"
            onClick={() => {
               if (handler) handler();
               setBtnClicked(true);
            }}
         >
            {isPending && btnClicked ? (
               <>
                  <ImSpinner2 className="size-8 animate-spin" />
                  <span>{loadingText}</span>
               </>
            ) : (
               <span>{children}</span>
            )}
         </button>
      </div>
   );
}

export default SubmitButton;
