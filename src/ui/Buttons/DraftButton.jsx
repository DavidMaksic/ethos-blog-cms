import { ImSpinner2 } from 'react-icons/im';

function DraftButton({ type, handler, isPending, onClick }) {
   return (
      <button
         className="flex items-center gap-3 text-3xl text-primary-400 hover:text-primary-500 px-6 py-3 dark:shadow-none rounded-full border-2 border-primary-300 hover:border-primary-400 transition-[color,border] disabled:!cursor-default"
         type="button"
         onClick={() => {
            if (onClick) onClick();
            if (handler) handler();
         }}
      >
         {isPending ? (
            <>
               <ImSpinner2 className="size-5 animate-spin" />
               <span>Saving</span>
            </>
         ) : (
            <span>Save {type ? 'changes' : 'draft'}</span>
         )}
      </button>
   );
}

export default DraftButton;
