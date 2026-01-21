import { useEffect } from 'react';
import mediumZoom from 'medium-zoom';

export default function ImageZoom() {
   useEffect(() => {
      let zoom;

      setTimeout(() => {
         zoom = mediumZoom('.image-container img', {
            margin: 60,
         });
      }, 300);

      return () => {
         zoom.detach();
      };
   }, []);

   return null;
}
