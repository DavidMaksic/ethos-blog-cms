import { useState, useRef, useEffect } from 'react';

function RankingImage({ src, blurSrc, alt }) {
   const [loaded, setLoaded] = useState(false);
   const imgRef = useRef(null);

   useEffect(() => {
      if (imgRef.current?.complete) setLoaded(true);
   }, []);

   return (
      <div className="size-12 rounded-lg overflow-hidden relative shrink-0">
         <div
            className={`absolute inset-0 scale-110 transition-opacity duration-300 ${
               loaded ? 'opacity-0' : 'opacity-100'
            }`}
            style={{
               backgroundImage: blurSrc ? `url(${blurSrc})` : undefined,
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
               loaded ? 'opacity-85' : 'opacity-0'
            }`}
            onLoad={() => setLoaded(true)}
         />
      </div>
   );
}

export default RankingImage;
