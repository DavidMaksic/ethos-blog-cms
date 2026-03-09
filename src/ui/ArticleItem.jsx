import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
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
   const imgRef = useRef(null);
   const [searchParams, setSearchParams] = useSearchParams();
   const [isSelected, setIsSelected] = useState(false);
   const [isUnSelected, setIsUnSelected] = useState(false);

   useEffect(() => {
      if (imgRef.current?.complete) setTimeout(() => setLoaded(true), 50);
   }, []);

   // Bug fix for searching
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

            <div className="relative w-full h-25 rounded-2xl overflow-hidden border-l border-primary-200">
               <span
                  className={`absolute inset-0 scale-110 transition-opacity duration-700 ${
                     loaded ? 'opacity-0' : 'opacity-90 dark:opacity-75'
                  }`}
                  style={{
                     backgroundImage: article.image_blur
                        ? `url(${article.image_blur})`
                        : undefined,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     filter: 'blur(20px)',
                  }}
               />
               <img
                  ref={imgRef}
                  src={image}
                  alt={title}
                  className={`w-full h-full object-cover transition-opacity duration-700 group-hover:opacity-100 ${
                     loaded ? 'opacity-85 dark:opacity-70' : 'opacity-0'
                  }`}
                  onLoad={() => setTimeout(() => setLoaded(true), 50)}
               />
            </div>
         </Link>
      </motion.div>
   );
}

export default ArticleItem;
