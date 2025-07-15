import { useEffect, useRef } from 'react';

export function useIntersectionObserver(setActiveId, activeId) {
   const headingElementsRef = useRef({});

   useEffect(() => {
      const callback = (headings) => {
         headingElementsRef.current = headings.reduce((map, headingElement) => {
            map[headingElement.target.id] = headingElement;

            return map;
         }, headingElementsRef.current);

         const visibleHeadings = [];

         Object.keys(headingElementsRef.current).forEach((key) => {
            const headingElement = headingElementsRef.current[key];
            if (headingElement.isIntersecting)
               visibleHeadings.push(headingElement);
         });

         const getIndexFromId = (id) =>
            headingElements.findIndex((heading) => heading.id === id);

         if (visibleHeadings.length === 1) {
            setActiveId(visibleHeadings[0].target.id);
         } else if (visibleHeadings.length > 1) {
            const sortedVisibleHeadings = visibleHeadings.sort(
               (a, b) =>
                  getIndexFromId(a.target.id) > getIndexFromId(b.target.id)
            );
            setActiveId(sortedVisibleHeadings[0].target.id);
         }

         if (!visibleHeadings.length) {
            const activeElement = headingElements.find(
               (el) => el.id === activeId
            );
            const activeIndex = headingElements.findIndex(
               (el) => el.id === activeId
            );

            const activeIdYcoord = activeElement?.getBoundingClientRect().y;
            if (activeIdYcoord && activeIdYcoord > 150 && activeIndex !== 0) {
               setActiveId(headingElements[activeIndex - 1].id);
            }
         }
      };

      const observer = new IntersectionObserver(callback, {
         rootMargin: '0px 0px -40% 0px',
      });

      const headingElements = Array.from(
         document.querySelectorAll('h1, h2, h3')
      );

      headingElements.forEach((element) => observer.observe(element));

      return () => {
         observer.disconnect();
         headingElementsRef.current = {};
      };
   }, [setActiveId, activeId]);
}
