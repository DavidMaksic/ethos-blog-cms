import { ImSpinner2 } from 'react-icons/im';

function PasswordButton({ isPending, loadingText, children }) {
   return (
      <div className="flex justify-self-center">
         <button
            className="flex items-center gap-3 text-4xl text-primary-400 hover:text-primary-500 px-7 py-3 dark:shadow-none rounded-full border-2 border-primary-300 hover:border-primary-400 transition-[color,border] disabled:!cursor-default font-logo"
            type="submit"
         >
            {isPending ? (
               <>
                  <ImSpinner2 className="size-5 animate-spin" />
                  <span>{loadingText}</span>
               </>
            ) : (
               <span>{children}</span>
            )}
         </button>
      </div>
   );
}

export default PasswordButton;
