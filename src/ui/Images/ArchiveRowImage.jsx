import { useState, useRef, useEffect } from 'react';

function ArchiveRowImage({ src, alt, blurDataURL, isFirst, isLast }) {
   const [loaded, setLoaded] = useState(false);
   const imgRef = useRef(null);

   useEffect(() => {
      if (imgRef.current?.complete) setLoaded(true);
   }, []);

   return (
      <div
         className={`relative w-full h-24 2xl:h-23 xl:h-30 overflow-hidden ${isFirst ? 'rounded-tr-2xl!' : ''} ${isLast ? 'rounded-br-2xl!' : ''}`}
      >
         <div
            className={`absolute inset-0 scale-110 transition-opacity duration-300 ${
               !loaded ? 'opacity-0' : 'opacity-90 dark:opacity-75'
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
            className={`w-full h-full object-cover transition-300 ${
               loaded ? 'opacity-85 dark:opacity-70' : 'opacity-0'
            }`}
            onLoad={() => setLoaded(true)}
         />
      </div>
   );
}

export default ArchiveRowImage;
