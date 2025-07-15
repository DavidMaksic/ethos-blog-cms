import { HiOutlinePencil, HiOutlineUser } from 'react-icons/hi2';
import { HiOutlineUpload } from 'react-icons/hi';
import { useAuthors } from '../authentication/useAuthors';
import { RxStack } from 'react-icons/rx';
import Stats from './Stats';

function StatsLayout({ articles }) {
   const { authors } = useAuthors();

   const numArticles = articles.length;
   const numAuthors = authors?.length;
   const numPublished = articles.filter(
      (item) => item.status === 'published'
   ).length;
   const numDrafted = articles.filter(
      (item) => item.status === 'drafted'
   ).length;

   return (
      <>
         <Stats
            title="Articles"
            value={numArticles}
            icon={<RxStack className="text-svg-articles transition-color" />}
            color="bg-stat-articles"
         />
         <Stats
            title="Authors"
            value={numAuthors}
            icon={
               <HiOutlineUser className="text-svg-authors transition-color" />
            }
            color="bg-stat-authors"
         />
         <Stats
            title="Published"
            value={numPublished}
            icon={
               <HiOutlineUpload className="text-svg-published transition-color" />
            }
            color="bg-stat-published"
         />
         <Stats
            title="Drafted"
            value={numDrafted}
            icon={
               <HiOutlinePencil className="text-svg-drafted transition-color" />
            }
            color="bg-stat-drafted"
         />
      </>
   );
}

export default StatsLayout;
