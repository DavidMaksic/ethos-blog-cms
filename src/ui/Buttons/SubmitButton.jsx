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
         ? 'from-white dark:from-transparent to-white dark:to-transparent !border-accent/80 dark:border-accent/60 shadow-none'
         : '';
   const loadingTextStyle =
      isPending && btnClicked ? '!text-accent dark:text-accent/70!' : '';

   useEffect(() => {
      if (to && isSuccess) navigate(to);
      if (!to && isSuccess) navigate(-1);
   }, [to, isSuccess, navigate]);

   return (
      <div
         className={`rounded-full bg-gradient-to-r from-accent-300/80 dark:from-accent-300/60 to-accent-600/70 dark:to-accent-600/50 hover:from-transparent hover:to-transparent border-2 border-transparent hover:border-accent/70 dark:hover:border-accent/60 shadow-link-btn hover:shadow-none dark:shadow-none transition-[box-shadow,border,--tw-gradient-from,--tw-gradient-to] duration-300 bg-origin-border ${loadingStyle}`}
      >
         <button
            className={`flex items-center gap-5 text-5xl px-10 pr-11 py-4 pt-5 text-white dark:text-accent-100/80 font-logo hover:text-accent/80 dark:hover:text-accent/70 transition-[color] duration-300 disabled:!cursor-default ${loadingTextStyle}`}
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
