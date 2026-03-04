import { useState, useRef, useEffect } from 'react';
import mediumZoom from 'medium-zoom';

function ArticleImage({ src, className, blurDataURL, isTransparent }) {
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
            margin: 60,
         });
      }, 300);
      return () => {
         clearTimeout(timer);
         zoomRef.current?.detach();
      };
   }, [loaded]);

   return (
      <span className={`block w-full relative overflow-hidden ${className}`}>
         <span
            className={`absolute inset-0 transition-opacity duration-700 ${isTransparent ? 'scale-85' : 'scale-110'} ${
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
            alt="Article image"
            className={`${loaded ? className : ''} transition-opacity duration-700 ${
               loaded ? 'opacity-90 dark:opacity-75' : 'opacity-0'
            }`}
            style={{ width: '100%', height: 'auto' }}
            onLoad={() => setTimeout(() => setLoaded(true), 50)}
         />
      </span>
   );
}

export default ArticleImage;
