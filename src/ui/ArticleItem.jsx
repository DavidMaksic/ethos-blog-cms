import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

function ArticleItem({
   open,
   close,
   openID,
   isLink = false,
   setSelectedID,
   article,
}) {
   const { id, image, title } = article;

   const [loaded, setLoaded] = useState(false);
   const [searchParams, setSearchParams] = useSearchParams();
   const [isSelected, setIsSelected] = useState(false);
   const [isUnSelected, setIsUnSelected] = useState(false);

   // - Bug fix for searching
   useEffect(() => {
      if (isSelected || isUnSelected) {
         setSearchParams(searchParams);
      }
   }, [isSelected, isUnSelected, setSearchParams, searchParams]);

   function handleClick(e) {
      e.stopPropagation();
      if (!open) return;
      openID === '' || openID !== id ? open(id) : close();

      setSelectedID(id);
      setIsSelected((isSelected) => !isSelected);
      if (openID) setIsUnSelected(true);
   }

   return (
      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         transition={{ duration: 0.3 }}
      >
         <Link
            to={isLink && `/archive/edit/${id}`}
            className={`grid grid-cols-[2fr_1.2fr]! gap-x-6 h-max rounded-2xl border bg-white dark:bg-primary-300/10 border-quaternary/80 dark:border-primary-300/15 shadow-xs dark:shadow-sm transition-bg hover:translate-x-1 group transition duration-200 ${
               openID === id &&
               'bg-accent-300/40! text-primary-600 dark:bg-accent-300/40!'
            }`}
            onClick={handleClick}
         >
            <h2 className="font-article font-semibold text-xl leading-6 self-center px-2 pl-8">
               {title.length > 51 ? `${title.slice(0, 52)}...` : title}
            </h2>

            <img
               className={`w-full h-25 object-cover opacity-80 rounded-2xl z-0 group-hover:opacity-100 transition-200 border-l border-primary-200 ${
                  loaded ? 'opacity-85 dark:opacity-70' : 'opacity-0'
               }`}
               onLoad={() => setLoaded(true)}
               src={image}
               alt={title}
            />
         </Link>
      </motion.div>
   );
}

export default ArticleItem;
