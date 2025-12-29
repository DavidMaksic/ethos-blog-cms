import { HiOutlineUserCircle } from 'react-icons/hi2';
import { useCurrentAuthor } from '../../features/authentication/useCurrentAuthor';

function HeaderUser() {
   const { user } = useCurrentAuthor();
   const { full_name, profile_image } = user.user_metadata;

   return (
      <div className="flex gap-3 items-center p-3 pb-5 px-1 text-[0.94rem] font-medium border-b border-b-quaternary dark:border-b-primary-300/30">
         {profile_image ? (
            <img
               className="block size-9 aspect-square object-cover object-center rounded-[50%] dark:opacity-90 transition-200"
               src={profile_image}
               alt="User image"
            />
         ) : (
            <HiOutlineUserCircle className="size-9 stroke-1 text-primary-400/80 dark:text-primary-300" />
         )}
         <span>{full_name}</span>
      </div>
   );
}

export default HeaderUser;
