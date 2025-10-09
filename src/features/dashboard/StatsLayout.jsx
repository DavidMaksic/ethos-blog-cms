import { PiChatCircleLight } from 'react-icons/pi';
import { HiOutlineUser } from 'react-icons/hi2';
import { useComments } from '../../hooks/useComments';
import { CiBookmark } from 'react-icons/ci';
import { useUsers } from '../../hooks/useUsers';
import { SlHeart } from 'react-icons/sl';
import Stats from './Stats';

function StatsLayout({ articles }) {
   const { users } = useUsers();
   const { comments } = useComments();

   const numUsers = users?.length;
   const totalLikes = articles?.flatMap(
      (article) => article.likes.filter((item) => item.type === 'article') || []
   ).length;

   const totalComments = comments?.length;
   const totalBookmarks = users?.flatMap((user) => user.bookmarks || []).length;

   return (
      <>
         <Stats
            title="Likes"
            value={totalLikes}
            icon={
               <SlHeart className="text-svg-likes transition-color p-0.5!" />
            }
            color="bg-stat-likes"
         />
         <Stats
            title="Comments"
            value={totalComments}
            icon={
               <PiChatCircleLight className="text-svg-comments transition-color" />
            }
            color="bg-stat-comments"
         />
         <Stats
            title="Bookmarks"
            value={totalBookmarks}
            icon={
               <CiBookmark className="text-svg-bookmarks transition-color" />
            }
            color="bg-stat-bookmarks"
         />
         <Stats
            title="Users"
            value={numUsers}
            icon={<HiOutlineUser className="text-svg-users transition-color" />}
            color="bg-stat-users"
         />
      </>
   );
}

export default StatsLayout;
