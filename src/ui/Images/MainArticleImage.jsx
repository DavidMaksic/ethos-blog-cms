import { useState, useRef, useEffect } from 'react';
import mediumZoom from 'medium-zoom';

function MainArticleImage({ src, blurDataURL, alt }) {
   const [loaded, setLoaded] = useState(false);
   const imgRef = useRef(null);
   const zoomRef = useRef(null);

   useEffect(() => {
      if (imgRef.current?.complete) setTimeout(() => setLoaded(true), 50);
   }, []);

   useEffect(() => {
      if (!loaded || !imgRef.current) return;
      const timer = setTimeout(() => {
         zoomRef.current = mediumZoom(imgRef.current, {
            margin: window.innerWidth <= 768 ? 22 : 60,
         });
      }, 300);
      return () => {
         clearTimeout(timer);
         zoomRef.current?.detach();
      };
   }, [loaded]);

   return (
      <div className="relative h-[24rem] overflow-hidden rounded-3xl">
         <div
            className={`absolute inset-0 scale-110 transition-opacity duration-300 ${
               loaded ? 'opacity-0' : 'opacity-90 dark:opacity-75'
            }`}
            style={{
               backgroundImage: blurDataURL ? `url(${blurDataURL})` : undefined,
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               filter: 'blur(20px)',
            }}
         />
         <img
            ref={imgRef}
            src={src}
            alt={alt}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
               loaded ? 'opacity-90 dark:opacity-75' : 'opacity-0'
            }`}
            onLoad={() => setTimeout(() => setLoaded(true), 50)}
         />
      </div>
   );
}

export default MainArticleImage;
