import { HiOutlineArrowUturnLeft } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

function BackButton({ setIsFullscreen, setLocalFullscreen }) {
   const navigate = useNavigate();

   return (
      <HiOutlineArrowUturnLeft
         className="size-11 p-2.5 stroke-[1.8px] hover:bg-primary-200/30 dark:hover:bg-primary-300/30 text-primary-400 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-500 rounded-xl transition-200 cursor-pointer"
         onClick={() => {
            setLocalFullscreen(false);
            setIsFullscreen(false);
            navigate(-1);
         }}
      />
   );
}

export default BackButton;
