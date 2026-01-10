import { useEffect } from 'react';
import mediumZoom from 'medium-zoom';

export default function ImageZoom() {
   useEffect(() => {
      const zoom = mediumZoom('.image-container img', {
         margin: 60,
      });

      return () => {
         zoom.detach();
      };
   }, []);

   return null;
}
