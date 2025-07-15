import { RiResetLeftLine } from 'react-icons/ri';

function ResetButton({ handler }) {
   return (
      <RiResetLeftLine
         className="absolute rounded-full right-23 top-5 p-3 text-5xl text-primary-400 hover:text-primary-500 bg-primary  hover:bg-primary-100 dark:hover:bg-primary-200 border border-quaternary cursor-pointer transition duration-300 hover:-rotate-90"
         onClick={handler}
      />
   );
}

export default ResetButton;
