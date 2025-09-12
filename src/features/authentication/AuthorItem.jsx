import { HiOutlineUserCircle } from 'react-icons/hi2';
import { useCurrentAuthor } from '../authentication/useCurrentAuthor';
import { TbSettings } from 'react-icons/tb';
import { Link } from 'react-router-dom';

function AuthorItem({ author, activeUser }) {
   const { user: currentAuthor } = useCurrentAuthor();

   if (activeUser?.id === author?.id) return;

   const { full_name, email, description_en, profile_image } = author;
   const currentFullName = currentAuthor.user_metadata.full_name;
   const id = currentAuthor.id;

   if (profile_image === undefined) return <div>Loading...</div>;

   const nameStyle =
      currentFullName === full_name
         ? 'text-accent-400 dark:text-accent'
         : 'text-primary-500 dark:text-primary-600/75';

   return (
      <li
         className={`relative flex flex-col items-center self-center gap-2 bg-secondary dark:bg-primary-200 rounded-3xl px-20 py-12 box-shadow transition-200 h-full ${
            !description_en && 'pb-18'
         }`}
      >
         {profile_image ? (
            <img
               className="block size-30 aspect-square object-cover object-center rounded-[50%] dark:opacity-90"
               src={profile_image}
               alt="User image"
            />
         ) : (
            <HiOutlineUserCircle className="size-30 stroke-[0.4px] text-primary-400/70 dark:text-primary-300" />
         )}

         <div className="flex flex-col gap-6 self-center text-center">
            <div className="flex flex-col">
               <span
                  className={`font-logo text-[2.8rem] mb-[-5px] ${nameStyle}`}
               >
                  {full_name}
               </span>
               <span className="text-sm mt-1 font-extralight text-primary-400">
                  {email}
               </span>
            </div>

            {description_en ? (
               <span className="text-xl font-creator">{description_en}</span>
            ) : (
               <span className="text-xl font-creator">
                  Your profile description will appear here. Write something
                  about yourself!
               </span>
            )}
         </div>

         {currentAuthor.email === email && (
            <Link to={`${id}`}>
               <TbSettings className="absolute rounded-full right-2 top-2 p-2 text-5xl text-[#babfc7] dark:text-primary-300 hover:text-[#8c939e] dark:hover:text-primary-400 dark:hover:bg-primary-50 hover:bg-primary-100 stroke-[1.3px] cursor-pointer transition-200" />
            </Link>
         )}
      </li>
   );
}

export default AuthorItem;
