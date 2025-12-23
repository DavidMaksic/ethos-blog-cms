import { LuEraser } from 'react-icons/lu';

function ClearButton({ handler, style }) {
   return (
      <LuEraser
         className={`absolute rounded-full ${style} top-5 p-3 text-5xl text-primary-400 hover:text-primary-500 bg-primary  hover:bg-primary-100 dark:hover:bg-primary-200 border border-quaternary cursor-pointer transition-200`}
         onClick={handler}
      />
   );
}

export default ClearButton;
